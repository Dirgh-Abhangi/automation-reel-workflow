# Component contract and customization

## Files and authoring responsibilities
`scene-plan.json` is the author-facing artifact. `src/components/contract.js` is the authoritative strict validator and `tools/story.mjs` is its CLI. Read `example/scene-plan.json` for a complete working example. `motion.js` samples animation from time; `characters.js` decorates the base rig; `sets.js` builds environments/props; `director.js` composes them. Do not rewrite these per story.

## Top-level contract
Use `{version:1,duration,characters,shots,tokens?,audio?,caption?}`. Duration is 1–180 seconds. Characters map stable IDs to appearance specifications. Shots are ordered, contiguous, positive-length intervals from zero to duration. Start/end/event `at` accepts absolute seconds or `{token:"L001:W004",edge:"s",offset:0}`. Tokens refer to exact occurrence IDs from `data/tokens.json`, not fuzzy word matches. `prepare` supplies the current token map and rejects stale narration hashes. Events use absolute timeline time. Actor start/end use seconds relative to their shot.

## Character specification
No fixed cast is required. Supported fields:
- Six-digit hex colors: skin, shirtCol, shirtAccent, shirtTrim, pantsCol, shoeCol, hairCol, badgeCol.
- shirtStyle: plain, hoodie, varsity, suit, striped, armor.
- hair: none, spiky, bob, quiff, cap, tophat, horns.
- variant: normal, buff_entity, cat_plush. These are rig archetypes, not named identities.
- scale: .5–2.5; body: `{height,width,head}` each .7–1.4, default 1. These deliberately bounded proportions preserve the basic joint system. They are not arbitrary mesh sculpting.
- accessories: array of `{kind:"glasses"|"backpack"|"headphones",color?}`.
- badgeText/badgeCol; boolean tail, catEars, chestButton.

Example original character:
```json
{"skin":"#a86d49","shirtStyle":"suit","shirtCol":"#303b64","shirtAccent":"#df8e45","pantsCol":"#212a40","hair":"quiff","hairCol":"#171822","body":{"height":1.12,"width":0.9,"head":1.05},"accessories":[{"kind":"glasses","color":"#242733"}]}
```
Reuse this character ID across shots. Change the appearance specification once to update all appearances. For a new hairstyle, garment texture or body topology, extend the factory with an explicit new option and validation; do not quietly map it to a similar existing item. No GLB/FBX import or full character editor is implemented.

## Shots
Fields: id, start, end, set, lighting, camera, actors, optional props/events/note.
- set: street, office, classroom, home, lab, arena.
- lighting: day, warm, night, alarm.
- camera: `{preset,target,move?,strength?}`. Presets: wide, two_shot, medium, close, over_shoulder, insert, low_reveal, overhead. Target is a visible actor or prop ID. Moves: hold/push/pull/orbit, strength 0–.5. Camera follows target with a preset offset; stage the second person deliberately for two-shot/over-shoulder. These presets do not solve occlusion automatically.
- actor: `{id,position:[x,y,z],to?,yaw?,motion?,mood?,intensity?,start?,end?,talk?}`. Metres, degrees; origin at feet; faces +Z. `to` is required for walk/run. Travel determines gait phase. Motion: idle, talk, walk, run, react, point, wave, sit, kneel, fall, celebrate, reach, punch, float. Mood: neutral, happy, smug, angry, shock, panic, evil, dizzy. Actor window defaults to the whole shot. These are reusable time curves, not a physics/IK solver. Stage furniture and contacts explicitly and review them.
- prop: `{id,kind,color?,text?,scale?,position?}` or replace position with owner and socket left/right. Kind: document, phone, gift, orb, button, case. Text is short (up to 80 characters; use document for readable inserts). Held props parent to the hand socket; transfers between owners are staged across cuts, not continuous handoff IK.
- event: `{at,type,gain?,dur?,pan?}` with type whoosh/pop/portal/glitch/ding/slam/boing/cheer. Add only motivated sound events.
- audio: `{music:"none"|"roblox_arcade"}`. Other score genres require importing a suitable licensed track or extending the mixer.
- caption: `{y:1420,size:76}` within validator bounds. Text follows script/timing.

## Reusable shot recipes
1. Establish a rule: street wide hold, actor talk, then document insert for the actual rule.
2. Conversation: office/home medium, matching eye lines; reaction close after a short hold.
3. Evidence: owner-held document close; move to a separate prop insert if the text must be read.
4. Escalation: low reveal on larger configurable character, cut to protagonist react; avoid hiding the cause.
5. Chase: street wide/pull, run with explicit to, follow with a static reaction. Keep travel direction coherent.
6. Classroom exchange: two visible actors at desks, seated poses, medium reverse cuts.
7. Warm-to-night turn: preserve characters/set positions, change lighting on a cut, use restrained push.
8. Arena conflict: anticipation/reach or punch, cut at contact to reacting actor, then fall/hold. Review contact manually; no automatic target IK.
9. Reconciliation: two-shot hold then happy/celebrate; allow the closing line space.
10. Device reveal: lab insert on document/button, motivated ding, close reaction.

## Extending after new samples
Record visible evidence and timing separately from inferred production software. Add an original reusable component, its allowed parameters, an independent story fixture and motion/render checks. Update validator and this catalog together. Never claim a new capability from documentation alone.

## Fast authoring with executable recipes
Write `story.json` with characters, optional audio/caption and beats. Each beat has recipe, duration and cast mapping the catalog's lead/other roles to your IDs. Optional set/lighting/camera/props/events overrides are validated. Run `node tools/story.mjs assemble story.json` to emit the full scene plan. Use `story.example.json` as a small independent example. The actual reusable recipes live in `src/components/recipes.json`; their supported IDs are establish/conversation/reaction/reveal/chase/classroom/celebration/confrontation/evidence/device. Ensure beat durations total the speech duration, then bind/prepare. For unusual staging, edit the generated plan's supported actor fields, not engine code.

Use `example/src/components/story.schema.json` as the compact core structured-generation schema. It intentionally exposes recipe selection and character customization; detailed overrides remain available in validated scene plans. Schema validity alone does not prove that role IDs, timing totals or physical staging are correct; always run assemble/validate. No provider-specific API adapter or Gemini benchmark is included.
