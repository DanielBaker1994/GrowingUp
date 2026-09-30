# Kahshe Lake family film

- `final.mp4` — the film (1920x1080, 30 fps, 56.7 s, with sound). No on-screen titles, dates or names.
- `hf-project/` — the HyperFrames project. Render: `cd hf-project && npx hyperframes render -o final.mp4 --fps 30` (needs ffmpeg + ffprobe on PATH).
  Rebuild the sound: `python3 tools/make_score.py` (the score) then `python3 tools/make_audio.py` (score + sound design into `assets/audio/mix.wav`). Needs numpy, scipy and ffmpeg.
- `storyboard/` — key stills
- `BREAKDOWN.md`, `LOG.md`, `LESSONS.md`

## Music credit
The score is an arrangement of Erik Satie's *Gymnopédie No. 1* (1888, public domain), played on sampled instruments from the
tonejs-instruments project (npm packages `tonejs-instrument-piano-mp3`, `tonejs-instrument-cello-mp3`,
`tonejs-instrument-violin-mp3`, published as MIT). Only the 21 samples the arrangement uses are kept in
`hf-project/assets/samples/`.
