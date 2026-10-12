import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

function formatTimecodeSRT(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function formatTimecodeVTT(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export function generateVideoAndSubtitlesManifest() {
  const trackerPath = path.join(ROOT_DIR, "docs", "LISTENING_SCENARIOS_TRACKER.json");
  if (!fs.existsSync(trackerPath)) {
    console.error("Tracker not found at", trackerPath);
    return;
  }

  const tracker = JSON.parse(fs.readFileSync(trackerPath, "utf8"));
  const videoManifest = {
    generatedAt: new Date().toISOString(),
    totalUnits: Object.keys(tracker.units).length,
    totalLessons: 0,
    lessons: []
  };

  let totalSubtitleFiles = 0;

  for (const [unitId, unit] of Object.entries(tracker.units)) {
    for (const lesson of unit.lessons) {
      if (lesson.status !== "RECORDED") continue;

      videoManifest.totalLessons++;
      const unitDir = path.join(ROOT_DIR, "assets", "audio", "scenarios", unitId);
      const lessonClipsDir = path.join(unitDir, lesson.id);

      let currentOffset = 0;
      const timedLines = [];
      let srtContent = "";
      let vttContent = "WEBVTT\n\n";

      for (let i = 0; i < lesson.script.length; i++) {
        const line = lesson.script[i];
        const clipPath = path.join(lessonClipsDir, `${line.id}.mp3`);
        let duration = 3.5; // fallback
        if (fs.existsSync(clipPath)) {
          const stats = fs.statSync(clipPath);
          // 128kbps CBR MP3 is ~16,000 bytes/sec
          duration = Math.max(1.0, Math.round((stats.size / 16000) * 10) / 10);
        }

        const startSec = Math.round(currentOffset * 100) / 100;
        const endSec = Math.round((currentOffset + duration) * 100) / 100;

        const srtStart = formatTimecodeSRT(startSec);
        const srtEnd = formatTimecodeSRT(endSec);
        const vttStart = formatTimecodeVTT(startSec);
        const vttEnd = formatTimecodeVTT(endSec);

        srtContent += `${i + 1}\n${srtStart} --> ${srtEnd}\n[${line.speaker}]: ${line.text}\n\n`;
        vttContent += `${i + 1}\n${vttStart} --> ${vttEnd}\n<v ${line.speaker}>${line.text}\n\n`;

        timedLines.push({
          index: i + 1,
          lineId: line.id,
          speaker: line.speaker,
          voiceId: line.voiceId,
          text: line.text,
          startSeconds: startSec,
          endSeconds: endSec,
          durationSeconds: duration,
          timecodeSRT: `${srtStart} --> ${srtEnd}`,
          timecodeVTT: `${vttStart} --> ${vttEnd}`,
          clipRelativePath: `assets/audio/scenarios/${unitId}/${lesson.id}/${line.id}.mp3`
        });

        currentOffset += duration;
      }

      // Write .srt and .vtt
      const srtPath = path.join(unitDir, `${lesson.id}.srt`);
      const vttPath = path.join(unitDir, `${lesson.id}.vtt`);
      fs.writeFileSync(srtPath, srtContent.trim() + "\n", "utf8");
      fs.writeFileSync(vttPath, vttContent.trim() + "\n", "utf8");
      totalSubtitleFiles += 2;

      videoManifest.lessons.push({
        unitId,
        unitName: unit.unitName,
        cefr: unit.cefr,
        lessonId: lesson.id,
        lessonName: lesson.name,
        titleEn: lesson.titleEn,
        titleAr: lesson.titleAr,
        totalDurationSeconds: Math.round(currentOffset * 10) / 10,
        wordCount: lesson.wordCount,
        masterAudioRelative: lesson.fullAudioRelative,
        srtRelative: `assets/audio/scenarios/${unitId}/${lesson.id}.srt`,
        vttRelative: `assets/audio/scenarios/${unitId}/${lesson.id}.vtt`,
        targetWords: lesson.targetWords,
        lines: timedLines
      });
    }
  }

  const manifestPath = path.join(ROOT_DIR, "docs", "VIDEO_AND_TRANSCRIPT_MANIFEST.json");
  fs.writeFileSync(manifestPath, JSON.stringify(videoManifest, null, 2), "utf8");
  console.log(`✅ Generated Video & Subtitle Manifest: docs/VIDEO_AND_TRANSCRIPT_MANIFEST.json (${videoManifest.totalLessons} lessons)`);
  console.log(`✅ Created ${totalSubtitleFiles} subtitle files (.srt & .vtt) in assets/audio/scenarios/`);
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateVideoAndSubtitlesManifest();
}
