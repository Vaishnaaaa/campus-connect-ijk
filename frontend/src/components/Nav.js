// frontend/src/components/Nav.js
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&family=Space+Mono&display=swap');
  :root{--bg:#f7f4ef;--bg2:#ede9e2;--ink:#1a1209;--muted:#8a7e6e;--gold:#b8860b;--gold2:#d4a017;--maroon:#7b1c1c;--border:rgba(184,134,11,0.2);--white:#ffffff}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--gold);border-radius:2px}
  .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;background:rgba(247,244,239,0.94);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
  .nav-logo{display:flex;align-items:center;gap:11px;text-decoration:none;cursor:pointer}
  .nav-cross{width:28px;height:28px;position:relative;flex-shrink:0}
  .nav-cross::before,.nav-cross::after{content:'';position:absolute;background:var(--maroon);border-radius:2px}
  .nav-cross::before{width:4px;height:28px;left:12px;top:0}
  .nav-cross::after{width:28px;height:4px;left:0;top:12px}
  .nav-logo-text{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:var(--ink);line-height:1.1}
  .nav-logo-text span{display:block;font-size:0.62rem;font-weight:400;color:var(--muted);letter-spacing:0.05em;font-family:'DM Sans',sans-serif}
  .nav-links{display:flex;gap:2px;align-items:center}
  .nav-lnk{background:none;border:none;cursor:pointer;padding:7px 13px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:0.79rem;font-weight:500;color:var(--muted);transition:all 0.2s;text-decoration:none;display:inline-block}
  .nav-lnk:hover{color:var(--ink);background:var(--bg2)}
  .nav-lnk.active{color:var(--maroon);background:rgba(123,28,28,0.07);font-weight:600}
  .nav-login{padding:7px 17px;background:var(--maroon);color:var(--white);border:none;border-radius:6px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.79rem;font-weight:600;transition:all 0.2s;margin-left:6px}
  .nav-login:hover{background:#5c1515}
  .nav-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--maroon),var(--gold));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--white);font-size:0.8rem;cursor:pointer;margin-left:8px;border:2px solid var(--border)}
  /* Modal */
  .mo{position:fixed;inset:0;z-index:200;background:rgba(26,18,9,0.68);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;animation:mofade 0.2s ease}
  @keyframes mofade{from{opacity:0}to{opacity:1}}
  .mo-box{background:var(--white);border:1px solid var(--border);border-radius:18px;padding:36px;width:380px;max-width:94vw;animation:moscale 0.25s ease;box-shadow:0 40px 100px rgba(0,0,0,0.2)}
  @keyframes moscale{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
  .mo-cross{width:24px;height:24px;position:relative;display:inline-block;margin-bottom:12px}
  .mo-cross::before,.mo-cross::after{content:'';position:absolute;background:var(--maroon);border-radius:2px}
  .mo-cross::before{width:4px;height:24px;left:10px;top:0}
  .mo-cross::after{width:24px;height:4px;left:0;top:10px}
  .mo-title{font-family:'Cormorant Garamond',serif;font-size:1.65rem;font-weight:700;color:var(--ink);margin-bottom:4px}
  .mo-sub{color:var(--muted);font-size:0.8rem;margin-bottom:24px}
  .mo-input{width:100%;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:7px;color:var(--ink);font-family:'DM Sans',sans-serif;font-size:0.875rem;outline:none;margin-bottom:9px;transition:border-color 0.2s}
  .mo-input:focus{border-color:var(--maroon)}
  .mo-err{background:rgba(123,28,28,0.08);border:1px solid rgba(123,28,28,0.2);border-radius:7px;padding:10px 14px;color:var(--maroon);font-size:0.8rem;margin-bottom:12px}
  .mo-actions{display:flex;gap:9px;margin-top:16px}
  .mo-btn{padding:11px 0;background:var(--maroon);color:var(--white);border:none;border-radius:7px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.875rem;transition:all 0.2s;flex:1}
  .mo-btn:hover{background:#5c1515}
  .mo-btn:disabled{opacity:0.6;cursor:not-allowed}
  .mo-cancel{padding:11px 16px;background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:7px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.875rem;transition:all 0.2s}
  .mo-cancel:hover{border-color:var(--ink);color:var(--ink)}
  .mo-toggle{background:none;border:none;color:var(--maroon);cursor:pointer;font-size:0.8rem;text-decoration:underline;font-family:'DM Sans',sans-serif}
  .mo-google{width:100%;padding:11px;background:var(--bg2);border:1px solid var(--border);border-radius:7px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.875rem;font-weight:500;color:var(--ink);transition:all 0.2s;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:8px}
  .mo-google:hover{border-color:var(--gold)}
  .mo-divider{display:flex;align-items:center;gap:12px;margin-bottom:16px;color:var(--muted);font-size:0.75rem}
  .mo-divider::before,.mo-divider::after{content:'';flex:1;height:1px;background:var(--border)}
`;

const LINKS = [
  ["/", "Home"], ["/hostel", "Hostel Hub"], ["/deals", "Deals"],
  ["/events", "Events"], ["/map", "Map"], ["/about", "About"], ["/reviews", "Reviews"],
];

export default function Nav() {
  const { firebaseUser, dbUser, login, register, loginWithGoogle, logout, authError, clearError } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const close = () => { setShowModal(false); clearError(); setForm({ name:"",email:"",password:"",confirm:"" }); };

  const handleSubmit = async () => {
    if (!form.email || !form.password) return;
    if (mode === "signup" && form.password !== form.confirm) return;
    setBusy(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.email, form.password, form.name);
      close();
    } catch (_) {}
    setBusy(false);
  };

  const handleGoogle = async () => {
    setBusy(true);
    try { await loginWithGoogle(); close(); } catch (_) {}
    setBusy(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <div className="nav-cross" />
          <div className="nav-logo-text">CampusConnect <span>Christ College, Irinjalakuda</span></div>
        </Link>
        <div className="nav-links">
          {LINKS.map(([path, label]) => (
            <Link key={path} to={path}
              className={`nav-lnk ${location.pathname === path ? "active" : ""}`}>
              {label}
            </Link>
          ))}
          {firebaseUser ? (
            <>
              <div className="nav-avatar" onClick={() => navigate("/profile")} title="Profile">
                {(dbUser?.name || firebaseUser.displayName || firebaseUser.email)[0].toUpperCase()}
              </div>
              <button className="nav-login" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="nav-login" onClick={() => { setShowModal(true); setMode("login"); }}>Login</button>
          )}
        </div>
      </nav>

      {showModal && (
        <div className="mo" onClick={e => e.target === e.currentTarget && close()}>
          <div className="mo-box">
            <div className="mo-cross" />
            <div className="mo-title">{mode === "login" ? "Welcome back" : "Create account"}</div>
            <div className="mo-sub">Christ College Irinjalakuda · Student Portal</div>

            <button className="mo-google" onClick={handleGoogle} disabled={busy}>
              <span>G</span> Continue with Google
            </button>
            <div className="mo-divider">or with email</div>

            {authError && <div className="mo-err">{authError}</div>}

            {mode === "signup" && (
              <input className="mo-input" placeholder="Full name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            )}
            <input className="mo-input" placeholder="College email" type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="mo-input" placeholder="Password" type="password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            {mode === "signup" && (
              <input className="mo-input" placeholder="Confirm password" type="password" value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
            )}

            <div className="mo-actions">
              <button className="mo-btn" onClick={handleSubmit} disabled={busy}>
                {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              </button>
              <button className="mo-cancel" onClick={close}>Cancel</button>
            </div>
            <p style={{ marginTop: "14px", fontSize: "0.78rem", color: "var(--muted)", textAlign: "center" }}>
              {mode === "login" ? "New here? " : "Already registered? "}
              <button className="mo-toggle" onClick={() => setMode(m => m === "login" ? "signup" : "login")}>
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
