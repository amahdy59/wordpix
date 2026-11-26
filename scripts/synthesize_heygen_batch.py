"""
Synthesize audio batches locally using HeyGen Voice Turbo API.
Generates local WAV/MP3 files and creates an interactive side-by-side comparison player
comparing HeyGen against Edge TTS for audio quality evaluation.

Usage:
  python scripts/synthesize_heygen_batch.py --batch=batch-01 --limit=15
  python scripts/synthesize_heygen_batch.py --serve
"""
import argparse
import hashlib
import html
import http.server
import json
import os
from pathlib import Path
import shutil
import socket
import socketserver
import subprocess
import sys
import time
import urllib.error
import urllib.request

socket.setdefaulttimeout(45)

ROOT = Path(__file__).resolve().parents[1]
BATCHES_DIR = ROOT / "output" / "recorded-audio" / "batches"
HEYGEN_DIR = ROOT / "output" / "recorded-audio" / "heygen"
RECORDINGS_DIR = ROOT / "output" / "recorded-audio" / "recordings"

API_URL = "https://api.heygen.com/v3/models/audio/tts"
DEFAULT_MODEL = "heygen-voice-1-turbo-free"
DEFAULT_VOICE = "83548de556df48ba8c09c42a57c51d85"  # Nadine
FALLBACK_KEY = "sk_V2_hgu_kAbz8dpB7Oy_QhNKrr4qLIVPV8LGnSnuYSjzCoQyu94d"


def get_ffmpeg():
    exe = shutil.which("ffmpeg")
    if not exe:
        try:
            import imageio_ffmpeg
            exe = imageio_ffmpeg.get_ffmpeg_exe()
        except ImportError:
            pass
    return exe


def resolve_batch_file(batch_arg: str) -> Path:
    if not batch_arg:
        batch_arg = "batch-01"
    if batch_arg.endswith(".json"):
        candidate = BATCHES_DIR / batch_arg
        if candidate.exists():
            return candidate
    candidates = [
        f for f in BATCHES_DIR.glob("*.json")
        if f.name.startswith(batch_arg)
        and not f.name.endswith("-results.json")
        and not f.name.endswith("-exec.json")
    ]
    if candidates:
        candidates.sort(key=lambda x: len(x.name))
        return candidates[0]
    return BATCHES_DIR / "batch-01-vocab-and-sentences.json"


def load_env_local_heygen_keys() -> list[str]:
    """Read HEYGEN_API_KEY* entries from gitignored .env.local without logging secrets."""
    env_path = ROOT / ".env.local"
    if not env_path.exists():
        return []
    keys = []
    for raw_line in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, val = line.split("=", 1)
        name = name.strip()
        val = val.strip().strip('"').strip("'")
        if val and (name == "HEYGEN_API_KEY" or name.startswith("HEYGEN_API_KEY_")):
            keys.append(val)
    return keys


def resolve_api_keys(explicit_key_arg: str) -> list[str]:
    """Resolve ordered, deduplicated HeyGen API keys from CLI, env, .env.local, and fallback."""
    candidates: list[str] = []
    if explicit_key_arg:
        candidates.extend(k.strip() for k in explicit_key_arg.split(",") if k.strip())
    else:
        for env_name in ["HEYGEN_API_KEY"] + [f"HEYGEN_API_KEY_{i}" for i in range(1, 10)]:
            val = os.environ.get(env_name, "").strip()
            if val:
                candidates.extend(k.strip() for k in val.split(",") if k.strip())
        candidates.extend(load_env_local_heygen_keys())
        if FALLBACK_KEY:
            candidates.append(FALLBACK_KEY)

    deduped: list[str] = []
    seen: set[str] = set()
    for k in candidates:
        if k and k not in seen:
            seen.add(k)
            deduped.append(k)
    return deduped


class HeyGenRateLimitError(RuntimeError):
    """Raised immediately on HTTP 429 so multi-key rotation can switch keys without delay."""


def request_heygen_audio(text: str, api_key: str, voice_id: str = DEFAULT_VOICE, model: str = DEFAULT_MODEL, retries: int = 3) -> dict:
    payload = {
        "model": model,
        "voice_id": voice_id,
        "language": "en",
        "text": text,
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"X-Api-Key": api_key, "Content-Type": "application/json"},
        method="POST",
    )
    last_error = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                body = json.loads(resp.read().decode("utf-8"))
                data = body.get("data", {})
                if not data.get("audio_url"):
                    raise ValueError(f"No audio_url returned from HeyGen: {body}")
                return data
        except urllib.error.HTTPError as error:
            last_error = error
            if error.code == 429:
                raise HeyGenRateLimitError(f"HTTP 429 rate limit exceeded for key ...{api_key[-4:]}") from error
            if error.code >= 500:
                wait_sec = min(60, 10 * (2 ** attempt))
                print(f"    [HeyGen HTTP {error.code}] Server busy. Backing off for {wait_sec}s...", flush=True)
                time.sleep(wait_sec)
                continue
            raise
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            last_error = error
            if attempt < retries - 1:
                wait_sec = 5 * (attempt + 1)
                print(f"    [Network glitch] {error}. Retrying in {wait_sec}s...", flush=True)
                time.sleep(wait_sec)
                continue
            raise
    raise RuntimeError(f"Failed to request HeyGen audio after {retries} attempts (last error: {last_error}).")


def download_audio_file(audio_url: str, wav_path: Path, timeout: int = 30, retries: int = 3) -> None:
    """Download synthesized WAV audio with explicit socket timeout and atomic replacement."""
    tmp_path = wav_path.with_suffix(".wav.tmp")
    last_error = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(audio_url, timeout=timeout) as resp, open(tmp_path, "wb") as out:
                shutil.copyfileobj(resp, out)
            os.replace(tmp_path, wav_path)
            return
        except Exception as error:
            last_error = error
            if tmp_path.exists():
                tmp_path.unlink(missing_ok=True)
            if attempt < retries - 1:
                wait_sec = 3 * (attempt + 1)
                print(f"    [Download retry {attempt + 1}/{retries - 1}] {error}. Retrying in {wait_sec}s...", flush=True)
                time.sleep(wait_sec)
                continue
            raise
    raise RuntimeError(f"Failed to download audio after {retries} attempts: {last_error}")


def convert_wav_to_mp3(wav_path: Path, mp3_path: Path):
    ffmpeg = get_ffmpeg()
    if not ffmpeg:
        return
    subprocess.run(
        [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-i", str(wav_path), "-b:a", "48k", str(mp3_path)],
        check=True,
    )


def generate_comparison_html(batch_name: str, results: list, html_path: Path):
    cards_html = []
    for idx, item in enumerate(results, start=1):
        escaped_text = html.escape(item["text"])
        sources_str = ", ".join(item.get("sources", []))
        escaped_sources = html.escape(sources_str)

        heygen_rel = os.path.relpath(item["heygenMp3Path"], html_path.parent).replace("\\", "/")
        edge_rel = os.path.relpath(item["edgeLocalPath"], html_path.parent).replace("\\", "/") if item.get("edgeLocalPath") else None

        edge_player = ""
        if edge_rel and os.path.exists(item["edgeLocalPath"]):
            edge_player = f"""
            <div class="player-col">
              <div class="player-label">
                <span class="engine-tag edge">Edge TTS</span>
                <span>JennyNeural &bull; {item.get('edgeDuration', 0):.2f}s</span>
              </div>
              <audio controls preload="none" src="{edge_rel}"></audio>
            </div>
            """
        else:
            edge_player = """
            <div class="player-col">
              <div class="player-label"><span class="engine-tag edge">Edge TTS</span> Not available</div>
            </div>
            """

        card = f"""
        <article class="compare-card" id="clip-{idx}">
          <div class="card-header">
            <span class="clip-num">#{idx}</span>
            <span class="clip-text">{escaped_text}</span>
          </div>
          <div class="players-row">
            <div class="player-col">
              <div class="player-label">
                <span class="engine-tag heygen">HeyGen</span>
                <span>Nadine &bull; {item.get('heygenDuration', 0):.2f}s</span>
              </div>
              <audio controls preload="none" src="{heygen_rel}"></audio>
            </div>
            {edge_player}
          </div>
          <div class="card-meta">
            <code>{escaped_sources}</code>
          </div>
        </article>
        """
        cards_html.append(card)

    html_content = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WordPix &bull; HeyGen vs Edge TTS Side-by-Side Review</title>
  <style>
    :root {{
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --muted: #475569;
      --border: #e2e8f0;
      --heygen: #7c3aed;
      --edge: #0284c7;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: var(--text);
      background: var(--bg);
      margin: 0;
      padding: 24px;
    }}
    .container {{
      max-width: 980px;
      margin: 0 auto;
    }}
    header {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }}
    h1 {{ margin: 0 0 8px 0; font-size: 1.5rem; }}
    .subtitle {{ color: var(--muted); margin: 0 0 16px 0; font-size: 0.95rem; }}
    .stats-bar {{
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
      font-size: 0.9rem;
    }}
    .stat-pill {{
      background: #f1f5f9;
      padding: 4px 12px;
      border-radius: 999px;
      font-weight: 500;
    }}
    .search-box {{
      margin-top: 16px;
    }}
    input[type="search"] {{
      width: 100%;
      padding: 10px 16px;
      border: 2px solid var(--border);
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      min-height: 44px;
    }}
    input[type="search"]:focus-visible {{
      border-color: var(--heygen);
      outline: 2px solid var(--heygen);
    }}
    .compare-list {{
      display: flex;
      flex-direction: column;
      gap: 16px;
    }}
    .compare-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }}
    .card-header {{
      display: flex;
      gap: 12px;
      align-items: baseline;
      margin-bottom: 16px;
    }}
    .clip-num {{
      font-weight: 700;
      color: var(--muted);
      font-size: 0.9rem;
    }}
    .clip-text {{
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text);
    }}
    .players-row {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 12px;
    }}
    @media (max-width: 640px) {{
      .players-row {{ grid-template-columns: 1fr; }}
    }}
    .player-col {{
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
    }}
    .player-label {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 0.85rem;
      color: var(--muted);
    }}
    .engine-tag {{
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #ffffff;
    }}
    .engine-tag.heygen {{ background: var(--heygen); }}
    .engine-tag.edge {{ background: var(--edge); }}
    audio {{
      width: 100%;
      height: 44px;
    }}
    .card-meta {{
      font-size: 0.8rem;
      color: var(--muted);
      margin-top: 4px;
    }}
    code {{
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
    }}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>WordPix &bull; HeyGen vs Edge TTS Listening Review</h1>
      <p class="subtitle">Direct side-by-side comparison. Listen to identical phrases on both engines to evaluate pronunciation, cadence, stress, and natural rhythm.</p>
      <div class="stats-bar">
        <span class="stat-pill">Batch: <strong>{html.escape(batch_name)}</strong></span>
        <span class="stat-pill">Evaluated Clips: <strong>{len(results)}</strong></span>
        <span class="stat-pill">HeyGen Voice: <strong>Nadine (Voice Turbo)</strong></span>
        <span class="stat-pill">Edge Voice: <strong>en-US-JennyNeural</strong></span>
      </div>
      <div class="search-box">
        <input type="search" id="filterInput" placeholder="Filter phrases by text or lesson source..." aria-label="Filter phrases">
      </div>
    </header>

    <main class="compare-list" id="compareList">
      {"".join(cards_html)}
    </main>
  </div>

  <script>
    const filterInput = document.getElementById('filterInput');
    const cards = document.querySelectorAll('.compare-card');
    filterInput.addEventListener('input', (e) => {{
      const query = e.target.value.toLowerCase().trim();
      cards.forEach(card => {{
        const text = card.querySelector('.clip-text').textContent.toLowerCase();
        const meta = card.querySelector('.card-meta').textContent.toLowerCase();
        if (text.includes(query) || meta.includes(query)) {{
          card.style.display = '';
        }} else {{
          card.style.display = 'none';
        }}
      }});
    }});
  </script>
</body>
</html>
"""
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)


class AudioCompareHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / "output" / "recorded-audio"), **kwargs)

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.send_response(302)
            self.send_header("Location", "/heygen/batch-01-compare-player.html")
            self.end_headers()
            return
        super().do_GET()


def main():
    parser = argparse.ArgumentParser(description="HeyGen batch synthesis and comparison")
    parser.add_argument("--batch", default="batch-01", help="Batch ID or filename")
    parser.add_argument("--limit", type=int, default=15, help="Number of clips to synthesize (default: 15, use 0 for all)")
    parser.add_argument("--daily-limit", type=int, default=1950, help="Maximum new API requests per key in one session to avoid 2000 quota limit (default: 1950)")
    parser.add_argument("--key", default="", help="HeyGen API key or comma-separated list of keys (defaults to env/.env.local HEYGEN_API_KEY* pool)")
    parser.add_argument("--serve", action="store_true", help="Start local comparison review server")
    parser.add_argument("--port", type=int, default=8768, help="Port for server")
    parser.add_argument("--delay", type=float, default=3.0, help="Delay between HeyGen requests (seconds)")
    args = parser.parse_args()

    api_keys = resolve_api_keys(args.key)
    if not api_keys:
        print("Error: No HeyGen API key provided.", file=sys.stderr)
        sys.exit(1)

    HEYGEN_DIR.mkdir(parents=True, exist_ok=True)
    clips_dir = HEYGEN_DIR / "clips"
    clips_dir.mkdir(parents=True, exist_ok=True)

    if args.serve and not any(arg.startswith("--limit") for arg in sys.argv[1:]):
        print(f"\nStarting listening server at http://127.0.0.1:{args.port}/heygen/batch-01-compare-player.html")
        with socketserver.TCPServer(("127.0.0.1", args.port), AudioCompareHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped.")
        return

    batch_path = resolve_batch_file(args.batch)
    print(f"Loading batch: {batch_path.name} (key pool: {len(api_keys)} keys)")
    with open(batch_path, "r", encoding="utf-8") as f:
        items = json.load(f)

    if args.limit > 0:
        items = items[: args.limit]
        print(f"Synthesizing {len(items)} clips with HeyGen for comparison...")

    results = []
    receipts_file = HEYGEN_DIR / f"{batch_path.stem}-heygen-results.json"
    existing_receipts = {}

    # Preload from all previous HeyGen results to avoid any redundant API calls across batches
    for rf in sorted(HEYGEN_DIR.glob("*-heygen-results.json")):
        try:
            with open(rf, "r", encoding="utf-8") as f:
                for r in json.load(f):
                    existing_receipts[r["text"]] = r
        except Exception:
            pass

    def persist_state():
        with open(receipts_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        generate_comparison_html(batch_path.stem, results, compare_html_path)

    compare_html_path = HEYGEN_DIR / f"{batch_path.stem}-compare-player.html"

    active_keys = list(api_keys)
    key_usage = {k: 0 for k in api_keys}
    rr_cursor = 0
    quota_reached = False

    for idx, item in enumerate(items, start=1):
        text = item["text"]
        text_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
        wav_path = clips_dir / f"{text_hash}.wav"
        mp3_path = clips_dir / f"{text_hash}.mp3"

        heygen_duration = 0
        if (text in existing_receipts) and (wav_path.exists() or mp3_path.exists()):
            print(f"[{idx}/{len(items)}] Using existing HeyGen clip: {text[:45]}...", flush=True)
            heygen_duration = existing_receipts[text].get("heygenDuration", 0)
        elif mp3_path.exists() and mp3_path.stat().st_size > 1024:
            print(f"[{idx}/{len(items)}] Using existing cached MP3: {text[:45]}...", flush=True)
        else:
            synthesized = False
            fatal_clip_error = False
            while active_keys and not synthesized and not fatal_clip_error:
                rr_cursor %= len(active_keys)
                current_key = active_keys[rr_cursor]
                if key_usage[current_key] >= args.daily_limit:
                    print(f"\n[!] Key ...{current_key[-4:]} reached daily safety limit ({args.daily_limit}). Rotating key...", flush=True)
                    active_keys.pop(rr_cursor)
                    continue

                print(f"[{idx}/{len(items)}] Requesting HeyGen (...{current_key[-4:]}): {text[:45]}...", flush=True)
                try:
                    data = request_heygen_audio(text, current_key)
                    audio_url = data["audio_url"]
                    heygen_duration = data.get("duration", 0)
                    download_audio_file(audio_url, wav_path)
                    convert_wav_to_mp3(wav_path, mp3_path)
                    key_usage[current_key] += 1
                    rr_cursor += 1
                    synthesized = True
                    time.sleep(args.delay)
                except HeyGenRateLimitError:
                    print(f"    [Key ...{current_key[-4:]} rate limited (HTTP 429)] Switching to next active key...", file=sys.stderr, flush=True)
                    active_keys.pop(rr_cursor)
                except Exception as e:
                    print(f"    [Error on '{text[:30]}']: {e}", file=sys.stderr, flush=True)
                    fatal_clip_error = True

            if fatal_clip_error:
                continue
            if not synthesized and not active_keys:
                print("\n[!] All provided HeyGen API keys reached their daily quota/limit. Stopping gracefully.", file=sys.stderr, flush=True)
                quota_reached = True
                break

        # Find corresponding Edge TTS local recording
        edge_path = item.get("localPath")
        edge_dur = item.get("duration", 0)

        results.append({
            "text": text,
            "sources": item.get("sources", []),
            "heygenWavPath": str(wav_path),
            "heygenMp3Path": str(mp3_path if mp3_path.exists() else wav_path),
            "heygenDuration": heygen_duration,
            "edgeLocalPath": edge_path,
            "edgeDuration": edge_dur,
        })

        if idx % 15 == 0 or idx == len(items):
            persist_state()
            print(f"    [Checkpointed {len(results)} clips to receipts and live player]", flush=True)

    persist_state()
    if quota_reached:
        print("\n[+] Progress checkpointed before quota exhaustion.", flush=True)
    print(f"\n[+] Side-by-Side Comparison Player updated: {compare_html_path}", flush=True)
    print(f"    Web Preview URL: http://127.0.0.1:{args.port}/heygen/{compare_html_path.name}", flush=True)

    if args.serve:
        print(f"\nStarting local comparison server on http://127.0.0.1:{args.port}/heygen/{compare_html_path.name}")
        with socketserver.TCPServer(("127.0.0.1", args.port), AudioCompareHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped.")


if __name__ == "__main__":
    main()
