/**
 * GALAXY EFFECTS v1 — Extreme Wow Factor
 * Requires galaxy-engine.js loaded first
 */
let SN_CD=false,AUR_ON=false,LOGO_N=0,LOGO_T=null;
const CNAMES=['Orion','Andromeda','Perseus','Cassiopeia','Lyra','Aquila','Cygnus','Vega'];
let constPts=[],constLns=[],constLast=null;

/* ── HELPERS ───────────────────────────── */
function showDisc(txt){
  const e=document.getElementById('discoveryNotif');if(!e)return;
  e.textContent='✦ '+txt;e.classList.add('show');
  setTimeout(()=>e.classList.remove('show'),4000);
}
function glowSpike(str,dur){
  if(!bloomPass||S.lowPerf)return;
  const orig=S.lowPerf?.3:1.0;
  gsap.to(bloomPass,{strength:str,duration:dur*.5,yoyo:true,repeat:1,
    onComplete:()=>{bloomPass.strength=orig;}});
}
function chromaSpike(){
  if(!window._ppPass||S.lowPerf)return;
  gsap.to(window._ppPass.uniforms.uChroma,{value:.025,duration:.08,yoyo:true,repeat:4,
    onComplete:()=>{window._ppPass.uniforms.uChroma.value=S.lowPerf?0:.003;}});
}
function shake(){
  const ox=camera.position.x;
  gsap.to(camera.position,{x:ox+4,duration:.05,yoyo:true,repeat:7,ease:'power1.inOut',
    onComplete:()=>{camera.position.x=ox;}});
}
function mkPtTex(c1,c2){
  const cv=document.createElement('canvas');cv.width=cv.height=64;
  const x=cv.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,c1);g.addColorStop(.5,c2);g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(cv);
}

/* ── SUPERNOVA ─────────────────────────── */
function triggerSupernova(pos){
  if(SN_CD||S.lowPerf)return;
  SN_CD=true;setTimeout(()=>SN_CD=false,120000);
  if(!pos)pos=new THREE.Vector3((Math.random()-.5)*180,(Math.random()-.5)*40,(Math.random()-.5)*180);
  // Flicker phase
  let f=0;const iv=setInterval(()=>{
    if(++f>=8){clearInterval(iv);doSNExplode(pos);return;}
    if(bloomPass)bloomPass.strength=f%2?3.5:.2;
  },80);
}
function doSNExplode(pos){
  // White flash
  const fl=document.createElement('div');
  fl.style.cssText='position:fixed;inset:0;background:#fff;z-index:9999;pointer-events:none;';
  document.body.appendChild(fl);
  gsap.to(fl,{opacity:0,duration:.5,onComplete:()=>fl.remove()});
  shake();chromaSpike();glowSpike(4,.3);
  // Burst particles
  const N=S.isMobile?250:700;
  const geo=new THREE.BufferGeometry();
  const pa=new Float32Array(N*3),ve=new Float32Array(N*3),ca=new Float32Array(N*3);
  const cols=[[1,1,1],[1,.95,.5],[1,.6,.1],[1,.2,.05],[.7,.05,.4],[.4,.05,.9]];
  for(let i=0;i<N;i++){
    pa[i*3]=pos.x;pa[i*3+1]=pos.y;pa[i*3+2]=pos.z;
    const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),sp=2+Math.random()*7;
    ve[i*3]=Math.sin(ph)*Math.cos(th)*sp;ve[i*3+1]=Math.sin(ph)*Math.sin(th)*sp;ve[i*3+2]=Math.cos(ph)*sp;
    const c=cols[Math.floor(Math.random()*cols.length)];
    ca[i*3]=c[0];ca[i*3+1]=c[1];ca[i*3+2]=c[2];
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pa,3));
  geo.setAttribute('color',new THREE.BufferAttribute(ca,3));
  const mat=new THREE.PointsMaterial({size:2.5,vertexColors:true,transparent:true,opacity:1,
    blending:THREE.AdditiveBlending,depthWrite:false,map:mkPtTex('rgba(255,255,255,1)','rgba(255,200,100,0)')});
  const pts=new THREE.Points(geo,mat);scene.add(pts);
  let life=1;
  (function animSN(){
    if(life<=0){scene.remove(pts);geo.dispose();mat.dispose();return;}
    life-=.013;mat.opacity=life;
    for(let i=0;i<N;i++){pa[i*3]+=ve[i*3]*.5;pa[i*3+1]+=ve[i*3+1]*.5;pa[i*3+2]+=ve[i*3+2]*.5;
      ve[i*3]*=.97;ve[i*3+1]*=.97;ve[i*3+2]*=.97;}
    geo.attributes.position.needsUpdate=true;
    requestAnimationFrame(animSN);
  })();
  // Shockwave ring
  const rg=new THREE.TorusGeometry(1,.4,6,48);
  const rm=new THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:.9,
    blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
  const ring=new THREE.Mesh(rg,rm);ring.position.copy(pos);ring.lookAt(camera.position);scene.add(ring);
  gsap.to(ring.scale,{x:100,y:100,z:1,duration:1.5,ease:'power2.out'});
  gsap.to(rm,{opacity:0,duration:1.5,onComplete:()=>{scene.remove(ring);rg.dispose();rm.dispose();}});
  // Debris nebula (persistent)
  const dsp=new THREE.Sprite(new THREE.SpriteMaterial({
    map:mkPtTex('rgba(255,100,30,.25)','rgba(150,20,80,.08)'),
    transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  dsp.position.copy(pos);dsp.scale.setScalar(80);scene.add(dsp);
  gsap.to(dsp.material,{opacity:.5,duration:2});
  showDisc('Supernova Detected! ✦');
}

/* ── HYPERSPACE STREAKS ────────────────── */
function warpHyperspace(cb){
  if(S.lowPerf||S.isMobile){if(cb)cb();return;}
  const N=2000;
  const geo=new THREE.BufferGeometry();
  const pa=new Float32Array(N*6);
  for(let i=0;i<N;i++){
    const r=20+Math.random()*500,a=Math.random()*Math.PI*2,y=(Math.random()-.5)*400;
    const x=Math.cos(a)*r,z=Math.sin(a)*r;
    const d=new THREE.Vector3(x,y,z).normalize();
    const len=8+Math.random()*60;
    pa[i*6]=x;pa[i*6+1]=y;pa[i*6+2]=z;
    pa[i*6+3]=x+d.x*len;pa[i*6+4]=y+d.y*len;pa[i*6+5]=z+d.z*len;
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pa,3));
  const mat=new THREE.LineBasicMaterial({color:0x67e8f9,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending});
  const ls=new THREE.LineSegments(geo,mat);scene.add(ls);
  gsap.to(mat,{opacity:.9,duration:.4});
  gsap.to(camera,{fov:125,duration:.7,ease:'power3.in',onUpdate:()=>camera.updateProjectionMatrix()});
  setTimeout(()=>{
    gsap.to(mat,{opacity:0,duration:.5});
    gsap.to(camera,{fov:60,duration:.6,ease:'power2.out',onUpdate:()=>camera.updateProjectionMatrix(),
      onComplete:()=>{scene.remove(ls);geo.dispose();mat.dispose();if(cb)cb();}});
  },800);
}

/* ── AURORA PLASMA STORM ───────────────── */
function spawnAurora(){
  if(AUR_ON||S.lowPerf||S.isMobile)return;
  AUR_ON=true;
  const cv=document.createElement('canvas');cv.width=512;cv.height=256;
  const ctx=cv.getContext('2d');
  const tex=new THREE.CanvasTexture(cv);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity:0,
    blending:THREE.AdditiveBlending,depthWrite:false}));
  sp.position.set(0,100,-250);sp.scale.set(700,320,1);scene.add(sp);
  gsap.to(sp.material,{opacity:.55,duration:3});
  let at=0;
  const aiv=setInterval(()=>{
    at+=.025;ctx.clearRect(0,0,512,256);
    for(let i=0;i<6;i++){
      const gy=ctx.createLinearGradient(0,0,512,0);
      const a0=.05+i*.03,a1=.08+i*.025;
      gy.addColorStop(0,'rgba(0,0,0,0)');
      gy.addColorStop(.15+Math.sin(at+i)*.1,`rgba(34,211,238,${a0})`);
      gy.addColorStop(.45,`rgba(124,58,237,${a1})`);
      gy.addColorStop(.75+Math.cos(at+i)*.1,`rgba(236,72,153,${a0})`);
      gy.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gy;
      ctx.beginPath();
      const by=110+i*10;ctx.moveTo(0,by);
      for(let x=0;x<=512;x+=12)ctx.lineTo(x,by+Math.sin(x*.018+at+i)*.7*25);
      ctx.lineTo(512,256);ctx.lineTo(0,256);ctx.fill();
    }
    tex.needsUpdate=true;
  },50);
  setTimeout(()=>{
    gsap.to(sp.material,{opacity:0,duration:3,onComplete:()=>{
      clearInterval(aiv);scene.remove(sp);AUR_ON=false;
      setTimeout(spawnAurora,25000+Math.random()*50000);
    }});
  },18000);
}

/* ── GLITCH EASTER EGG ─────────────────── */
function initGlitch(){
  const logo=document.querySelector('.nav-logo');if(!logo)return;
  logo.addEventListener('click',()=>{
    LOGO_N++;clearTimeout(LOGO_T);
    LOGO_T=setTimeout(()=>LOGO_N=0,2000);
    if(LOGO_N>=5){LOGO_N=0;doGlitch();}
  });
}
function doGlitch(){
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;mix-blend-mode:screen;';
  ov.innerHTML='<div style="position:absolute;inset:0;background:rgba(255,0,0,.07);transform:translateX(4px)"></div>'
    +'<div style="position:absolute;inset:0;background:rgba(0,255,255,.07);transform:translateX(-4px)"></div>';
  document.body.appendChild(ov);
  const msg=document.createElement('div');
  msg.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);'
    +'font-family:monospace;font-size:1.1rem;color:#22d3ee;letter-spacing:3px;z-index:9999;'
    +'pointer-events:none;text-shadow:0 0 20px #22d3ee;white-space:nowrap;';
  msg.textContent='YOU FOUND A RIFT IN SPACETIME ✦';
  document.body.appendChild(msg);
  chromaSpike();shake();glowSpike(3.5,.4);
  gsap.to(ov,{opacity:0,duration:.6,onComplete:()=>ov.remove()});
  gsap.to(msg,{opacity:0,delay:2.5,duration:.8,onComplete:()=>msg.remove()});
  showDisc('Dimensional Rift Unlocked! ✦');
}

/* ── CONSTELLATION DRAWING ─────────────── */
function initConstellation(){
  if(S.isMobile)return;
  document.getElementById('galaxyCanvas').addEventListener('dblclick',e=>{
    const rc=new THREE.Raycaster();
    const mv=new THREE.Vector2((e.clientX/innerWidth)*2-1,-(e.clientY/innerHeight)*2+1);
    rc.setFromCamera(mv,camera);
    const pt=rc.ray.at(90,new THREE.Vector3());
    const sm=new THREE.Mesh(new THREE.SphereGeometry(.9,8,8),
      new THREE.MeshBasicMaterial({color:0x67e8f9,blending:THREE.AdditiveBlending}));
    sm.position.copy(pt);scene.add(sm);constPts.push(sm);
    if(constLast){
      const lg=new THREE.BufferGeometry().setFromPoints([constLast.position,pt]);
      const ll=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0x22d3ee,transparent:true,
        opacity:.5,blending:THREE.AdditiveBlending}));
      scene.add(ll);constLns.push(ll);
    }
    constLast=sm;
    if(constPts.length>=4){
      showDisc('Constellation of '+CNAMES[Math.floor(Math.random()*CNAMES.length)]+' ✦');
      setTimeout(()=>{constPts.forEach(p=>scene.remove(p));constLns.forEach(l=>scene.remove(l));
        constPts=[];constLns=[];constLast=null;},6000);
    }
  });
}

/* ── SUPERNOVA TRIGGER STAR ────────────── */
function initSNStar(){
  if(S.isMobile||S.lowPerf)return;
  const sg=new THREE.SphereGeometry(3,12,12);
  const sm=new THREE.MeshBasicMaterial({color:0xfffde0,blending:THREE.AdditiveBlending});
  const star=new THREE.Mesh(sg,sm);
  const sPos=new THREE.Vector3(110,25,-90);star.position.copy(sPos);scene.add(star);
  const gg=new THREE.SphereGeometry(6,12,12);
  const gm=new THREE.MeshBasicMaterial({color:0xfff4a0,transparent:true,opacity:.35,
    blending:THREE.AdditiveBlending,side:THREE.BackSide});
  const glow=new THREE.Mesh(gg,gm);glow.position.copy(sPos);scene.add(glow);
  gsap.to(glow.scale,{x:1.6,y:1.6,z:1.6,duration:1.8,yoyo:true,repeat:-1,ease:'sine.inOut'});
  const rc2=new THREE.Raycaster();
  document.getElementById('galaxyCanvas').addEventListener('click',e=>{
    const mv2=new THREE.Vector2((e.clientX/innerWidth)*2-1,-(e.clientY/innerHeight)*2+1);
    rc2.setFromCamera(mv2,camera);
    if(rc2.intersectObject(star).length){
      scene.remove(star);scene.remove(glow);
      triggerSupernova(sPos.clone());
    }
  });
}

/* ── AUDIO REACTIVE ────────────────────── */
function initAudioReactive(){
  const ck=setInterval(()=>{
    if(typeof audioCtx==='undefined'||!audioCtx)return;
    clearInterval(ck);
    try{
      const an=audioCtx.createAnalyser();an.fftSize=32;
      audioGain.connect(an);
      const da=new Uint8Array(an.frequencyBinCount);
      (function ra(){
        requestAnimationFrame(ra);if(!S.audioOn)return;
        an.getByteFrequencyData(da);
        const bass=da[0]/255;
        if(bloomPass&&!S.lowPerf)bloomPass.strength=1.0+bass*1.8;
        nebulae.forEach(n=>{n.sp.material.opacity=Math.max(.2,.4+bass*.5);});
      })();
    }catch(e){}
  },1200);
}

/* ── INIT ──────────────────────────────── */
function initEffects(){
  if(typeof THREE==='undefined'||typeof scene==='undefined'){
    setTimeout(initEffects,600);return;
  }
  initSNStar();
  initGlitch();
  initConstellation();
  initAudioReactive();
  if(!S.lowPerf&&!S.isMobile)setTimeout(spawnAurora,8000+Math.random()*12000);
  setInterval(()=>{if(!SN_CD&&!S.lowPerf&&!S.isMobile)triggerSupernova();},200000);
  // Expose globals for testing
  window.triggerSupernova=triggerSupernova;
  window.triggerGlitch=doGlitch;
  window.warpHyperspace=warpHyperspace;
  window.spawnAurora=spawnAurora;
  console.log('%c✦ Galaxy Effects Loaded','color:#22d3ee;font-size:14px;font-family:monospace');
  console.log('%cCommands: triggerSupernova() | triggerGlitch() | warpHyperspace() | spawnAurora()','color:#7c3aed;font-size:11px;');
}

window.addEventListener('load',()=>setTimeout(initEffects,1500));
