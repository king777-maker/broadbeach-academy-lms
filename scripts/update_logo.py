import base64
import io
import os
from PIL import Image

logo_path = r'C:/Users/ADMIN/.gemini/antigravity/brain/a79ad851-939c-45f5-b470-c4cee63582ee/perfect_logo.png'
logo = Image.open(logo_path)
w, h = logo.size

# Generate optimized PNG bytes
buf = io.BytesIO()
logo.save(buf, format='PNG', optimize=True)
png_bytes = buf.getvalue()
b64_str = base64.b64encode(png_bytes).decode('ascii')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" fill="none">
  <image href="data:image/png;base64,{b64_str}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet" />
</svg>
'''

targets = [
    r'C:\Users\ADMIN\Desktop\bb_exp-2.0\src\assets\brand-logo.png',
    r'C:\Users\ADMIN\Desktop\bb_exp-2.0\public\brand-logo.png',
    r'C:\Users\ADMIN\Desktop\bb_exp-2.0\public\assets\brand-logo.png',
    r'C:\Users\ADMIN\Desktop\bb_exp-2.0\public\logo.png',
    r'C:\Users\ADMIN\Desktop\LMS-test\src\assets\brand-logo.png',
    r'C:\Users\ADMIN\Desktop\LMS-test\public\brand-logo.png',
    r'C:\Users\ADMIN\Desktop\LMS-test\public\assets\brand-logo.png',
    r'C:\Users\ADMIN\Desktop\LMS-test\public\logo.png',
]

for t in targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    with open(t, 'wb') as f:
        f.write(png_bytes)
    print('Updated PNG:', t)

svg_targets = [
    r'C:\Users\ADMIN\Desktop\bb_exp-2.0\src\assets\brand-logo.svg',
    r'C:\Users\ADMIN\Desktop\bb_exp-2.0\public\brand-logo.svg',
    r'C:\Users\ADMIN\Desktop\bb_exp-2.0\public\assets\brand-logo.svg',
    r'C:\Users\ADMIN\Desktop\LMS-test\src\assets\brand-logo.svg',
    r'C:\Users\ADMIN\Desktop\LMS-test\public\brand-logo.svg',
    r'C:\Users\ADMIN\Desktop\LMS-test\public\assets\brand-logo.svg',
]

for s in svg_targets:
    os.makedirs(os.path.dirname(s), exist_ok=True)
    with open(s, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print('Updated SVG:', s)

# Update webp targets
logo.save(r'C:\Users\ADMIN\Desktop\bb_exp-2.0\public\logo.webp', 'WEBP')
logo.save(r'C:\Users\ADMIN\Desktop\LMS-test\public\logo.webp', 'WEBP')
print('Updated WEBP targets')
print('All logo files successfully updated!')

