# BREAKDOWN — "Growing up, together." (Kahshe Lake family film)

**Mode:** Original (no reference video). **Category:** `editorial-collage` (paper-cut diorama, half stills-in-code, half characters in motion). The skill's `liquid-glass-ui` look was ruled out. Nothing here is a UI showcase.
**Spec:** 1920x1080, 30 fps, 1700 frames (56.67 s), stereo audio. **Beat grid:** one 3/4 bar = 100 f. Every cut lands on a bar line.

## Donor numbers used (from the skill's corpus, not copied shots)
- Cut rhythm: hold 6–10 s on a story beat, one 3–4 s "hush" beat (SOLD) — slower than a SaaS launch on purpose. Long tail settles: 30–45 f, no lockstep starts.
- Easing: entrances outQuart/outExpo, camera inOutSine over the whole shot, springs only for physical things (the SOLD plank). Camera never ends a shot at zero speed except the final hold.

## Look
- **Paper-cut diorama**, drawn in code (SVG, seeded scissor-cut edges), parallax layers, film grain + paper fibre overlay, warm vignette. No glass, no cards, no gradient blobs, no template motion.
- **No type.** Revision 3 removed every on-screen word the film had added (years, captions, pencil notes, dog names, end title). The pictures carry the years: the boys grow, the dogs change, the houses change. The only lettering left is the realtor's FOR SALE / SOLD sign in S5.

## Script (from the brief, no invented facts)
Family of four (mom, dad, sons born 1992 and 1994) at Kahshe Lake, Ontario. Two dogs: grey schnauzer, black shih-tzu/poodle. Later: Ludwig and Wolfgang (black schnauzer brothers) and Ruby (apricot doodle).

**Reference photos (revision 2):** the family's own photos were used as drawing references only, never placed in the film: the country house listing (gambrel roof, two dormers, porthole window, raised deck, ornamental grass) for S4 and S5; the dock (white pines over granite, black hose, carved bear on a stump, stone wall with concrete cap, mat-topped ramp, grey floating sections, tea-dark water) for S3; the great room (knotty pine, stone chimney, tall white-framed windows, tan leather sofa with red and cream pillows, sun grid on the pine floor) for S7; the two schnauzers at the door for the dogs-from-behind rig; the 2025 deck (Dad in blue, son in navy with hands on his head, daughter-in-law in white with a ponytail, red Adirondack, folding chair, inukshuk, goldenrod, dusk reflections) and the three dogs at the window for S8.

**Revision 3:** no on-screen type at all (no years, captions, dog names or end title); the ice no longer cracks; the 2004
backyard and 2014 scenes are gone; a new deck scene from the family's photo; the dock is seen head-on; new score.

| # | Frames | When / where | What happens | Camera / transition |
|---|---|---|---|---|
| S1 | 0–300 | March, the frozen lake | Family + both dogs walk across the lake at dusk toward the cottage; the windows come on (f175–235). One unbroken walk. | slow push-in 1.0→1.16, parallax. Exit: exposure flash f290–322 |
| S2 | 300–500 | Summer, the cottage deck | From the photo: carved bear on its stump in the foreground, weathered boards with railing shadows, picnic table under a furled red umbrella, two sling chairs, grey siding. The white schnauzer and the grey shaggy dog with the red collar chase each other round a loop on the boards. | 3D-projected deck (yaw −20°), push 1.0→1.05. Exit: torn-paper wipe f500–522 |
| S3 | 500–700 | October, the dock | Head-on from the floating dock, as in the photo: pines over the granite face, black hose, bear on the cap, stone wall, slab ledge. Dad, at the lake end, lifts the mat-topped ramp off its crib and presses it overhead; the older boy, at the shore end, steadies it, then walks it up to standing and ties it off with the yellow rope. Mom and the youngest watch from the cap with the pike pole and wrench; the shih-poo sits, the schnauzer trots along the cap. | 3D ramp (hinged at the slab, planks + mat on top, stringers and algae underneath), slow push and tilt up. Exit: warm dip f692–716 |
| S4 | 700–900 | July, the country place | The gambrel house at the back of the lawn; Dad on the riding mower, Mom on the push mower, the younger son raking; old schnauzer under the maple, gangly puppy bounding. | slow pan right. Exit: hard cut |
| S5 | 900–1000 | September | The same house, FOR SALE sign, the SOLD rider drops and swings. Hush beat. | push toward the sign. Exit: dip to black f992–1014 |
| S7 | 1000–1200 | The great room | Two small black schnauzers tear laps across the pine floor, then hop onto the leather sofa; one flops onto the red pillow. | drift right + push 1.0→1.1. Exit: light leak f1192–1236 |
| S8 | 1200–1700 | Dusk, the lake deck | Dad, a son and his wife at the rail, seen from behind; the son puts his hands on his head, she turns to them. The camera pulls back through the window: the schnauzer brothers and Ruby rise to the sill one after another and look down at them. | two-plane dolly-out; fade to black f1668–1699 |

## Rhythm
One 3/4 bar = 100 frames (54 BPM). Cuts at f300/500/700/900/1000/1200, all on bar lines. The melody enters with the deck (bar 4 = f400), the long held note covers the sale and the great room (bars 8–11), the second phrase is the 2025 deck (bars 12–15), and the final chord lands at f1600 under the window.

## Sound
**Score** (`tools/make_score.py`): an arrangement of Satie's Gymnopédie No. 1 (public domain) on sampled felt piano, with a bowed cello under the bass from bar 4 and a violin holding the long note and doubling the second phrase. Soft plate reverb. **Sound design** (`tools/make_audio.py`, synthesized, placed from the composition's frames): snow crunch from the walk clock (S1), paws on deck boards computed from each dog's gallop phase and distance plus the red collar's tag (S2), the ramp's hinge creak, the heave, drips into the lake and the knock as it stands (S3), two mowers panned across S4, the SOLD rider's clunk and chain (S5), nails on pine and two sofa thumps (S7), loons, crickets and three paw clicks on the sill (S8).
