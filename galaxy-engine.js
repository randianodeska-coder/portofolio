/**
 * GALAXY ENGINE v2 — Cinematic 3D Galaxy with Post-Processing
 */
const S={isMobile:innerWidth<=768,mouse:new THREE.Vector2,tMouse:new THREE.Vector2,idle:0,isIdle:!1,fps:0,frames:0,lt:performance.now(),page:0,warping:!1,
baseCam:new THREE.Vector3(0,150,400),secs:['hero','about','philosophy','vision-mission','skills','portfolio','contact'],
pageCam:[{x:0,y:150,z:400},{x:80,y:40,z:220},{x:-120,y:10,z:150},{x:60,y:80,z:80},{x:-80,y:-30,z:50},{x:0,y:200,z:50},{x:50,y:-20,z:120}],
lowPerf:!1,audioOn:!1};
const lerp=(a,b,t)=>(1-t)*a+t*b;

// Scene
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x060212,S.isMobile?.001:.0015);
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,1,2000);
camera.position.set(0,300,800); // Start far for reveal
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('galaxyCanvas'),antialias:!S.isMobile,alpha:!0,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setClearColor(0x060212,1);

// Post-Processing
let composer,bloomPass;
try{
  composer=new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene,camera));
  bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),S.isMobile?.8:1.2,.4,.85);
  bloomPass.threshold=.3;bloomPass.strength=S.isMobile?.6:1.0;bloomPass.radius=.5;
  composer.addPass(bloomPass);
  // Vignette+ChromaticAberration+FilmGrain
  const ppShader={uniforms:{tDiffuse:{value:null},uTime:{value:0},uVignette:{value:.4},uChroma:{value:.003},uGrain:{value:.08}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uVignette,uChroma,uGrain;varying vec2 vUv;
  float rand(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);}
  void main(){vec2 uv=vUv;float d=length(uv-.5);
  vec3 col;col.r=texture2D(tDiffuse,uv+vec2(uChroma,0.)).r;col.g=texture2D(tDiffuse,uv).g;col.b=texture2D(tDiffuse,uv-vec2(uChroma,0.)).b;
  col*=1.-uVignette*d*d*2.;col+=vec3((rand(uv+uTime)-.5)*uGrain);
  gl_FragColor=vec4(col,1.);}`};
  const ppPass=new THREE.ShaderPass(ppShader);
  ppPass.renderToScreen=!0;
  composer.addPass(ppPass);
  window._ppPass=ppPass;
}catch(e){composer=null;}

// Particle Texture
const mkTex=()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.2,'rgba(255,255,255,.8)');g.addColorStop(.5,'rgba(34,211,238,.2)');g.addColorStop(1,'rgba(0,0,0,0)');
x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);};
const pTex=mkTex();

const gGrp=new THREE.Group(),pGrp=new THREE.Group();
scene.add(gGrp);scene.add(pGrp);

// Galaxy
function mkGalaxy(){
const N=S.isMobile?30000:70000,R=350,B=4;
const pos=new Float32Array(N*3),col=new Float32Array(N*3),sc=new Float32Array(N);
const cI=new THREE.Color('#f8fafc'),cM=new THREE.Color('#22d3ee'),cO=new THREE.Color('#4c1d95');
for(let i=0;i<N;i++){const i3=i*3,r=Math.random()*R,sp=r*1,ba=(i%B)/B*Math.PI*2;
const rx=Math.pow(Math.random(),3)*(Math.random()<.5?1:-1)*.2*r;
const ry=Math.pow(Math.random(),3)*(Math.random()<.5?1:-1)*.2*r*.3;
const rz=Math.pow(Math.random(),3)*(Math.random()<.5?1:-1)*.2*r;
pos[i3]=Math.cos(ba+sp)*r+rx;pos[i3+1]=ry;pos[i3+2]=Math.sin(ba+sp)*r+rz;
const mc=cI.clone();if(r<R*.3)mc.lerp(cM,r/(R*.3));else{mc.copy(cM).lerp(cO,(r-R*.3)/(R*.7));}
col[i3]=mc.r;col[i3+1]=mc.g;col[i3+2]=mc.b;sc[i]=Math.random()*.5+.5;}
const geo=new THREE.BufferGeometry();
geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
geo.setAttribute('color',new THREE.BufferAttribute(col,3));
geo.setAttribute('aScale',new THREE.BufferAttribute(sc,1));
const mat=new THREE.ShaderMaterial({depthWrite:!1,blending:THREE.AdditiveBlending,vertexColors:!0,transparent:!0,
uniforms:{uTime:{value:0},uSize:{value:(S.isMobile?1.5:1.2)*renderer.getPixelRatio()},uTex:{value:pTex}},
vertexShader:`uniform float uTime,uSize;attribute float aScale;varying vec3 vC;
void main(){vec4 mp=modelMatrix*vec4(position,1.);vec4 vp=viewMatrix*mp;gl_Position=projectionMatrix*vp;
float tw=sin(uTime*2.+mp.x*.5)*.5+.5;gl_PointSize=uSize*aScale*(1.+tw*.5)*(300./-vp.z);vC=color;}`,
fragmentShader:`uniform sampler2D uTex;varying vec3 vC;void main(){gl_FragColor=vec4(vC,1.)*texture2D(uTex,gl_PointCoord);}`});
gGrp.add(new THREE.Points(geo,mat));

// Multi-layer starfield (3 layers for parallax depth)
[{n:S.isMobile?1500:4000,s:800,sz:2,o:.5},{n:S.isMobile?1000:3000,s:1200,sz:1.5,o:.35},{n:S.isMobile?800:2000,s:1600,sz:1,o:.2}].forEach(L=>{
const g2=new THREE.BufferGeometry(),p2=new Float32Array(L.n*3),c2=new Float32Array(L.n*3);
for(let i=0;i<L.n;i++){p2[i*3]=(Math.random()-.5)*L.s;p2[i*3+1]=(Math.random()-.5)*L.s;p2[i*3+2]=(Math.random()-.5)*L.s;
const t=Math.random();c2[i*3]=.7+t*.3;c2[i*3+1]=.7+t*.2;c2[i*3+2]=.8+t*.2;}
g2.setAttribute('position',new THREE.BufferAttribute(p2,3));
g2.setAttribute('color',new THREE.BufferAttribute(c2,3));
scene.add(new THREE.Points(g2,new THREE.PointsMaterial({size:L.sz,vertexColors:!0,transparent:!0,opacity:L.o,map:pTex,blending:THREE.AdditiveBlending,depthWrite:!1})));});
return mat;}
const gMat=mkGalaxy();

// Planets
const planets=[];
function mkPlanets(){
const data=[{r:12,d:80,sp:.005,c:0x22d3ee,ring:!1},{r:25,d:160,sp:.002,c:0x7c3aed,ring:!0},{r:8,d:220,sp:.003,c:0x0891b2,ring:!1},{r:18,d:280,sp:.0015,c:0x4c1d95,ring:!1},{r:6,d:320,sp:.004,c:0x67e8f9,ring:!1}];
const sGeo=new THREE.SphereGeometry(1,32,32);
const aVS=`varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const aFS=`varying vec3 vN;uniform vec3 uC;void main(){float i=pow(.6-dot(vN,vec3(0.0,0.0,1.0)),2.);gl_FragColor=vec4(uC,1.)*i;}`;
const pVS=`varying vec2 vUv;varying vec3 vPos;varying vec3 vNorm;void main(){vUv=uv;vPos=position;vNorm=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const pFS=`varying vec2 vUv;varying vec3 vPos;varying vec3 vNorm;uniform vec3 uColor;uniform float uTime;
// Simple 3D noise
float hash(vec3 p) {p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(in vec3 x){vec3 p=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
return mix(mix(mix(hash(p+vec3(0.,0.,0.)),hash(p+vec3(1.,0.,0.)),f.x),mix(hash(p+vec3(0.,1.,0.)),hash(p+vec3(1.,1.,0.)),f.x),f.y),
mix(mix(hash(p+vec3(0.,0.,1.)),hash(p+vec3(1.,0.,1.)),f.x),mix(hash(p+vec3(0.,1.,1.)),hash(p+vec3(1.,1.,1.)),f.x),f.y),f.z);}
float fbm(vec3 p){float f=0.0;f+=0.5000*noise(p);p*=2.02;f+=0.2500*noise(p);p*=2.03;f+=0.1250*noise(p);return f;}
void main(){
  float n=fbm(vPos*2.5+uTime*.1);
  float n2=fbm(vPos*5.0-uTime*.05);
  vec3 col=mix(uColor*.2,uColor,(n*n2)*1.5);
  float i=max(0.,dot(vNorm,normalize(vec3(1.,1.,1.))));
  gl_FragColor=vec4(col*i+uColor*0.1,1.);
}`;
data.forEach(d=>{const pv=new THREE.Group();
const m=new THREE.Mesh(sGeo,new THREE.ShaderMaterial({vertexShader:pVS,fragmentShader:pFS,uniforms:{uColor:{value:new THREE.Color(d.c)},uTime:{value:Math.random()*100}}}));
m.scale.setScalar(d.r);const a=Math.random()*Math.PI*2;
m.position.set(Math.cos(a)*d.d,(Math.random()-.5)*20,Math.sin(a)*d.d);
const am=new THREE.Mesh(sGeo,new THREE.ShaderMaterial({vertexShader:aVS,fragmentShader:aFS,uniforms:{uC:{value:new THREE.Color(d.c)}},blending:THREE.AdditiveBlending,side:THREE.BackSide,transparent:!0}));
am.scale.setScalar(d.r*1.2);am.position.copy(m.position);
if(d.ring){const rg=new THREE.Mesh(new THREE.TorusGeometry(d.r*1.8,1.5,2,64),new THREE.MeshBasicMaterial({color:d.c,transparent:!0,opacity:.4,blending:THREE.AdditiveBlending}));
rg.rotation.x=Math.PI/2.2;rg.position.copy(m.position);pv.add(rg);}
pv.add(m);pv.add(am);pGrp.add(pv);
planets.push({pv,mesh:m,sp:d.sp,ss:(Math.random()-.5)*.05});});}
mkPlanets();

// Black Hole Signature Moment
let blackHolePos=new THREE.Vector3(-180,30,-120);
let bhGroup=new THREE.Group();
bhGroup.position.copy(blackHolePos);
pGrp.add(bhGroup);

function mkBlackHole(){
  // Event Horizon
  const ehGeo=new THREE.SphereGeometry(8,32,32);
  const ehMat=new THREE.MeshBasicMaterial({color:0x000000});
  const eh=new THREE.Mesh(ehGeo,ehMat);
  bhGroup.add(eh);
  
  // Gravitational Lensing / Glow
  const glowGeo=new THREE.SphereGeometry(12,32,32);
  const glowMat=new THREE.MeshBasicMaterial({color:0x4c1d95,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,side:THREE.BackSide});
  const glow=new THREE.Mesh(glowGeo,glowMat);
  bhGroup.add(glow);

  // Accretion Disk (Particles)
  const diskGeo=new THREE.BufferGeometry();
  const dN=1500;
  const dPa=new Float32Array(dN*3),dCa=new Float32Array(dN*3);
  for(let i=0;i<dN;i++){
    const r=9+Math.random()*25,a=Math.random()*Math.PI*2;
    dPa[i*3]=Math.cos(a)*r; dPa[i*3+1]=(Math.random()-.5)*1.5; dPa[i*3+2]=Math.sin(a)*r;
    const c=r<15?0x22d3ee:0x7c3aed;
    const cl=new THREE.Color(c); dCa[i*3]=cl.r; dCa[i*3+1]=cl.g; dCa[i*3+2]=cl.b;
  }
  diskGeo.setAttribute('position',new THREE.BufferAttribute(dPa,3));
  diskGeo.setAttribute('color',new THREE.BufferAttribute(dCa,3));
  const diskMat=new THREE.PointsMaterial({size:1.5,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,map:pTex,depthWrite:false});
  const disk=new THREE.Points(diskGeo,diskMat);
  disk.rotation.x=Math.PI/6;
  bhGroup.add(disk);
  
  window._bhDisk=disk;
}
mkBlackHole();

// Throw particles to black hole
const bhParticles=[];
document.getElementById('galaxyCanvas').addEventListener('click',e=>{
  if(S.isMobile||S.lowPerf)return;
  const rc=new THREE.Raycaster();
  const mv=new THREE.Vector2((e.clientX/innerWidth)*2-1,-(e.clientY/innerHeight)*2+1);
  rc.setFromCamera(mv,camera);
  
  // Raycast plane near black hole
  const plane=new THREE.Plane(new THREE.Vector3(0,0,1), -blackHolePos.z + 50);
  const pt=new THREE.Vector3();
  rc.ray.intersectPlane(plane,pt);
  
  if(pt && pt.distanceTo(blackHolePos)<80){
    const pm=new THREE.Mesh(new THREE.SphereGeometry(.6,8,8),new THREE.MeshBasicMaterial({color:0xffffff,blending:THREE.AdditiveBlending}));
    pm.position.copy(pt);
    scene.add(pm);
    bhParticles.push({mesh:pm,life:1,vel:new THREE.Vector3()});
  }
});

// Nebula sprites (breathing effect)
const nebulae=[];
function mkNebulae(){
const nTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
g.addColorStop(0,'rgba(124,58,237,.12)');g.addColorStop(.4,'rgba(34,211,238,.06)');g.addColorStop(1,'rgba(0,0,0,0)');
x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);})();
[{x:-100,y:30,z:-80,s:120},{x:150,y:-20,z:100,s:90},{x:-50,y:60,z:200,s:150},{x:200,y:-40,z:-150,s:100}].forEach(n=>{
const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:nTex,transparent:!0,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:!1}));
sp.position.set(n.x,n.y,n.z);sp.scale.setScalar(n.s);scene.add(sp);
nebulae.push({sp,baseS:n.s,phase:Math.random()*Math.PI*2});});}
mkNebulae();

// Shooting Stars (object pool)
const shootPool=[];
function mkShootPool(){
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array([0,0,0,0,0,-8]),3));
const mat=new THREE.LineBasicMaterial({color:0x67e8f9,transparent:!0,opacity:0});
for(let i=0;i<5;i++){const l=new THREE.Line(geo.clone(),mat.clone());l.visible=!1;scene.add(l);
shootPool.push({line:l,active:!1,life:0,vel:new THREE.Vector3});}}
mkShootPool();
let shootTimer=0;
function fireShoot(){
const s=shootPool.find(s=>!s.active);if(!s)return;s.active=!0;s.life=1;
s.line.position.set((Math.random()-.5)*400,Math.random()*200+50,(Math.random()-.5)*400);
s.vel.set((Math.random()-.5)*8,-2-Math.random()*4,(Math.random()-.5)*8);
s.line.visible=!0;s.line.material.opacity=1;}

// Lights
scene.add(new THREE.AmbientLight(0x060212,2));
const coreL=new THREE.PointLight(0x22d3ee,5,500);scene.add(coreL);
const secL=new THREE.PointLight(0x7c3aed,3,600);secL.position.set(200,100,200);scene.add(secL);

// Audio
let audioCtx,audioGain,audioOsc;
function initAudio(){
try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();
audioGain=audioCtx.createGain();audioGain.gain.value=0;audioGain.connect(audioCtx.destination);
// Deep space drone
audioOsc=audioCtx.createOscillator();audioOsc.type='sine';audioOsc.frequency.value=55;audioOsc.connect(audioGain);
const o2=audioCtx.createOscillator();o2.type='sine';o2.frequency.value=82;o2.connect(audioGain);
const o3=audioCtx.createOscillator();o3.type='sine';o3.frequency.value=110;
const g3=audioCtx.createGain();g3.gain.value=.3;o3.connect(g3);g3.connect(audioGain);
audioOsc.start();o2.start();o3.start();}catch(e){}}

function toggleAudio(){
const btn=document.getElementById('audioToggle');
if(!audioCtx)initAudio();
S.audioOn=!S.audioOn;
if(S.audioOn){audioCtx.resume();audioGain.gain.linearRampToValueAtTime(.06,audioCtx.currentTime+1);btn.classList.add('playing');
btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>';}
else{audioGain.gain.linearRampToValueAtTime(0,audioCtx.currentTime+.5);btn.classList.remove('playing');
btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';}}

// Click Ping Effect
function doPing(x,y){
const el=document.createElement('div');el.className='ping-ring';el.style.left=x+'px';el.style.top=y+'px';
document.body.appendChild(el);
gsap.fromTo(el,{width:0,height:0,opacity:1},{width:120,height:120,opacity:0,duration:.8,ease:'power2.out',onComplete:()=>el.remove()});}

// UI Init
function initUI(){
const pre=document.getElementById('preloader'),fill=document.getElementById('preFill'),pct=document.getElementById('prePercent'),st=document.getElementById('preStatus');
let p=0;const iv=setInterval(()=>{p+=Math.random()*15;if(p>=100){p=100;clearInterval(iv);st.innerText='READY.';
setTimeout(()=>{pre.style.opacity='0';setTimeout(()=>{pre.style.display='none';
document.body.classList.remove('loading');
// Full Cinematic Tour on Load
if (!S.isMobile && !sessionStorage.getItem('rnvn_tour_played_v3')) {
  sessionStorage.setItem('rnvn_tour_played_v3', 'true');
  S.warping = true;
  document.body.classList.add('tour-active'); // hide hero text during tour
  const heroEl = document.getElementById('hero');
  const hdr = document.getElementById('header');
  hdr.style.opacity = '0';
  heroEl.style.opacity = '0';
  heroEl.classList.add('active');

  // Shared function: removes tour class and stagger-reveals hero
  function revealHero(){
    S.warping = false;
    document.body.classList.remove('tour-active');
    if(tOver) tOver.classList.remove('active');
    heroEl.style.opacity = '1';
    gsap.to(hdr, {opacity:1, duration:0.8, ease:'power2.out'});
    const parts = [
      heroEl.querySelector('.hero-eyebrow'),
      heroEl.querySelector('.hero-title'),
      heroEl.querySelector('.hero-tagline'),
      heroEl.querySelector('.hero-sub'),
      heroEl.querySelector('.hero-actions'),
      heroEl.querySelector('.hero-metrics'),
    ].filter(Boolean);
    gsap.fromTo(parts,
      {opacity:0, y:40},
      {opacity:1, y:0, duration:0.85, ease:'power3.out', stagger:0.13,
        onComplete: () => { trigRevs(heroEl); }
      }
    );
  }

  const tOver = document.getElementById('tourOverlay');
  const tCap  = document.getElementById('tourCaption');
  const tProg = document.getElementById('tourProgFill');

  if(tOver) tOver.classList.add('active');
  // Clone skip button to clear old listeners
  const tSkipOld = document.getElementById('tourSkip');
  let tSkip = tSkipOld;
  if(tSkipOld){
    tSkip = tSkipOld.cloneNode(true);
    tSkip.style.display = 'block';
    tSkipOld.parentNode.replaceChild(tSkip, tSkipOld);
  }
  
  // The exact same 16-second tour
  const introTl = gsap.timeline();
  // Scene 1: Dive in
  introTl.call(()=>{tCap.innerHTML='WELCOME TO THE CREATIVE UNIVERSE.';gsap.to(tProg,{width:'20%',duration:4});})
        .to(S.baseCam,{x:0,y:0,z:50,duration:4,ease:'power1.inOut'})
  // Scene 2: The Core
        .call(()=>{tCap.innerHTML='WHERE IDEAS GRAVITATE & BIND TOGETHER.';gsap.to(tProg,{width:'40%',duration:4});})
        .to(S.baseCam,{x:100,y:-30,z:0,duration:4,ease:'power1.inOut'})
  // Scene 3: Nebula
        .call(()=>{tCap.innerHTML='EXPLORING NEW DIMENSIONS OF DESIGN.';gsap.to(tProg,{width:'70%',duration:4});})
        .to(S.baseCam,{x:-50,y:60,z:-100,duration:4,ease:'power1.inOut'})
  // Scene 4: Return
        .call(()=>{tCap.innerHTML="LET'S BUILD SOMETHING GREAT.";gsap.to(tProg,{width:'100%',duration:4});})
        .to(S.baseCam,{x:0,y:150,z:400,duration:4,ease:'power2.out'})
        .call(()=>{ revealHero(); });

  // Skip button
  if(tSkip){
    tSkip.addEventListener('click', ()=>{
      introTl.kill();
      gsap.to(S.baseCam,{x:0,y:150,z:400,duration:1.2,ease:'power2.out'});
      revealHero();
    });
  }
} else {
  // Mobile or repeat visit — instant reveal
  const heroEl = document.getElementById('hero');
  const hdr = document.getElementById('header');
  if(heroEl){ heroEl.classList.add('active'); heroEl.style.opacity='1'; trigRevs(heroEl); }
  if(hdr) hdr.style.opacity = '1';
}
},800);},500);}
fill.style.width=p+'%';pct.innerText=Math.floor(p)+'%';
if(p<40)st.innerText='CALIBRATING WARP DRIVE...';else if(p<80)st.innerText='MAPPING STELLAR OBJECTS...';},150);

// Cursor & Gyroscope
if(!S.isMobile){
  const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');
  let rx=innerWidth/2,ry=innerHeight/2;
  let cursorVisible = false;
  addEventListener('mousemove',e=>{
    dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';
    if (!cursorVisible) {
      cursorVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
    S.tMouse.x=(e.clientX/innerWidth)*2-1;S.tMouse.y=-(e.clientY/innerHeight)*2+1;S.idle=0;S.isIdle=!1;
  });
  const rc=()=>{const dx=parseFloat(dot.style.left)||innerWidth/2,dy=parseFloat(dot.style.top)||innerHeight/2;
  rx=lerp(rx,dx,.15);ry=lerp(ry,dy,.15);ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(rc);};rc();
  document.querySelectorAll('a,button,.portfolio-card,.skill-card,.dock-item,.filter-btn,.btn-primary,.btn-ghost').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.classList.add('hover');ring.classList.add('hover');});
  el.addEventListener('mouseleave',()=>{dot.classList.remove('hover');ring.classList.remove('hover');});});
} else {
  // Mobile Gyroscope Parallax
  let gyroInit=false;
  const initGyro=()=>{
    if(gyroInit)return;gyroInit=true;
    if(typeof DeviceOrientationEvent!=='undefined' && typeof DeviceOrientationEvent.requestPermission==='function'){
      DeviceOrientationEvent.requestPermission().then(res=>{
        if(res==='granted')addEventListener('deviceorientation',handleGyro);
      }).catch(console.error);
    }else{
      addEventListener('deviceorientation',handleGyro);
    }
  };
  const handleGyro=(e)=>{
    if(!e.beta||!e.gamma)return;
    let x=e.gamma, y=e.beta-45;
    x=Math.max(-45,Math.min(45,x)); y=Math.max(-45,Math.min(45,y));
    S.tMouse.x=x/45; S.tMouse.y=-y/45; S.idle=0;S.isIdle=false;
  };
  document.addEventListener('touchstart',initGyro,{once:true});
}

// Time-Distortion Scroll Effect
let scrollTimeout;
window.addEventListener('scroll',()=>{
  if(S.isMobile||S.lowPerf||S.warping||S.page!==3&&S.page!==4)return; // Only on long pages
  S.idle=0;S.isIdle=false;
  gsap.to(camera,{fov:68,duration:.3,onUpdate:()=>camera.updateProjectionMatrix()});
  if(bloomPass)gsap.to(bloomPass,{strength:1.5,duration:.3});
  clearTimeout(scrollTimeout);
  scrollTimeout=setTimeout(()=>{
    gsap.to(camera,{fov:60,duration:.6,ease:'elastic.out(1,0.5)',onUpdate:()=>camera.updateProjectionMatrix()});
    if(bloomPass)gsap.to(bloomPass,{strength:1.0,duration:.6});
  },150);
});

// Click ping on canvas
document.getElementById('galaxyCanvas').style.pointerEvents='auto';
document.getElementById('galaxyCanvas').addEventListener('click',e=>doPing(e.clientX,e.clientY));

// Nav SPA
document.querySelectorAll('a[href^="#"]').forEach(l=>{l.addEventListener('click',e=>{e.preventDefault();
const mt=document.getElementById('menuToggle'),mn=document.getElementById('mainNav'),hdr=document.getElementById('header');
if(mt.classList.contains('open')){
  mt.classList.remove('open');mn.classList.remove('open');hdr.classList.remove('menu-open');
  document.body.style.overflow='';
}
const id=l.getAttribute('href').replace('#',''),idx=S.secs.indexOf(id);if(idx!==-1)goTo(idx);});});

// Mobile menu
const mt=document.getElementById('menuToggle'),mn=document.getElementById('mainNav'),hdr=document.getElementById('header');
mt.addEventListener('click',()=>{
  const isOpen = mt.classList.toggle('open');
  mn.classList.toggle('open');
  hdr.classList.toggle('menu-open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Audio
document.getElementById('audioToggle').addEventListener('click',toggleAudio);

// WhatsApp form
const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',e=>{e.preventDefault();
const n=document.getElementById('fname').value,m=document.getElementById('fmsg').value;
window.open(`https://wa.me/628563122123?text=${encodeURIComponent('Halo, saya '+n+'. '+m)}`,'_blank');});

initModal();}

// SPA Navigation
function goTo(idx){
if(S.warping||idx===S.page)return;
const curIdx = S.page;
S.warping=!0;S.page=idx;
const hdr=document.getElementById('header');idx>0?hdr.classList.add('scrolled'):hdr.classList.remove('scrolled');

// Mobile: simple scroll-based SPA
if(S.isMobile){
  const cur=document.getElementById(S.secs[curIdx]),tgt=document.getElementById(S.secs[idx]);
  cur.classList.remove('active');
  window.scrollTo({top:0,behavior:'instant'});
  setTimeout(()=>{tgt.classList.add('active');trigRevs(tgt);S.warping=!1;},200);
  return;}

// Check for Custom Transitions
if(window.executeTransition) {
  executeTransition(curIdx, idx, () => {
    window.scrollTo(0,0);
    S.warping=!1;
  });
  return;
}

// Fallback warp
const cur=document.getElementById(S.secs[curIdx]),tgt=document.getElementById(S.secs[idx]),wo=document.getElementById('warpOverlay'),tc=S.pageCam[idx];
cur.classList.remove('active');wo.classList.add('active');
if(window.warpHyperspace && !S.lowPerf){
  window.warpHyperspace(()=>{
    gsap.to(S.baseCam,{x:tc.x,y:tc.y,z:tc.z,duration:.1});
    wo.classList.remove('active');window.scrollTo(0,0);tgt.classList.add('active');trigRevs(tgt);S.warping=!1;
  });
} else {
  gsap.to(camera,{fov:110,duration:.4,ease:'power2.in',onUpdate:()=>camera.updateProjectionMatrix(),
  onComplete:()=>{gsap.to(S.baseCam,{x:tc.x,y:tc.y,z:tc.z,duration:.5,ease:'power2.out'});
  gsap.to(camera,{fov:60,duration:.5,ease:'power2.out',onUpdate:()=>camera.updateProjectionMatrix(),
  onComplete:()=>{wo.classList.remove('active');window.scrollTo(0,0);tgt.classList.add('active');trigRevs(tgt);S.warping=!1;}});}});
}
}

function trigRevs(sec){sec.querySelectorAll('.reveal').forEach((r,i)=>setTimeout(()=>r.classList.add('active'),i*100));
sec.querySelectorAll('.m-num').forEach(el=>{if(el.dataset.done)return;el.dataset.done='1';
const t=+el.getAttribute('data-target');let c=0;const u=()=>{c+=t/40;if(c<t){el.innerText=Math.ceil(c);requestAnimationFrame(u);}else el.innerText=t;};u();});}

// Animation
const clock=new THREE.Clock();
let perfCheck=0;

function animate(){
requestAnimationFrame(animate);
const now=performance.now(),dt=clock.getDelta(),et=clock.getElapsedTime();
S.frames++;if(now>=S.lt+1000){S.fps=(S.frames*1000)/(now-S.lt);S.lt=now;S.frames=0;
// Auto low-perf detection
perfCheck++;if(perfCheck>3&&S.fps<28&&!S.lowPerf){S.lowPerf=!0;if(bloomPass)bloomPass.strength=.3;if(window._ppPass){window._ppPass.uniforms.uChroma.value=0;window._ppPass.uniforms.uGrain.value=0;}}}
S.idle+=dt;if(S.idle>3&&!S.warping)S.isIdle=!0;
S.mouse.lerp(S.tMouse,.05);
let tx=S.baseCam.x,ty=S.baseCam.y,tz=S.baseCam.z;
if(S.isIdle&&!S.isMobile){const ot=et*.1;tx+=Math.sin(ot)*80;tz+=Math.cos(ot)*80-80;}
else{tx+=S.mouse.x*40;ty+=S.mouse.y*25;}
camera.position.x=lerp(camera.position.x,tx,.06);camera.position.y=lerp(camera.position.y,ty,.06);camera.position.z=lerp(camera.position.z,tz,.06);
camera.lookAt(0,0,0);

// Galaxy
gGrp.rotation.y=et*.02;if(gMat.uniforms)gMat.uniforms.uTime.value=et;
coreL.intensity=4+Math.sin(et*2)*1.5;

// Planets
planets.forEach(p=>{
  p.pv.rotation.y+=p.sp;
  p.mesh.rotation.y+=p.ss;
  if(p.mesh.material.uniforms && p.mesh.material.uniforms.uTime){
    p.mesh.material.uniforms.uTime.value=et;
  }
});

// Nebula breathing
nebulae.forEach(n=>{const s=n.baseS*(1+Math.sin(et*.3+n.phase)*.08);n.sp.scale.setScalar(s);
n.sp.material.opacity=.4+Math.sin(et*.5+n.phase)*.15;});

// Black hole rotation & particle suck
if(window._bhDisk)window._bhDisk.rotation.y+=.02;
bhGroup.rotation.y-=.005;

// Animate thrown particles
for(let i=bhParticles.length-1;i>=0;i--){
  const p=bhParticles[i];
  const dir=new THREE.Vector3().subVectors(blackHolePos,p.mesh.position);
  const d=dir.length();
  if(d<8){
    scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();
    bhParticles.splice(i,1);
    if(bloomPass&&!S.lowPerf)bloomPass.strength=1.8;
    setTimeout(()=>{if(bloomPass)bloomPass.strength=1.0;},100);
  }else{
    dir.normalize();
    p.vel.add(dir.multiplyScalar(0.4));
    p.mesh.position.add(p.vel);
    // Spaghettification effect
    p.mesh.scale.set(1,1+p.vel.length()*0.5,1);
    p.mesh.lookAt(blackHolePos);
  }
}

// Shooting stars
shootTimer+=dt;if(shootTimer>2+Math.random()*3){shootTimer=0;fireShoot();}
shootPool.forEach(s=>{if(!s.active)return;s.life-=dt*.8;if(s.life<=0){s.active=!1;s.line.visible=!1;return;}
s.line.position.add(s.vel.clone().multiplyScalar(dt*15));s.line.material.opacity=s.life;});

// Post-processing time uniform
if(window._ppPass)window._ppPass.uniforms.uTime.value=et;

// HUD
if(S.frames%10===0){
const f=document.getElementById('hudFPS'),se=document.getElementById('hudSector'),d=document.getElementById('hudDepth'),c=document.getElementById('hudCam'),t=document.getElementById('hudTime');
if(f)f.innerText='FPS: '+Math.round(S.fps)+(S.lowPerf?' [ECO]':'');
if(c)c.innerText='CAM: '+Math.round(camera.rotation.y*57.3)+'°';
if(d)d.innerText='DEPTH: '+(S.page*2.5).toFixed(1)+' LY';
const sn=['X-27','Y-14','Z-99','O-88','A-01','S-44'];if(se)se.innerText='SECTOR: '+sn[S.page];
if(t)t.innerText=new Date().toLocaleTimeString('id-ID')+' WIB';}

// Render
if(composer&&!S.lowPerf)composer.render();else renderer.render(scene,camera);}

// Resize
addEventListener('resize',()=>{S.isMobile=innerWidth<=768;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
renderer.setSize(innerWidth,innerHeight);if(composer)composer.setSize(innerWidth,innerHeight);});

// Modal
function initModal(){
const modal=document.getElementById('projectModal'),cb=document.querySelector('.close-modal'),cards=document.querySelectorAll('.portfolio-card');
const pd={vault:{t:'RNVN WEB',d:'Website modern dengan kombinasi desain cinematic, clean UI, dan teknologi performa tinggi.',i:'web.png',l:'https://randianodeskaputra.netlify.app'},
rnvn:{t:'RNVN STREETWEAR',d:'Brand identity streetwear di atas controlled aggression dan editorial typography.',i:'rnvnwear.png',l:'https://rnvn-brand.vercel.app'},
nexus:{t:'RNVN PRINTING',d:'Layanan percetakan modern dengan kualitas premium.',i:'rnvn printing.png',l:'https://rnvn-printing.vercel.app'},
aiautomation:{t:'RNVN AI AUTOMATION',d:'Platform otomasi bisnis berbasis AI.',i:'rnvnaiautomation.png',l:'https://aiautomation-teal.vercel.app'}};
cards.forEach((c, i)=>{c.addEventListener('click',()=>{const p=pd[c.dataset.project];if(!p)return;
document.getElementById('modalTitle').innerText=p.t;document.getElementById('modalDesc').innerText=p.d;document.getElementById('modalImage').src=p.i;
const mLink=document.getElementById('modalLink');if(p.l){mLink.href=p.l;mLink.style.display='inline-flex';}else{mLink.style.display='none';}
if(window.transitionGravitationalZoomIn && !S.isMobile){ transitionGravitationalZoomIn(i, ()=>{modal.classList.add('active'); S.warping=false;}); } else { modal.classList.add('active'); }
});});
const cl=()=>{if(window.transitionLaunchBack && !S.isMobile && modal.classList.contains('active')){transitionLaunchBack(()=>{modal.classList.remove('active');});}else{modal.classList.remove('active');}};
cb.addEventListener('click',cl);modal.addEventListener('click',e=>{if(e.target===modal)cl();});
document.querySelectorAll('.filter-btn').forEach(b=>{b.addEventListener('click',()=>{
document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');
const f=b.dataset.filter;cards.forEach(c=>{if(f==='all'||c.dataset.category===f){c.style.display='block';setTimeout(()=>{c.style.opacity='1';c.style.transform='scale(1)';},10);}
else{c.style.opacity='0';c.style.transform='scale(.9)';setTimeout(()=>c.style.display='none',300);}});});});}

initUI();animate();
