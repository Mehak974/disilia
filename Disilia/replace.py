"""
replace.py  –  Sweep all Disilia templates to the new light theme.

Old palette:        New palette:
  bg-dark             bg-cream
  text-dark           text-charcoal
  bg-slate            bg-parchment
  text-slate          text-muted
  text-gold           text-gold       (kept, but new hex in config)
  bg-gold             bg-gold         (kept)
  text-gray-900       text-charcoal

Also patches base.html body / glass-nav inline styles.
"""

import glob, re

TEMPLATE_GLOB = 'templates/**/*.html'

# (old_pattern, replacement)  – applied in order
CLASS_SUBS = [
    # dark  → charcoal (text/bg/border etc)
    (r'\b(text|bg|border|ring|shadow|from|to|via|divide)-dark\b', r'\1-charcoal'),
    # slate → parchment or muted depending on context
    (r'\b(bg|border|from|to|via|divide)-slate\b',                  r'\1-parchment'),
    (r'\btext-slate\b',                                             r'text-muted'),
    # gray-900 / gray-800 → charcoal
    (r'\btext-gray-900\b',                                          r'text-charcoal'),
    (r'\bbg-gray-900\b',                                            r'bg-charcoal'),
    # gray-800 border → lighter
    (r'\bborder-gray-800\b',                                        r'border-gold/20'),
    # gray-400/500 text → muted
    (r'\btext-gray-400\b',                                          r'text-muted'),
    (r'\btext-gray-500\b',                                          r'text-muted'),
    # white headings on dark → charcoal
    (r'\btext-white\b',                                             r'text-charcoal'),
    # gray-200 body text
    (r'\btext-gray-200\b',                                          r'text-charcoal'),
]

files = glob.glob(TEMPLATE_GLOB, recursive=True)
changed = 0

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, replacement in CLASS_SUBS:
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        changed += 1
        print(f'  Updated: {filepath}')

print(f'\nDone – {changed} file(s) updated.')
