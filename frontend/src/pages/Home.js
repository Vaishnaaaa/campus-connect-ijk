// frontend/src/pages/Home.js
import { Link } from "react-router-dom";
import "../styles/globals.css";

const CrossSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect x="88" y="10" width="24" height="180" rx="4" fill="white" />
    <rect x="10" y="70" width="180" height="24" rx="4" fill="white" />
    <circle cx="100" cy="100" r="95" stroke="white" strokeWidth="1" strokeDasharray="4 8" />
  </svg>
);

// SVG icons for each service card
const HostelIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 42V20L24 8L40 20V42" stroke="#7b1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 42V30H30V42" stroke="#7b1c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 20H20M28 20H32M16 27H20M28 27H32" stroke="#d4a017" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 42H44" stroke="#7b1c1c" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const DealsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="14" width="32" height="24" rx="3" stroke="#7b1c1c" strokeWidth="2.5"/>
    <path d="M8 20H40" stroke="#7b1c1c" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 8L12 14M32 8L36 14" stroke="#d4a017" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 28L22 32L30 24" stroke="#d4a017" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EventIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="36" height="32" rx="4" stroke="#7b1c1c" strokeWidth="2.5"/>
    <path d="M6 20H42" stroke="#7b1c1c" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 6V14M32 6V14" stroke="#d4a017" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="14" y="26" width="6" height="6" rx="1" fill="#d4a017"/>
    <rect x="28" y="26" width="6" height="6" rx="1" fill="#7b1c1c" opacity="0.4"/>
    <rect x="21" y="26" width="6" height="6" rx="1" fill="#7b1c1c" opacity="0.2"/>
  </svg>
);

const MapIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 12V42L18 36L30 42L42 36V10L30 16L18 6Z" stroke="#7b1c1c" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M18 6V36M30 16V42" stroke="#d4a017" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="30" cy="26" r="4" fill="#7b1c1c" opacity="0.2" stroke="#7b1c1c" strokeWidth="2"/>
    <path d="M30 22V18" stroke="#7b1c1c" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const S = `
  .hero{min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:0 80px 100px}
  .hero-bg{position:absolute;inset:0;background:linear-gradient(160deg,#1a0a0a 0%,#2d1a0e 40%,#3d2a10 100%)}
  .hero-bg-img{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1600&q=80');background-size:cover;background-position:center 30%;opacity:0.28;mix-blend-mode:luminosity}
  .hero-bg-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,10,10,0.98) 0%,rgba(26,10,10,0.5) 50%,rgba(26,10,10,0.2) 100%)}
  .hero-orn{position:absolute;top:80px;right:80px;z-index:1;opacity:0.12;width:260px;height:260px}
  .hero-stats{position:absolute;top:88px;left:80px;z-index:2;display:flex;flex-direction:column;gap:20px}
  .h-stat-n{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#d4a017;line-height:1}
  .h-stat-l{font-size:0.67rem;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;margin-top:2px}
  .hero-badge{position:relative;z-index:2;margin-bottom:24px;display:inline-flex;align-items:center;gap:10px}
  .hero-badge-line{width:34px;height:1px;background:#d4a017}
  .hero-badge-txt{font-family:'Space Mono',monospace;font-size:0.67rem;color:#d4a017;letter-spacing:0.2em;text-transform:uppercase}
  .hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(3.5rem,7vw,6rem);font-weight:700;line-height:0.95;letter-spacing:-0.02em;color:#fff;position:relative;z-index:2;margin-bottom:22px}
  .hero-title em{color:#d4a017;font-style:italic}
  .hero-sub{font-size:1rem;color:rgba(255,255,255,0.6);max-width:460px;line-height:1.75;position:relative;z-index:2;margin-bottom:40px}
  .hero-cta{display:flex;gap:14px;position:relative;z-index:2}
  .btn-hero-p{padding:12px 28px;background:var(--gold);color:#fff;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.875rem;border-radius:6px;transition:all 0.25s;text-decoration:none}
  .btn-hero-p:hover{background:var(--gold2)}
  .btn-hero-g{padding:12px 28px;background:transparent;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.2);cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;font-size:0.875rem;border-radius:6px;transition:all 0.25s;text-decoration:none}
  .btn-hero-g:hover{border-color:#d4a017;color:#d4a017}
  .svc-grid{display:grid;grid-template-columns:repeat(2,1fr);border:1px solid var(--border);border-radius:16px;overflow:hidden;gap:1px;background:var(--border)}
  .svc-card{background:var(--white);padding:44px 40px 52px;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden;text-decoration:none;display:block}
  .svc-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--maroon),var(--gold));transform:scaleX(0);transition:transform 0.3s;transform-origin:left}
  .svc-card:hover::after{transform:scaleX(1)}
  .svc-card:hover{background:var(--bg)}
  .svc-card:hover .svc-icon-wrap svg path, .svc-card:hover .svc-icon-wrap svg rect, .svc-card:hover .svc-icon-wrap svg circle{transition:all 0.3s}
  .svc-num{font-family:'Space Mono',monospace;font-size:0.67rem;color:var(--gold);margin-bottom:22px;letter-spacing:0.1em}
  .svc-icon-wrap{margin-bottom:18px;display:flex;align-items:center;justify-content:flex-start}
  .svc-name{font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;margin-bottom:10px;color:var(--ink)}
  .svc-desc{color:var(--muted);font-size:0.875rem;line-height:1.75;max-width:320px}
  .svc-arrow{position:absolute;bottom:24px;right:24px;width:38px;height:38px;border-radius:50%;background:var(--bg2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:1rem;transition:all 0.3s;font-family:sans-serif}
  .svc-card:hover .svc-arrow{background:var(--maroon);color:var(--white);border-color:var(--maroon);transform:translate(3px,-3px)}
  @media(max-width:900px){
    .hero{padding:0 28px 72px}
    .hero-stats{top:auto;bottom:auto;left:28px;right:28px;flex-direction:row;flex-wrap:wrap;gap:16px;position:relative;z-index:2;margin-bottom:32px}
    .svc-grid{grid-template-columns:1fr}
  }
`;

const SERVICES = [
  {
    num: "01",
    Icon: HostelIcon,
    name: "Hostel Hub",
    desc: "Browse verified PGs and hostels near Christ College with ratings, facilities, and direct booking.",
    to: "/hostel"
  },
  {
    num: "02",
    Icon: DealsIcon,
    name: "Campus Deals",
    desc: "A student-to-student marketplace for used textbooks, stationery, and electronics within the Christ College community.",
    to: "/deals"
  },
  {
    num: "03",
    Icon: EventIcon,
    name: "Event Chart",
    desc: "Stay informed about PRAGATHI, Christotsav, sports meets, and all academic and cultural campus events.",
    to: "/events"
  },
  {
    num: "04",
    Icon: MapIcon,
    name: "Campus Map",
    desc: "Interactive map of Christ College, Irinjalakuda with key facilities and nearby landmarks.",
    to: "/map"
  },
];

// Stats — separated from hero so NAAC doesn't overlap hero title on mobile
const STATS = [
  ["70+", "Years"],
  ["6000+", "Students"],
  ["50+", "Programmes"],
  ["A+", "NAAC"],
];

export default function Home() {
  return (
    <div className="page">
      <style>{S}</style>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-bg-img" />
        <div className="hero-bg-grad" />
        <div className="hero-orn"><CrossSVG /></div>

        {/* Stats — absolute on desktop, hidden on mobile to prevent overlap */}
        <div className="hero-stats">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <div className="h-stat-n">{n}</div>
              <div className="h-stat-l">{l}</div>
            </div>
          ))}
        </div>

        <div className="hero-badge">
          <div className="hero-badge-line" />
          <div className="hero-badge-txt">Christ College IJK · Autonomous · Affiliated to Calicut University</div>
        </div>

        <h1 className="hero-title">
          Your Campus.<br />
          <em>Beautifully</em><br />
          Connected.
        </h1>

        <p className="hero-sub">
          Hostels, marketplace, events, and navigation — every essential campus service unified for Christ College students.
        </p>

        <div className="hero-cta">
          <Link to="/hostel" className="btn-hero-p">Explore Services</Link>
          <Link to="/about" className="btn-hero-g">About the College</Link>
        </div>
      </section>

      {/* Divider */}
      <div style={{ padding: "0 80px", margin: "56px 0", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ color: "var(--gold)", opacity: 0.55 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {/* Services */}
      <section style={{ padding: "0 80px 100px" }}>
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">Four services,<br /><em>one platform.</em></h2>
        <div className="svc-grid">
          {SERVICES.map(({ num, Icon, name, desc, to }) => (
            <Link key={num} to={to} className="svc-card">
              <div className="svc-num">{num}</div>
              <div className="svc-icon-wrap"><Icon /></div>
              <div className="svc-name">{name}</div>
              <p className="svc-desc">{desc}</p>
              <div className="svc-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}