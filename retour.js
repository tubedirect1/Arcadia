// retour.js — Bouton retour avec confirmation
(function(){

const style=document.createElement('style');
style.textContent=`
#ja-menu{position:fixed;bottom:18px;right:18px;z-index:99999;font-family:'DM Sans',system-ui,sans-serif;user-select:none;touch-action:none;}
#ja-toggle{
  display:flex;align-items:center;gap:8px;
  background:rgba(14,14,20,.92);border:1px solid rgba(255,45,85,.3);
  color:#ff2d55;font-size:13px;font-weight:800;
  padding:10px 16px;border-radius:50px;
  cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.4);
  transition:border-color .2s,transform .15s;
  white-space:nowrap;
}
#ja-toggle:hover{border-color:rgba(255,45,85,.7);transform:scale(1.05);}
#ja-toggle:active{transform:scale(.96);}
.ja-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;}
.ja-modal{background:#0e0e14;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:28px 24px;width:100%;max-width:320px;text-align:center;animation:jaSlide .25s ease;}
@keyframes jaSlide{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
.ja-modal-icon{font-size:40px;margin-bottom:12px;}
.ja-modal h3{font-family:'Russo One',system-ui,sans-serif;font-size:17px;text-transform:uppercase;letter-spacing:1px;color:#f2f2fa;margin-bottom:8px;}
.ja-modal p{font-size:13px;color:#5a5a78;font-weight:600;margin-bottom:20px;line-height:1.5;}
.ja-btn-row{display:flex;gap:10px;}
.ja-btn-yes{flex:1;padding:12px;background:#ff2d55;border:none;border-radius:50px;color:#fff;font-family:'Russo One',system-ui,sans-serif;font-size:13px;letter-spacing:1px;cursor:pointer;transition:background .15s;}
.ja-btn-yes:hover{background:#ff0a3c;}
.ja-btn-no{flex:1;padding:12px;background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:50px;color:#8888aa;font-family:'DM Sans',system-ui,sans-serif;font-weight:800;font-size:13px;cursor:pointer;transition:all .15s;}
.ja-btn-no:hover{border-color:rgba(255,255,255,.3);color:#f2f2fa;}
`;
document.head.appendChild(style);

// Bouton
const wrap=document.createElement('div');
wrap.id='ja-menu';
wrap.innerHTML=`<button id="ja-toggle" onclick="jaConfirm()">🏠 Accueil</button>`;
document.body.appendChild(wrap);

// Drag
(function(){
  const el=document.getElementById('ja-menu');
  const toggle=document.getElementById('ja-toggle');
  let dragging=false,hasMoved=false,startX,startY,origRight,origBottom;
  const THRESHOLD=6;

  function onStart(e){
    if(!e.target.closest('#ja-toggle'))return;
    const t=e.touches?e.touches[0]:e;
    startX=t.clientX;startY=t.clientY;
    hasMoved=false;dragging=true;
    const rect=el.getBoundingClientRect();
    origRight=window.innerWidth-rect.right;
    origBottom=window.innerHeight-rect.bottom;
    el.style.transition='none';
  }
  function onMove(e){
    if(!dragging)return;
    const t=e.touches?e.touches[0]:e;
    const dx=t.clientX-startX;const dy=t.clientY-startY;
    if(!hasMoved&&Math.sqrt(dx*dx+dy*dy)<THRESHOLD)return;
    hasMoved=true;
    let newRight=origRight-dx;let newBottom=origBottom-dy;
    newRight=Math.max(4,Math.min(window.innerWidth-60,newRight));
    newBottom=Math.max(4,Math.min(window.innerHeight-60,newBottom));
    el.style.right=newRight+'px';el.style.bottom=newBottom+'px';
    e.preventDefault();
  }
  function onEnd(){
    if(!dragging)return;
    dragging=false;
    el.style.transition='';
    hasMoved=false;
  }
  toggle.addEventListener('pointerdown',onStart);
  document.addEventListener('pointermove',onMove);
  document.addEventListener('pointerup',onEnd);
  toggle.addEventListener('click',e=>{if(hasMoved)e.stopPropagation();});
})();

// Confirmation retour
function jaConfirm(){
  const bg=document.createElement('div');
  bg.className='ja-modal-bg';
  bg.innerHTML=`<div class="ja-modal">
    <div class="ja-modal-icon">🏠</div>
    <h3>Retour à l'accueil</h3>
    <p>Tu vas quitter le jeu.<br>Ta progression pourrait ne pas être sauvegardée.</p>
    <div class="ja-btn-row">
      <button class="ja-btn-no" onclick="this.closest('.ja-modal-bg').remove()">Rester</button>
      <button class="ja-btn-yes" onclick="window.location.href='index.html'" onclick="(function(){let o=document.getElementById('ja-rl');if(!o){o=document.createElement('div');o.id='ja-rl';o.style.cssText='position:fixed;inset:0;background:#060608;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px';o.innerHTML='<div style=\"font-family:sans-serif;font-size:24px;font-weight:900;color:#f2f2fa\">Les JdA</div><div style=\"width:36px;height:36px;border:3px solid rgba(255,45,85,.15);border-top-color:#ff2d55;border-radius:50%;animation:s .8s linear infinite\"></div><style>@keyframes s{to{transform:rotate(360deg)}}<\/style>';document.body.appendChild(o);}setTimeout(()=>{window.location.href=(window.JA_HOME||'index.html');},300);})()">Quitter</button>
    </div>
  </div>`;
  bg.addEventListener('click',e=>{if(e.target===bg)bg.remove();});
  document.body.appendChild(bg);
}

// Enregistrer une visite
(async()=>{
  try{
    const SB='https://yhdyivsxovztidhddewj.supabase.co';
    const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZHlpdnN4b3Z6dGlkaGRkZXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTcyOTUsImV4cCI6MjA5MzAzMzI5NX0.BCs4_GvRdSHs7bZ7Kcp-xsBDlk23oIHm1F4PXngQ9GA';
    const params=new URLSearchParams(window.location.search);
    const jeu_id=params.get('id')||document.title||'unknown';
    await fetch(`${SB}/rest/v1/visites`,{method:'POST',headers:{'apikey':KEY,'Authorization':`Bearer ${KEY}`,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({jeu_id,visitor_token:localStorage.getItem('ja_visitor')||'anon'})});
  }catch(e){}
})();

})();
