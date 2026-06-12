/* RNVN — Cyberpunk Portfolio Script */
gsap.registerPlugin(ScrollTrigger);
const $ = id => document.getElementById(id);
const rand = (a,b) => Math.random()*(b-a)+a;

/* ── PRELOADER ── */
;(()=>{
  const pre=$('preloader'), fill=$('preFill'), status=$('preStatus');
  if(!pre) return;
  
  // Inject digital counter
  const pctText=document.createElement('div');
  pctText.className='pre-pct';
  pctText.style.fontFamily='var(--font-mono)';
  pctText.style.fontSize='2.5rem';
  pctText.style.fontWeight='900';
  pctText.style.color='#fff';
  pctText.style.marginBottom='0.8rem';
  pctText.style.textShadow='0 0 12px rgba(255,255,255,0.6)';
  pctText.textContent='00%';
  const bar=pre.querySelector('.pre-bar');
  if(bar) bar.parentNode.insertBefore(pctText,bar);

  const msgs=['LOADING ASSETS...','DEPLOYING UI LAYERS...','CALIBRATING ANIMATIONS...','SYSTEM READY.'];
  let pct=0, mi=0;
  const iv=setInterval(()=>{
    pct=Math.min(pct+rand(1.5,4),100);
    const intPct=Math.floor(pct);
    if(fill) fill.style.width=intPct+'%';
    pctText.textContent=(intPct<10?'0':'')+intPct+'%';
    
    if(pct>(mi+1)*25&&mi<msgs.length-1){
      mi++;
      if(status) status.textContent=msgs[mi];
    }
    
    if(pct>=100){
      clearInterval(iv);
      setTimeout(()=>{
        if(typeof gsap!=='undefined'){
          gsap.to('.pre-inner', {opacity:0, scale:0.9, duration:0.4, ease:'power2.inOut'});
          gsap.to('#preloader', {
            yPercent:-100,
            duration:1.1,
            delay:0.3,
            ease:'power4.inOut',
            onComplete:()=>{
              pre.style.display='none';
              document.body.classList.remove('loading');
              initAll();
            }
          });
        } else {
          pre.classList.add('fade');
          setTimeout(()=>{
            pre.style.display='none';
            document.body.classList.remove('loading');
            initAll();
          },700);
        }
      },300);
    }
  },35);
})();

/* ── INIT ── */
function initAll(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  initClock(); initNav(); initScrollProgress(); initReveal();
  initCity3D(); initCounters(); initFilter(); initModal(); initForm();
  initBackToTop(); initGsap(); initTextScramble(); initViewportScanner(); initGlitchTransitions();
  initProfileHoloRings();

  // Only initialize interactive hover/mousemove/tilt effects on desktop (non-touch)
  if(!isTouch){
    initHoverEffects();
    initMagneticButtons();
    initScreenGlitchOnClick();
    initCyberGlitchStorm();
    initAutoGlitchMonitor();
    initMouseHud();
    initScrollSkew();
    initCyberCursor();
    initCards3DTilt();
  }
}

/* ── CLOCK ── */
function initClock(){
  const el=$('sysTime');
  const tick=()=>{if(el){const d=new Date();el.textContent=d.toLocaleTimeString('id-ID')+' WIB';}};
  tick(); setInterval(tick,1000);
}

/* ── NAV ── */
function initNav(){
  const header=$('header'), toggle=$('menuToggle'), nav=document.querySelector('.desktop-nav');
  window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>60),{passive:true});
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      toggle.classList.toggle('open',open);
      toggle.setAttribute('aria-expanded',open);
      header.classList.toggle('nav-active',open); // Make header transparent when mobile nav is open
      document.body.classList.toggle('nav-open',open); // Lock background scrolling
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open'); 
      toggle.classList.remove('open'); 
      toggle.setAttribute('aria-expanded',false);
      header.classList.remove('nav-active');
      document.body.classList.remove('nav-open');
    }));
  }
}

/* ── SCROLL PROGRESS ── */
function initScrollProgress(){
  const fill=$('scrollFill');
  window.addEventListener('scroll',()=>{
    const h=document.documentElement;
    if(fill)fill.style.width=(window.scrollY/(h.scrollHeight-h.clientHeight)*100)+'%';
  },{passive:true});
}

/* ── REVEAL ── */
function initReveal(){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('active');obs.unobserve(e.target);}
  }),{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* ── BACK TO TOP ── */
function initBackToTop(){
  const btn=$('backToTop');
  if(!btn)return;
  window.addEventListener('scroll',()=>btn.classList.toggle('visible',window.scrollY>500),{passive:true});
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ── COUNTERS ── */
function initCounters(){
  document.querySelectorAll('.m-num').forEach(el=>{
    const target=parseFloat(el.dataset.target);
    const dur=2000, start=performance.now();
    const step=now=>{
      const p=Math.min((now-start)/dur,1), ease=1-Math.pow(1-p,3);
      el.textContent=Number.isInteger(target)?Math.floor(ease*target):( ease*target).toFixed(2);
      if(p<1)requestAnimationFrame(step);
    };
    setTimeout(()=>requestAnimationFrame(step),1000);
  });
}

/* ── 3D CITY ── */
function initCity3D(){
  const canvas=$('cityCanvas');
  if(!canvas||typeof THREE==='undefined'){document.body.classList.add('no-webgl');return;}
  const W=window.innerWidth, H=window.innerHeight;
  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x000000,0.013);
  const camera=new THREE.PerspectiveCamera(55,W/H,0.1,800);
  camera.position.set(0,35,80); camera.lookAt(0,0,0);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0,0);

  // Grid
  scene.add(new THREE.GridHelper(200,40,0x220008,0x110004));

  // Buildings
  const cols=[0xFF0033,0x00FFCC,0x00FF88,0x4444ff];
  const buildings=[];
  for(let i=0;i<130;i++){
    const h=rand(2,28),w=rand(1.5,4.5);
    const geo=new THREE.BoxGeometry(w,h,w);
    const isWire=Math.random()>.45;
    const mat=new THREE.MeshBasicMaterial({
      color:isWire?cols[Math.floor(rand(0,cols.length))]:0x0a0a0a,
      wireframe:isWire,transparent:true,opacity:isWire?rand(.08,.35):.95
    });
    const mesh=new THREE.Mesh(geo,mat);
    const x=rand(-85,85),z=rand(-85,85);
    if(Math.abs(x)<10&&Math.abs(z)<10)continue;
    mesh.position.set(x,h/2,z);
    scene.add(mesh);
    if(!isWire){
      const eGeo=new THREE.EdgesGeometry(geo);
      const eMat=new THREE.LineBasicMaterial({color:cols[Math.floor(rand(0,cols.length))],transparent:true,opacity:rand(.04,.22)});
      mesh.add(new THREE.LineSegments(eGeo,eMat));
    }
    buildings.push({mesh,phase:rand(0,Math.PI*2)});
  }

  // Particles
  const N=600,pos=new Float32Array(N*3);
  for(let i=0;i<N;i++){pos[i*3]=rand(-100,100);pos[i*3+1]=rand(0,55);pos[i*3+2]=rand(-100,100);}
  const pGeo=new THREE.BufferGeometry();
  pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pts=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xFF0033,size:.3,transparent:true,opacity:.5}));
  scene.add(pts);

  // Light streams
  for(let i=0;i<15;i++){
    const pts2=[new THREE.Vector3(rand(-60,60),0,rand(-60,60)),new THREE.Vector3(rand(-60,60),rand(5,35),rand(-60,60))];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2),new THREE.LineBasicMaterial({color:0xFF0033,transparent:true,opacity:rand(.04,.2)})));
  }

  // Lights
  const rLight=new THREE.PointLight(0xFF0033,1.5,100);
  rLight.position.set(0,20,0); scene.add(rLight);
  scene.add(new THREE.AmbientLight(0x111111));

  let frame=0, camAngle=0;
  const isMobile=window.innerWidth<768;
  const camR=isMobile?60:80;
  let mouseX=0, mouseY=0;

  if(!isMobile){
    window.addEventListener('mousemove',e=>{
      mouseX=(e.clientX/window.innerWidth - 0.5)*15;
      mouseY=(e.clientY/window.innerHeight - 0.5)*10;
    },{passive:true});
  }

  // Scroll Progress Tracker for camera zoom/fly-through
  let scrollData = { progress: 0 };
  if (typeof gsap !== 'undefined') {
    gsap.to(scrollData, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2
      }
    });
  }

  function animate(){
    requestAnimationFrame(animate); frame++;
    camAngle+=isMobile?.00025:.0003;
    
    // Smooth camera dive-in path
    const targetHeight = 36 - (scrollData.progress * 26); // Go down from 36 to 10
    const targetRadius = camR - (scrollData.progress * (camR * 0.45)); // Go closer to the center by 45%
    const currentAngle = camAngle + (scrollData.progress * Math.PI * 1.8); // Turn around the city as we scroll
    
    camera.position.x = Math.sin(currentAngle) * targetRadius + mouseX;
    camera.position.z = Math.cos(currentAngle) * targetRadius + mouseY;
    camera.position.y = targetHeight + Math.sin(frame * 0.012) * 2.5 - mouseY; // slight bobbing
    
    camera.lookAt(0, 5 - (scrollData.progress * 3.5), 0);
    buildings.forEach(b=>{b.mesh.scale.y=1+Math.sin(frame*.01+b.phase)*.02;});
    const pa=pGeo.attributes.position.array;
    for(let i=0;i<N;i++){pa[i*3+1]+=.04;if(pa[i*3+1]>55)pa[i*3+1]=0;}
    pGeo.attributes.position.needsUpdate=true;
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    const w=window.innerWidth,h=window.innerHeight;
    camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
  });
}

/* ── FILTER ── */
function initFilter(){
  const btns=document.querySelectorAll('.filter-btn');
  const cards=document.querySelectorAll('.portfolio-card');
  btns.forEach(btn=>btn.addEventListener('click',()=>{
    btns.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');
    const f=btn.dataset.filter;
    cards.forEach(card=>{
      const show=f==='all'||card.dataset.category===f;
      gsap?gsap.to(card,{opacity:show?1:0,scale:show?1:.95,duration:.3,onComplete:()=>{card.style.display=show?'':'none';}}):card.style.display=show?'':'none';
      if(show)card.style.display='';
    });
  }));
}

/* ── MODAL ── */
const projects={
  vault:{
    title: "RNVN — web Development",
    desc: "Layanan RNVN Web Developer Web Design Desain website modern, clean, dan premium dengan tampilan yang elegan dan user friendly. Web Development Pembuatan website cepat, aman, responsif, dan berperforma tinggi. Responsive Design Tampilan optimal di desktop, tablet, maupun smartphone. E-Commerce Website Membangun toko online modern lengkap dengan produk, cart, checkout, dan payment gateway. Landing Page Premium Landing page cinematic untuk promosi brand, produk, event, atau bisnis. Portfolio Website Website personal atau company profile dengan identitas visual profesional. SEO & Speed Optimization Optimasi website agar cepat, ringan, dan mudah ditemukan di Google. Maintenance & Support Perawatan website, update sistem, dan support berkelanjutan. Domain & Hosting Membantu setup domain dan hosting agar website siap online dengan aman dan stabil.",
    imgSrc: "rnvn web.png",
    link: "https://randianodeskaputra.netlify.app"
  },
  rnvn:{
    title: "RNVN — Streetwear Identity",
    desc: "RNVN is a brand born from controlled aggression. The visual identity fuses brutalist grid systems with editorial typography to create a presence that dominates — online and off. Logo, lookbook, and digital storefront conceived as a singular, cohesive statement.",
    imgSrc: "mockup.png",
    link: "https://rnvn-brand.vercel.app"
  },
  nexus:{
    title: "RNVN PRINTING",
    desc: "Kami melayani Cetak Undangan Cetak Foto Banner & Poster Sticker & Merchandise Sablon Kaos Branding UMKM Digital Printing Desain & Produksi Visual Dengan kualitas modern dan hasil yang siap meningkatkan identitas visual bisnis maupun personal project Anda.",
    imgSrc: "rnvn printing2.png",
    link: "https://rnvn-printing.vercel.app/"
  },
  aiautomation:{
    title: "RNVN AI Automation",
    desc: "Platform otomasi bisnis berbasis AI yang dirancang untuk membantu bisnis, brand, dan individu mengotomatiskan alur kerja secara cerdas. Mulai dari otomasi pemasaran, manajemen leads, hingga integrasi sistem — semua dalam satu platform modern yang efisien dan berorientasi pada hasil nyata.",
    imgSrc: "rnvnaiautomation.png",
    link: "https://aiautomation-teal.vercel.app/"
  },
  nexusplatform:{
    title: "NEXUS — Cyberpunk Observability Platform",
    desc: "Futuristic observability platform dengan 3D city visualization menggunakan Three.js + WebGL. Menampilkan mission-control cockpit interface, autonomous AI monitoring agents, real-time alert feed, animated dashboard, dan GSAP ScrollTrigger animations. Dibangun dengan dark-mode cyberpunk aesthetic, HUD overlays, dan immersive sci-fi storytelling.",
    imgSrc: "rnvnaiautomation.png",
    link: "https://aiautomation-teal.vercel.app/"
  }
};

function initModal(){
  const modal=$('projectModal'),img=$('modalImage'),title=$('modalTitle'),desc=$('modalDesc'),link=$('modalLink'),close=document.querySelector('.close-modal');
  if(!modal)return;
  let savedY=0;
  const open=id=>{
    const d=projects[id]; if(!d)return;
    img.src=d.imgSrc; title.textContent=d.title; desc.textContent=d.desc; link.setAttribute('href',d.link);
    modal.classList.add('active'); modal.setAttribute('aria-hidden','false');
    savedY=window.scrollY; document.body.style.top=`-${savedY}px`;
    document.body.classList.add('modal-open');
    gsap&&gsap.fromTo(modal.querySelector('.modal-content'),{y:50,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out'});
  };
  const closeM=()=>{
    modal.classList.remove('active'); modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    document.body.style.top='';
    window.scrollTo(0, savedY); // Safe viewport scroll position restore for Android & iOS
  };
  document.querySelectorAll('.portfolio-card').forEach(c=>{
    c.addEventListener('click',()=>open(c.dataset.project));
    c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open(c.dataset.project);});
  });
  close&&close.addEventListener('click',closeM);
  modal.addEventListener('click',e=>{if(e.target===modal)closeM();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('active'))closeM();});
}

/* ── FORM ── */
function initForm(){
  const form=$('contactForm');
  if(!form)return;
  const WA='628563122123';
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('name').value.trim();
    const email=document.getElementById('email').value.trim();
    const msg=document.getElementById('message').value.trim();
    if(!name||!email||!msg)return;
    const text=`Halo Randiano! 👋%0ASaya menghubungi via portfolio website.%0A%0A*Nama:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A%0A*Pesan:*%0A${encodeURIComponent(msg)}`;
    window.open(`https://wa.me/${WA}?text=${text}`,'_blank','noopener,noreferrer');
    const btn=$('submitBtn');
    const btnText=btn.querySelector('.btn-text');
    if(btnText){
      btnText.textContent='✓ REDIRECTED TO WHATSAPP!';
    } else {
      btn.textContent='✓ REDIRECTED TO WHATSAPP!';
    }
    btn.style.background='#00FF88'; btn.style.color='#000';
    form.reset();
    setTimeout(()=>{
      if(btnText){
        btnText.textContent='Kirim Pesan via WhatsApp';
      } else {
        btn.textContent='Kirim Pesan via WhatsApp';
      }
      btn.style.background=''; btn.style.color='';
    },4000);
  });
}

/* ── GSAP ANIMATIONS ── */
function initGsap(){
  if(typeof gsap==='undefined')return;
  // Hero
  gsap.fromTo('.hero-eyebrow',{opacity:0,y:-20},{opacity:1,y:0,duration:.8,ease:'power2.out',delay:.5});
  gsap.fromTo('.title-line',{opacity:0,y:70,skewX:6},{opacity:1,y:0,skewX:0,duration:1,stagger:.15,ease:'power3.out',delay:.7});
  gsap.fromTo('.hero-sub,.hero-actions,.hero-metrics',{opacity:0,y:30},{opacity:1,y:0,duration:.8,stagger:.12,ease:'power2.out',delay:1.3});
  gsap.fromTo('.hud-tl,.hud-tr,.hud-bl,.hud-br',{opacity:0},{opacity:1,duration:1.5,stagger:.15,ease:'power1.out',delay:.8});
  gsap.fromTo('.crosshair',{opacity:0,scale:.5},{opacity:1,scale:1,duration:1,ease:'elastic.out(1,.5)',delay:1});
  // Parallax
  gsap.to('#cityCanvas',{y:180,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
  // Sections
  gsap.fromTo('#about .about-left',{x:-60,opacity:0},{x:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#about',start:'top 75%'}});
  gsap.fromTo('#about .about-right',{x:60,opacity:0},{x:0,opacity:1,duration:1,ease:'power3.out',delay:.2,scrollTrigger:{trigger:'#about',start:'top 75%'}});
  gsap.fromTo('.skill-card',{y:50,opacity:0},{y:0,opacity:1,duration:.7,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#skills',start:'top 75%'}});
  gsap.fromTo('.portfolio-card',{y:50,opacity:0},{y:0,opacity:1,duration:.7,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#portfolio',start:'top 75%'}});
  gsap.fromTo('#contact .contact-left',{x:-50,opacity:0},{x:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#contact',start:'top 75%'}});
  gsap.fromTo('#contact .contact-right',{x:50,opacity:0},{x:0,opacity:1,duration:1,delay:.2,ease:'power3.out',scrollTrigger:{trigger:'#contact',start:'top 75%'}});
}

/* ── HOVER EFFECTS ── */
function initHoverEffects(){
  document.querySelectorAll('.portfolio-card, .skill-card, .tech-cat, .astat').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      card.style.setProperty('--mouse-x',`${x}px`);
      card.style.setProperty('--mouse-y',`${y}px`);
    },{passive:true});
  });
}

/* ── MATRIX TEXT SCRAMBLE ── */
function initTextScramble(){
  const chars='01XYZ@#$+-*/%=[]{}<>_';
  document.querySelectorAll('.sec-title, .hero-eyebrow, .nav-links a, .card-body h3').forEach(el=>{
    const original=el.innerText;
    if(!original)return;
    const scramble=()=>{
      let iterations=0;
      const interval=setInterval(()=>{
        el.innerText=original.split('').map((char,index)=>{
          if(index<iterations)return original[index];
          if(char===' ')return ' ';
          return chars[Math.floor(Math.random()*chars.length)];
        }).join('');
        if(iterations>=original.length)clearInterval(interval);
        iterations+=1/3;
      },30);
    };
    el.addEventListener('mouseenter',scramble);
    if(typeof gsap!=='undefined' && typeof ScrollTrigger!=='undefined' && el.classList.contains('sec-title')){
      ScrollTrigger.create({
        trigger:el,
        start:'top 85%',
        once:true,
        onEnter:scramble
      });
    }
  });
}

/* ── MAGNETIC EFFECT ── */
function initMagneticButtons(){
  if(typeof gsap==='undefined')return;
  document.querySelectorAll('.btn-primary, .btn-ghost, .dock-item, .back-to-top, .menu-toggle').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const rect=btn.getBoundingClientRect();
      const x=e.clientX-rect.left-rect.width/2;
      const y=e.clientY-rect.top-rect.height/2;
      gsap.to(btn,{x:x*0.3,y:y*0.3,duration:0.3,ease:'power2.out'});
    },{passive:true});
    btn.addEventListener('mouseleave',()=>{
      gsap.to(btn,{x:0,y:0,duration:0.5,ease:'elastic.out(1,0.3)'});
    });
  });
}

/* ── SCREEN GLITCH ON CLICK ── */
function initScreenGlitchOnClick(){
  document.body.addEventListener('click',e=>{
    // Ignore form inputs to avoid focus/typing glitches
    if(e.target.closest('input, textarea, select')) return;
    
    document.body.classList.add('screen-glitch-active');
    setTimeout(()=>{
      document.body.classList.remove('screen-glitch-active');
    },230);
  });
}

/* ── INTERACTIVE CANVAS PARTICLES & DIGITAL NOISE ── */
function initCyberGlitchStorm(){
  const canvas=document.createElement('canvas');
  canvas.id='cyberGlitchCanvas';
  canvas.style.position='fixed';
  canvas.style.inset='0';
  canvas.style.pointerEvents='none';
  canvas.style.zIndex='1';
  canvas.style.opacity='0.55';
  document.body.appendChild(canvas);

  const ctx=canvas.getContext('2d');
  let w=canvas.width=window.innerWidth;
  let h=canvas.height=window.innerHeight;

  window.addEventListener('resize',()=>{
    w=canvas.width=window.innerWidth;
    h=canvas.height=window.innerHeight;
  },{passive:true});

  const particles=[];
  const maxParticles=50;
  let mouse={x:null,y:null,active:false};

  // Matrix drops setup
  const matrixCols=Math.floor(w/14);
  const matrixDrops=[];
  for(let i=0;i<matrixCols;i++){
    matrixDrops[i]=Math.random()*-150;
  }
  const chars='01XYZ@#$+-*/%=[]{}<>_';

  window.addEventListener('mousemove',e=>{
    mouse.x=e.clientX;
    mouse.y=e.clientY;
    mouse.active=true;
    
    if(particles.length<maxParticles){
      particles.push({
        x:mouse.x,
        y:mouse.y,
        vx:(Math.random()-0.5)*3,
        vy:(Math.random()-0.5)*3-0.8,
        size:Math.random()*3+2,
        color:Math.random()>0.5?'#FF0033':'#00FFCC',
        char:Math.random()>0.5?'1':'0',
        life:1.0,
        decay:Math.random()*0.02+0.015
      });
    }
  },{passive:true});

  window.addEventListener('mouseleave',()=>{mouse.active=false;});

  function draw(){
    ctx.clearRect(0,0,w,h);

    // Render Matrix falling digital rain drops on the edges
    ctx.fillStyle='rgba(0,255,204,0.06)';
    ctx.font='9px var(--font-mono)';
    matrixDrops.forEach((y,index)=>{
      const x=index*14;
      if(x<w*0.14||x>w*0.86){
        const text=chars[Math.floor(Math.random()*chars.length)];
        ctx.fillText(text,x,y);
        if(y>h&&Math.random()>0.975){
          matrixDrops[index]=0;
        }else{
          matrixDrops[index]=y+12;
        }
      }
    });

    if(mouse.active&&Math.random()>0.4){
      ctx.strokeStyle='rgba(255,0,51,0.14)';
      ctx.lineWidth=0.5;
      particles.forEach(p=>{
        const dx=p.x-mouse.x;
        const dy=p.y-mouse.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<140){
          ctx.beginPath();
          ctx.moveTo(mouse.x,mouse.y);
          ctx.lineTo(p.x,p.y);
          ctx.stroke();
        }
      });
    }

    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.x+=p.vx;
      p.y+=p.vy;
      p.life-=p.decay;

      if(p.life<=0){
        particles.splice(i,1);
        continue;
      }

      ctx.fillStyle=p.color;
      ctx.globalAlpha=p.life*0.6;
      ctx.font=`bold ${p.size*2.2}px var(--font-mono)`;
      ctx.fillText(p.char,p.x,p.y);

      ctx.strokeStyle=p.color;
      ctx.lineWidth=0.4;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size*(2-p.life),0,Math.PI*2);
      ctx.stroke();
    }
    ctx.globalAlpha=1.0;

    if(Math.random()>0.985){
      ctx.fillStyle='rgba(255,0,51,0.06)';
      for(let i=0;i<3;i++){
        const gy=Math.random()*h;
        const gh=Math.random()*15+2;
        ctx.fillRect(0,gy,w,gh);
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── PERIODIC AUTO-GLITCH MONITOR ── */
function initAutoGlitchMonitor(){
  const chars='01XYZ@#$+-*/%=[]{}<>_';
  const selectors='.sec-title, .hero-eyebrow, .nav-links a, .card-tag, .hud-value, .cinfo-label';
  
  setInterval(()=>{
    if(Math.random()>0.5)return;
    const elements=document.querySelectorAll(selectors);
    if(elements.length===0)return;
    const el=elements[Math.floor(Math.random()*elements.length)];
    
    if(!el.dataset.origText){
      el.dataset.origText=el.innerText;
    }
    const original=el.dataset.origText;
    if(!original||original.trim()==='')return;
    
    let iterations=0;
    const interval=setInterval(()=>{
      el.innerText=original.split('').map((char,index)=>{
        if(index<iterations)return original[index];
        if(char===' ')return ' ';
        return chars[Math.floor(Math.random()*chars.length)];
      }).join('');
      if(iterations>=original.length){
        clearInterval(interval);
        el.innerText=original;
      }
      iterations+=original.length/8;
    },25);
  },3500);
}

/* ── PROFILE 3D TILT & HOLOGRAM RINGS ── */
function initProfileHoloRings(){
  const wrapper=document.querySelector('.hero-image-wrapper');
  if(wrapper){
    const ry=document.createElement('div');
    ry.className='hero-img-ring ring-y';
    const rx=document.createElement('div');
    rx.className='hero-img-ring ring-x';
    wrapper.appendChild(ry);
    wrapper.appendChild(rx);

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if(!isTouch){
      wrapper.addEventListener('mousemove',e=>{
        const rect=wrapper.getBoundingClientRect();
        const x=e.clientX-rect.left-rect.width/2;
        const y=e.clientY-rect.top-rect.height/2;
        const tiltX=(y/(rect.height/2))*20;
        const tiltY=-(x/(rect.width/2))*20;
        wrapper.style.setProperty('--tilt-x',`${tiltX}deg`);
        wrapper.style.setProperty('--tilt-y',`${tiltY}deg`);
      },{passive:true});
      wrapper.addEventListener('mouseleave',()=>{
        wrapper.style.setProperty('--tilt-x',`0deg`);
        wrapper.style.setProperty('--tilt-y',`0deg`);
      });
    }
  }
}

/* ── MOUSE DIAGNOSTIC HUD ── */
function initMouseHud(){
  if(window.innerWidth<768)return;
  const hud=document.createElement('div');
  hud.id='mouseHud';
  hud.style.position='fixed';
  hud.style.pointerEvents='none';
  hud.style.zIndex='99999';
  hud.style.fontFamily='var(--font-mono)';
  hud.style.fontSize='8px';
  hud.style.color='rgba(255,0,85,0.7)';
  hud.style.letterSpacing='1px';
  hud.style.lineHeight='1.4';
  hud.style.padding='6px';
  hud.style.borderLeft='1px solid rgba(255,0,85,0.4)';
  hud.style.opacity='0';
  hud.style.transition='opacity-delay 0.25s ease';
  document.body.appendChild(hud);

  const statuses=['SYS: OK','LOC: INDONESIA','NET: SECURE','MODE: RUNTIME','GRID: ONLINE'];

  window.addEventListener('mousemove',e=>{
    hud.style.left=(e.clientX+15)+'px';
    hud.style.top=(e.clientY+15)+'px';
    hud.style.opacity='1';
    
    if(Math.random()>0.96){
      hud.innerHTML=`X: ${e.clientX}<br>Y: ${e.clientY}<br>${statuses[Math.floor(Math.random()*statuses.length)]}`;
    }
  },{passive:true});

  window.addEventListener('mouseleave',()=>{
    hud.style.opacity='0';
  });
}

/* ── SCROLL MOMENTUM SKEW & CHROMATIC ABERRATION ── */
function initScrollSkew(){
  if(typeof gsap==='undefined'||window.innerWidth<768)return;
  let proxy={skew:0},
      skewSetter=gsap.quickSetter('.portfolio-card, .skill-card','skewY','deg'),
      clamp=gsap.utils.clamp(-6,6),
      root=document.documentElement;

  ScrollTrigger.create({
    onUpdate:(self)=>{
      const vel=self.getVelocity();
      let skew=clamp(vel/-220);
      
      const intensity=Math.min(Math.abs(vel)/260, 4.5);
      root.style.setProperty('--scroll-glitch-intensity', intensity+'px');
      
      gsap.to(root,{
        '--scroll-glitch-intensity':'0px',
        duration:0.4,
        ease:'power2.out',
        overwrite:'auto'
      });

      if(Math.abs(skew)>Math.abs(proxy.skew)){
        proxy.skew=skew;
        gsap.to(proxy,{
          skew:0,
          duration:0.6,
          ease:'power3.out',
          overwrite:'auto',
          onUpdate:()=>skewSetter(proxy.skew)
        });
      }
    }
  });
}

/* ── LAGGING NEON CROSSHAIR CURSOR ── */
function initCyberCursor(){
  const isTouchDevice='ontouchstart' in window || navigator.maxTouchPoints > 0;
  if(window.innerWidth<768 || isTouchDevice) return;
  
  document.body.style.cursor='none';
  document.querySelectorAll('.btn-primary, .btn-ghost, .dock-item, .back-to-top, .menu-toggle, a, button').forEach(el=>{
    el.style.cursor='none';
  });

  const dot=document.createElement('div');
  dot.id='cyberCursorDot';
  dot.style.position='fixed';
  dot.style.width='6px';
  dot.style.height='6px';
  dot.style.background='var(--red)';
  dot.style.borderRadius='50%';
  dot.style.pointerEvents='none';
  dot.style.zIndex='100000';
  dot.style.transform='translate(-50%,-50%)';
  document.body.appendChild(dot);

  const ring=document.createElement('div');
  ring.id='cyberCursorRing';
  ring.style.position='fixed';
  ring.style.width='28px';
  ring.style.height='28px';
  ring.style.border='1.5px solid var(--cyan)';
  ring.style.borderRadius='50%';
  ring.style.pointerEvents='none';
  ring.style.zIndex='99999';
  ring.style.transform='translate(-50%,-50%)';
  ring.style.transition='transform 0.08s ease-out, width 0.15s, height 0.15s, border-color 0.15s';
  document.body.appendChild(ring);

  window.addEventListener('mousemove',e=>{
    dot.style.left=e.clientX+'px';
    dot.style.top=e.clientY+'px';
    ring.style.left=e.clientX+'px';
    ring.style.top=e.clientY+'px';
  },{passive:true});

  document.querySelectorAll('a, button, [role="button"], .portfolio-card, .skill-card, .dock-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      ring.style.width='40px';
      ring.style.height='40px';
      ring.style.borderColor='var(--red)';
    });
    el.addEventListener('mouseleave',()=>{
      ring.style.width='28px';
      ring.style.height='28px';
      ring.style.borderColor='var(--cyan)';
    });
  });
}

/* ── VIEWPORT SCANNER ── */
function initViewportScanner(){
  const scanBar=document.createElement('div');
  scanBar.className='scan-bar';
  document.body.appendChild(scanBar);
}

/* ── GLITCH TRANSITIONS ON NAVIGATION ── */
function initGlitchTransitions(){
  const transitionDiv=document.createElement('div');
  transitionDiv.id='glitchTransition';
  transitionDiv.innerHTML=`
    <div class="glitch-trans-title">SYSTEM RE-SYNC</div>
    <div class="glitch-trans-bar"></div>
  `;
  document.body.appendChild(transitionDiv);

  document.querySelectorAll('a[href^="#"]:not(#modalLink), .back-to-top').forEach(link=>{
    link.addEventListener('click',e=>{
      let targetEl;
      if(link.classList.contains('back-to-top') || link.id === 'backToTop'){
        targetEl=document.body;
      } else {
        const targetId=link.getAttribute('href');
        if(!targetId || !targetId.startsWith('#')) return;
        targetEl=document.querySelector(targetId);
      }
      if(!targetEl) return;
      e.preventDefault();

      transitionDiv.classList.add('active');
      
      const title = transitionDiv.querySelector('.glitch-trans-title');
      const orig = title.textContent;
      const chars = '01XYZ@#$+-*/%=[]{}';
      let ticks = 0;
      const staticIv = setInterval(()=>{
        title.textContent = orig.split('').map(() => chars[Math.floor(Math.random()*chars.length)]).join('');
        ticks++;
        if(ticks > 8){
          clearInterval(staticIv);
          title.textContent = orig;
        }
      }, 30);

      setTimeout(()=>{
        targetEl.scrollIntoView({behavior:'smooth'});
        setTimeout(()=>{
          transitionDiv.classList.remove('active');
        },200);
      },320);
    });
  });
}



/* ── CARDS 3D TILT ── */
function initCards3DTilt(){
  document.querySelectorAll('.portfolio-card, .skill-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=e.clientX-rect.left-rect.width/2;
      const y=e.clientY-rect.top-rect.height/2;
      const tiltX=(y/(rect.height/2))*8;
      const tiltY=-(x/(rect.width/2))*8;
      card.style.transform=`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    },{passive:true});
    card.addEventListener('mouseleave',()=>{
      card.style.transform='perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
    card.style.transition='transform 0.1s ease-out, box-shadow 0.15s ease-out';
  });
}
