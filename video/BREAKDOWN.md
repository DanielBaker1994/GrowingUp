# BREAKDOWN — "Growing up, together." (Kahshe Lake family film)

**Mode:** Original (no reference video). **Category:** `editorial-collage` (paper-cut diorama, half stills-in-code, half characters in motion). The skill's `liquid-glass-ui` look was ruled out. Nothing here is a UI showcase.
**Spec:** 1920x1080, 30 fps, 1700 frames (56.67 s), stereo audio. **Beat grid:** 72 BPM = 25 f/beat = 100 f/bar. Every cut lands on a bar line.

## Donor numbers used (from the skill's corpus, not copied shots)
- Cut rhythm: hold 6–10 s on a story beat, one 3–4 s "hush" beat (SOLD) — slower than a SaaS launch on purpose. Long tail settles: 30–45 f, no lockstep starts.
- Easing: entrances outQuart/outExpo, camera inOutSine over the whole shot, springs only for physical things (the SOLD plank). Camera never ends a shot at zero speed except the final hold.
- Type: display serif ~190 px (≈17.6% of frame height), mono caption 22 px, handwritten note 74 px; holds ≥ 2 s.

## Look
- **Paper-cut diorama**, drawn in code (SVG, seeded scissor-cut edges), parallax layers, film grain + paper fibre overlay, warm vignette. No glass, no cards, no gradient blobs, no template motion.
- **Type:** Fraunces (light + light italic, optical size 144) for the year and the closing line, DM Mono for place captions, Reenie Beanie for the pencil notes.
- **Recurring device:** a year odometer (each digit rolls with its own ease and stagger) + a pencil ruler along the bottom marking 2004→2023, so "growing older" is the spine of the film.

## Script (from the brief, no invented facts)
Family of four (mom, dad, sons born 1992 and 1994) at Kahshe Lake, Ontario. Two dogs: grey schnauzer, black shih-tzu/poodle.

| # | Frames | Year / where | What happens | Camera / transition |
|---|---|---|---|---|
| S1 | 0–300 | 2004 · March | Family + both dogs cross the frozen lake at dusk toward the far cottage light. Ice cracks (f118), everyone freezes, schnauzer sits; window lights up (f175–235). Note: "the boys are 12 & 10". | slow push-in, 1.0→1.16, parallax 0.02–1.5. Exit: exposure flash f290–322 |
| S2 | 300–500 | 2004 · August ("six months on") | The two dogs chase each other around the yard; the black shih-poo is greyer and tires first, sits and pants; the schnauzer play-bows. | lateral dolly + slow push. Exit: torn-paper wipe f500–522 |
| S3 | 500–700 | 2006 · October | Dad and older son (14) lift and pull the dock out; mom and younger son (12) stand by with a pike pole and hammer; dogs nearby. | push-in with sway. Exit: warm dip f692–716 |
| S4 | 700–900 | 2010 · July, the country place | No lake. Dad on the riding mower, mom on a push mower, younger son (now 16) raking; old schnauzer frail under the maple, big gangly puppy schnauzer bounding. Older son is off at university (note). | slow pan right. Exit: hard cut |
| S5 | 900–1000 | 2011 · September | House front, FOR SALE sign, SOLD plank drops and swings. Hush beat. | push toward sign. Exit: dip to black f992–1014 |
| S6 | 1000–1200 | 2014 · August | Cottage backyard at dusk. Old grey schnauzer, frail, walks a few steps, sits, lies down; the young schnauzer play-bows and flops beside him. | push-in 1.0→1.24. Exit: dissolve + light leak f1196–1240 |
| S7 | 1200–1700 | 2023 · June | Ludwig (blue collar) and Wolfgang (black + blue collar), two tiny black schnauzers, frolic in the same yard; names written in pencil. They sit; crane back to reveal the yard; "Growing up, together." | low camera → crane out to wide f210–430; type f1332+; fade to black f1640–1699 |

## Rhythm
Bars: S1 = 3 bars, S2/S3/S4/S6 = 2 bars each, S5 = 1 bar, S7 = 5 bars. Cuts at f300/500/700/900/1000/1200. Motion accents on beats: crack at f118 (bar 2 beat 4.7), plank drop f922 (bar 10 beat 1.9).

## Sound (all synthesized, `tools/make_audio.py`)
Felt piano + plucks + pad + soft kick/shaker (D major), built up over bars 4–9, one lonely note at the sale, quiet reprise, full swell at 2023. Sound design placed from composition frames: footfalls computed from the walk clock (S1), ice boom/cracks, dock creak/scrape/drips, two engines panned across S4, cricket bed at dusk, collar jingles in S7, plank clunk + chain rattle.
