/**
 * GALAXY TRANSITIONS v1 — Custom 3D Cinematic Transitions
 * Mapping:
 * home->about: warpIntoOrbit
 * about->projects(portfolio): constellationFormation
 * projects->projectDetail: gravitationalZoomIn
 * projectDetail->projects: launchBack
 * *->contact: signalTransmission
 * *->home: returnToOrigin
 */

// Cache objects for reuse
const TransCache = {
  aboutPlanet: null,
  projPlanets: [],
  constLns: null,
  signalLight: null,
  signalLines: null
};

function initTransCache() {
  // Create a specific planet for About
  const g = new THREE.SphereGeometry(15, 32, 32);
  const m = new THREE.MeshStandardMaterial({
    color: 0x4ade80, emissive: 0x22c55e, emissiveIntensity: 0.2,
    wireframe: true, transparent: true, opacity: 0
  });
  TransCache.aboutPlanet = new THREE.Mesh(g, m);
  TransCache.aboutPlanet.position.set(80, 40, 180); // Near About camera (80,40,220)
  scene.add(TransCache.aboutPlanet);

  // Project planets
  for(let i=0; i<4; i++) {
    const pg = new THREE.SphereGeometry(5, 16, 16);
    const pm = new THREE.MeshBasicMaterial({color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0});
    const pmesh = new THREE.Mesh(pg, pm);
    TransCache.projPlanets.push(pmesh);
    scene.add(pmesh);
  }

  // Signal light
  const sg = new THREE.SphereGeometry(2, 16, 16);
  const sm = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0});
  TransCache.signalLight = new THREE.Mesh(sg, sm);
  scene.add(TransCache.signalLight);
}
setTimeout(initTransCache, 2000);

// Global Transition Controller
function executeTransition(curIdx, tgtIdx, onComplete) {
  const curId = S.secs[curIdx];
  const tgtId = S.secs[tgtIdx];
  const tc = S.pageCam[tgtIdx];

  const mapKey = `${curId}->${tgtId}`;
  
  const curEl = document.getElementById(curId);
  const tgtEl = document.getElementById(tgtId);
  
  // Unmount old content visually
  gsap.to(curEl, {opacity: 0, duration: 0.4, onComplete: () => {
    curEl.classList.remove('active');
    curEl.style.opacity = '';
    
    // Prepare new content (invisible)
    tgtEl.classList.add('active');
    tgtEl.style.opacity = '0';
    
    const showTarget = () => {
      gsap.to(tgtEl, {opacity: 1, duration: 0.5});
      if(window.trigRevs) trigRevs(tgtEl);
      if(onComplete) onComplete();
    };

    // Route transitions
    if (tgtId === 'about') {
      transitionWarpToOrbit(tc, showTarget);
    } else if (tgtId === 'philosophy') {
      transitionConstellationForm(tc, showTarget);
    } else if (tgtId === 'portfolio') {
      transitionGravitationalZoomIn(0, showTarget);
    } else if (tgtId === 'contact') {
      transitionSignalTransmission(tc, showTarget);
    } else if (tgtId === 'hero') {
      transitionReturnToOrigin(tc, showTarget);
    } else {
      // Generic fallback 3D move
      gsap.to(S.baseCam, {x: tc.x, y: tc.y, z: tc.z, duration: 1.5, ease: 'easeInOutCubic'});
      setTimeout(showTarget, 1000);
    }
  }});
}

/* 1. HOME -> ABOUT: "WARP INTO ORBIT" */
function transitionWarpToOrbit(tc, showTarget) {
  // Camera warp speed to about planet
  const p = TransCache.aboutPlanet;
  p.material.opacity = 0;
  
  const tl = gsap.timeline();
  // Star lines warp
  if(window.warpHyperspace) {
    warpHyperspace();
  } else {
    gsap.to(camera, {fov: 100, duration: 0.4});
  }
  
  tl.to(S.baseCam, {x: p.position.x, y: p.position.y, z: p.position.z + 100, duration: 0.6, ease: 'power2.in'})
    .to(camera, {fov: 60, duration: 0.4}, "-=0.2")
    .to(p.material, {opacity: 0.8, duration: 0.5}, "-=0.5")
    // Orbit around it
    .to(S.baseCam, {x: p.position.x + 30, z: p.position.z + 30, duration: 0.8, ease: 'sine.inOut'})
    // Planet expands as portal
    .to(p.scale, {x: 30, y: 30, z: 30, duration: 0.6, ease: 'power3.in'}, "-=0.2")
    .to(p.material, {opacity: 0, duration: 0.3}, "-=0.3")
    .call(() => {
      p.scale.set(1,1,1);
      S.baseCam.set(tc.x, tc.y, tc.z);
      showTarget();
    });
}

/* 2. ABOUT -> PROJECTS: "CONSTELLATION FORMATION" */
function transitionConstellationForm(tc, showTarget) {
  const tl = gsap.timeline();
  // Zoom out to galaxy view
  tl.to(S.baseCam, {z: tc.z + 150, y: tc.y + 50, duration: 0.8, ease: 'easeInOutCubic'})
    .call(() => {
      // Connect stars & form project planets
      TransCache.projPlanets.forEach((pm, i) => {
        pm.position.set(tc.x + (i-1.5)*30, tc.y + Math.random()*20, tc.z - 50 + Math.random()*20);
        pm.scale.set(0.1, 0.1, 0.1);
        pm.material.opacity = 0;
        gsap.to(pm.material, {opacity: 0.8, duration: 0.5, delay: i*0.1});
        gsap.to(pm.scale, {x: 1, y: 1, z: 1, duration: 0.8, ease: 'back.out(1.7)', delay: i*0.1});
      });
    })
    .to(S.baseCam, {x: tc.x, y: tc.y, z: tc.z, duration: 1.2, ease: 'easeInOutExpo'}, "+=0.5")
    .call(() => {
      showTarget();
      // Fade out planets
      TransCache.projPlanets.forEach(pm => gsap.to(pm.material, {opacity: 0, duration: 1}));
    });
}

/* 3. PROJECTS -> PROJECT DETAIL: "GRAVITATIONAL ZOOM-IN" */
function transitionGravitationalZoomIn(cardIdx, showModal) {
  const pm = TransCache.projPlanets[cardIdx % 4];
  pm.material.opacity = 0.8;
  pm.scale.set(1,1,1);
  pm.position.set(S.baseCam.x, S.baseCam.y, S.baseCam.z - 80);
  
  // Radial blur / motion blur fx via fov
  gsap.to(camera, {fov: 30, duration: 0.6, ease: 'power2.in', onUpdate: ()=>camera.updateProjectionMatrix()});
  gsap.to(S.baseCam, {
    x: pm.position.x, y: pm.position.y, z: pm.position.z + 5, 
    duration: 0.8, ease: 'power3.in',
    onComplete: () => {
      // Break surface
      if(bloomPass && !S.lowPerf) gsap.to(bloomPass, {strength: 3, duration: 0.2, yoyo: true, repeat: 1});
      pm.material.opacity = 0;
      showModal();
    }
  });
}

/* 4. PROJECT DETAIL -> PROJECTS: "LAUNCH BACK" */
function transitionLaunchBack(hideModal) {
  hideModal(); // hide UI instantly
  if(window.shake) window.shake();
  
  // Rocket trail
  if(window.spawnAurora) {
    // temporary effect
    gsap.to(camera.position, {z: camera.position.z + 10, duration: 0.1, yoyo:true, repeat: 5});
  }
  
  const tc = S.pageCam[3]; // portfolio
  gsap.to(camera, {fov: 100, duration: 0.3, onUpdate: ()=>camera.updateProjectionMatrix()});
  gsap.to(S.baseCam, {
    x: tc.x, y: tc.y, z: tc.z, 
    duration: 1.0, ease: 'power3.out',
    onComplete: () => {
      gsap.to(camera, {fov: 60, duration: 0.4, onUpdate: ()=>camera.updateProjectionMatrix()});
      S.warping = false;
    }
  });
}

/* 5. * -> CONTACT: "SIGNAL TRANSMISSION" */
function transitionSignalTransmission(tc, showTarget) {
  const light = TransCache.signalLight;
  light.position.set(tc.x, tc.y, tc.z - 60);
  
  const tl = gsap.timeline();
  // Blur / move back
  tl.to(S.baseCam, {z: S.baseCam.z + 50, duration: 0.5, ease: 'power2.out'})
    .to(light.material, {opacity: 1, duration: 0.3}, "-=0.2")
    .to(light.scale, {x: 20, y: 20, z: 20, duration: 0.6, ease: 'power4.in'})
    .call(() => {
      if(bloomPass && !S.lowPerf) {
        gsap.to(bloomPass, {strength: 4, duration: 0.1, yoyo: true, repeat: 1});
      }
    })
    .to(light.material, {opacity: 0, duration: 0.2})
    .to(S.baseCam, {x: tc.x, y: tc.y, z: tc.z, duration: 0.8, ease: 'power2.out'})
    .call(() => {
      light.scale.set(1,1,1);
      showTarget();
    });
}

/* 6. * -> HOME: "RETURN TO ORIGIN" */
function transitionReturnToOrigin(tc, showTarget) {
  // Reverse warp / gravity pull
  gsap.to(camera, {fov: 130, duration: 0.5, ease: 'power2.in', onUpdate: ()=>camera.updateProjectionMatrix()});
  
  gsap.to(S.baseCam, {
    x: tc.x, y: tc.y, z: tc.z, 
    duration: 1.2, ease: 'back.out(1.2)', 
    onComplete: () => {
      gsap.to(camera, {fov: 60, duration: 0.6, ease: 'elastic.out(1, 0.5)', onUpdate: ()=>camera.updateProjectionMatrix()});
      showTarget();
    }
  });
}

/* 7. 404: "LOST IN VOID" */
function transitionLostInVoid() {
  // Demo function for 404
  const errorEl = document.createElement('div');
  errorEl.innerHTML = `
    <div id="voidPage" style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;color:#fff;">
      <h1 style="font-size:4rem;text-shadow:0 0 20px #7c3aed;">404 - LOST IN VOID</h1>
      <button id="btnHelp" class="btn-primary" style="margin-top:2rem;">SIGNAL FOR HELP</button>
    </div>
  `;
  document.body.appendChild(errorEl);
  
  gsap.to(S.baseCam, {x: 1000, y: 1000, z: 1000, duration: 2, ease: 'power2.inOut'});
  
  document.getElementById('btnHelp').addEventListener('click', () => {
    errorEl.remove();
    // Return to Origin
    S.warping = true;
    executeTransition(4, 0, () => { S.warping = false; });
  });
}
window.transitionLostInVoid = transitionLostInVoid;
