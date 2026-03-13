// frontend/src/pages/About.js
import christImg from "../assets/christ.jpeg";
import "../styles/globals.css";
const PROGRAMMES=[
  {icon:"🔬",name:"Science",count:"9 UG · 9 PG · 5 PhD"},
  {icon:"💼",name:"Commerce",count:"3 UG · 1 PG · 1 PhD"},
  {icon:"💻",name:"CS & IT",count:"2 UG · 1 PG"},
  {icon:"📚",name:"Humanities",count:"2 UG · 3 PG · 1 PhD"},
  {icon:"🗣️",name:"Languages",count:"4 UG · 1 PG"},
  {icon:"📊",name:"Management",count:"BBA · MSW"},
];
export default function About(){
  return(
    <div className="page">
      <div className="page-inner" style={{minHeight:"100vh"}}>
        <div className="section-label">Our Institution</div>
        <h1 className="section-title">About Christ College,<br/><em>Irinjalakuda</em></h1>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center",marginBottom:72}}>
          <div style={{position:"relative"}}>
            <img src={christImg} alt="Christ College" style={{width:"100%",borderRadius:14,border:"1px solid var(--border)"}}/>
            <div style={{position:"absolute",bottom:-20,left:-20,background:"var(--maroon)",color:"var(--white)",padding:"18px 22px",borderRadius:12,fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:700,lineHeight:1,boxShadow:"var(--shadow)"}}>
              70+<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.68rem",fontWeight:400,opacity:0.75,marginTop:4}}>Years</div>
            </div>
          </div>
          <div>
            <p style={{color:"var(--muted)",lineHeight:1.85,marginBottom:16,fontSize:"0.9rem"}}>Christ College, Irinjalakuda is an Autonomous institution affiliated to the University of Calicut, founded with a vision of holistic education rooted in values, service, and academic excellence.</p>
            <p style={{color:"var(--muted)",lineHeight:1.85,marginBottom:16,fontSize:"0.9rem"}}>Accredited with an A+ grade by NAAC and managed by the Christ College Educational Society, the college offers UG, PG, and PhD programmes across sciences, commerce, humanities, languages, IT, and management.</p>
            <p style={{color:"var(--muted)",lineHeight:1.85,fontSize:"0.9rem"}}>CampusConnect was built here — to simplify daily campus life so students can focus on learning, growing, and connecting.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:24}}>
              {[{icon:"🏆",t:"NAAC A+ Accredited",d:"Recognised for academic quality and excellence"},{icon:"📖",t:"Autonomous Status",d:"Flexible curriculum under Calicut University"},{icon:"🌿",t:"Beautiful Campus",d:"Scenic Irinjalakuda campus"},{icon:"🤝",t:"Diverse Community",d:"6000+ students across all streams"}].map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,padding:14}}>
                  <span style={{fontSize:"1.1rem"}}>{f.icon}</span>
                  <div><div style={{fontWeight:600,fontSize:"0.84rem",marginBottom:3}}>{f.t}</div><div style={{fontSize:"0.76rem",color:"var(--muted)",lineHeight:1.5}}>{f.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-label">Academic Programmes</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,marginBottom:28,letterSpacing:"-0.01em"}}>Programmes <em style={{color:"var(--maroon)",fontStyle:"italic"}}>Offered</em></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {PROGRAMMES.map((p,i)=>(
            <div key={i} style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:10,padding:18,transition:"all 0.2s",cursor:"default"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--maroon)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
              <div style={{fontSize:"1.3rem",marginBottom:7}}>{p.icon}</div>
              <div style={{fontWeight:600,fontSize:"0.84rem",marginBottom:4}}>{p.name}</div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:"0.68rem",color:"var(--gold)"}}>{p.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
