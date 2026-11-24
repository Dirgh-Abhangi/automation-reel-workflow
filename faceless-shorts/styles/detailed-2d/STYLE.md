# Detailed 2D — reference and story contract

Use this development route for the ten Video-*.mp4 mythological illustrated-animation references supplied on 14 November 2026. Current stage: reference context and brief specification. Character construction drawings, upgraded puppet code and a visually accepted renderer are NOT yet complete. Do not use the previous Roblox or Illustrated Suspense prototypes as the visual foundation.

## Original baseline
Build from the original uploaded faceless-shorts.zip, SHA256 288d9ab0128892fb5ed7acbac9b097303dda5e856f1d5b805d4505f8458bb202. The existing ../inside-out/ tree was checked against that archive: all 16 files matched. Reuse that original Canvas 2D project structure and capture/timing utilities as appropriate. Its simple hero, explainer palette, fixed legs, independent elbow/hand interpolation, mandatory cut effects and ban on gradients are NOT this style's drawing specification. Preserve other styles. Do not use the newer SVG prototype as the base. No Blender is required.

## Read these before keyframes
1. Read references/drawing-rules.md and inspect the relevant primary-overview and primary-motion boards. Their index is references/inventory.json; IDs R0–R9 map to the numbered entries. Treat these videos as the primary visual target, not decorative inspiration.
2. Read briefs/story-template.md. Accept natural-language input; organize it into this format on the user's behalf. Do not require the user to hand-write JSON or animation coordinates.
3. Read briefs/filled-example.md for the expected precision. It illustrates specification, not a mandatory plot, costume or cast.
4. Produce a normalized brief like briefs/example.json and run `python tools/check_brief.py /path/to/brief.json`.
The included example intentionally leaves C02 face design as ASK; the checker exits 2 and identifies that question. Exit 0 means explicit fields are resolved, not that art is approved.
5. Perform a semantic completeness review; a successful checker cannot prove that prose specifies enough detail or that art matches the references.

## Reference priority and conflicts
The user's explicit current direction takes precedence. Within that direction, use the selected reference boards and approved construction sheets for drawing; the approved story brief for identity, setting, action and continuity; and original renderer utilities only for implementation. Do not import unrelated style defaults. If a story request conflicts with a locked visual detail, ask which should change instead of silently choosing. A character ID always names the same design until the user changes it.

Construction sheets are still pending. Do not claim they exist, substitute unrelated style sheets, or label reference contact sheets as executable assets. Once constructed and visually accepted, place character/face/joint/environment sheets beside their drawing modules and explicitly map each labelled part to a code component. Render the sheets from that same code so illustration and implementation cannot drift.

## Missing information protocol
Distinguish FIXED, ASK and AGENT_CHOICE. Missing fields do not grant creative freedom. AGENT_CHOICE is permitted only at exact paths listed in creative_freedom, based on the user's explicit delegation. Record the resolved value before drawing; never pretend it was supplied by the user. For an ASK or unresolved conflict, collect short, specific questions with options and explain what visual decision each affects. Ask about identity, era/place, costume, visible layout, who acts on whom, left/right ambiguity, emotional intent, prop ownership and outcome when missing or contradictory. Continue independent analysis while awaiting answers; do not render the affected character, scene or shot. Do not block unrelated work on a missing frame-rate choice or harmless implementation detail.

After answers, restate the affected decisions and update the brief. Do not invent missing story events, violence, relationships, dialogue or historical details. Treat references as visual evidence, not authoritative historical sources. Voice, story rewriting, publishing and unrelated workflow changes are outside this upgrade unless requested.

## Keyframe specification
For each shot create: start pose, contact/action peak, end pose; cast IDs and screen positions; facing and gaze targets; head/torso angles; shoulder/elbow/wrist and hip/knee/ankle landmarks; hand pose; prop attachment; face state; environment layers; crop and caption-safe space. Express actor-left/right separately from screen-left/right. Infer implementation coordinates from approved composition; the user need not supply them. Keep limb lengths and face proportions consistent.

Use a separate semantic review for physical feasibility: can the hand reach the object without stretching, do the feet support the pose, does jewelry follow the body, is the arm in front of or behind the torso, does the background remain consistent across cuts? Flag unsupported actions before drawing. Missing capability requires an implemented and inspected component, not a generic replacement.

## Acceptance order
First match one detailed character, an expression set and one environment against the primary references. Then inspect a short gesture/contact sequence. Expand only after the drawing language is accepted. A renderer that runs is not a successful visual match. Keep visual approval and target-model performance marked unverified until actually evaluated. Do not generate another full proof video merely to demonstrate that the pipeline runs.
