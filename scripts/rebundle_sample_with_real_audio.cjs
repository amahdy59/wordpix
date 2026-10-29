const fs = require('fs');
const path = require('path');

const audioDir = path.resolve('assets/samples/audio');
const files = [
  '01_tariq_alarm.mp3',
  '02_adam_nightstand.mp3',
  '03_tariq_lamp.mp3',
  '04_adam_blanket.mp3',
  '05_tariq_wardrobe.mp3',
  '06_adam_resolution.mp3'
];

const dialogueBase64 = {};
for (const f of files) {
  const buf = fs.readFileSync(path.join(audioDir, f));
  dialogueBase64[f.replace('.mp3', '')] = buf.toString('base64');
}

const wordAudioBase64 = JSON.parse(
  fs.readFileSync('C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/word_audio_base64.json', 'utf8')
);
const imageBase64 = fs.readFileSync('C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/bedroom_image_base64.txt', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WordPix - Lesson Video & Scenario (Men-Only / ElevenLabs Master)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #10b981;
      --accent: #38bdf8;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .video-viewport {
      position: relative;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      background: #020617;
      border-radius: 14px;
    }
    .scene-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.3s cubic-bezier(0.25, 1, 0.5, 1);
      will-change: transform;
    }
    .focal-clock { transform: scale(1.48) translate(-14%, 8%); }
    .focal-nightstand { transform: scale(1.38) translate(-10%, 14%); }
    .focal-bed { transform: scale(1.28) translate(0%, 5%); }
    .focal-wardrobe { transform: scale(1.42) translate(20%, -6%); }
    .focal-overview { transform: scale(1.0) translate(0%, 0%); }

    button:focus-visible {
      outline: 3px solid #38bdf8;
      outline-offset: 2px;
    }
  </style>
</head>
<body class="p-4 md:p-8 antialiased">
  <div class="max-w-4xl mx-auto space-y-6">

    <!-- Header & Cultural Standards Overview -->
    <header class="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span class="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">Pre-A1 Starter</span>
            <span class="px-2.5 py-0.5 text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full">Unit 006: The Bedroom</span>
            <span class="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">All-Male Cast (Islamic Tradition)</span>
            <span class="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full">ElevenLabs Master Audio</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Scenario: The Morning Rush (البحث عن الساعة)</h1>
          <p class="text-slate-400 text-sm mt-1">Characters: <strong class="text-purple-400">Tariq</strong> (Older brother / British accent) & <strong class="text-sky-400">Adam</strong> (Younger brother / American accent).</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-slate-400">Target Duration</div>
          <div class="text-lg font-bold text-emerald-400">28 Seconds</div>
          <div class="text-xs text-slate-500">6 Dialogue Clips Synthesized</div>
        </div>
      </div>
    </header>

    <!-- Interactive Multimodal Player -->
    <main class="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          Scenario Player (ElevenLabs Multi-Speaker Voice)
        </h2>
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-slate-400">Status:</span>
          <span id="audio-status" class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">Ready to Play</span>
        </div>
      </div>

      <!-- Video Viewport -->
      <div class="video-viewport border border-slate-700 shadow-inner">
        <img id="scene-bg" src="data:image/webp;base64,${imageBase64}" alt="Illustrated bedroom scene" class="scene-img focal-overview" />

        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/40 pointer-events-none"></div>

        <!-- Speaker Indicator Top Left -->
        <div id="speaker-badge" class="absolute top-4 left-4 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3.5 py-2 rounded-xl transition-all duration-300 opacity-0 transform -translate-y-2">
          <div id="speaker-avatar" class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md"></div>
          <div>
            <div id="speaker-name" class="text-xs font-bold text-white tracking-wide"></div>
            <div id="speaker-status" class="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Spoken via ElevenLabs
            </div>
          </div>
        </div>

        <!-- Target Word Flash Overlay (Right Top) -->
        <div id="word-badge" class="absolute top-4 right-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/60 p-3 rounded-xl transition-all duration-300 opacity-0 transform translate-x-2 max-w-[220px] shadow-xl">
          <div class="flex items-center justify-between gap-2">
            <span id="badge-word" class="text-sm font-black text-emerald-300"></span>
            <span id="badge-phonetic" class="text-xs text-emerald-400/80 font-mono"></span>
          </div>
          <div id="badge-arabic" class="text-xs text-emerald-200 mt-1 font-arabic" dir="rtl"></div>
          <div id="badge-desc" class="text-[11px] text-slate-300 mt-1 leading-snug"></div>
        </div>

        <!-- Sound Effect Alert -->
        <div id="sfx-indicator" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-sky-400/50 text-sky-300 text-xs px-4 py-2 rounded-full font-bold shadow-lg transition-opacity duration-300 opacity-0 pointer-events-none flex items-center gap-2">
          <span>🔊</span> <span id="sfx-text"></span>
        </div>

        <!-- Subtitle Overlay -->
        <div class="absolute bottom-4 left-4 right-4 text-center">
          <div id="subtitles-en" class="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] transition-all min-h-[32px]">
            Press &ldquo;Play Scenario&rdquo; to hear authentic ElevenLabs audio with male voices.
          </div>
          <div id="subtitles-ar" class="text-sm md:text-base text-amber-300/95 font-medium font-arabic mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" dir="rtl">
            اضغط على &ldquo;تشغيل المشهد&rdquo; للاستماع إلى الأداء الصوتي الحقيقي لشخصيتي طارق وآدم.
          </div>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-700/60">
        <div class="flex items-center gap-3">
          <button id="play-btn" class="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
            <svg id="play-icon" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z"/></svg>
            <span id="play-label">Play Scenario</span>
          </button>
          <button id="restart-btn" class="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-2 border border-slate-700 active:scale-95 transition-all">
            Replay
          </button>
        </div>

        <div class="flex-1 min-w-[200px] flex items-center gap-3">
          <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div id="progress-bar" class="bg-emerald-400 h-full w-0 transition-all duration-300"></div>
          </div>
          <span id="time-display" class="text-xs font-mono text-slate-400 min-w-[40px]">00:00</span>
        </div>

        <div class="flex items-center gap-2">
          <button id="toggle-quiz-btn" class="h-11 px-4 text-xs font-bold rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 transition-colors">
            Quiz Check
          </button>
        </div>
      </div>
    </main>

    <!-- Target Word Deck (ElevenLabs Clips) -->
    <section class="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-xl space-y-4">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"/></svg>
          Individual Vocabulary Pronunciation Masters
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">Click any card to trigger individual ElevenLabs dictionary pronunciation audio.</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3" id="word-cards-container"></div>
    </section>

    <!-- Active Recall Comprehension -->
    <section id="comprehension-section" class="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-xl space-y-4 hidden">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h2 class="text-base font-bold text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          Active Retrieval Check
        </h2>
        <span class="text-xs text-slate-400">Question 1 of 2</span>
      </div>
      <div class="space-y-3">
        <p class="text-slate-200 text-sm font-semibold">Where did Tariq finally spot Adam's watch?</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button class="quiz-opt h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-sm font-medium text-left transition-all" data-correct="false">
            A) Under the blanket
          </button>
          <button class="quiz-opt h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-sm font-medium text-left transition-all" data-correct="true">
            B) Hanging on the wardrobe door
          </button>
          <button class="quiz-opt h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-sm font-medium text-left transition-all" data-correct="false">
            C) Beside the lamp on the desk
          </button>
        </div>
        <div id="quiz-feedback" class="text-xs font-bold p-3 rounded-xl hidden"></div>
      </div>
    </section>

  </div>

  <script>
    // ElevenLabs Raw Audio Clips
    const DIALOGUE_AUDIO = ${JSON.stringify(dialogueBase64)};
    const WORD_AUDIO = ${JSON.stringify(wordAudioBase64)};

    const STEPS = [
      {
        id: '01_tariq_alarm',
        speaker: 'Tariq',
        role: 'Older Brother (British)',
        color: 'bg-purple-600',
        text: "Adam, wake up! Did you check the alarm clock?",
        textAr: "آدم، استيقظ! هل تحققت من المنبه؟",
        targetWord: 'Alarm clock',
        phonetic: '/əˈlɑːrm klɑːk/',
        wordAr: 'المنبه',
        wordDesc: 'A bedside device that sounds an alarm to wake you up.',
        focal: 'focal-clock',
        sfx: '⏰ Digital Alarm Ring'
      },
      {
        id: '02_adam_nightstand',
        speaker: 'Adam',
        role: 'Younger Brother (American)',
        color: 'bg-sky-600',
        text: "Oh no, I'm late! Where is my watch? Is it on the nightstand?",
        textAr: "يا إلهي، لقد تأخرت! أين ساعتي؟ هل هي على منضدة السرير؟",
        targetWord: 'Nightstand',
        phonetic: '/ˈnaɪtstænd/',
        wordAr: 'منضدة السرير',
        wordDesc: 'A small table beside your bed for essentials.',
        focal: 'focal-nightstand',
        sfx: '⚡ Rushing Footsteps'
      },
      {
        id: '03_tariq_lamp',
        speaker: 'Tariq',
        role: 'Older Brother (British)',
        color: 'bg-purple-600',
        text: "No, only the lamp is on the nightstand.",
        textAr: "لا، فقط المصباح موجود على المنضدة.",
        targetWord: 'Lamp',
        phonetic: '/læmp/',
        wordAr: 'مصباح',
        wordDesc: 'An electric light positioned on the nightstand.',
        focal: 'focal-nightstand',
        sfx: '💡 Click of Light Switch'
      },
      {
        id: '04_adam_blanket',
        speaker: 'Adam',
        role: 'Younger Brother (American)',
        color: 'bg-sky-600',
        text: "Look under the blanket on the bed!",
        textAr: "ابحث تحت البطانية فوق السرير!",
        targetWord: 'Blanket',
        phonetic: '/ˈblæŋkɪt/',
        wordAr: 'بطانية',
        wordDesc: 'A thick, warm covering spread over a bed.',
        focal: 'focal-bed',
        sfx: '🛏️ Shuffling Bedding'
      },
      {
        id: '05_tariq_wardrobe',
        speaker: 'Tariq',
        role: 'Older Brother (British)',
        color: 'bg-purple-600',
        text: "Nothing here. Wait... look at the wardrobe door! It's hanging right there.",
        textAr: "لا شيء هنا. انتظر... انظر إلى باب خزانة الملابس! إنها معلقة هناك.",
        targetWord: 'Wardrobe',
        phonetic: '/ˈwɔːrdroʊb/',
        wordAr: 'خزانة ملابس',
        wordDesc: 'A tall cupboard where clothes hang on rails.',
        focal: 'focal-wardrobe',
        sfx: '🚪 Wooden Door Shift'
      },
      {
        id: '06_adam_resolution',
        speaker: 'Adam',
        role: 'Younger Brother (American)',
        color: 'bg-sky-600',
        text: "Aha! Thank goodness. Time to get ready!",
        textAr: "رائع! الحمد لله. حان وقت الاستعداد!",
        targetWord: 'Bed',
        phonetic: '/bɛd/',
        wordAr: 'سرير',
        wordDesc: 'Platform where a person sleeps and rests.',
        focal: 'focal-overview',
        sfx: '✨ Success Chime'
      }
    ];

    let isPlaying = false;
    let currentIndex = 0;
    let currentAudio = null;

    const sceneBg = document.getElementById('scene-bg');
    const speakerBadge = document.getElementById('speaker-badge');
    const speakerAvatar = document.getElementById('speaker-avatar');
    const speakerName = document.getElementById('speaker-name');
    const wordBadge = document.getElementById('word-badge');
    const badgeWord = document.getElementById('badge-word');
    const badgePhonetic = document.getElementById('badge-phonetic');
    const badgeArabic = document.getElementById('badge-arabic');
    const badgeDesc = document.getElementById('badge-desc');
    const sfxIndicator = document.getElementById('sfx-indicator');
    const sfxText = document.getElementById('sfx-text');
    const subEn = document.getElementById('subtitles-en');
    const subAr = document.getElementById('subtitles-ar');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const playLabel = document.getElementById('play-label');
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    const audioStatus = document.getElementById('audio-status');

    function playAudioClip(base64Data) {
      return new Promise((resolve) => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio = null;
        }
        const audio = new Audio('data:audio/mp3;base64,' + base64Data);
        currentAudio = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    }

    async function playScenarioStep(idx) {
      if (!isPlaying) return;
      if (idx >= STEPS.length) {
        finishScenario();
        return;
      }

      currentIndex = idx;
      const step = STEPS[idx];

      // Update Camera & Visuals
      sceneBg.className = 'scene-img ' + step.focal;

      // Update Speaker Indicator
      speakerBadge.classList.remove('opacity-0', '-translate-y-2');
      speakerAvatar.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ' + step.color;
      speakerAvatar.textContent = step.speaker[0];
      speakerName.textContent = step.speaker + ' (' + step.role + ')';

      // Update Word Badge
      wordBadge.classList.remove('opacity-0', 'translate-x-2');
      badgeWord.textContent = step.targetWord;
      badgePhonetic.textContent = step.phonetic;
      badgeArabic.textContent = step.wordAr;
      badgeDesc.textContent = step.wordDesc;

      // Show SFX
      sfxIndicator.classList.remove('opacity-0');
      sfxText.textContent = step.sfx;
      setTimeout(() => sfxIndicator.classList.add('opacity-0'), 2000);

      // Subtitles
      const regex = new RegExp('(' + step.targetWord + ')', 'gi');
      subEn.innerHTML = step.text.replace(regex, '<span class="text-emerald-400 underline decoration-2 underline-offset-4 font-black">$1</span>');
      subAr.textContent = step.textAr;

      // Progress bar
      progressBar.style.width = (((idx + 1) / STEPS.length) * 100) + '%';
      const sec = Math.round(((idx + 1) / STEPS.length) * 28);
      timeDisplay.textContent = '00:' + (sec < 10 ? '0' : '') + sec;

      audioStatus.textContent = 'Speaking: ' + step.speaker;

      // PLAY AUTHENTIC ELEVENLABS AUDIO
      const clipBase64 = DIALOGUE_AUDIO[step.id];
      if (clipBase64) {
        await playAudioClip(clipBase64);
      } else {
        await new Promise(r => setTimeout(r, 3500));
      }

      // Small 400ms pause between dialogue turns for realistic conversational breathing room
      await new Promise(r => setTimeout(r, 400));

      if (isPlaying) {
        playScenarioStep(idx + 1);
      }
    }

    function startScenario() {
      isPlaying = true;
      playLabel.textContent = 'Pause';
      playIcon.innerHTML = '<path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/>';
      playScenarioStep(currentIndex);
    }

    function pauseScenario() {
      isPlaying = false;
      if (currentAudio) currentAudio.pause();
      playLabel.textContent = 'Resume';
      playIcon.innerHTML = '<path d="M4 4l12 6-12 6V4z"/>';
      audioStatus.textContent = 'Paused';
    }

    function finishScenario() {
      isPlaying = false;
      playLabel.textContent = 'Replay';
      playIcon.innerHTML = '<path d="M4 4l12 6-12 6V4z"/>';
      audioStatus.textContent = 'Complete';
      subEn.innerHTML = '<span class="text-emerald-300">Scenario Complete!</span> Now test your comprehension below.';
      subAr.textContent = 'اكتمل المشهد! اختبر استيعابك أدناه.';
      speakerBadge.classList.add('opacity-0');
      wordBadge.classList.add('opacity-0');
      sceneBg.className = 'scene-img focal-overview';
      document.getElementById('comprehension-section').classList.remove('hidden');
    }

    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseScenario();
      } else {
        if (currentIndex >= STEPS.length) currentIndex = 0;
        startScenario();
      }
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      if (currentAudio) currentAudio.pause();
      currentIndex = 0;
      startScenario();
    });

    document.getElementById('toggle-quiz-btn').addEventListener('click', () => {
      const q = document.getElementById('comprehension-section');
      q.classList.toggle('hidden');
      q.scrollIntoView({ behavior: 'smooth' });
    });

    // Word Deck
    const wordCards = [
      { name: 'Bed', ar: 'سرير', phonetic: '/bɛd/' },
      { name: 'Nightstand', ar: 'منضدة سرير', phonetic: '/ˈnaɪtstænd/' },
      { name: 'Lamp', ar: 'مصباح', phonetic: '/læmp/' },
      { name: 'Blanket', ar: 'بطانية', phonetic: '/ˈblæŋkɪt/' },
      { name: 'Pillow', ar: 'وسادة', phonetic: '/ˈpɪloʊ/' },
      { name: 'Wardrobe', ar: 'خزانة ملابس', phonetic: '/ˈwɔːrdroʊb/' }
    ];

    const cardsContainer = document.getElementById('word-cards-container');
    wordCards.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all cursor-pointer group shadow-sm';
      card.innerHTML = \`
        <div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">\${item.name}</span>
            <span class="text-slate-500 group-hover:text-emerald-400 text-xs">🔊</span>
          </div>
          <div class="text-[11px] text-slate-400 font-mono mt-0.5">\${item.phonetic}</div>
          <div class="text-xs text-amber-300/80 font-arabic mt-1" dir="rtl">\${item.ar}</div>
        </div>
        <button class="mt-3 w-full py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1">
          Play Voice
        </button>
      \`;
      card.addEventListener('click', () => {
        const data = WORD_AUDIO[item.name];
        if (data) playAudioClip(data.base64);
      });
      cardsContainer.appendChild(card);
    });

    // Quiz Options
    document.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = e.currentTarget.getAttribute('data-correct') === 'true';
        const feedback = document.getElementById('quiz-feedback');
        feedback.classList.remove('hidden', 'bg-emerald-500/20', 'text-emerald-300', 'bg-rose-500/20', 'text-rose-300', 'border-emerald-500/40', 'border-rose-500/40');
        if (isCorrect) {
          e.currentTarget.classList.add('bg-emerald-600/30', 'border-emerald-400', 'text-emerald-200');
          feedback.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border', 'border-emerald-500/40');
          feedback.textContent = '🎉 Correct! Tariq found the watch hanging on the wardrobe door.';
        } else {
          e.currentTarget.classList.add('bg-rose-600/30', 'border-rose-400', 'text-rose-200');
          feedback.classList.add('bg-rose-500/20', 'text-rose-300', 'border', 'border-rose-500/40');
          feedback.textContent = 'Not quite! Remember Tariq said: "Wait... look at the wardrobe door! It\'s hanging right there."';
        }
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(
  'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/lesson_video_sample.html',
  html,
  'utf8'
);
console.log('Successfully re-assembled lesson_video_sample.html with real ElevenLabs master audio!');
