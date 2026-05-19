"use client";

import { DOCUMENTS } from "@/app/lib/documents";

interface DocState {
  id: string;
  active: boolean;
  loaded: boolean;
  loading: boolean;
  error?: string;
}

interface SidebarProps {
  docStates: DocState[];
  onToggleDoc: (id: string) => void;
  onNewChat: () => void;
  onAskQuestion: (q: string) => void;
  onClose?: () => void;
}

const QUICK_QUESTIONS = [
  "Quels sont mes droits fondamentaux ?",
  "Pouvoirs du Président de la République",
  "Comment fonctionne le Parlement ?",
  "Combien de mandats présidentiels sont autorisés ?",
  "Comment réviser la Constitution ?",
  "Constitution 2006 vs révision de 2011",
  "Évolution constitutionnelle depuis 1960",
];

const TOPICS = [
  { label: "Droits & libertés", q: "Expliquez les droits et libertés fondamentaux dans la Constitution congolaise" },
  { label: "Exécutif", q: "Comment fonctionne le pouvoir exécutif en RDC ?" },
  { label: "Sénat", q: "Quel est le rôle du Sénat en RDC ?" },
  { label: "Justice", q: "Comment est organisé le pouvoir judiciaire en RDC ?" },
  { label: "Territoire", q: "Comment est organisé le territoire de la RDC selon la Constitution ?" },
  { label: "Égalité H/F", q: "Quelles sont les protections constitutionnelles des femmes en RDC ?" },
  { label: "Droits sociaux", q: "Quels sont les droits économiques et sociaux dans la Constitution congolaise ?" },
  { label: "Cour constit.", q: "Quel est le rôle de la Cour constitutionnelle en RDC ?" },
  { label: "Transition 2003 vs 2006", q: "Comparez la Constitution de la transition 2003 et la Constitution de 2006" },
  { label: "Indépendance 1960", q: "Quelles étaient les dispositions de la Loi fondamentale de 1960 à l'indépendance ?" },
];

export default function Sidebar({
  docStates,
  onToggleDoc,
  onNewChat,
  onAskQuestion,
  onClose,
}: SidebarProps) {
  const getDocState = (id: string) => docStates.find((d) => d.id === id);

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--blue-dk)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Flag stripe */}
      <div className="flag-stripe" style={{ height: 4, flexShrink: 0 }} />

      {/* Header */}
      <div
        style={{
          padding: "1.1rem 1.1rem 0.9rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "0.65rem" }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11.5C16.5 22 20 17.5 20 12V6L12 2z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.25 }}>
              Assistant Constitutionnel
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
              République Démocratique du Congo
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 4 }}
              aria-label="Fermer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "3px 9px", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
          <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)", display: "inline-block" }} />
          Actif · Multi-documents
        </div>

        <button
          onClick={onNewChat}
          style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.88)", fontSize: 12.5, cursor: "pointer", marginTop: "0.65rem", transition: "background 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle conversation
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "1rem" }}>

        {/* Documents */}
        <div style={{ padding: "0.85rem 1.1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "0.55rem" }}>
            📄 Documents constitutionnels
          </div>
          {DOCUMENTS.map((doc) => {
            const state = getDocState(doc.id);
            const isActive = state?.active ?? false;
            const isLoading = state?.loading ?? false;

            return (
              <div
                key={doc.id}
                onClick={() => onToggleDoc(doc.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0.45rem 0.65rem",
                  borderRadius: 8,
                  marginBottom: 3,
                  cursor: "pointer",
                  border: `1px solid ${isActive ? "rgba(0,127,255,0.4)" : "transparent"}`,
                  background: isActive ? "rgba(0,127,255,0.22)" : "transparent",
                  opacity: isLoading ? 0.7 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `1.5px solid ${isActive ? "var(--blue)" : "rgba(255,255,255,0.35)"}`,
                    background: isActive ? "var(--blue)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {isActive && !isLoading && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="1.5 6 4.5 9 10.5 3"/></svg>
                  )}
                  {isLoading && (
                    <div className="spin" style={{ width: 8, height: 8, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "var(--yellow)", borderRadius: "50%" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.label}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{doc.year}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick questions */}
        <div style={{ padding: "0.85rem 1.1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "0.55rem" }}>
            Questions fréquentes
          </div>
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onAskQuestion(q)}
              style={{ display: "block", width: "100%", textAlign: "left", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "0.45rem 0.65rem", marginBottom: 4, color: "rgba(255,255,255,0.75)", fontSize: 12, cursor: "pointer", transition: "all 0.15s", lineHeight: 1.4 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(247,214,24,0.12)"; e.currentTarget.style.color = "var(--yellow)"; e.currentTarget.style.borderColor = "rgba(247,214,24,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Topics */}
        <div style={{ padding: "0.85rem 1.1rem" }}>
          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "0.55rem" }}>
            Explorer par thème
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {TOPICS.map((t) => (
              <span
                key={t.label}
                onClick={() => onAskQuestion(t.q)}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "3px 9px", fontSize: 11, color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--red)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--red)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "0.75rem 1.1rem", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, flexShrink: 0 }}>
        <strong style={{ color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>Sources : presidence.cd</strong><br />
        Documents officiels de la Présidence de la RDC.<br />
        Outil pédagogique — consultez un juriste pour des conseils officiels.
      </div>
    </aside>
  );
}
