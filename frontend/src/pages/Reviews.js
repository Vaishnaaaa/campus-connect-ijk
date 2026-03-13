// frontend/src/pages/Reviews.js
import { useState } from "react";
import "../styles/globals.css";
export default function Reviews(){
  const [email,setEmail]=useState("");
  const [subMsg,setSubMsg]=useState(null);
  const handleSub=()=>{
    if(!email){return;}
    setSubMsg("Thanks for subscribing! 🎉");
    setEmail("");
    setTimeout(()=>setSubMsg(null),4000);
  };
  return(
    <div className="page" style={{minHeight:"100vh"}}>
      <div className="page-inner">
        <div className="section-label">Student Voices</div>
        <h1 className="section-title" style={{textAlign:"center"}}>What students <em>say</em></h1>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{background:"var(--white)",borderRadius:16,padding:44,border:"1px solid var(--border)",position:"relative",boxShadow:"var(--shadow)"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"5rem",color:"var(--gold)",lineHeight:0,position:"absolute",top:34,left:36,opacity:0.2}}>"</div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",lineHeight:1.85,color:"var(--ink2)",marginBottom:28,fontStyle:"italic"}}>
              CampusConnect has been a game-changer for me at Christ College. I found my PG in minutes, bought second-hand chemistry books for a fraction of the price, and never missed a single campus event. Everything I need, right here.
            </p>
            <div style={{display:"flex",alignItems:"center",gap:13}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,var(--maroon),var(--gold))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--white)",fontSize:"0.85rem"}}>AM</div>
              <div>
                <div style={{fontWeight:600,fontSize:"0.875rem"}}>Agatha Matthew</div>
                <div style={{fontSize:"0.77rem",color:"var(--muted)"}}>2nd Year B.Sc. Chemistry · Christ College IJK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"72px 80px",background:"var(--maroon)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:40,flexWrap:"wrap"}}>
        <div>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,color:"var(--white)",marginBottom:7}}>Stay connected.</h3>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.875rem"}}>Get notified about hostel listings, deals, and upcoming campus events.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {subMsg && <div className="alert alert-success" style={{marginBottom:0}}>{subMsg}</div>}
          <div style={{display:"flex",gap:11}}>
            <input style={{padding:"12px 18px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:7,color:"var(--white)",fontFamily:"'DM Sans',sans-serif",fontSize:"0.875rem",outline:"none",width:240}}
              placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
              onFocus={e=>e.target.style.borderColor="#d4a017"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.2)"}/>
            <button className="btn btn-gold" onClick={handleSub}>Subscribe →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
