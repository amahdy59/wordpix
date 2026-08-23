# -*- coding: utf-8 -*-
import json
import re

def parse_figma_metadata(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find sections
    # Match <frame id="..." name="section-..." ...>
    section_blocks = re.findall(r'<frame id="([^"]+)" name="section-([^"]+)"(.*?)<\/frame>\s*<\/frame>', content, re.DOTALL)
    
    sections = []
    for sec_id, sec_name, sec_content in section_blocks:
        topic_header_match = re.search(r'<text [^>]*name="([^"]+)" [^>]*\/>\s*<text [^>]*name="(\d+) items"', sec_content)
        topic_title = topic_header_match.group(1) if topic_header_match else sec_name.replace("-", " ").title()
        
        cards = re.findall(r'<frame id="([^"]+)" name="card-([^"]+)"[^>]*>\s*<rounded-rectangle id="([^"]+)" name="img"[^>]*\/>\s*<frame [^>]*>\s*<text [^>]*name="([^"]+)"', sec_content)
        
        items = []
        for c_id, c_name, img_id, lbl in cards:
            items.append({
                "id": c_name,
                "label": lbl,
                "cardNodeId": c_id,
                "imgNodeId": img_id,
                "topic": sec_name
            })
        
        sections.append({
            "sectionId": sec_name,
            "sectionTitle": topic_title,
            "items": items
        })
    
    all_items = [item for s in sections for item in s["items"]]
    return sections, all_items

fs_sections, fs_items = parse_figma_metadata("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2615/output.txt")
po_sections, po_items = parse_figma_metadata("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2623/output.txt")
zoo_sections, zoo_items = parse_figma_metadata("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2627/output.txt")

print(f"Fire Station: {len(fs_items)} items across {len(fs_sections)} topics")
print(f"Post Office: {len(po_items)} items across {len(po_sections)} topics")
print(f"Zoo: {len(zoo_items)} items across {len(zoo_sections)} topics")

curriculum_payload = {
    "fire-station": {"sections": fs_sections, "items": fs_items},
    "post-office": {"sections": po_sections, "items": po_items},
    "zoo": {"sections": zoo_sections, "items": zoo_items}
}

with open("next_3_lessons_raw.json", "w", encoding="utf-8") as f:
    json.dump(curriculum_payload, f, indent=2, ensure_ascii=False)

print("Parsed next 3 lessons successfully!")
