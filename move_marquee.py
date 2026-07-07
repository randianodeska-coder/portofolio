import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the marquee block
start_marquee = content.find('<!-- MARQUEE -->')
end_marquee = content.find('  <!-- TENTANG RNVN -->')

if start_marquee != -1 and end_marquee != -1:
    marquee_block = content[start_marquee:end_marquee]
    # Remove it from the current position
    content = content[:start_marquee] + content[end_marquee:]
    
    # Place it inside the hero section, before the "NEXT: THE NATION" div
    # So the next div should be below the marquee
    next_div_str = '<div style="text-align:center; margin-top:50px; padding-bottom:50px; width:100%; position:relative; z-index:50;"><a href="#about" class="btn-ghost">NEXT: THE NATION ↓</a></div>'
    
    if next_div_str in content:
        content = content.replace(next_div_str, marquee_block + '\n    ' + next_div_str)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Marquee moved inside hero section")
