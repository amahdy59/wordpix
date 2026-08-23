# -*- coding: utf-8 -*-
import re

def get_sections(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    return re.findall(r'<frame id="([^"]+)" name="section-([^"]+)"', content)

print("Post Office sections:", get_sections("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2623/output.txt"))
print("Zoo sections:", get_sections("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2627/output.txt"))
