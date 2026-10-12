# WordPix Video Production & Subtitles Guide

This guide explains how to use the generated listening scenario audio assets, timecoded subtitle files, and metadata manifests for video creation, transcript extraction, and automated content workflows.

---

## 1. Directory Structure

All audio, subtitles, and individual dialogue clips are organized systematically by Unit ID:

```
assets/audio/scenarios/
  ├── [unit-id]/
  │   ├── [lesson-id]_full.mp3    # Master mixed audio scenario (30s - 50s)
  │   ├── [lesson-id].srt         # SubRip timecoded subtitles (for Premiere, CapCut, DaVinci)
  │   ├── [lesson-id].vtt         # WebVTT timecoded subtitles (for HTML5 <video> / <track>)
  │   └── [lesson-id]/            # Individual isolated speaker line clips
  │       ├── 01_layla_...mp3
  │       ├── 02_hana_...mp3
  │       ├── 03_tariq_...mp3
  │       ├── 04_omar_...mp3
  │       └── 05_adam_...mp3
```

---

## 2. Character Cast & Voice Profiles

All dialogues feature a consistent 5-character ensemble:

| Character | Gender |   Accent   | Role                                  | ElevenLabs Voice ID    | Voice Name |
| :-------- | :----: | :--------: | :------------------------------------ | :--------------------- | :--------- |
| **Layla** | Female |  British   | Senior Educator / Mentor              | `Xb7hH8MSUJpSbSDYk0k2` | Alice      |
| **Hana**  | Female |  American  | Inquisitive Researcher / Explorer     | `cgSgspJ2msm6clMCkdW9` | Jessica    |
| **Tariq** |  Male  |  British   | Elder Mentor / Brother                | `JBFqnCBsd6RMkjVDRZzb` | George     |
| **Adam**  |  Male  |  American  | Inquisitive Scholar / Younger Brother | `bIHbv24MWmeRgasZH58o` | Will       |
| **Omar**  |  Male  | Australian | Knowledgeable Artisan / Medic         | `IKne3meq5aSn9XLyUdCD` | Charlie    |

---

## 3. Subtitle & Transcript Files

### SubRip (`.srt`)

Located directly alongside each scenario:
`assets/audio/scenarios/<unit_id>/<lesson_id>.srt`

- Import directly into **Premiere Pro**, **DaVinci Resolve**, **CapCut**, **Final Cut Pro**, or **Avid**.
- Includes the speaker tag (e.g. `[Layla]: ...`) for easy character caption styling.

### WebVTT (`.vtt`)

Located at:
`assets/audio/scenarios/<unit_id>/<lesson_id>.vtt`

- Ready for web video players using `<track kind="subtitles" src="..." srclang="en">`.
- Uses standard voice tags (e.g. `<v Layla>...</v>`).

---

## 4. Programmatic Manifest (`docs/VIDEO_AND_TRANSCRIPT_MANIFEST.json`)

A single JSON document indexing all lessons with structured metadata:

```json
{
  "unitId": "money-currency",
  "unitName": "Money & Currency",
  "cefr": "A1",
  "lessonId": "money-currency-1",
  "lessonName": "Money & Currency 1",
  "titleEn": "Coins, Currencies & Bank Accounts",
  "titleAr": "العملات المعدنية والعملات العالمية والحسابات البنكية",
  "totalDurationSeconds": 41.3,
  "masterAudioRelative": "assets/audio/scenarios/money-currency/money-currency-1_full.mp3",
  "srtRelative": "assets/audio/scenarios/money-currency/money-currency-1.srt",
  "vttRelative": "assets/audio/scenarios/money-currency/money-currency-1.vtt",
  "targetWords": ["coin", "bill", "penny", "nickel", ...],
  "lines": [
    {
      "index": 1,
      "lineId": "01_layla_everyday_money",
      "speaker": "Layla",
      "voiceId": "Xb7hH8MSUJpSbSDYk0k2",
      "text": "When we live and work abroad, we use different coins, paper bills, and bank services.",
      "startSeconds": 0.0,
      "endSeconds": 5.7,
      "durationSeconds": 5.7,
      "timecodeSRT": "00:00:00,000 --> 00:00:05,700",
      "clipRelativePath": "assets/audio/scenarios/money-currency/money-currency-1/01_layla_everyday_money.mp3"
    }
  ]
}
```

---

## 5. Automated Video Generation Pipeline

To automate video creation with FFmpeg or Python (MoviePy/Remotion):

1. **Background Visuals**: Pull thematic images/slides based on `targetWords` and `titleEn`.
2. **Audio Track**: Use `masterAudioRelative` or stitch `clipRelativePath` files.
3. **Subtitles / Captions**: Burn in subtitles using FFmpeg:
   ```bash
   ffmpeg -loop 1 -i background.jpg -i scenario_full.mp3 -vf "subtitles=scenario.srt:force_style='FontSize=24,PrimaryColour=&HFFFFFF&'" -c:v libx264 -c:a aac -shortest output.mp4
   ```
4. **Character Avatars**: Display the speaking character's avatar based on `lines[i].speaker` during `[startSeconds, endSeconds]`.
