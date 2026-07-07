with open('index.html', encoding='utf-8') as f:
    content = f.read()

# Remove remaining NEXT buttons
import re
# Remove all "NEXT" nav divs that were manually added
content = re.sub(
    r'\s*<div style="text-align:center;[^"]*margin-top:50px[^>]*>.*?</div>\s*(?=</section>)',
    '\n  ',
    content,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up NEXT buttons")
