with open('galaxy-engine.js', encoding='utf-8') as f:
    content = f.read()

checks = [
    ('goTo(idx)', 'SPA navigation call'),
    ("classList.add('active')", 'Section .active add'),
    ("classList.remove('active')", 'Section .active remove'),
    ('initModal', 'Modal init present'),
    ('initUI', 'initUI present'),
]

for term, label in checks:
    count = content.count(term)
    print(f'{label}: found {count}x')

print('\nTotal lines:', len(content.splitlines()))
print('\n--- galaxy-scroll.js check ---')
with open('galaxy-scroll.js', encoding='utf-8') as f:
    sc = f.read()
print('Lines:', len(sc.splitlines()))
print('scrollToSection func:', 'scrollToSection' in sc)
print('buildDotNav func:', 'buildDotNav' in sc)
print('RNVN_SCROLL export:', 'RNVN_SCROLL' in sc)
