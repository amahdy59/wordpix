# -*- coding: utf-8 -*-
import json
import re

def parse_full_document(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all sections: <frame id="..." name="section-([^"]+)" ...>
    section_matches = list(re.finditer(r'<frame id="([^"]+)" name="section-([^"]+)"', content))
    sections = []
    
    for i, m in enumerate(section_matches):
        sec_id = m.group(1)
        sec_name = m.group(2)
        start_idx = m.start()
        end_idx = section_matches[i+1].start() if i+1 < len(section_matches) else len(content)
        sec_content = content[start_idx:end_idx]
        
        # Extract title from topic-header
        title_m = re.search(r'<frame [^>]*name="topic-header"[^>]*>\s*<text [^>]*name="([^"]+)"', sec_content)
        topic_title = title_m.group(1) if title_m else sec_name.replace("-", " ").title()
        
        # Extract all cards in this section
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

fs_sections, fs_items = parse_full_document("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2615/output.txt")
po_sections, po_items = parse_full_document("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2623/output.txt")
zoo_sections, zoo_items = parse_full_document("C:/Users/AhmedMahdy/.gemini/antigravity/brain/a1ce7c1a-95a6-4c23-b24f-006abfd27a89/.system_generated/steps/2627/output.txt")

print(f"Fire Station: {len(fs_items)} items across {len(fs_sections)} topics:")
for s in fs_sections:
    print(f"  - {s['sectionTitle']} ({s['sectionId']}): {len(s['items'])} items")

print(f"\nPost Office: {len(po_items)} items across {len(po_sections)} topics:")
for s in po_sections:
    print(f"  - {s['sectionTitle']} ({s['sectionId']}): {len(s['items'])} items")

print(f"\nZoo: {len(zoo_items)} items across {len(zoo_sections)} topics:")
for s in zoo_sections:
    print(f"  - {s['sectionTitle']} ({s['sectionId']}): {len(s['items'])} items")

curriculum_payload = {
    "fire-station": {"sections": fs_sections, "items": fs_items},
    "post-office": {"sections": po_sections, "items": po_items},
    "zoo": {"sections": zoo_sections, "items": zoo_items}
}

with open("next_3_lessons_full.json", "w", encoding="utf-8") as f:
    json.dump(curriculum_payload, f, indent=2, ensure_ascii=False)

