const fs = require('fs');
const path = require('path');

const audioDir = path.resolve('assets/samples/audio');
const audioFiles = [
  '01_tariq_alarm.mp3',
  '02_adam_nightstand.mp3',
  '03_tariq_lamp.mp3',
  '04_adam_blanket.mp3',
  '05_tariq_wardrobe.mp3',
  '06_adam_resolution.mp3'
];

const audioBase64 = {};
for (const f of audioFiles) {
  const buf = fs.readFileSync(path.join(audioDir, f));
  audioBase64[f.replace('.mp3', '')] = buf.toString('base64');
}

const veoMp4Base64 = fs.readFileSync('C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/veo_shot01_base64.txt', 'utf8').trim();
const shotsBase64 = JSON.parse(
  fs.readFileSync('C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/stitched_shots_base64.json', 'utf8')
);

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Stitched Shots Video Renderer</title>
  <style>
    body { background: #020617; margin: 0; overflow: hidden; }
    canvas { width: 1280px; height: 720px; display: block; }
  </style>
</head>
<body>
  <canvas id="c" width="1280" height="720"></canvas>
  <video id="veo" playsinline muted style="display:none;">
    <source src="data:video/mp4;base64,${veoMp4Base64}" type="video/mp4">
  </video>

  <script>
    const AUDIO_MAP = ${JSON.stringify(audioBase64)};
    const SHOTS_MAP = ${JSON.stringify(shotsBase64)};

    // Preload image elements
    const shotImages = {};
    for (const [key, b64] of Object.entries(SHOTS_MAP)) {
      const img = new Image();
      img.src = 'data:image/webp;base64,' + b64;
      shotImages[key] = img;
    }

    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const veoVideo = document.getElementById('veo');

    const STEPS = [
      {
        id: '01_tariq_alarm',
        speaker: 'Tariq',
        text: 'Adam, wake up! Did you check the alarm clock?',
        textAr: 'آدم، استيقظ! هل تحققت من المنبه؟',
        word: 'Alarm clock', phonetic: '/əˈlɑːrm klɑːk/', wordAr: 'المنبه',
        useVeo: true,
        shotKey: 'alarm_clock',
        duration: 4800
      },
      {
        id: '02_adam_nightstand',
        speaker: 'Adam',
        text: "Oh no, I'm late! Where is my watch? Is it on the nightstand?",
        textAr: 'يا إلهي، لقد تأخرت! أين ساعتي؟ هل هي على منضدة السرير؟',
        word: 'Nightstand', phonetic: '/ˈnaɪtstænd/', wordAr: 'منضدة السرير',
        useVeo: false,
        shotKey: 'nightstand',
        duration: 5200
      },
      {
        id: '03_tariq_lamp',
        speaker: 'Tariq',
        text: 'No, only the lamp is on the nightstand.',
        textAr: 'لا، فقط المصباح موجود على المنضدة.',
        word: 'Lamp', phonetic: '/læmp/', wordAr: 'مصباح',
        useVeo: false,
        shotKey: 'lamp',
        duration: 4200
      },
      {
        id: '04_adam_blanket',
        speaker: 'Adam',
        text: 'Look under the blanket on the bed!',
        textAr: 'ابحث تحت البطانية فوق السرير!',
        word: 'Blanket', phonetic: '/ˈblæŋkɪt/', wordAr: 'بطانية',
        useVeo: false,
        shotKey: 'blanket',
        duration: 4500
      },
      {
        id: '05_tariq_wardrobe',
        speaker: 'Tariq',
        text: "Nothing here. Wait... look at the wardrobe door! It's hanging right there.",
        textAr: 'لا شيء هنا. انتظر... انظر إلى باب خزانة الملابس!',
        word: 'Wardrobe', phonetic: '/ˈwɔːrdroʊb/', wordAr: 'خزانة ملابس',
        useVeo: false,
        shotKey: 'wardrobe',
        duration: 5500
      },
      {
        id: '06_adam_resolution',
        speaker: 'Adam',
        text: 'Aha! Thank goodness. Time to get ready!',
        textAr: 'رائع! الحمد لله. حان وقت الاستعداد!',
        word: 'Bed', phonetic: '/bɛd/', wordAr: 'سرير',
        useVeo: false,
        shotKey: 'room_overview',
        duration: 4200
      }
    ];

    let currentStep = 0;
    let stepStartTime = 0;
    let recordedChunks = [];
    let mediaRecorder = null;
    let audioCtx = null;
    let audioDest = null;
    const audioBuffers = {};

    async function initAudio() {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
      audioDest = audioCtx.createMediaStreamDestination();

      for (const [id, base64] of Object.entries(AUDIO_MAP)) {
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        audioBuffers[id] = await audioCtx.decodeAudioData(bytes.buffer);
      }
    }

    function playAudioNode(id) {
      if (!audioBuffers[id]) return;
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffers[id];
      source.connect(audioDest);
      source.connect(audioCtx.destination);
      source.start();
    }

    function drawFrame(now) {
      const step = STEPS[currentStep];
      if (!step) return;

      // Dark solid background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 1280, 720);

      // 1. Draw Distinct Shot (NO SCROLLING OR PANNING)
      if (step.useVeo && veoVideo.readyState >= 2) {
        ctx.drawImage(veoVideo, 0, 0, 1280, 720);
      } else {
        const shotImg = shotImages[step.shotKey];
        if (shotImg && shotImg.complete) {
          ctx.drawImage(shotImg, 0, 0, 1280, 720);
        }
      }

      // 2. Cinematic Vignettes
      const gradTop = ctx.createLinearGradient(0, 0, 0, 150);
      gradTop.addColorStop(0, 'rgba(2, 6, 23, 0.9)');
      gradTop.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, 1280, 150);

      const gradBot = ctx.createLinearGradient(0, 510, 0, 720);
      gradBot.addColorStop(0, 'rgba(2, 6, 23, 0)');
      gradBot.addColorStop(0.4, 'rgba(2, 6, 23, 0.85)');
      gradBot.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
      ctx.fillStyle = gradBot;
      ctx.fillRect(0, 510, 1280, 210);

      // 3. Brand Pill Top Left
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(32, 24, 380, 36, 18);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(48, 42, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('WordPix • Unit 006: The Bedroom • Scene Beat', 62, 46);

      // 4. Speaker Pill
      ctx.fillStyle = step.speaker === 'Tariq' ? 'rgba(147, 51, 234, 0.95)' : 'rgba(2, 132, 199, 0.95)';
      ctx.beginPath();
      ctx.arc(52, 92, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(step.speaker[0], 52, 98);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(76, 74, 180, 36, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(step.speaker, 88, 96);

      // 5. Target Vocabulary Spotlight (Top Right)
      ctx.fillStyle = 'rgba(6, 78, 59, 0.92)';
      ctx.beginPath();
      ctx.roundRect(960, 24, 288, 86, 16);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '900 18px system-ui, sans-serif';
      ctx.fillText(step.word, 980, 52);

      ctx.fillStyle = '#6ee7b7';
      ctx.font = '12px monospace';
      ctx.fillText(step.phonetic, 980, 72);

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(step.wordAr, 1228, 56);
      ctx.textAlign = 'left';

      // 6. Subtitles (Bottom Center)
      ctx.textAlign = 'center';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 12;
      ctx.fillText(step.text, 640, 626);
      ctx.shadowBlur = 0;

      ctx.font = 'medium 20px sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText(step.textAr, 640, 664);

      // 7. Timeline Bar
      const totalSteps = STEPS.length;
      const progress = ((currentStep + (now - stepStartTime) / step.duration) / totalSteps);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 714, Math.min(1280, 1280 * progress), 6);

      requestAnimationFrame(drawFrame);
    }

    async function runScenario() {
      await initAudio();

      if (veoVideo) {
        veoVideo.currentTime = 0;
        veoVideo.play().catch(() => {});
      }

      const videoStream = canvas.captureStream(30);
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks()
      ]);

      mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp9,opus',
        videoBitsPerSecond: 2500000
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          window._FINAL_VIDEO_BASE64 = reader.result.split(',')[1];
          console.log('Base64 video ready! Size:', window._FINAL_VIDEO_BASE64.length);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start(200);
      requestAnimationFrame(drawFrame);

      for (let i = 0; i < STEPS.length; i++) {
        currentStep = i;
        stepStartTime = performance.now();
        playAudioNode(STEPS[i].id);

        if (STEPS[i].useVeo) {
          veoVideo.play().catch(() => {});
        } else {
          veoVideo.pause();
        }

        await new Promise(r => setTimeout(r, STEPS[i].duration));
      }

      currentStep = STEPS.length;
      mediaRecorder.stop();
    }

    window.addEventListener('load', () => {
      setTimeout(runScenario, 500);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(
  'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/record_muxed_sample.html',
  html,
  'utf8'
);
console.log('Successfully updated record_muxed_sample.html with distinct stitched shots!');
