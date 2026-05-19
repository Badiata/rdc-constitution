"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { DOCUMENTS } from "@/app/lib/documents";
import Landing from "@/app/components/Landing";
import Sidebar from "@/app/components/Sidebar";
import ChatMessage from "@/app/components/ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DocState {
  id: string;
  active: boolean;
  loaded: boolean;
  loading: boolean;
  text: string;
  label: string;
  year: string;
  error?: string;
}

const SUGGESTED_QUESTIONS = [
  "Quels sont mes droits fondamentaux selon la Constitution de 2006 ?",
  "Quels sont les pouvoirs du Président de la République ?",
  "Comment a évolué la Constitution congolaise depuis 1960 ?",
  "Quelle est la différence entre la Constitution de 2006 et la révision de 2011 ?",
  "Comment réviser la Constitution ?",
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [docStates, setDocStates] = useState<DocState[]>(
    DOCUMENTS.map((d) => ({
      id: d.id,
      active: d.defaultActive,
      loaded: false,
      loading: false,
      text: "",
      label: d.label,
      year: d.year,
    }))
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (!started) return;
    DOCUMENTS.filter((d) => d.defaultActive).forEach((d) => loadDoc(d.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  async function loadDoc(id: string) {
    setDocStates((prev) => prev.map((d) => (d.id === id ? { ...d, loading: true } : d)));
    try {
      const res = await fetch(`/api/document?id=${id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDocStates((prev) => prev.map((d) => d.id === id ? { ...d, loading: false, loaded: true, text: data.text } : d));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setDocStates((prev) => prev.map((d) => d.id === id ? { ...d, loading: false, loaded: true, error: msg, text: "" } : d));
    }
  }

  function toggleDoc(id: string) {
    setDocStates((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const newActive = !d.active;
        if (newActive && !d.loaded && !d.loading) loadDoc(id);
        return { ...d, active: newActive };
      })
    );
  }

  const getActiveDocs = useCallback(() => {
    return docStates
      .filter((d) => d.active && d.loaded && d.text)
      .map((d) => ({ label: d.label, year: d.year, text: d.text }));
  }, [docStates]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    setSidebarOpen(false);
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    abortRef.current = new AbortController();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, docs: getActiveDocs() }),
        signal: abortRef.current.signal,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) { accumulated += parsed.text; setStreamingContent(accumulated); }
          } catch (e) { console.log("parse error", e); }
        }
      if (accumulated) {
        setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
      }
      setStreamingContent("");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setMessages((prev) => [...prev, { role: "assistant", content: `**Erreur :** ${msg}` }]);
      setStreamingContent("");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  function newChat() {
    abortRef.current?.abort();
    setMessages([]); setStreamingContent(""); setIsLoading(false); setSidebarOpen(false);
  }

  const activeDocs = docStates.filter((d) => d.active && d.loaded);

  if (!started) return <Landing onStart={() => setStarted(true)} />;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} className="mobile-overlay" />
      )}

      <div style={{ position: "relative", zIndex: 50, flexShrink: 0 }} className={`sidebar-wrapper${sidebarOpen ? " open" : ""}`}>
        <Sidebar docStates={docStates} onToggleDoc={toggleDoc} onNewChat={newChat} onAskQuestion={(q) => sendMessage(q)} onClose={() => setSidebarOpen(false)} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.7rem 1.25rem", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(true)} className="hamburger" style={{ width: 34, height: 34, background: "none", border: "1px solid var(--border)", borderRadius: 8, display: "none", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--txt2)", flexShrink: 0 }} aria-label="Menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Dialogue Constitutionnel · RDC</div>
            <div style={{ fontSize: 11, color: "var(--txt3)", fontStyle: "italic" }}>
              {activeDocs.length > 0 ? `${activeDocs.length} document${activeDocs.length > 1 ? "s" : ""} actif${activeDocs.length > 1 ? "s" : ""}` : "Activez un document dans la barre latérale"}
            </div>
          </div>
          <button onClick={newChat} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "var(--txt2)", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.color = "var(--blue)"; e.currentTarget.style.background = "var(--blue-lt)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--txt2)"; e.currentTarget.style.background = "none"; }}>
            Réinitialiser
          </button>
        </div>
        <div className="flag-stripe" style={{ height: 3, flexShrink: 0 }} />

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {messages.length === 0 && !isLoading && (
            <div className="fade-up" style={{ maxWidth: 640 }}>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "3px solid var(--red)", borderRadius: 12, padding: "1.1rem 1.25rem", marginBottom: "1.25rem" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: "var(--blue-dk)", marginBottom: "0.4rem" }}>Bienvenue dans votre Assistant Constitutionnel</h2>
                <p style={{ fontSize: 13.5, color: "var(--txt2)", lineHeight: 1.7 }}>
                  Je couvre <strong>10 textes constitutionnels congolais</strong> de 1908 à 2011, chargés directement depuis la Présidence de la RDC. Activez les documents dans la barre latérale, posez vos questions — je citerai toujours le document source et l&apos;article précis.
                </p>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--txt3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Commencer par</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)}
                    style={{ textAlign: "left", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.65rem 1rem", fontSize: 13.5, color: "var(--txt2)", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.color = "var(--blue)"; e.currentTarget.style.background = "var(--blue-lt)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--txt2)"; e.currentTarget.style.background = "var(--surface)"; }}>
                    <span style={{ color: "var(--yellow-dk)", flexShrink: 0 }}>→</span>{q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => <ChatMessage key={i} role={msg.role} content={msg.content} />)}
          {isLoading && <ChatMessage role="assistant" content={streamingContent} isStreaming />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "0.85rem 1.25rem 1rem", borderTop: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.55rem 0.55rem 0.55rem 0.9rem", transition: "border-color 0.15s" }}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
            onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
            <textarea ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKeyDown}
              placeholder="Posez votre question sur les textes constitutionnels congolais…"
              rows={1} disabled={isLoading}
              style={{ flex: 1, border: "none", background: "transparent", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--txt)", resize: "none", outline: "none", minHeight: 22, maxHeight: 120, lineHeight: 1.55, padding: 0 }} />
            <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}
              style={{ width: 36, height: 36, background: isLoading || !input.trim() ? "var(--border)" : "var(--blue)", border: "none", borderRadius: 8, color: "#fff", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
              {isLoading
                ? <div className="spin" style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
            </button>
          </div>
          <div style={{ marginTop: 5, fontSize: 10.5, color: "var(--txt3)", textAlign: "center" }}>Entrée pour envoyer · Maj+Entrée pour nouvelle ligne</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper { position: fixed !important; top: 0; left: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.25s ease; z-index: 60 !important; }
          .sidebar-wrapper.open { transform: translateX(0); }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
