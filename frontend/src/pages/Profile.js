// frontend/src/pages/Profile.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyBookings, getMyDeals, updateBookingStatus, updateMe } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/globals.css";

const STATUS_PILL = {
  pending: "pill-gold", confirmed: "pill-green", rejected: "pill-red", cancelled: "pill-red",
};

export default function Profile() {
  const { firebaseUser, dbUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", department: "", year: "" });
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    if (!firebaseUser) { navigate("/"); return; }
    setProfileForm({
      name: dbUser?.name || "",
      phone: dbUser?.phone || "",
      department: dbUser?.department || "",
      year: dbUser?.year || "",
    });
    Promise.all([getMyBookings(), getMyDeals()])
      .then(([b, d]) => { setBookings(b.data.data); setDeals(d.data.data); })
      .finally(() => setLoading(false));
  }, [firebaseUser, dbUser]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await updateBookingStatus(bookingId, { status: "cancelled" });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to cancel.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateMe({ ...profileForm, year: profileForm.year ? Number(profileForm.year) : undefined });
      setSaveMsg({ type: "success", msg: "Profile updated!" });
      setEditMode(false);
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setSaveMsg({ type: "error", msg: e.response?.data?.message || "Update failed." });
    }
  };

  if (!firebaseUser) return null;

  return (
    <div className="page">
      <div className="page-inner" style={{ minHeight: "100vh" }}>
        {/* Profile Header */}
        <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 40, flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,var(--maroon),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, color: "var(--white)", flexShrink: 0 }}>
            {(dbUser?.name || firebaseUser.displayName || firebaseUser.email)[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.75rem", fontWeight: 700 }}>{dbUser?.name || firebaseUser.displayName}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{firebaseUser.email}</div>
            {dbUser?.department && <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{dbUser.department}{dbUser.year ? ` · Year ${dbUser.year}` : ""}</div>}
          </div>
          <button className="btn btn-outline" onClick={() => setEditMode(e => !e)}>
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* Edit Form */}
        {editMode && (
          <div className="card" style={{ padding: 24, marginBottom: 32 }}>
            {saveMsg && <div className={`alert ${saveMsg.type === "success" ? "alert-success" : "alert-error"}`}>{saveMsg.msg}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["name", "Full Name"], ["phone", "Phone"], ["department", "Department"], ["year", "Year"]].map(([k, l]) => (
                <div key={k}>
                  <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: 4 }}>{l}</label>
                  <input className="input" value={profileForm[k]} type={k === "year" ? "number" : "text"}
                    onChange={e => setProfileForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <button className="btn btn-maroon" style={{ marginTop: 16 }} onClick={handleSaveProfile}>Save Changes</button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "var(--bg2)", borderRadius: 10, padding: 4, width: "fit-content", border: "1px solid var(--border)" }}>
          {["bookings", "deals"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "9px 22px", borderRadius: 7, cursor: "pointer", fontSize: "0.84rem", fontWeight: tab === t ? 600 : 500, transition: "all 0.2s", background: tab === t ? "var(--maroon)" : "transparent", border: "none", color: tab === t ? "var(--white)" : "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
              {t === "bookings" ? "My Bookings" : "My Deals"}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : tab === "bookings" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bookings.length === 0 && <p style={{ color: "var(--muted)" }}>No bookings yet. <a href="/hostel" style={{ color: "var(--maroon)" }}>Browse hostels →</a></p>}
            {bookings.map(b => (
              <div key={b._id} className="card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: 4 }}>{b.hostel?.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 2 }}>
                    <div>Move-in: {new Date(b.moveInDate).toLocaleDateString()}</div>
                    <div>Rent: ₹{b.hostel?.rent?.toLocaleString()}/month</div>
                    {b.adminNote && <div>Note: {b.adminNote}</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className={`pill ${STATUS_PILL[b.status]}`}>{b.status}</span>
                  {b.status === "pending" && (
                    <button className="btn btn-outline" style={{ color: "#dc2626", borderColor: "rgba(220,38,38,0.3)", padding: "6px 14px", fontSize: "0.78rem" }}
                      onClick={() => handleCancel(b._id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {deals.length === 0 && <p style={{ color: "var(--muted)" }}>No deals posted yet. <a href="/deals" style={{ color: "var(--maroon)" }}>Post a deal →</a></p>}
            {deals.map(d => (
              <div key={d._id} className="card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>{d.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>₹{d.price} · {d.category} · {d.condition}</div>
                </div>
                <span className={`pill ${d.isSold ? "pill-red" : "pill-green"}`}>{d.isSold ? "Sold" : "Available"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
