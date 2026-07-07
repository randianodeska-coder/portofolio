with open('index.html', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'btn-ghost' in l or 'margin-top:50px' in l:
        print(i+1, l.rstrip()[:100])
