// frontend/src/pages/CampusDeals.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getDeals, createDeal, deleteDeal } from "../services/api";
import "../styles/globals.css";

const CONDITIONS = ["New", "Like New", "Good", "Fair"];

// Category placeholder images (Unsplash)
const CATEGORY_IMAGES = {
  Books:       "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
  Stationery:  "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80",
  Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80",
  Other:       "https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=400&q=80",
};

// SVG icons for categories
const CategoryIcon = ({ category }) => {
  const icons = {
    Books: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="11" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 6H11M6 9H11M6 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 4L17 5V18L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    Stationery: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13 3L17 7L8 16H4V12L13 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M11 5L15 9" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    Electronics: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 15V17M13 15V17M5 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 9L10 11L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Other: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 7L10 3L17 7V13L10 17L3 13V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
  };
  return icons[category] || icons.Other;
};

export default function CampusDeals() {
  const { firebaseUser, dbUser } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Books",
    price: "", condition: "Good", sellerPhone: "", image: ""
  });
  const [formBusy, setFormBusy] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (search) params.search = search;
      const res = await getDeals(params);
      setDeals(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(loadDeals, 300);
    return () => clearTimeout(t);
  }, [category, search]);

  const handlePost = async () => {
    if (!form.title || !form.price) {
      setFormMsg({ type: "error", msg: "Title and price are required." });
      return;
    }
    setFormBusy(true);
    try {
      await createDeal({ ...form, price: Number(form.price) });
      setFormMsg({ type: "success", msg: "Deal posted successfully!" });
      setForm({ title: "", description: "", category: "Books", price: "", condition: "Good", sellerPhone: "", image: "" });
      loadDeals();
      setTimeout(() => { setShowForm(false); setFormMsg(null); }, 2000);
    } catch (e) {
      setFormMsg({ type: "error", msg: e.response?.data?.message || "Failed to post." });
    } finally {
      setFormBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deleteDeal(id);
      loadDeals();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="page">
      <div className="page-inner" style={{ minHeight: "100vh" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 0 }}>
          <div>
            <div className="section-label">Peer Marketplace</div>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Campus <em>Deals</em></h1>
          </div>
          {firebaseUser && (
            <button className="btn btn-maroon" style={{ marginTop: 52 }}
              onClick={() => { setShowForm(true); setFormMsg(null); }}>
              + Post a Deal
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, margin: "32px 0", flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" style={{ maxWidth: 300 }} placeholder="Search deals…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {["All", "Books", "Stationery", "Electronics", "Other"].map(c => (
            <button key={c} className={`btn ${category === c ? "btn-maroon" : "btn-outline"}`}
              style={{ borderRadius: 20, padding: "7px 16px" }}
              onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(256px,1fr))", gap: 18 }}>
            {deals.map(d => (
              <div key={d._id} className="card" style={{ overflow: "hidden" }}>
                {/* Image — seller-provided or category fallback */}
                <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                  <img
                    src={d.images?.[0] || CATEGORY_IMAGES[d.category] || CATEGORY_IMAGES.Other}
                    alt={d.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.src = CATEGORY_IMAGES[d.category] || CATEGORY_IMAGES.Other; }}
                  />
                  {/* Category badge */}
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    display: "flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
                    borderRadius: 20, padding: "4px 10px",
                    fontSize: "0.7rem", fontWeight: 600, color: "var(--maroon)",
                    border: "1px solid rgba(123,28,28,0.15)"
                  }}>
                    <CategoryIcon category={d.category} />
                    {d.category}
                  </span>
                  {/* Condition badge */}
                  <span className="pill pill-gold" style={{ position: "absolute", top: 10, right: 10, fontSize: "0.65rem" }}>
                    {d.condition}
                  </span>
                </div>

                <div style={{ padding: 18 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: 4, lineHeight: 1.3 }}>
                    {d.title}
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", color: "var(--maroon)", fontSize: "1rem", marginBottom: 8 }}>
                    ₹{d.price?.toLocaleString()}
                  </div>
                  {d.description && (
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 10, lineHeight: 1.6 }}>
                      {d.description}
                    </p>
                  )}
                  <div style={{ fontSize: "0.77rem", color: "var(--muted)", lineHeight: 2, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                    <div>👤 {d.sellerName}</div>
                    <div>📧 <a href={`mailto:${d.sellerEmail}`} style={{ color: "var(--gold)", textDecoration: "none" }}>{d.sellerEmail}</a></div>
                    {d.sellerPhone && <div>📞 {d.sellerPhone}</div>}
                  </div>
                  {dbUser && d.seller === dbUser._id && (
                    <button className="btn btn-outline" style={{ marginTop: 10, width: "100%", color: "#dc2626", borderColor: "rgba(220,38,38,0.3)" }}
                      onClick={() => handleDelete(d._id)}>
                      Remove Listing
                    </button>
                  )}
                </div>
              </div>
            ))}
            {deals.length === 0 && (
              <p style={{ color: "var(--muted)", gridColumn: "1/-1" }}>No deals found.</p>
            )}
          </div>
        )}
      </div>

      {/* Post Deal Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(26,18,9,0.68)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 18, padding: 36, width: 420, maxWidth: "94vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 40px 100px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>Post a Deal</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 22 }}>List your item for the Christ College community.</div>

            {formMsg && (
              <div className={`alert ${formMsg.type === "success" ? "alert-success" : "alert-error"}`}>{formMsg.msg}</div>
            )}

            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Title *</label>
            <input className="input" placeholder="e.g. Organic Chemistry textbook" style={{ marginBottom: 10 }}
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Category</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {["Books", "Stationery", "Electronics", "Other"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Condition</label>
                <select className="input" value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Price (₹) *</label>
            <input className="input" type="number" placeholder="250" style={{ marginBottom: 10 }}
              value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />

            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>
              Image URL <span style={{ color: "var(--gold)", fontStyle: "italic" }}>(optional — paste a photo link)</span>
            </label>
            <input className="input" type="url" placeholder="https://i.imgur.com/yourimage.jpg" style={{ marginBottom: 10 }}
              value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            {form.image && (
              <div style={{ marginBottom: 10, borderRadius: 8, overflow: "hidden", height: 100 }}>
                <img src={form.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => e.target.style.display = "none"} />
              </div>
            )}

            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Phone (optional)</label>
            <input className="input" type="tel" placeholder="9876543210" style={{ marginBottom: 10 }}
              value={form.sellerPhone} onChange={e => setForm(f => ({ ...f, sellerPhone: e.target.value }))} />

            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 5 }}>Description</label>
            <textarea className="input" rows={3} placeholder="Describe condition, edition, etc."
              style={{ resize: "vertical", marginBottom: 16 }}
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

            <div style={{ display: "flex", gap: 9 }}>
              <button className="btn btn-maroon" style={{ flex: 1 }} onClick={handlePost} disabled={formBusy}>
                {formBusy ? "Posting…" : "Post Deal"}
              </button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}