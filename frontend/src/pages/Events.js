// frontend/src/pages/Events.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getEvents, registerForEvent } from "../services/api";
import "../styles/globals.css";

const TYPE_COLORS = {
  Cultural: { bg: "rgba(212,160,23,0.12)", color: "#a07810" },
  Academic: { bg: "rgba(123,28,28,0.1)", color: "#7b1c1c" },
  Sports:   { bg: "rgba(22,101,52,0.1)",  color: "#166534" },
  default:  { bg: "rgba(100,100,100,0.1)", color: "#555" },
};

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M1 7H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 1V4M11 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1C4.79 1 3 2.79 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="7" cy="5" r="1.5" fill="currentColor"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Events() {
  const { firebaseUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [regStatus, setRegStatus] = useState({});

  useEffect(() => {
    getEvents({ upcoming: true })
      .then(res => setEvents(res.data.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (eventId) => {
    if (!firebaseUser) { alert("Please login to register."); return; }
    setRegStatus(s => ({ ...s, [eventId]: "loading" }));
    try {
      await registerForEvent(eventId);
      setRegStatus(s => ({ ...s, [eventId]: "success" }));
    } catch (e) {
      setRegStatus(s => ({ ...s, [eventId]: e.response?.data?.message || "Failed" }));
    }
  };

  return (
    <div className="page">
      <div className="page-inner-alt" style={{ minHeight: "100vh" }}>
        <div className="section-label">Academic Calendar</div>
        <h1 className="section-title">Event <em>Chart</em></h1>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {events.map(ev => {
              const d = new Date(ev.date);
              const isSel = selected?._id === ev._id;
              const rs = regStatus[ev._id];
              const typeStyle = TYPE_COLORS[ev.type] || TYPE_COLORS.default;
              const spotsLeft = ev.maxParticipants
                ? ev.maxParticipants - (ev.registrations?.length || 0)
                : null;

              return (
                <div key={ev._id} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${isSel ? "rgba(123,28,28,0.3)" : "var(--border)"}`, transition: "all 0.3s", boxShadow: isSel ? "0 4px 24px rgba(123,28,28,0.08)" : "none" }}>

                  {/* Main Row — always visible */}
                  <div
                    onClick={() => setSelected(isSel ? null : ev)}
                    style={{ display: "grid", gridTemplateColumns: "80px 1px 1fr auto", alignItems: "center", gap: 0, background: isSel ? "rgba(123,28,28,0.03)" : "var(--white)", cursor: "pointer", transition: "background 0.2s" }}
                  >
                    {/* Date block */}
                    <div style={{ padding: "22px 16px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 700, color: "var(--maroon)", lineHeight: 1 }}>
                        {d.getDate()}
                      </div>
                      <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginTop: 3 }}>
                        {MONTHS[d.getMonth()]} {d.getFullYear()}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ width: 1, height: 48, background: "var(--border)" }} />

                    {/* Event info */}
                    <div style={{ padding: "18px 24px" }}>
                      {/* Name — bold, prominent */}
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginBottom: 6, lineHeight: 1.2 }}>
                        {ev.title || ev.name}
                      </div>
                      {/* Meta row */}
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                        {ev.type && (
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: typeStyle.bg, color: typeStyle.color }}>
                            {ev.type}
                          </span>
                        )}
                        {ev.time && (
                          <span style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                            <ClockIcon /> {ev.time}
                          </span>
                        )}
                        {(ev.venue || ev.location) && (
                          <span style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                            <PinIcon /> {ev.venue || ev.location}
                          </span>
                        )}
                        {ev.organizer && (
                          <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                            {ev.organizer}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side */}
                    <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      {spotsLeft !== null && (
                        <span style={{ fontSize: "0.68rem", color: spotsLeft < 10 ? "#dc2626" : "var(--muted)" }}>
                          {spotsLeft} spots left
                        </span>
                      )}
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "0.85rem", transition: "transform 0.3s", transform: isSel ? "rotate(90deg)" : "none" }}>
                        →
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isSel && (
                    <div style={{ padding: "28px 32px", background: "var(--bg)", borderTop: "1px solid var(--border)", animation: "fadeUp 0.25s ease" }}>
                      {ev.description && (
                        <p style={{ color: "var(--muted)", lineHeight: 1.85, fontSize: "0.9rem", marginBottom: 24, maxWidth: 640 }}>
                          {ev.description}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        {rs === "success" ? (
                          <div className="alert alert-success" style={{ margin: 0 }}>✅ You're registered!</div>
                        ) : (
                          <button
                            className="btn btn-maroon"
                            onClick={() => handleRegister(ev._id)}
                            disabled={rs === "loading"}
                          >
                            {rs === "loading" ? "Registering…" : typeof rs === "string" ? rs : "Register Now →"}
                          </button>
                        )}
                        {ev.maxParticipants && (
                          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                            {ev.registrations?.length || 0} / {ev.maxParticipants} registered
                          </span>
                        )}
                      </div>
                      {ev.videoUrl && (
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 10, marginTop: 24 }}>
                          <iframe src={ev.videoUrl} title={ev.title || ev.name} allowFullScreen
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {events.length === 0 && (
              <p style={{ color: "var(--muted)" }}>No upcoming events at the moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}