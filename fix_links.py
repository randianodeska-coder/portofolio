import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove all the misplaced divs that were inserted outside of sections
pattern = re.compile(r'<div style="text-align:center; margin-top:50px; padding-bottom:50px;"><a href="[^"]+" class="btn-ghost">[^<]+</a></div>\n\s*')
content = pattern.sub('', content)

# 2. Add the next links INSIDE the sections, right before the closing </section> tag.
# Let's define a mapping of section IDs to the NEXT section ID and label.
sections = [
    ("hero", "about", "THE NATION"),
    ("about", "philosophy", "PHILOSOPHY"),
    ("philosophy", "vision-mission", "VISION & MISSION"),
    ("vision-mission", "values", "CORE VALUES"),
    ("values", "services", "THE ECOSYSTEM"),
    ("services", "why-rnvn", "WHY RNVN"),
    ("why-rnvn", "quote-section", "THE MIND"),
    ("quote-section", "contact", "JOIN THE NATION")
]

for current_id, next_id, next_label in sections:
    # Find the closing tag of the current section
    # The regex looks for the specific section start, any content, and then its </section>
    # Since regex with .*? can be tricky with HTML, it's safer to just split or use a reliable method.
    
    # We can search for the end of the .sec-inner div inside the section, or just right before </section>
    # The easiest way:
    # We will inject the Next button just before `</section>` for that specific id.
    
    # A robust way is to find `<section id="current_id"` and then the FIRST `</section>` after it.
    start_str = f'<section id="{current_id}"'
    start_idx = content.find(start_str)
    if start_idx != -1:
        end_idx = content.find('</section>', start_idx)
        if end_idx != -1:
            # We want to insert it inside, but maybe inside sec-inner if possible?
            # Actually, just before </section> is fine as long as we style it properly.
            # Let's put it right before </section>.
            # Wait, for the contact section, <footer> is inside it. We should put it before <footer>.
            
            insert_str = f'\n    <div style="text-align:center; margin-top:50px; padding-bottom:50px; width:100%; position:relative; z-index:50;"><a href="#{next_id}" class="btn-ghost">NEXT: {next_label} ↓</a></div>\n  '
            
            if current_id == "contact":
                # Contact doesn't really need a next link (it's the last page).
                continue
                
            if current_id == "hero":
                # For hero, we already have a button "START YOUR VISION", we can just add this at the bottom
                # Actually hero has `<div class="hero-actions">`. Let's just put it at the very bottom of hero content.
                content = content[:end_idx] + insert_str + content[end_idx:]
            else:
                content = content[:end_idx] + insert_str + content[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed next links positioning")
