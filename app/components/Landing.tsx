"use client";

import { useState } from "react";
import DRCFlag from "@/app/components/DRCFlag";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      {/* Full-screen flag */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <DRCFlag className="w-full h-full" />
      </div>

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "rgba(0,20,60,0.52)",
          backdropFilter: "blur(1px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 460,
          gap: "1.5rem",
        }}
      >
        {/* Hero text */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 5vw, 40px)",
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
              lineHeight: 1.2,
              letterSpacing: "0.01em",
            }}
          >
            Assistant Constitutionnel
          </h1>
          <p
            style={{
              fontSize: "clamp(12px, 2.5vw, 15px)",
              color: "rgba(255,255,255,0.82)",
              textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              marginTop: "0.4rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            République Démocratique du Congo · 1908 – 2011
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 20,
            padding: "2rem 1.75rem",
            width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          {/* Shield icon */}
          <div
            style={{
              width: 48,
              height: 48,
              background: "var(--blue-lt)",
              border: "2px solid var(--blue-bd)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-dk)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11.5C16.5 22 20 17.5 20 12V6L12 2z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--blue-dk)",
              textAlign: "center",
              marginBottom: "0.3rem",
            }}
          >
            Accéder à l&apos;assistant
          </h2>
          <p style={{ fontSize: 13, color: "var(--txt2)", textAlign: "center", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            10 textes constitutionnels de 1908 à 2011, directement depuis la Présidence de la RDC.
          </p>

          <button
            onClick={onStart}
            style={{
              width: "100%",
              background: "var(--blue)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "0.8rem",
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--blue-dk)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--blue)")}
          >
            Démarrer →
          </button>

          {/* Features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.75rem",
              marginTop: "1.25rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            {[
              { icon: "📄", label: "10 documents" },
              { icon: "🔍", label: "Citations précises" },
              { icon: "🇫🇷", label: "En français" },
            ].map((f) => (
              <div key={f.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{f.icon}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)", fontWeight: 500 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
          Sources officielles · presidence.cd
        </p>
      </div>
    </div>
  );
}
