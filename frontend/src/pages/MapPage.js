// frontend/src/pages/MapPage.js
import "../styles/globals.css";
export default function MapPage(){
  return(
    <div className="page">
      <div className="page-inner" style={{minHeight:"100vh"}}>
        <div className="section-label">Navigation</div>
        <h1 className="section-title" style={{marginBottom:28}}>Campus <em>Map</em></h1>
        <div style={{width:"100%",height:500,borderRadius:16,overflow:"hidden",border:"1px solid var(--border)",boxShadow:"var(--shadow)"}}>
          <iframe title="Christ College IJK Map" width="100%" height="100%" frameBorder="0" style={{border:0}}
            src="https://www.openstreetmap.org/export/embed.html?bbox=76.2000%2C10.3400%2C76.2200%2C10.3540&layer=mapnik&marker=10.3472%2C76.2104"
            allowFullScreen/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginTop:24}}>
          {[["Institution","Christ College IJK"],["Location","Irinjalakuda, Thrissur"],["Affiliation","Calicut University"]].map(([l,v])=>(
            <div key={l} style={{background:"var(--white)",borderRadius:12,padding:20,border:"1px solid var(--border)"}}>
              <div style={{fontSize:"0.67rem",color:"var(--muted)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:"var(--maroon)"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
