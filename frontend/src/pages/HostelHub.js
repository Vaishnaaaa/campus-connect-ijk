// frontend/src/pages/HostelHub.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getHostels, createBooking } from "../services/api";
import "../styles/globals.css";

const Stars = ({ n }) => (
  <span className="stars">
    {"★".repeat(Math.round(n || 0))}
    {"☆".repeat(5 - Math.round(n || 0))}
  </span>
);

const navBtnStyle = (side) => ({
  position: "absolute", top: "50%", [side]: 8, transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", borderRadius: "50%",
  width: 28, height: 28, cursor: "pointer", fontSize: "1.1rem",
  display: "flex", alignItems: "center", justifyContent: "center",
  backdropFilter: "blur(4px)", zIndex: 2,
});

function ImageGallery({ images, image, name }) {
  const [idx, setIdx] = useState(0);
  const fallback = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80";
  const imgs = Array.isArray(images) && images.length > 0 ? images
    : typeof image === "string" && image ? [image]
    : [fallback];

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % imgs.length); };

  return (
    <div style={{ position: "relative", height: 196, overflow: "hidden", background: "var(--bg2)" }}>
      <img src={imgs[idx] || fallback} alt={name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={e => { e.target.src = fallback; }} />
      {imgs.length > 1 && (
        <>
          <button onClick={prev} style={navBtnStyle("left")}>‹</button>
          <button onClick={next} style={navBtnStyle("right")}>›</button>
          <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
            {imgs.map((_, i) => (
              <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                style={{ width: i === idx ? 16 : 6, height: 6, borderRadius: 3, background: i === idx ? "#fff" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s" }} />
            ))}
          </div>
          <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "0.65rem", padding: "2px 8px", borderRadius: 20, backdropFilter: "blur(4px)" }}>
            {idx + 1}/{imgs.length}
          </span>
        </>
      )}
    </div>
  );
}

export default function HostelHub() {
  const { firebaseUser } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookForm, setBookForm] = useState({ moveInDate: "", studentPhone: "", message: "" });
  const [bookStatus, setBookStatus] = useState(null);
  const [bookBusy, setBookBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (filter === "Ladies") params.gender = "girls";
        if (filter === "Mens")   params.gender = "boys";
        if (search) params.search = search;
        const res = await getHostels(params);
        setHostels(res.data.data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [filter, search]);

  const handleBook = async () => {
    if (!bookForm.moveInDate) { setBookStatus({ type: "error", msg: "Please select a move-in date." }); return; }
    setBookBusy(true);
    try {
      await createBooking({ hostelId: booking._id, ...bookForm });
      setBookStatus({ type: "success", msg: "Booking submitted! The hostel owner will confirm shortly." });
      setTimeout(() => { setBooking(null); setBookStatus(null); }, 3000);
    } catch (e) {
      setBookStatus({ type: "error", msg: e.response?.data?.message || "Booking failed." });
    } finally {
      setBookBusy(false);
    }
  };

  const genderLabel = (g) => g === "girls" ? "Ladies PG" : g === "boys" ? "Mens Hostel" : (g || "");

  return (
    <div className="page">
      <div className="page-inner-alt" style={{ minHeight: "100vh" }}>
        <div className="section-label">Accommodation</div>
        <h1 className="section-title">Hostel <em>Hub</em></h1>

        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" style={{ maxWidth: 340 }} placeholder="Search hostels…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {["All", "Ladies", "Mens"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn ${filter === f ? "btn-maroon" : "btn-outline"}`}
              style={{ borderRadius: 20, padding: "7px 18px" }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
            {hostels.map(h => (
              <div key={h._id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative" }}>
                  <ImageGallery images={h.images} image={h.image} name={h.name} />
                  <span className="pill pill-maroon" style={{ position: "absolute", top: 12, right: 12, zIndex: 3 }}>
                    {genderLabel(h.gender)}
                  </span>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 7 }}>{h.name}</div>
                  <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
                    {h.distance_from_college && <span style={{ fontSize: "0.77rem", color: "var(--muted)" }}>📍 {h.distance_from_college} from college</span>}
                    {h.location && <span style={{ fontSize: "0.77rem", color: "var(--muted)" }}>🏘 {h.location}</span>}
                  </div>
                  <Stars n={h.rating} />
                  {h.facilities?.length > 0 && (
                    <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {h.facilities.slice(0, 3).map(f => (
                        <span key={f} className="pill pill-gold" style={{ fontSize: "0.68rem" }}>{f}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)", marginTop: 12 }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", color: "var(--maroon)", fontSize: "1rem" }}>
                      ₹{(h.price ?? h.rent ?? 0).toLocaleString()}
                      <span style={{ fontSize: "0.67rem", color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}> / mo</span>
                    </div>
                    <button className="btn btn-maroon" style={{ padding: "7px 16px", fontSize: "0.8rem" }}
                      onClick={() => {
                        if (!firebaseUser) { alert("Please login to book."); return; }
                        setBooking(h); setBookStatus(null);
                        setBookForm({ moveInDate: "", studentPhone: "", message: "" });
                      }}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
            {hostels.length === 0 && (
              <p style={{ color: "var(--muted)", gridColumn: "1/-1" }}>No hostels found matching your search.</p>
            )}
          </div>
        )}
      </div>

      {booking && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(26,18,9,0.68)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => e.target === e.currentTarget && setBooking(null)}>
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 18, padding: 36, width: 380, maxWidth: "94vw", boxShadow: "0 40px 100px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>Book {booking.name}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 22 }}>
              ₹{(booking.price ?? booking.rent ?? 0).toLocaleString()}/month
              {booking.distance_from_college && ` · ${booking.distance_from_college} from college`}
            </div>
            {bookStatus && <div className={`alert ${bookStatus.type === "success" ? "alert-success" : "alert-error"}`}>{bookStatus.msg}</div>}
            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Move-in Date *</label>
            <input className="input" type="date" style={{ marginBottom: 10 }} value={bookForm.moveInDate}
              onChange={e => setBookForm(f => ({ ...f, moveInDate: e.target.value }))} />
            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Phone Number</label>
            <input className="input" type="tel" placeholder="9876543210" style={{ marginBottom: 10 }} value={bookForm.studentPhone}
              onChange={e => setBookForm(f => ({ ...f, studentPhone: e.target.value }))} />
            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Message (optional)</label>
            <textarea className="input" rows={3} placeholder="Any special requirements?" style={{ resize: "vertical", marginBottom: 16 }}
              value={bookForm.message} onChange={e => setBookForm(f => ({ ...f, message: e.target.value }))} />
            <div style={{ display: "flex", gap: 9 }}>
              <button className="btn btn-maroon" style={{ flex: 1 }} onClick={handleBook} disabled={bookBusy}>
                {bookBusy ? "Submitting…" : "Confirm Booking"}
              </button>
              <button className="btn btn-outline" onClick={() => setBooking(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}