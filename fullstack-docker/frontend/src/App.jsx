import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setStatus("success");
      })
      .catch(() => {
        setMessage("Backend connection failed");
        setStatus("error");
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        padding: "20px",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Main Card */}
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "48px 40px",
          maxWidth: "620px",
          width: "100%",
          textAlign: "center",
          boxSizing: "border-box",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        }}
      >
        {/* Docker Logo */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px auto",
            boxShadow: "0 8px 20px rgba(14,165,233,0.4)",
          }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="white"
          >
            {/* Docker whale icon simplified */}
            <rect x="2" y="10" width="4" height="3" rx="0.5" />
            <rect x="7" y="10" width="4" height="3" rx="0.5" />
            <rect x="12" y="10" width="4" height="3" rx="0.5" />
            <rect x="7" y="6" width="4" height="3" rx="0.5" />
            <rect x="12" y="6" width="4" height="3" rx="0.5" />
            <path
              d="M21 10.5C21 10.5 20 9 17 9H16.5V10H17C19 10 20 11 20 11L21 10.5Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Experiment Badge */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(14,165,233,0.15)",
            color: "#38bdf8",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            padding: "5px 14px",
            borderRadius: "100px",
            border: "1px solid rgba(14,165,233,0.3)",
            marginBottom: "16px",
          }}
        >
          Experiment No. 7 — DevOps &amp; Docker
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#f1f5f9",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px",
          }}
        >
          PS Lost &amp; Found
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "#94a3b8",
            margin: "0 0 6px 0",
          }}
        >
          Full Stack Docker Application
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "#64748b",
            margin: "0 0 30px 0",
          }}
        >
          Frontend: React (Vite) &nbsp;|&nbsp; Backend: Node.js / Express &nbsp;|&nbsp; Server: Nginx
        </p>

        {/* Status Banner */}
        <div
          style={{
            borderRadius: "12px",
            padding: "16px 22px",
            marginBottom: "24px",
            backgroundColor:
              status === "success"
                ? "rgba(34,197,94,0.12)"
                : status === "error"
                ? "rgba(239,68,68,0.12)"
                : "rgba(148,163,184,0.1)",
            border:
              status === "success"
                ? "1px solid rgba(34,197,94,0.3)"
                : status === "error"
                ? "1px solid rgba(239,68,68,0.3)"
                : "1px solid rgba(148,163,184,0.2)",
            color:
              status === "success"
                ? "#4ade80"
                : status === "error"
                ? "#f87171"
                : "#94a3b8",
            fontWeight: "600",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "18px" }}>
            {status === "success" ? "✅" : status === "error" ? "❌" : "⏳"}
          </span>
          <span>Backend Response: {message}</span>
        </div>

        {/* Info Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Frontend Port
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#38bdf8" }}>:3000</div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Backend Port
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#a78bfa" }}>:5000</div>
          </div>
        </div>

        {/* Tech stack pills */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {["React 19", "Vite 8", "Node.js 22", "Express 5", "Nginx", "Docker Compose"].map(
            (tech) => (
              <span
                key={tech}
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "#cbd5e1",
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {tech}
              </span>
            )
          )}
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "#475569",
            marginTop: "24px",
            marginBottom: 0,
          }}
        >
          Containerized with Docker · Orchestrated via Docker Compose
        </p>
      </div>
    </div>
  );
}

export default App;
