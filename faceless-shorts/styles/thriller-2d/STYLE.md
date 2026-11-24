# Thriller 2D (`thriller-2d`): Multi-Plane 2D Horror & Interactive Story Reels, 9:16

> **Isolation Rule (Important):** `thriller-2d` is an **independent 2D cinematic story workflow** inside `faceless-shorts/`. Do **not** mix its visual rules (gradients, soft ambient glows, rim lights, slower narrative suspense beats, multi-cast/external audio sync, or 2-round keyframe gate) back into the original `6` styles (`deep-dive`, `inside-out`, `night-file`, `paper-atlas`, `stick-story`, `tall-tale`). Those styles follow their own `STYLE.md` strictly.

Reference style showcase: `style-sheet.png` • Complete runnable project: `example/` (**The Free Lift — Episode 1**, interactive Wing B Floor 13 thriller).

---

## 1. Visual Look & World Rules (Tower-11-Inspired Dark Ink 2D)
- **Bold Dark Outlines (`INK = '#14100E'`):** All foreground characters, doors, props, stamps, HUD pills, and set architecture use crisp `3.5–6px` rounded ink outlines (`fillStroke`).
- **Multi-Plane Depth & Lighting:** Unlike flat `inside-out`, `thriller-2d` uses subtle directional linear/radial light cones (`radGrad`, `linGrad`), ambient fog bands, dust motes, screen-locked HUD tiles, diegetic clipboards/terminals, crimson impact flashes, and heavy `vignette` + `filmGrainOverlay`.
- **Grounded Exterior Rule (Never Blend Buildings Into Sky):**
  1. Draw stars, moons, rolling hills, and drifting mist **strictly behind** architectural silhouettes.
  2. Paint masonry (`#1A2638` / `#243349`) cleanly separated from the midnight indigo sky with a pale moonlit rim stroke (`rgba(180,212,255,0.28)`).
  3. Always plant buildings on a stone plinth + courtyard sidewalk + glowing entrance/streetlamps so structures never float in darkness.
- **Character Puppet Rig (`src/chars.js`):**
  - Front & back views (`view: 'front' | 'back'`), expressive eye looks & natural blinking, sweat drops, animated leg swing during sprints (`runPhase`), dead/powered-off phone screen support during blackouts, ghostly cyan POV hands (`drawSpectralHandsPOV`), and audio-driven lip-sync (`mouthAt(t, 'Maya')` via `data/mouth.json`).
- **Caption Styling (`src/captions.js`):** Positioned near `y = 1605` (keeping hero puppets between `y = 350–1300` and foreground POV hands raised above `y = 1220` so subtitles never collide). Active highlight shifts smoothly by act/tension (`gold` default -> `cyan` eerie cold -> `crimson` danger/entity).

---

## 2. Production Workflow (Keyframes First -> Audio -> Sync -> Final MP4)

### Stage A — Mandatory Keyframe Gate (Before Animating Full Timeline)
1. Plan the story arc (`60–160s`: Hook -> Backstory/Dare -> Rules/Clues -> Rising Approach -> Silence Dropout Tension -> Climax Twist -> `[A] vs [B]` Interactive Cliffhanger CTA).
2. Implement static compositional hero beats (`KF-01..KF-12`) in `src/keyframes.js`.
3. Render & inspect `review/keyframes/grid_all.jpg` (`node tools/render_keyframes.mjs`), grade every panel cleanly, and refine any layout/overlap/sky-blend bugs **before** choreographing full continuous camera/cut animation in `src/shots.js`.

### Stage B — Voice & Soundtrack (Three Supported Paths)
1. **Standard `faceless-shorts` Pipeline (Compatible with `selftest.sh` & `new_video.sh`):**
   - Run `scripts/py scripts/voice.py .` + `scripts/py scripts/words.py .` (or `estimate.py .`), then `tools/mix.py .`.
2. **Multi-Cast Emotional Kokoro Director (`tools/audio_director.py`, English Noir + Hinglish):**
   - Synthesizes multi-character tracks (`Narrator` blend + `Maya` + `DrWard` 1978 PA bandpass + `Entity` whispered double-track), splits `...` into natural human pauses + subtle `breath_intake()`, and outputs `data*/lines.json`, `words.json`, `mouth.json`, `narration.wav`.
   - For Hinglish Devanagari (`"lang": "hi"`), always strip espeak switch tokens `/(en|hi)/g`, use nukta `फ़`/`ज़` on loan words, and use plain `ख` (not `ख़`) so `खाली`/`खुद` stay crisp.
3. **External Pro/Studio Master Audio (`tools/sync_external_audio.py`):**
   - When the user supplies a finished voice+SFX track (`externalAudio: true` in `script.json`), map verified line windows -> align word intervals acoustically + generate `mouth.json`, and run `tools/mix.py` in `externalAudio` mode (weaves a ducked horror score + silence dropouts + gentle sub-bass weight without doubling already-baked SFX!).

### Stage C — Motion, Sheet QA, Render & Release Packaging
1. Choreograph `src/shots.js` (`S01..S12`), run `node tools/capture.mjs check` -> `cues` -> `python tools/mix.py .`.
2. Always capture and visually inspect `node tools/capture.mjs sheet review/sheet.jpg 2.5 8` first.
3. Render final `1080x1920 @ 30fps` MP4 (`node tools/capture.mjs video renders/<out>.mp4`; supports `--draft` and optional `[start end]` slicing for `selftest.sh`), and render the matching `1080x1920` + `1:1` grid-safe cover (`cover.html` -> `node tools/render_cover.mjs`).

---

## 3. Engine Map (`example/`)
| file | purpose |
|---|---|
| `index.html` / `keyframes.html` / `cover.html` | Reel player (`window.OP`), keyframe review gallery (`window.KF`), and vertical + 1:1 grid-safe cover renderer |
| `src/palette.js`, `hud.js`, `chars.js`, `sets.js` | Unified dark-ink 2D engine (HUDs, stamps, arrows, terminal, Maya/Ward/Entity puppets, multi-plane sets) |
| `src/timing.js`, `captions.js`, `shots.js`, `main.js` | Multi-dir timing loader, `WdAny` bilingual triggers, lip-sync `mouthAt`, camera/flash/shake director |
| `tools/capture.mjs`, `mix.py` | Windows CPU Skia headless Chrome capture (`--disable-gpu`) + 48kHz stereo horror score & sub-SFX mixer |
| `tools/audio_director.py`, `sync_external_audio.py` | Multi-voice Kokoro Hindi/Noir director & external studio MP3/WAV acoustic word/lip-sync aligner |
| `tools/render_keyframes.mjs`, `render_cover.mjs` | Fast headless captures for Round-1/Round-2 Keyframe grids & release thumbnails |

---

## 4. Production QA Pitfalls (Verify Every Reel)
- **Sky Blending (`S01`):** Mist ribbons must draw **behind** brick buildings; always add moonlight edge rim + stone foundation + ground lighting so buildings never float.
- **Inverted Door Physics:** Verify pull sign mathematically (`pull: 0 -> 1` must **open** gap width, never shrink it) and check side text labels stay inside frame (`MORGUE`).
- **Blackout Phone Continuity:** Switch `drawPhoneHandPOV(..., dead = true)` right on pitch blackout so red UI screens don't remain glowing in total darkness.
- **Spectral/Hand Caption Clearance:** Keep foreground POV arms above `y ~ 1220` (`scale ~ 0.92–0.96`) so lower captions (`y ~ 1605`) never overlap keycard text.
- **Windows Headless Chrome:** Keep `--disable-gpu` on Chromium capture spawns to prevent blank 48 KB GPU compositing frames.

