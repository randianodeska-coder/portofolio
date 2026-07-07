import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = """  <!-- TENTANG RNVN -->
  <section id="about" class="section sec-pad" data-3d-scene="about-planet">
    <div class="sec-inner">
      <div class="sec-tag">// 01 THE NATION</div>
      <div class="about-grid">
        <div class="about-left">
          <h2 class="sec-title reveal">MORE THAN A BRAND.<br><span class="accent-text">WE BUILD VISIONS.</span></h2>
          <p class="sec-body reveal">RNVN (Randi Vision Nation) dibangun di atas satu filosofi utama: perubahan besar selalu berawal dari sebuah visi.</p>
          <p class="sec-body reveal"><em>"Nation"</em> bagi kami bukan sekadar komunitas, melainkan sebuah pergerakan kolektif—menyatukan para visioner, inovator, dan kreator yang meyakini bahwa batas terbesar hanyalah imajinasi.</p>
          <p class="sec-body reveal">Kami hadir untuk menerjemahkan ide menjadi realitas. Membantu orang berpikir lebih jauh, berkarya lebih besar, dan berkembang tanpa batas.</p>
        </div>
        <div class="about-right">
          <div class="profile-frame reveal" style="border-radius: 50%;">
            <div class="profile-ring"></div>
            <div style="width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle at 30% 30%, var(--violet-light), var(--bg-deep)); z-index: 2; position: relative; border: 2px solid rgba(124, 58, 237, 0.4); overflow: hidden; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); color: var(--cyan); letter-spacing: 2px;">RNVN</div>
            <div class="profile-glow"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FILOSOFI -->
  <section id="philosophy" class="section sec-pad sec-dark" data-3d-scene="solar-system">
    <div class="sec-inner text-center">
      <div class="sec-tag" style="justify-content: center;">// 02 PHILOSOPHY</div>
      <h2 class="sec-title reveal">THINK <span class="accent-text">BEYOND LIMITS.</span></h2>
      <p class="sec-body reveal" style="margin: 0 auto 15px auto;">Di dalam diri setiap manusia, terbentang alam semesta dengan kemungkinan tak terhingga.</p>
      <p class="sec-body reveal" style="margin: 0 auto 40px auto;">Planet-planet yang mengorbit dalam identitas RNVN adalah simbol bahwa kreativitas, ide, dan visi tidak mengenal batas. Seluruh terobosan besar yang berhasil mengubah dunia selalu berawal dari satu titik singular: sebuah pikiran yang berani mendobrak batas.</p>
      <div class="reveal" style="padding: 40px; border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 12px; background: rgba(18, 5, 36, 0.5); position: relative; overflow: hidden; margin-top: 40px;">
        <h3 style="font-family: var(--font-body); font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; font-style: italic; background: linear-gradient(90deg, var(--cyan), var(--violet-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          "The Universe Doesn't Exist Above You.<br>It Exists Within You."
        </h3>
      </div>
    </div>
  </section>

  <!-- VISI & MISI -->
  <section id="vision-mission" class="section sec-pad" data-3d-scene="vision-mission">
    <div class="sec-inner">
      <div class="sec-tag">// 03 DIRECTION</div>
      <div class="about-grid" style="align-items: start;">
        <div>
          <h2 class="sec-title reveal">OUR <span class="accent-text">VISION.</span></h2>
          <p class="sec-body reveal">Menjadi <em>creative ecosystem</em> yang menghubungkan desain, teknologi, fashion, dan inovasi untuk menciptakan karya yang memberi dampak positif bagi individu, bisnis, dan komunitas di tingkat nasional hingga global.</p>
        </div>
        <div>
          <h2 class="sec-title reveal">OUR <span class="accent-text">MISSION.</span></h2>
          <ul style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.8; display: flex; flex-direction: column; gap: 15px;" class="reveal">
            <li><span style="color: var(--cyan); margin-right: 10px;">✦</span> Menghasilkan produk dan layanan dengan kualitas premium.</li>
            <li><span style="color: var(--cyan); margin-right: 10px;">✦</span> Mengembangkan solusi kreatif berbasis desain dan teknologi.</li>
            <li><span style="color: var(--cyan); margin-right: 10px;">✦</span> Memberdayakan UMKM, kreator, dan bisnis lokal melalui branding yang kuat.</li>
            <li><span style="color: var(--cyan); margin-right: 10px;">✦</span> Terus berinovasi mengikuti perkembangan teknologi, AI, dan industri kreatif.</li>
            <li><span style="color: var(--cyan); margin-right: 10px;">✦</span> Membangun komunitas yang tumbuh bersama dalam semangat kolaborasi dan kreativitas.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- NILAI BRAND -->
  <section id="values" class="section sec-pad sec-dark" data-3d-scene="brand-values">
    <div class="sec-inner">
      <div class="sec-tag" style="justify-content: center;">// 04 CORE VALUES</div>
      <h2 class="sec-title text-center reveal">BRAND <span class="accent-text">VALUES.</span></h2>
      <div class="skills-grid" style="margin-top: 50px;">
        <div class="skill-card reveal"><div class="skill-icon" style="color: #c084fc;">👁</div><h3>Vision</h3><p>Semua karya besar selalu dimulai dari sebuah visi.</p></div>
        <div class="skill-card reveal"><div class="skill-icon" style="color: #2dd4bf;">✦</div><h3>Creativity</h3><p>Kreativitas adalah bahasa universal yang mampu menciptakan perubahan.</p></div>
        <div class="skill-card reveal"><div class="skill-icon" style="color: #38bdf8;">⚡</div><h3>Innovation</h3><p>Terus berkembang melalui teknologi, AI, dan solusi modern.</p></div>
        <div class="skill-card reveal"><div class="skill-icon" style="color: #fbbf24;">💎</div><h3>Quality</h3><p>Kualitas bukan pilihan, tetapi standar dalam setiap proses.</p></div>
        <div class="skill-card reveal"><div class="skill-icon" style="color: #f87171;">🛡</div><h3>Integrity</h3><p>Kepercayaan dibangun melalui konsistensi, tanggung jawab, dan transparansi.</p></div>
      </div>
    </div>
  </section>

  <!-- LAYANAN -->
  <section id="services" class="section sec-pad" data-3d-scene="services-planets">
    <div class="sec-inner">
      <div class="sec-tag">// 05 WHAT WE DO</div>
      <h2 class="sec-title reveal">THE <span class="accent-text">ECOSYSTEM.</span></h2>
      <p class="sec-body reveal">Menghubungkan ide dengan realitas melalui berbagai layanan premium.</p>
      <div class="portfolio-grid" id="portfolioGrid">
        <div class="portfolio-card reveal" data-project="design" tabindex="0" role="button">
          <div class="card-num">01</div>
          <div class="card-img"><div style="width:100%; height:100%; background: linear-gradient(45deg, #4c1d95, #0891b2);"></div><div class="card-overlay"><span>View Detail</span></div></div>
          <div class="card-body"><span class="card-tag">CREATIVE DESIGN</span><h3>Visual Identity</h3><p>Logo, Branding, UI/UX, Social Media Design.</p></div>
        </div>
        <div class="portfolio-card reveal" data-project="printing" tabindex="0" role="button">
          <div class="card-num">02</div>
          <div class="card-img"><div style="width:100%; height:100%; background: linear-gradient(45deg, #120524, #22d3ee);"></div><div class="card-overlay"><span>View Detail</span></div></div>
          <div class="card-body"><span class="card-tag">PRINTING SOLUTIONS</span><h3>Premium Print</h3><p>Custom Apparel, Merchandise, UV Print, DTF.</p></div>
        </div>
        <div class="portfolio-card reveal" data-project="fashion" tabindex="0" role="button">
          <div class="card-num">03</div>
          <div class="card-img"><div style="width:100%; height:100%; background: linear-gradient(45deg, #000, #7c3aed);"></div><div class="card-overlay"><span>View Detail</span></div></div>
          <div class="card-body"><span class="card-tag">FASHION</span><h3>RNVN Wear</h3><p>Premium Streetwear Collection by RNVN.</p></div>
        </div>
        <div class="portfolio-card reveal" data-project="web" tabindex="0" role="button">
          <div class="card-num">04</div>
          <div class="card-img"><div style="width:100%; height:100%; background: linear-gradient(45deg, #060212, #67e8f9);"></div><div class="card-overlay"><span>View Detail</span></div></div>
          <div class="card-body"><span class="card-tag">WEBSITE DEV</span><h3>Digital Presence</h3><p>Landing Page, Company Profile, Portfolio.</p></div>
        </div>
        <div class="portfolio-card reveal" data-project="ai" tabindex="0" role="button">
          <div class="card-num">05</div>
          <div class="card-img"><div style="width:100%; height:100%; background: linear-gradient(45deg, #1a0b2e, #22d3ee);"></div><div class="card-overlay"><span>View Detail</span></div></div>
          <div class="card-body"><span class="card-tag">AI AUTOMATION</span><h3>Smart Solutions</h3><p>Chatbot, Workflow Automation, Productivity.</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- MENGAPA MEMILIH RNVN -->
  <section id="why-rnvn" class="section sec-pad sec-dark" data-3d-scene="galaxy-pullback">
    <div class="sec-inner text-center">
      <div class="sec-tag" style="justify-content: center;">// 06 WHY RNVN</div>
      <h2 class="sec-title reveal">BEYOND <span class="accent-text">EXPECTATIONS.</span></h2>
      <p class="sec-body reveal" style="margin: 0 auto 15px auto;">Kami percaya bahwa desain yang baik bukan hanya terlihat menarik, tetapi mampu menyampaikan identitas, membangun kepercayaan, dan menciptakan pengalaman yang berkesan.</p>
      <p class="sec-body reveal" style="margin: 0 auto 50px auto;">Setiap proyek dikerjakan dengan pendekatan strategis, memperhatikan detail, kualitas, dan tujuan jangka panjang.</p>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <h3 class="reveal" style="font-size: clamp(1.2rem, 3vw, 1.8rem); font-family: var(--font-body); font-weight: 400; color: var(--text-main);">Kami tidak sekadar merancang produk. <strong style="color: var(--cyan);">Kami memahat identitas.</strong></h3>
        <h3 class="reveal" style="font-size: clamp(1.2rem, 3vw, 1.8rem); font-family: var(--font-body); font-weight: 400; color: var(--text-main);">Kami tidak sekadar menyelesaikan pekerjaan. <strong style="color: var(--violet-light);">Kami mewujudkan visi.</strong></h3>
      </div>
    </div>
  </section>

  <!-- QUOTE -->
  <section id="quote-section" class="section sec-pad" style="align-items: center; justify-content: center; min-height: 100vh;" data-3d-scene="mind-explosion">
    <div class="sec-inner text-center">
      <h2 class="reveal" style="font-family: var(--font-display); font-size: clamp(2rem, 6vw, 5rem); line-height: 1.2; font-style: italic; letter-spacing: 2px;">
        "Every Great Creation<br>
        <span class="accent-text">Begins Inside the Mind."</span>
      </h2>
    </div>
  </section>

  <!-- CONTACT & PENUTUP -->
  <section id="contact" class="section sec-pad sec-dark" data-3d-scene="grand-finale">
    <div class="sec-inner">
      <div class="sec-tag">// 07 JOIN THE NATION</div>
      <div class="about-grid">
        <div>
          <h2 class="sec-title reveal">JOIN THE <span class="accent-text">VISION.</span></h2>
          <p class="sec-body reveal">RNVN bukan sekadar sebuah nama. RNVN adalah perjalanan untuk terus berkembang, menciptakan karya bermakna, dan membangun masa depan melalui kreativitas tanpa batas.</p>
          <p class="sec-body reveal">Kami mengundang Anda untuk menjadi bagian dari perjalanan ini. Karena setiap ide layak diwujudkan, dan setiap visi pantas menjadi kenyataan.</p>
          <h3 class="reveal" style="font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 2px; margin-top: 30px; color: var(--text-main);">RNVN — <span class="cyan">THINK BEYOND LIMITS.</span></h3>
          <div class="contact-info" style="margin-top: 40px; display: flex; flex-direction: column; gap: 20px;">
            <div class="reveal" style="display: flex; flex-direction: column;"><span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 5px;">WHATSAPP</span><a href="https://wa.me/628563122123" class="cyan" style="font-size: 1.2rem; font-weight: 500;">+62 856 3122 123</a></div>
            <div class="reveal" style="display: flex; flex-direction: column;"><span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 5px;">EMAIL</span><span style="font-size: 1.2rem;">randianodeska@gmail.com</span></div>
            <div class="reveal" style="display: flex; flex-direction: column;"><span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 5px;">INSTAGRAM</span><a href="https://www.instagram.com/randianodskptra_/" target="_blank" rel="noopener" class="cyan" style="font-size: 1.2rem; font-weight: 500;">@randianodskptra_</a></div>
          </div>
        </div>
        <div>
          <div class="reveal" style="padding: 40px; border: 1px solid rgba(34, 211, 238, 0.3); border-radius: 16px; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px); position: relative; overflow: hidden; box-shadow: 0 0 30px rgba(34, 211, 238, 0.1);">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 51%); background-size: 100% 4px; opacity: 0.3; pointer-events: none;"></div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan); letter-spacing: 3px; margin-bottom: 20px;">// INCOMING TRANSMISSION</div>
            <p style="font-family: var(--font-mono); font-size: 0.95rem; line-height: 1.8; color: #d1d5db;">
              Kami percaya bahwa dunia berubah karena keberanian seseorang untuk berpikir berbeda. Kami percaya bahwa kreativitas adalah kekuatan, teknologi adalah alat, dan visi adalah kompas yang mengarahkan masa depan.<br><br>
              RNVN hadir bukan hanya untuk menciptakan produk, tetapi untuk membangun identitas, menghubungkan ide dengan realitas, dan menginspirasi setiap individu agar berani melampaui batas pikirannya.<br><br>
              Kami tidak mengikuti tren. <strong style="color: var(--text-main);">Kami menciptakan arah.</strong><br>
              Kami tidak hanya membangun sebuah brand. <strong style="color: var(--cyan);">Kami membangun sebuah Nation.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
"""

# Regex to match from <!-- ABOUT --> down to just before <footer>
pattern = re.compile(r'<!-- ABOUT -->.*?<footer>', re.DOTALL)
result = pattern.sub(new_content + '\n    <footer>', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print("Updated index.html")
