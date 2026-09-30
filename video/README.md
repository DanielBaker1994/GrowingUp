# Kahshe Lake family film

- `final.mp4` — the film (1920x1080, 30 fps, 80 s, with sound). No on-screen titles, dates or names.
- `hf-project/` — the HyperFrames project. Render: `cd hf-project && npx hyperframes render -o final.mp4 --fps 30` (needs ffmpeg + ffprobe on PATH).
  Rebuild the sound: `python3 tools/make_score.py` (the score) then `python3 tools/make_audio.py` (score + sound design into `assets/audio/mix.wav`). Needs numpy, scipy and ffmpeg.
- `storyboard/` — key stills
- `BREAKDOWN.md`, `LOG.md`, `LESSONS.md`

## Music credit
The score is an arrangement of Erik Satie's *Gymnopédie No. 1* (1888, public domain), played on sampled instruments from the
tonejs-instruments project (npm packages `tonejs-instrument-piano-mp3`, `tonejs-instrument-cello-mp3`,
`tonejs-instrument-violin-mp3`, published as MIT). Only the samples the arrangement uses are kept in
`hf-project/assets/samples/`.

## Sound credits
The sound effects are recordings (snow and wood footsteps, a door creak for the ramp hinge, lake lapping, rain, crickets,
bees, wind, water drips, a paddle), from openly licensed game and education packages: Minetest Game, Lugaru,
Scratch 1.4, The Battle for Wesnoth, MegaGlest, LinCity-NG, Crossfire and Tux Paint. The files, their authors and licenses
(CC0, CC BY 3.0, CC BY-SA 3.0, GPL-2+) are listed in `hf-project/assets/sfx/CREDITS.md`. The two lawn mowers and the
distant loons are synthesized: no usable open recording of either was reachable here.
