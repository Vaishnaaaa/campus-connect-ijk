// frontend/src/components/Footer.js
import { Link } from "react-router-dom";
const S=`
  .footer{padding:52px 80px 32px;background:var(--ink);color:rgba(255,255,255,0.5)}
  .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:44px;margin-bottom:40px}
  .f-logo{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:12px}
  .f-logo span{color:#d4a017}
  .footer-brand p{font-size:0.8rem;line-height:1.75}
  .f-col h4{font-size:0.68rem;letter-spacing:0.2em;text-transform:uppercase;color:#d4a017;margin-bottom:18px}
  .f-col a{display:block;color:rgba(255,255,255,0.5);text-decoration:none;font-size:0.8rem;margin-bottom:9px;transition:color 0.2s}
  .f-col a:hover{color:#fff}
  .footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:0.76rem}
  @media(max-width:900px){.footer{padding:44px 24px 28px}.footer-top{grid-template-columns:1fr 1fr}}
`;
export default function Footer(){
  return(
    <>
      <style>{S}</style>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="f-logo">Campus<span>Connect</span></div>
            <p>A unified digital platform for Christ College, Irinjalakuda — bringing students closer to campus life.</p>
          </div>
          <div className="f-col">
            <h4>Services</h4>
            <Link to="/hostel">Hostel Hub</Link>
            <Link to="/deals">Campus Deals</Link>
            <Link to="/events">Event Chart</Link>
            <Link to="/map">Campus Map</Link>
          </div>
          <div className="f-col">
            <h4>College</h4>
            <a href="https://christcollegeijk.edu.in" target="_blank" rel="noreferrer">Official Website</a>
            <Link to="/about">About</Link>
            <a href="https://christcollegeijk.edu.in/admission-2026-27" target="_blank" rel="noreferrer">Admissions</a>
            <a href="https://christcollegeijk.edu.in/contact-us" target="_blank" rel="noreferrer">Contact</a>
          </div>
          <div className="f-col">
            <h4>Support</h4>
            <Link to="/reviews">Reviews</Link>
            <a href="https://it.christcollegeijk.edu.in" target="_blank" rel="noreferrer">IT Support</a>
            <Link to="/profile">My Profile</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 CampusConnect · Christ College, Irinjalakuda</p>
          <p>Affiliated to the University of Calicut</p>
        </div>
      </footer>
    </>
  );
}
