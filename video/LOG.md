# LOG

| Round | What | Result |
|---|---|---|
| 0 | Category: editorial-collage (paper-cut diorama). No donor video analysed: the skill's analyzer needs a reference and outbound access to video hosts is blocked here, so donor numbers come from the skill's own corpus notes (see BREAKDOWN). | |
| 1 | Built S1 to S7 in one `index.html` + `js/*`, everything a pure function of the frame. Still-checked each scene with `tools/shot.cjs`. | fixed: hair covering faces, black porch-roof bar, forest block on the dock scene, dogs cramped in the mowing scene, end-card text over trees |
| 2 | Draft render (4 min) → contact sheet review | found: end card arriving mid-crane, note/label collisions in S7 → moved type later, crane earlier |
| 3 | Final render `--crf 20` (5.5 min), re-encoded x264 crf 28 for size | 1920x1080, 30 fps, 56.7 s, 16 MB, -14.8 LUFS, TP -2.8 dBFS |
| 4 | Revision from the family's photos: S3 redrawn as the real shore (ramp carried off the float), gambrel house added to S4/S5, S7 moved into the great room, new S8 (2025 deck + three dogs at the window), main.js to 8 scenes, score shifted 2 beats for the new ending, new SFX. | fixed while still-checking: people standing in water, Mom's head under the note, dogs piled on one cushion, black windows in the great room, low-contrast year over pine (added a shade scrim) |
| 5 | Final render of the 59.7 s cut | see README for size/loudness |

**Not available in this environment (said plainly):** ElevenLabs (no key, host blocked) and an image generator (none provided). Instead all art is drawn in code and all music/sound is synthesized with numpy (`tools/make_audio.py`). No Gemini listening pass; the mix was graded by numbers only (LUFS, per-bar RMS), never listened to by a human.
**Known rough edges:** faces are blank by design (paper-cut); the sons are told apart by clothes and height only; dogs are stylised, not photoreal; cracks on the ice are a graphic overlay.
