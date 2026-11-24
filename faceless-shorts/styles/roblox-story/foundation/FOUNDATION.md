# Phase-one proof laboratory

This is a work-in-progress visual laboratory, separate from the existing story renderer. Do not substitute it for an approved production asset library. The bundled rendered study is the actual exported geometry, not an image-generation concept.

## Rebuild on the target machine
Run `blender -b --python build.py -- --out /absolute/output --render` from this directory. Omit --render to generate an editable Blender scene and GLB only. Python dependencies are supplied by Blender; no model API or paid service is required by this builder. Windows users should supply their Blender executable path. Avoid hardcoding machine paths in plans.

Edit characters.json to vary clothing, skin, hair colors, scale, long-hair and glasses. Stable joint names use character ID plus hips, torso, head, shoulder_L/R, elbow_L/R, hand_L/R and leg_L/R. These are transform hierarchies, not a skinned armature. The child has larger relative head proportions; older posture is adjusted, but these remain preliminary character-family studies, not fully differentiated production models.

Tested with Blender 4.3.2. Use --frame 42 for the raised-arm key pose. The Blender area-light setup is not carried into GLB: recreate equivalent illumination in the consuming renderer. The exported camera and mesh materials are included.

The three-second study contains a wave with anticipation, lift, small oscillations and return, head turns, and neutral/surprised/tense/neutral facial keyframes. Key poses have been rendered; continuous motion and interpolation still need playback review. The GLB contains one combined scene animation with body and facial transform channels; the previous Three.js scene-plan renderer does not yet import these assets. Do not claim that integration is complete.

## Visual standard to establish
Use the warm domestic references for materials/light, hospital references for environment organization, and neon references for a separate future effects pack. Maintain original identities. Do not merge all visual profiles indiscriminately.

Inspect front/side/back and close-up views generated from the same model. Compare silhouette, face placement, hair clumps, material response, cloth layering and joints. Avoid bead-like hair and overly toy-like rounding if they depart from the target reference. The refined proof replaces bead hair with swept mesh clumps and reduces garment/head rounding. It remains toy-like and is not approved as the target look. Family stills use 64 CPU samples; view studies use 48. Denoising is disabled for compatibility with the available CPU renderer.

## Phase-one completion order
1. Refine master character silhouette, hair and garment construction against selected reference frames.
2. Differentiate adult, child and older families beyond recoloring and scaling.
3. Implement controllable gaze, brows, eyelids and mouth shapes with expression transitions.
4. Add walk/stop/turn/sit/reach/reaction studies with foot and hand contact checks.
5. Validate furnished room layout and close/medium/wide/over-shoulder camera coverage.
6. Add one complete portal/reveal effect with editable stages and light interaction.
7. Import/export the approved assets and clips into the story renderer.
8. Test unseen character/story combinations using the target low-cost model.

Only after visual acceptance should the assets become production defaults. Expand the reusable library in phase two. Keep other seven animation styles unchanged. Read quality-gates.json for actual current status; do not infer completion from file existence.

## Reproducible character studies
Run `blender -b --python studies.py -- --scene /absolute/output/character_lab.blend --out /absolute/studies`. Optional `--only back,tense` limits rendering to named views. See character_studies.jpg and studies/ for front, side, back, three-quarter, neutral, surprised, tense, return and wave poses of adult_a. Rear-view study hides room geometry to avoid wall occlusion. These are inspection cameras, not cinematic story coverage.

Facial changes currently animate eye scale, brow rotation and mouth geometry transforms. They are hardcoded proof keyframes, not a reusable expression-control API. Only adult_a received multi-angle inspection; all families still need separate turnaround and motion acceptance. Phase one remains open; no target-model quality benchmark has run.

## Walk, contact and camera proof
Use Blender **4.3.2** for `motion_study.py`; later layered-action APIs have not been validated. Build character_lab.blend first, then run:

```sh
blender -b --python-exit-code 1 --python motion_study.py -- --scene /absolute/output/character_lab.blend --out /absolute/motion --character adult_a --render --samples 16
ffmpeg -y -framerate 30 -i /absolute/motion/frames/%04d.png -c:v libx264 -pix_fmt yuv420p -movflags +faststart /absolute/motion/motion_preview.mp4
```

The deterministic six-second proof has four short steps, a stop, a reach, palm contact with a cube, a lift and a hold. The first shot tracks the walk; the second cuts closer and gently pushes in. `--frames 1,30,90,120,180` renders only inspection stills; do not encode a sparse sequence as a complete clip. Default preview resolution is 270×480, 30 fps. This noisy, low-resolution render is a motion diagnostic, not a final-quality deliverable. Outputs include an editable scene and contact-report.json. The preview is silent.

Select an existing ID from characters.json. Adult and child profiles have passed evaluated-transform contact checks; the child also has arrival and lifted-prop stills. Scaling must be uniform and positive. This proof normalizes torso posture; it does not yet preserve an older character's unique gait. Prop, step path, timings, reach and camera offsets remain a single proof recipe in code. Do not advertise arbitrary prop manipulation, independent expression direction, general collision avoidance or story-plan integration.

The solver uses two-segment legs and arms with fixed limb lengths. Planted feet stay in world space; swing feet follow eased paths. Limb orientation uses a shortest rotation from the downward rest axis to avoid roll flips when a knee crosses vertical. Quaternion signs are kept consistent before baking. Palm-to-prop contact is a surface attachment with a block hand, not articulated finger grasping.

After baking, inspect evaluated sole bounds, stance displacement, limb endpoint continuity and palm/cube contact at **359 half-frame samples**. Reject errors above 0.003 times character scale. Read bundled motion-contact-adult.json and motion-contact-child.json for measured results. These tests do not measure whole-mesh collisions, expressive quality, gait realism or perceptual playback. Keep production approval false until those checks and reference comparison pass. Inspect all frames around foot landing, reach/contact, lift and the camera cut. Review this proof before porting its controllers into the production runtime; motion_study.py does not update character_lab.glb or the Three.js renderer.

Observed visual limitation: the pedestal occludes part of the legs during the approach. Add an unobstructed side-view diagnostic and refine the narrative camera before approving gait or cinematic framing. The present walk has basic arm swing and hip motion; weight transfer, toe roll, finger articulation and nuanced acting remain work in progress.

Use motion_studies.jpg for the inspected key poses and motion_preview.mp4 for the complete diagnostic clip. File decoding was verified; frame-sequence inspection is not a claim of real-time perceptual playback review.
