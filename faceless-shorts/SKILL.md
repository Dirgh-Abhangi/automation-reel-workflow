---
name: faceless-shorts
description: Create narrated vertical animated videos with local rendering, captions and sound. Use for faceless shorts, Roblox-style stories, animated explainers and short narrative videos. Roblox supports reusable scene plans and configurable character rigs; Illustrated Suspense provides a separate 2D/2.5D visual prototype; other styles retain their existing renderers.
---
# Faceless Shorts

## Route first
Use the user's selected style. Otherwise choose from the style directories under `styles/` based on the brief and references. Read only the selected `STYLE.md` and relevant resources. The user's explicit preferences take precedence; the selected style controls visual rules. Do not apply another style's caption, palette, duration or motion restrictions globally.

For **roblox-story**, use the component workflow below. Read:
- `styles/roblox-story/STYLE.md`: production steps and commands.
- `styles/roblox-story/references/component-authoring.md`: supported scene contract, character customization and extension rules.
- `styles/roblox-story/references/sample-analysis.md`: observations from the five supplied reference videos and quality targets.

For **deep-dive, night-file, inside-out, stick-story, paper-atlas, tall-tale, thriller-2d**, read the selected guide and `references/legacy-workflow.md`. These seven styles have not been converted to scene plans. Keep their existing implementations; do not claim they support the Roblox component contract. Their own style rules override conflicting generic rules in that legacy document.

For **illustrated-suspense**, read `styles/illustrated-suspense/STYLE.md` and `styles/illustrated-suspense/references/formula.md`. This is the independent 2D/2.5D route based on the nine clips supplied on 14 November 2026. Use its own JSON contract and preview renderer; do not apply the Roblox component workflow. It is a visual proof, not a production-approved style.

For **detailed-2d**, read `styles/detailed-2d/STYLE.md` and its primary drawing references before interpreting the story. Use `styles/detailed-2d/briefs/story-template.md` to capture intent and ask about material omissions before affected keyframes. This route starts from the original uploaded 2D baseline; the later prototypes are not its visual foundation. It currently supplies reference and brief contracts, not a finished renderer.

## Phase-one visual foundation
For development of reference-quality Roblox assets, read `styles/roblox-story/foundation/FOUNDATION.md` and `quality-gates.json`. These proof assets are not approved production defaults. Finish visual acceptance and renderer integration before using them for final videos.

## Component production workflow
1. Interpret the brief, narration language, duration, cast and visual references. Use reasonable defaults; clarify only decisions that block the work. If video creation is already authorized, proceed without a redundant “Build it?” question.
2. Check capability coverage before writing. Match every required character, location, prop and action to the catalog. For an unsupported capability, explicitly build and validate a reusable extension or explain the remaining gap. Never silently substitute a different action or fabricate API names.
3. Write the story and freeze narration. Assign characters stable, neutral IDs (`protagonist`, `witness`, `rival`); customize their appearance separately from shot data. Do not tie roles to the example cast.
4. Generate/import narration; align the fixed transcript. Preserve language, timing provenance and confidence. Bind stable word IDs. Do not label length-weighted estimates as measured word alignment.
5. Produce `scene-plan.json` using the existing contract. Choose locations, actor motions, positions, camera presets, props and timed sound events. Routine generation edits data, not engine code. Match the reference's pacing and deliberate holds; do not move the camera or add a sound on every cut automatically.
6. Validate and prepare. Check character IDs, timeline coverage, exact word anchors, prop ownership and audio requirements. Invalid plans must stop before rendering. Changed narration invalidates speech timings and dependent anchors.
7. Preview representative character views, each shot's key poses and event-centered motion segments. Inspect contact, feet, faces, text, framing and transitions. A successful runtime check is not proof of good animation.
8. Repair the failing shot or component, keeping approved data intact. Start with at most two automatic local repair attempts; identify an unresolved capability gap instead of looping indefinitely.
9. Render final MP4 only after review. Check encoder success, duration, dimensions, frame rate, audio streams and actual playback. Deliver the result with an honest account of any unverified quality or unavailable runtime.

## Extend the reusable system
Turn new references into general capabilities: a configurable rig, prop, environment, motion clip or shot recipe. Keep identities and stories in data. Give each new capability an explicit contract, a small working example and a regression test. Test both a reference-inspired beat and a different story/character combination. Preserve the ability to change colors, clothing, accessories and supported proportions without editing animation code.

## Boundaries
This is a code-rendered animation system. Runtime requirements depend on the route: Illustrated Suspense uses Node.js, Sharp and FFmpeg; other engines may require Python and browser graphics, plus a speech source; a chat model alone does not execute it. Do not promise exact reference quality, arbitrary character imports, automatic inverse kinematics or cross-style support that has not been implemented and tested. Do not publish or upload videos to social platforms unless explicitly requested.
