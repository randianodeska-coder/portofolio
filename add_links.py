import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Next links
content = content.replace('<!-- FILOSOFI -->', '<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="#philosophy" class="btn-ghost">NEXT: PHILOSOPHY ↓</a></div>\n  <!-- FILOSOFI -->')
content = content.replace('<!-- VISI & MISI -->', '<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="#vision-mission" class="btn-ghost">NEXT: VISION & MISSION ↓</a></div>\n  <!-- VISI & MISI -->')
content = content.replace('<!-- NILAI BRAND -->', '<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="#values" class="btn-ghost">NEXT: CORE VALUES ↓</a></div>\n  <!-- NILAI BRAND -->')
content = content.replace('<!-- LAYANAN -->', '<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="#services" class="btn-ghost">NEXT: THE ECOSYSTEM ↓</a></div>\n  <!-- LAYANAN -->')
content = content.replace('<!-- MENGAPA MEMILIH RNVN -->', '<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="#why-rnvn" class="btn-ghost">NEXT: WHY RNVN ↓</a></div>\n  <!-- MENGAPA MEMILIH RNVN -->')
content = content.replace('<!-- QUOTE -->', '<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="#quote-section" class="btn-ghost">NEXT: THE MIND ↓</a></div>\n  <!-- QUOTE -->')
content = content.replace('<!-- CONTACT & PENUTUP -->', '<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="#contact" class="btn-ghost">NEXT: JOIN THE NATION ↓</a></div>\n  <!-- CONTACT & PENUTUP -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added next links")
