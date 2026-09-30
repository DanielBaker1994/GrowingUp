# BREAKDOWN — "Growing up, together." (Kahshe Lake family film)

**Mode:** Original (no reference video). **Category:** `editorial-collage` (paper-cut diorama, half stills-in-code, half characters in motion). The skill's `liquid-glass-ui` look was ruled out. Nothing here is a UI showcase.
**Spec:** 1920x1080, 30 fps, 1790 frames (59.67 s), stereo audio. **Beat grid:** 72 BPM = 25 f/beat = 100 f/bar. Every cut lands on a bar line.

## Donor numbers used (from the skill's corpus, not copied shots)
- Cut rhythm: hold 6–10 s on a story beat, one 3–4 s "hush" beat (SOLD) — slower than a SaaS launch on purpose. Long tail settles: 30–45 f, no lockstep starts.
- Easing: entrances outQuart/outExpo, camera inOutSine over the whole shot, springs only for physical things (the SOLD plank). Camera never ends a shot at zero speed except the final hold.
- Type: display serif ~190 px (≈17.6% of frame height), mono caption 22 px, handwritten note 74 px; holds ≥ 2 s.

## Look
- **Paper-cut diorama**, drawn in code (SVG, seeded scissor-cut edges), parallax layers, film grain + paper fibre overlay, warm vignette. No glass, no cards, no gradient blobs, no template motion.
- **Type:** Fraunces (light + light italic, optical size 144) for the year and the closing line, DM Mono for place captions, Reenie Beanie for the pencil notes.
- **Recurring device:** a year odometer (each digit rolls with its own ease and stagger) + a pencil ruler along the bottom marking 2004→2025, so "growing older" is the spine of the film.

## Script (from the brief, no invented facts)
Family of four (mom, dad, sons born 1992 and 1994) at Kahshe Lake, Ontario. Two dogs: grey schnauzer, black shih-tzu/poodle. Later: Ludwig and Wolfgang (black schnauzer brothers) and Ruby (apricot doodle).

**Reference photos (revision 2):** the family's own photos were used as drawing references only, never placed in the film: the country house listing (gambrel roof, two dormers, porthole window, raised deck, ornamental grass) for S4 and S5; the dock (white pines over granite, black hose, carved bear on a stump, stone wall with concrete cap, mat-topped ramp, grey floating sections, tea-dark water) for S3; the great room (knotty pine, stone chimney, tall white-framed windows, tan leather sofa with red and cream pillows, sun grid on the pine floor) for S7; the two schnauzers at the door for the dogs-from-behind rig; the 2025 deck (Dad in blue, son in navy with hands on his head, daughter-in-law in white with a ponytail, red Adirondack, folding chair, inukshuk, goldenrod, dusk reflections) and the three dogs at the window for S8.

| # | Frames | Year / where | What happens | Camera / transition |
|---|---|---|---|---|
| S1 | 0–300 | 2004 · March | Family + both dogs cross the frozen lake at dusk toward the far cottage light. Ice cracks (f118), everyone freezes, schnauzer sits; window lights up (f175–235). Note: "the boys are 12 & 10". | slow push-in, 1.0→1.16, parallax 0.02–1.5. Exit: exposure flash f290–322 |
| S2 | 300–500 | 2004 · August ("six months on") | The two dogs chase each other around the yard; the black shih-poo is greyer and tires first, sits and pants; the schnauzer play-bows. | lateral dolly + slow push. Exit: torn-paper wipe f500–522 |
| S3 | 500–700 | 2006 · October | At the stone wall below the cottage: Dad and the older son (14) lift the mat-topped ramp off the floating dock on yellow ropes and carry it along the ledge; Mom and the younger son (12) wait on the cap by the carved bear with the pike pole and wrench; the shih-poo sits, the schnauzer trots after them. | pan left 1130→920 with push 0.98→1.06. Exit: warm dip f692–716 |
| S4 | 700–900 | 2010 · July, the country place | No lake; the gambrel house sits at the back of the lawn against the wood line. Dad on the riding mower, mom on a push mower, younger son (now 16) raking; old schnauzer frail under the maple, big gangly puppy schnauzer bounding. Older son is off at university (note). | slow pan right. Exit: hard cut |
| S5 | 900–1000 | 2011 · September | The same gambrel house, FOR SALE sign, SOLD plank drops and swings. Hush beat. | push toward sign. Exit: dip to black f992–1014 |
| S6 | 1000–1200 | 2014 · August | Cottage backyard at dusk. Old grey schnauzer, frail, walks a few steps, sits, lies down; the young schnauzer play-bows and flops beside him. | push-in 1.0→1.24. Exit: dissolve + light leak f1196–1240 |
| S7 | 1200–1400 | 2023 · June | The great room: Ludwig (black collar) and Wolfgang (blue collar), two small black schnauzers, tear laps across the pine floor, then hop onto the leather sofa; Ludwig flops onto the red pillow. Names written in pencil. | drift right + push 1.0→1.1. Exit: light leak f1392–1436 |
| S8 | 1400–1790 | 2025 · August | Dusk on the lake deck: Dad, a son and his wife at the rail, seen from behind; the son puts his hands on his head, she turns to them. The camera pulls back through the window (f1518–1662): the frame racks into focus and Ludwig, Wolfgang and Ruby rise to the sill one after another, looking down at them. "Growing up, together." over the upper panes. | two-plane dolly-out (lake 3.05→1.0, room 4.6→1.0); type f1650+; fade to black f1762–1789 |

## Rhythm
Bars: S1 = 3 bars, S2/S3/S4/S6/S7 = 2 bars each, S5 = 1 bar, S8 = a 2-beat breath + 3 bars (bars 14–16 shift by 50 f so the final chord lands under the end card at f1650). Cuts at f300/500/700/900/1000/1200/1400. Motion accents on beats: crack at f118 (bar 2 beat 4.7), plank drop f922 (bar 10 beat 1.9).

## Sound (all synthesized, `tools/make_audio.py`)
Felt piano + plucks + pad + soft kick/shaker (D major), built up over bars 4–9, one lonely note at the sale, quiet reprise, full swell at 2023. Sound design placed from composition frames: footfalls computed from the walk clock (S1), ice boom/cracks, dock creak/scrape/drips, two engines panned across S4, cricket bed at dusk, plank clunk + chain rattle, nails on pine and collar tags in the great room with two sofa thumps, loons and crickets on the 2025 lake, three nail clicks as the dogs reach the sill.
