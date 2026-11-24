# Reference-derived formula

## Evidence and limits
Nine distinct supplied videos, all 720×1280 at 30 fps; approximately 13.18 minutes combined. Examined 108 evenly distributed overview frames and 96 frames in eight four-second event windows. This is sampled visual analysis, not complete frame-by-frame playback or a perceptual audio review. inventory.json records filenames, durations and file hashes. overview-0 through overview-8 correspond to those numbered entries. Dense boards identify timestamps.

The source project files are unavailable. Layered 2D composition is a practical reconstruction inferred from the visible motion; do not claim knowledge of the creators' software or prove that none of their shots use 3D. Most observed results can be reproduced with illustrated planes, transforms, masks, perspective drawing and light overlays.

## The actual common denominator
- Illustrated cartoon people: large rounded heads, simple oval eyes with small highlights, small noses/mouths, dark but relatively fine contours, shaped hair silhouettes and readable clothing seams. Faces carry expressions through eyebrow/eye/mouth changes. Avoid realistic skin, rounded plastic block bodies and physically based bevel highlights.
- Environments retain materially more detail than the characters: shelves, panel joints, frames, floorboards, rails, labels, furniture, window slats and trees. Use illustrated detail and clear depth, not photorealistic materials.
- Perspective is usually established by the background drawing. Separate foreground occluders, mid-ground subjects and background planes supply depth during controlled pans and pushes. A simulated lens, vignette, light shaft or particle overlay does not require a 3D rig.
- Limited character animation sits inside active editorial pacing. Held body poses, small head/arm changes, replacement facial drawings, short translated walks and deliberately distorted silhouettes alternate with close-ups and object inserts. Do not infer full skeletal acting from smooth camera motion.
- Short uppercase caption chunks occupy the lower image, with a few meaningful words colored red, amber or another story accent. Captions are neither large paragraphs nor decorative title cards throughout the story.
- Compact screen-locked HUD tags make a threat legible: time, day, temperature, budget, distance, battery or scan state. Values change only when story state changes.
- The recurring dramatic structure is hook → rule or backstory → concrete threat evidence → attempted solution → cost or contradiction → forced choice. Sequels can begin with the previous viewer choice. This is a transferable formula, not a mandatory copied plot.

## Two related treatments
**Night / suspense:** cool navy, charcoal and muted blue-green environments, warm domestic light islands, darker foreground framing, tight detail shots, red danger accents, held reactions. Examples: overview 0, 1, 3, 4, 6, 7, 8.

**Survival / countdown:** brighter illustrative exteriors, architectural cutaways, countdown/budget/temp HUDs, explanatory inserts, weather layers and gradual day-to-night escalation. Examples: overview 2 and 5. Do not grade every daytime shot with the heavy night vignette.

## Evidence-to-component mapping
| Clip / time | Visible behavior | General component to build |
|---|---|---|
| 0, 31–35 s | Facial replacement followed by an elongated silhouette behind foreground slats | Expression states + controlled deformation + independent occluder mask |
| 1, 40–44 s | Hold on a tall silhouette, then closer evidence of a door opening | Threat hold + clue insert + opening mask |
| 3, 14–18 s | Foreground hands, paw/contact close-up, then an urgent timer | POV hand rig + contact anchor + timer card |
| 4, 29–33 s | Face close-up cuts to deep corridor; scan light and status warning appear | Perspective environment + scan sweep + state-driven HUD |
| 5, 89–93 s | Figure at a gate, gesture, cut to intercom, waveform animation | Gesture replacement + prop insert + waveform display |
| 6, 13–17 s | Thermal view reveals a silhouette, then exterior/face close-up | False-color silhouette treatment + reveal + reaction cut |
| 7, 24–28 s | Distance countdown, small translated figures, pet/lead close-up | Screen HUD + depth-scaled movement + prop continuity |
| 8, 56–60 s | Pet/legs insert, dark reaction, concealed face with eye accents | Foreground insert + darkness hold + selective glow |

These windows demonstrate techniques, not measured average shot lengths. The prototype's 1.8–2.2 second shots are design choices, not statistics calculated from the samples.

## Asset design contract for later expansion
Create original, neutral IDs. Keep role (protagonist, stranger, helper), age/proportions, body design, hair, wardrobe and expression independently configurable. Supply adult, child, older and special character families with their own drawings; simple scaling is not enough. Pets require separate silhouettes and action poses. Store each character's head, hair, eyes, brows, mouth, torso, upper/lower arms, hands and legs as named layers with pivots and contact anchors. Add front/three-quarter/back views rather than rotating a flat front drawing through a fake full turn.

For environments, supply base perspective, masks, foreground frame, props, detail layer, light overlay and camera-safe margins. Detail must survive the intended close-up. For effects, store timed stages (anticipation, onset, peak, decay, hold) with restrained defaults. Preserve caption and HUD readability.

## First proof gap
The new SVG proof establishes editable flat artwork, four shot roles, a face change, a foreground reach, small movement, lighting overlays, screen HUD and emphasized captions. It is intentionally small. It lacks the reference environments' richness, broad character library, fine acting, cinematic effects range, audio timing and sustained story variety. Do not promote it as an exact-quality match. The immediate next test is visual calibration, not additional generic asset quantity.
