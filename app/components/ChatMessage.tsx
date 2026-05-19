"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

function formatContent(text: string): string {
  return text
    .replace(/<art>(.*?)<\/art>/g, '<span class="art-badge">$1</span>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          marginTop: 2,
          background: isUser ? "var(--yellow-lt)" : "var(--blue-dk)",
          border: isUser ? "1.5px solid var(--yellow)" : "none",
          color: isUser ? "var(--blue-dk)" : "#fff",
        }}
      >
        {isUser ? (
          "Vous"
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11.5C16.5 22 20 17.5 20 12V6L12 2z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--txt3)",
            marginBottom: 3,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {isUser ? "Vous" : "Assistant Constitutionnel"}
        </div>
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: 12,
            fontSize: 14,
            lineHeight: 1.75,
            background: isUser ? "var(--blue)" : "var(--surface)",
            color: isUser ? "#fff" : "var(--txt)",
            border: isUser ? "none" : "1px solid var(--border)",
            borderTopLeftRadius: isUser ? 12 : 4,
            borderTopRightRadius: isUser ? 4 : 12,
            boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {isStreaming && content === "" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "2px 0" }}>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          ) : (
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: `<p>${formatContent(content)}</p>`,
              }}
            />
          )}
          {isStreaming && content !== "" && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: "var(--blue)",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                animation: "blink 1s infinite",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
