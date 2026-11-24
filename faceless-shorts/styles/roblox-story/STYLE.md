# Roblox Story — reusable production system

Create original vertical 3D stories using general character rigs, configurable sets and time-sampled motions. Target readable acting, consistent identities, purposeful cuts and dramatic prop inserts. References span 36.96–142.06 seconds, not one fixed 20-second formula.

Read `references/component-authoring.md` before authoring a plan and `references/sample-analysis.md` when matching these references. Runtime: `example/src/components/`. Keep `example/src/shots.js` as the original legacy demonstration, accessible with `?legacy=1`; do not rewrite it for routine component stories.

## Create and build
```bash
bash <skill>/scripts/new_video.sh roblox-story <name> --dir <parent>
cd <parent>/<name>
# Write script.json (use script.example.json only as a format guide).
# Generate voice with the shared scripts/voice.py and scripts/words.py,
# or import externally aligned speech with the same data format.
# Existing tools/tts_align.py is an ESTIMATED alignment fallback, not forced alignment.
node tools/story.mjs bind
# Read data/tokens.json. Write story.json and run:
node tools/story.mjs assemble story.json
# Or author scene-plan.json directly using stable token anchors.
node tools/story.mjs validate
node tools/story.mjs prepare
python3 tools/mix.py .
node tools/capture.mjs check
node tools/capture.mjs sheet review/contact.png
node tools/capture.mjs video renders/final.mp4
```
Check capture tool's usage for exact options before using optional modes. Prepare fails on unverified timing; `--allow-estimated` explicitly marks a preview. To mark alignment verified, inspect word boundaries against the actual narration, correct them, and write `data/alignment.json` with `method`, `verified:true`, reviewer and review scope before rebinding. Never set verified solely to pass a check.

## Narration data
Use the shared script fields: title, voice, speed, lead, gap, outro, music and lines containing text. `data/lines.json` contains duration and lines with start/end; `data/words.json` contains `{line,w,s,e}` records. Use `data/narration.wav` for speech and optional `data/mouth.json` for envelope lip movement. A supplied mouth envelope is amplitude-driven, not phoneme-accurate lip sync. Default captions follow actual word timing. Use exact caption text; do not invent shortened phrases that silently misalign.

## Review and finish
Review `review/events.json` times and short clips around contacts and cuts. Check each character from front/side, then compare the same identity across all shots. Keep important faces/props clear of captions and platform overlays. Check prop hand attachment and gait against travel distance. Tone, staging and readability matter more than constant motion. Typical baseline captions are 76 px at y=1420 on 1080×1920; adjust within validated bounds to match a sample and avoid collisions.

Render with the bundled Three.js engine and FFmpeg. Do not claim a complete visual match until the encoded video has been watched against the reference. Current built-in sets are procedural and less detailed than the supplied productions; rich bespoke monsters, clothing textures and film-specific environments require additional reusable assets.

See `references/validation.md` for completed checks and the outstanding visual acceptance requirement.
