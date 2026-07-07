import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Navigation Links
nav_old = '''      <nav class="desktop-nav" id="mainNav">
        <ul class="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#portfolio">Work</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>'''
nav_new = '''      <nav class="desktop-nav" id="mainNav">
        <ul class="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#about">Nation</a></li>
          <li><a href="#philosophy">Philosophy</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Join</a></li>
        </ul>
      </nav>'''
# Actually wait, they have #skills and #portfolio as IDs. 
# Let's keep the IDs as #skills and #portfolio but change the text.
nav_new_correct = '''      <nav class="desktop-nav" id="mainNav">
        <ul class="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#about">Nation</a></li>
          <li><a href="#philosophy">Philosophy</a></li>
          <li><a href="#skills">Values</a></li>
          <li><a href="#portfolio">Services</a></li>
          <li><a href="#contact">Join</a></li>
        </ul>
      </nav>'''
content = content.replace(nav_old, nav_new_correct)

# 2. Update section tags
content = content.replace('// 02 BRAND VALUES', '// 04 BRAND VALUES')
content = content.replace('// 03 OUR SERVICES', '// 05 OUR SERVICES')
content = content.replace('// 04 CONTACT', '// 06 CONTACT')

# 3. Add NEXT links if they don't exist
def insert_next_link(content, section_id, next_id, label):
    end_tag = '</section>'
    start_idx = content.find(f'<section id="{section_id}"')
    if start_idx != -1:
        end_idx = content.find(end_tag, start_idx)
        if end_idx != -1:
            next_link = f'\n    <div style="text-align:center; margin-top:50px; padding-bottom:50px; width:100%; position:relative; z-index:50;"><a href="#{next_id}" class="btn-ghost">NEXT: {label} ↓</a></div>\n  '
            # only add if it's not already there
            if next_link.strip() not in content[start_idx:end_idx+50]:
                content = content[:end_idx] + next_link + content[end_idx:]
    return content

content = insert_next_link(content, 'hero', 'about', 'THE NATION')
content = insert_next_link(content, 'about', 'philosophy', 'PHILOSOPHY')
content = insert_next_link(content, 'skills', 'portfolio', 'OUR SERVICES')
content = insert_next_link(content, 'portfolio', 'contact', 'CONTACT')

# 4. Insert Philosophy and Vision-Mission
new_sections = '''
  <!-- FILOSOFI -->
  <section id="philosophy" class="section sec-pad sec-dark" data-3d-scene="solar-system">
    <div class="sec-inner text-center">
      <div class="sec-tag" style="justify-content: center;">// 02 PHILOSOPHY</div>
      <h2 class="sec-title reveal">THINK <span class="accent-text">BEYOND LIMITS.</span></h2>
      <p class="sec-body reveal" style="margin: 0 auto 15px auto;">Di dalam setiap manusia terdapat alam semesta yang penuh kemungkinan.</p>
      <p class="sec-body reveal" style="margin: 0 auto 40px auto;">Planet-planet yang mengorbit di dalam identitas visual RNVN melambangkan bahwa kreativitas, ide, dan visi tidak memiliki batas. Semua inovasi besar yang pernah mengubah dunia lahir dari satu tempat yang sama—pikiran manusia.</p>
      <p class="sec-body reveal" style="margin: 0 auto 40px auto;">RNVN percaya bahwa batas terbesar bukanlah dunia di sekitar kita, melainkan cara kita memandang kemungkinan. Karena itu kami mengusung filosofi:</p>
      <div class="reveal" style="padding: 40px; border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 12px; background: rgba(18, 5, 36, 0.5); position: relative; overflow: hidden; margin-top: 40px;">
        <h3 style="font-family: var(--font-body); font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; font-style: italic; background: linear-gradient(90deg, var(--cyan), var(--violet-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          "The Universe Doesn't Exist Above You.<br>It Exists Within You."
        </h3>
      </div>
    </div>
    <div style="text-align:center; margin-top:50px; padding-bottom:50px; width:100%; position:relative; z-index:50;"><a href="#vision-mission" class="btn-ghost">NEXT: VISION & MISSION ↓</a></div>
  </section>

  <!-- VISI & MISI -->
  <section id="vision-mission" class="section sec-pad" data-3d-scene="vision-mission">
    <div class="sec-inner">
      <div class="sec-tag">// 03 DIRECTION</div>
      <div class="contact-grid">
        <div class="contact-left">
          <h2 class="sec-title reveal">OUR <span class="accent-text">VISION.</span></h2>
          <p class="sec-body reveal">Menjadi <em>creative ecosystem</em> yang menghubungkan desain, teknologi, fashion, dan inovasi untuk menciptakan karya yang memberi dampak positif bagi individu, bisnis, dan komunitas di tingkat nasional hingga global.</p>
        </div>
        <div class="contact-right">
          <h2 class="sec-title reveal">OUR <span class="accent-text">MISSION.</span></h2>
          <ul class="sec-body reveal" style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 1rem;"><span style="color: var(--cyan); margin-right: 10px;">✦</span> Menghasilkan produk dan layanan dengan kualitas premium.</li>
            <li style="margin-bottom: 1rem;"><span style="color: var(--cyan); margin-right: 10px;">✦</span> Mengembangkan solusi kreatif berbasis desain dan teknologi.</li>
            <li style="margin-bottom: 1rem;"><span style="color: var(--cyan); margin-right: 10px;">✦</span> Memberdayakan UMKM, kreator, dan bisnis lokal melalui branding yang kuat.</li>
            <li style="margin-bottom: 1rem;"><span style="color: var(--cyan); margin-right: 10px;">✦</span> Terus berinovasi mengikuti perkembangan teknologi, AI, dan industri kreatif.</li>
            <li style="margin-bottom: 1rem;"><span style="color: var(--cyan); margin-right: 10px;">✦</span> Membangun komunitas yang tumbuh bersama dalam semangat kolaborasi dan kreativitas.</li>
          </ul>
        </div>
      </div>
    </div>
    <div style="text-align:center; margin-top:50px; padding-bottom:50px; width:100%; position:relative; z-index:50;"><a href="#skills" class="btn-ghost">NEXT: BRAND VALUES ↓</a></div>
  </section>
'''

# insert new sections between about and skills
if 'id="philosophy"' not in content:
    target = '  <!-- NILAI BRAND -->'
    content = content.replace(target, new_sections + '\n' + target)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html")
