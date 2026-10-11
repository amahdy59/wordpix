import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

export function buildListeningPlayer() {
  const trackerJsonPath = path.join(ROOT_DIR, "docs", "LISTENING_SCENARIOS_TRACKER.json");
  if (!fs.existsSync(trackerJsonPath)) {
    console.error("No tracker JSON found at", trackerJsonPath);
    return;
  }

  const tracker = JSON.parse(fs.readFileSync(trackerJsonPath, "utf8"));
  const outDir = path.join(ROOT_DIR, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const htmlPath = path.join(outDir, "listening_player.html");
  const publicHtmlPath = path.join(ROOT_DIR, "public", "listening-scenarios-player.html");

  const unitsList = Object.values(tracker.units);
  const totalCompleted = unitsList.reduce((acc, u) => acc + (u.completedLessons || 0), 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WordPix - Listening Scenarios Player (ElevenLabs v4)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --bg: #090d16;
      --card: #131b2e;
      --border: #232f48;
      --primary: #10b981;
    }
    body {
      background-color: var(--bg);
      color: #f1f5f9;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .custom-scroll::-webkit-scrollbar { width: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    .active-lesson { border-color: #38bdf8 !important; background-color: rgba(56, 189, 248, 0.08) !important; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">
  <div class="max-w-7xl mx-auto space-y-6">

    <!-- Top Banner -->
    <header class="bg-[#131b2e] border border-[#232f48] rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">Autonomous Pipeline Active</span>
          <span class="px-2.5 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">ElevenLabs v4 Master</span>
          <span class="px-2.5 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">72% Promo Rate</span>
          <span class="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">All-Male Respectful Cast</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">WordPix Listening Scenarios Studio</h1>
        <p class="text-slate-400 text-sm mt-1">Review live audio scenarios synthesized with Tariq (British), Adam (American), and Omar (Australian).</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <div class="text-xs text-slate-400">Completed Lessons</div>
          <div class="text-2xl font-black text-emerald-400" id="completedCount">${totalCompleted} Lessons</div>
          <div class="text-xs text-slate-500">Remaining Quota: ${tracker.quotaRemaining.toLocaleString()} chars</div>
        </div>
        <button onclick="location.reload()" class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer">
          🔄 Refresh Feed
        </button>
      </div>
    </header>

    <!-- Main Grid: Sidebar + Player -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Left Column: Lessons Directory (5 cols) -->
      <aside class="lg:col-span-5 space-y-4">
        <div class="bg-[#131b2e] border border-[#232f48] rounded-2xl p-4 shadow-lg">
          <h2 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Units &amp; Lessons</span>
            <span class="text-xs font-normal text-slate-400">${unitsList.length} Units Active</span>
          </h2>
          <div class="space-y-4 max-h-[75vh] overflow-y-auto custom-scroll pr-1" id="unitsAccordion">
            <!-- Units injected by JS -->
          </div>
        </div>
      </aside>

      <!-- Right Column: Interactive Player & Dialogue View (7 cols) -->
      <main class="lg:col-span-7 space-y-5">
        <div class="bg-[#131b2e] border border-[#232f48] rounded-2xl p-6 shadow-xl sticky top-6">
          <div id="playerView" class="space-y-6">
            <div class="text-center py-16 text-slate-500">
              <p class="text-lg font-semibold text-slate-400">Select a lesson from the left directory to listen and review.</p>
              <p class="text-xs mt-1 text-slate-500">Each scenario features 100% target vocabulary coverage and high expressive acting.</p>
            </div>
          </div>
        </div>
      </main>

    </div>

  </div>

  <script>
    const DATA = ${JSON.stringify(tracker, null, 2)};

    let currentLesson = null;
    let audioElem = new Audio();

    function renderSidebar() {
      const container = document.getElementById('unitsAccordion');
      container.innerHTML = '';

      Object.values(DATA.units).forEach((unit, uIdx) => {
        const unitCard = document.createElement('div');
        unitCard.className = 'border border-[#232f48] rounded-xl overflow-hidden bg-[#0d1424]';

        const unitHeader = document.createElement('div');
        unitHeader.className = 'px-4 py-3 bg-[#162035] flex items-center justify-between cursor-pointer border-b border-[#232f48]';
        unitHeader.innerHTML = \`
          <div>
            <div class="text-xs font-bold text-sky-400 uppercase tracking-wider">\${unit.cefr} &bull; \${unit.unitId}</div>
            <div class="text-sm font-extrabold text-white">\${unit.unitName}</div>
          </div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">\${unit.completedLessons}/\${unit.lessonCount} Done</span>
        \`;

        const lessonsList = document.createElement('div');
        lessonsList.className = 'divide-y divide-[#1e2a44] p-1';

        unit.lessons.forEach((lesson) => {
          const item = document.createElement('button');
          item.id = 'btn-' + lesson.id;
          item.className = 'w-full text-left p-3 rounded-lg hover:bg-slate-800/60 transition-all flex items-center justify-between gap-3 text-xs';
          item.onclick = () => selectLesson(lesson, item);
          item.innerHTML = \`
            <div class="truncate">
              <div class="font-bold text-slate-200 truncate">\${lesson.name}</div>
              <div class="text-slate-400 text-[11px] truncate">\${lesson.titleEn} (\${lesson.titleAr})</div>
            </div>
            <div class="shrink-0 text-right">
              <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">\${lesson.estSeconds}s</span>
            </div>
          \`;
          lessonsList.appendChild(item);
        });

        unitCard.appendChild(unitHeader);
        unitCard.appendChild(lessonsList);
        container.appendChild(unitCard);
      });
    }

    function selectLesson(lesson, btnElem) {
      currentLesson = lesson;
      document.querySelectorAll('.active-lesson').forEach(el => el.classList.remove('active-lesson'));
      if (btnElem) btnElem.classList.add('active-lesson');

      const fullAudioSrc = '../' + lesson.fullAudioRelative;

      const playerView = document.getElementById('playerView');
      playerView.innerHTML = \`
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 rounded-full">\${lesson.id}</span>
            <span class="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-full">100% Target Words</span>
            <span class="px-2 py-0.5 text-xs font-bold bg-slate-700 text-slate-300 rounded-full">Duration: ~\${lesson.estSeconds}s</span>
          </div>
          <h2 class="text-2xl font-black text-white">\${lesson.titleEn}</h2>
          <p class="text-emerald-400 font-arabic text-sm mt-0.5" dir="rtl">\${lesson.titleAr}</p>
        </div>

        <!-- Master Audio Player -->
        <div class="p-4 rounded-xl bg-[#0b101c] border border-[#232f48] space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="font-bold text-slate-300">Continuous Full Scenario (eleven_v4 Master)</span>
            <span class="font-mono text-emerald-400">\${(lesson.fullAudioBytes / 1024).toFixed(1)} KB</span>
          </div>
          <audio controls class="w-full h-10 rounded" src="\${fullAudioSrc}"></audio>
        </div>

        <!-- Target Vocabulary Badges -->
        <div>
          <div class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Target Words Covered (\${lesson.coveredWords.length}):</div>
          <div class="flex flex-wrap gap-1.5">
            \${lesson.coveredWords.map(w => \`<span class="px-2 py-1 bg-[#1a253c] border border-[#2a3a5c] text-sky-300 rounded-lg text-xs font-mono font-semibold">\${w}</span>\`).join('')}
          </div>
        </div>

        <!-- Line by Line Dialogue Script with Individual Playback -->
        <div>
          <div class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Dialogue Lines &amp; Lip-Sync Clips:</div>
          <div class="space-y-2.5">
            \${lesson.script.map((line, idx) => {
              const speakerColor = line.speaker === 'Tariq' ? 'text-purple-300 bg-purple-500/20 border-purple-500/30' : line.speaker === 'Adam' ? 'text-sky-300 bg-sky-500/20 border-sky-500/30' : 'text-amber-300 bg-amber-500/20 border-amber-500/30';
              const lineAudioSrc = '../assets/audio/scenarios/' + lesson.fullAudioRelative.split('/')[3] + '/' + lesson.id + '/' + line.id + '.mp3';
              return \`
                <div class="p-3.5 rounded-xl bg-[#0d1424] border border-[#232f48] flex items-start justify-between gap-3 hover:border-slate-600 transition-colors">
                  <div class="space-y-1 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded text-[11px] font-bold border \${speakerColor}">\${line.speaker}</span>
                      <span class="text-[10px] text-slate-500 font-mono">\${line.id}</span>
                    </div>
                    <p class="text-sm text-slate-200 leading-relaxed">"\${line.text}"</p>
                  </div>
                  <button onclick="playClip('\${lineAudioSrc}')" class="size-9 rounded-lg bg-slate-800 hover:bg-sky-600 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer" title="Play individual sentence">
                    ▶
                  </button>
                </div>
              \`;
            }).join('')}
          </div>
        </div>
      \`;
    }

    function playClip(url) {
      audioElem.src = url;
      audioElem.play();
    }

    renderSidebar();

    // Select first lesson by default if available
    const firstUnit = Object.values(DATA.units)[0];
    if (firstUnit && firstUnit.lessons.length > 0) {
      selectLesson(firstUnit.lessons[0], document.getElementById('btn-' + firstUnit.lessons[0].id));
    }
  </script>
</body>
</html>
`;

  fs.writeFileSync(htmlPath, html, "utf8");
  fs.writeFileSync(publicHtmlPath, html, "utf8");
  console.log(`Generated listening player at: ${htmlPath}`);
  console.log(`Also copied to public: ${publicHtmlPath}`);
  return htmlPath;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  buildListeningPlayer();
}
