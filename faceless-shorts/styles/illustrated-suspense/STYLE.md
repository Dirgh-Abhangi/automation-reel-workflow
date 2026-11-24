# Illustrated Suspense — independent 2D / 2.5D style

Use this route for the nine reference clips supplied on 14 November 2026: illustrated suspense, survival countdowns, rule-based danger and viewer-choice stories. Read references/formula.md and inspect references/overview-*.jpg before designing artwork. Do not use the Roblox assets, Blender laboratory, or the existing thriller-2d renderer as this style's visual baseline. Those eight existing styles remain separate.

## Current capability, honestly stated
This is a **new visual and compositing proof**, not a complete video-generation workflow or an accepted match to the references. The original SVG character, corridor, door insert, reaction shot and choice cards can be regenerated and animated. Fonts, geometry, materials and timing remain visible and editable. No Blender, browser GPU, paid rendering API or 3D mesh is required. Do not mistake successful encoding for visual parity.

Read review/status.json for implemented and missing capabilities. Review review/keyframes.jpg and review/proof.mp4. Source footage in the reference boards is for comparison; do not use those frames as production backgrounds or claim they are original assets.

## Build and inspect
From example/, install Node.js dependencies with `npm install`. Use Node 22+ and FFmpeg available on PATH. The pinned Sharp dependency rasterizes SVG; Python and Blender are not required.

```sh
node render.mjs --check
node --test test.mjs
node render.mjs --stills --out /absolute/output
node render.mjs --out /absolute/output
```

Use `--plan /absolute/plan.json` to select another configuration. Paths may contain spaces if shell-quoted. The first render command makes 720×1280 stills; the full preview makes a silent 360×640 / 30 fps MP4. These are proof outputs, not final delivery resolution. A platform-specific Sharp fallback may use CODEX_PRIMARY_RUNTIME_NODE_MODULES when installed; normal external use resolves the local npm dependency. Do not hardcode a host path.

## Low-cost-model editing contract
Copy example/plan.json; edit data before editing source. Supported fields:

| Field | Allowed values / limits |
|---|---|
| version | 1 |
| palette | night, day; day is an uncalibrated proof variation |
| character | skin, hair, coat, shirt as six-digit hex; hairStyle swept or bob |
| status | 0–15 characters, screen-locked |
| shots[].type | establish, insert, reaction, choice |
| shots[].duration | 0.5–8 seconds per shot; at most 60 seconds total |
| shots[].expression | neutral, worried, surprised |
| shots[].caption | at most 6 words / 32 characters; one line |
| shots[].highlight | one exact caption token, including punctuation |

Choice labels, corridor geometry, camera paths and the single reach gesture are currently authored in scene.mjs. Do not invent JSON controls for pets, arbitrary props, walking, lip sync, multiple actors or choice labels. Build and test those components before exposing them. No property currently provides independent age/body-type control. Two hair silhouettes and color changes do not constitute a full customizable cast.

## Production method to develop
1. Pick a coherent reference treatment: domestic/night suspense or daylight survival/countdown. Keep the common drawing language, but calibrate lighting independently.
2. Establish one original character in front, three-quarter and back views; neutral/fear/surprise/speaking expressions; near/far eye and mouth alignment; body and clothing variants. Match the illustrated look before expanding the cast.
3. Approve one room and one exterior at wide, medium, insert and close-up scales. Layer architecture, character, occluders, light, particles and HUD independently.
4. Lock three visual samples against selected reference frames before expanding motion. Inspect shape proportions, outline weight, composition, local detail and tone, not only file correctness. Record user rejection as an unmet style gate.
5. Extend one action at a time: gesture, blink, head turn, expression replacement, prop interaction, foreground hand and multi-plane move. Prefer carefully timed limited animation; do not add constant bobbing to every element.
6. Build narration-first shots around story information. Use a clue insert, reaction and consequence; hold when suspense needs it. Import the user's voice source later; never claim estimated caption timing is acoustic alignment.
7. Inspect key poses and dense event windows, then full temporal playback. Check text spacing, readable highlights, character continuity, occlusion, prop contact, tracked HUD and motion direction at cuts.
8. Only after visual acceptance expand generic characters, pets, buildings, props, maps, thermal views and effects into the reusable library. Test new cast/story combinations on the user's chosen model; do not promise equal output across all models.
