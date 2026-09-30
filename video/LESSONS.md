## Lessons
- RULE: If HyperFrames' bundler moves scripts, build the DOM inside a boot() on DOMContentLoaded and register `window.__timelines[id]` inline in index.html.
  EVIDENCE: external-script version rendered black and check reported "appendChild of null"; after boot() wrap it rendered.
  GOES IN: SKILL.md §4
- RULE: Keep a still-shot tool (`tools/shot.cjs`, calls the page's draw(t) and screenshots) and review 9 stills before any full render.
  EVIDENCE: ~25 layout bugs were caught at 1 s each instead of 4 min per render.
  GOES IN: SKILL.md §5
- RULE: Locked-down sandboxes: fonts/GSAP from npm (@fontsource/*, gsap), ffmpeg via pip imageio-ffmpeg, ffprobe via npm @ffprobe-installer.
  EVIDENCE: github raw and jsdelivr were 403; npm and pip worked.
  GOES IN: SKILL.md §3
- RULE: Grain overlays inflate H.264 (crf 20 = 317 MB). Re-encode the delivery at crf 26–28.
  EVIDENCE: 317 MB → 16 MB at crf 28, no visible loss on stills.
  GOES IN: SKILL.md §5

- RULE: When the client sends photos, list the 5–8 features that make each place theirs (the carved bear, the gambrel roof, the red pillow) and draw those; skip everything else.
  EVIDENCE: revision 2 read as "our cottage" from a handful of props per scene, with the same paper-cut style.
  GOES IN: SKILL.md §2
- RULE: A dolly-out through a window needs two planes at different scale rates, and the near plane should fade and un-blur in over the first ~20% of the move, or the mullions pop in.
  EVIDENCE: S8, the mullion appeared as a hard 130 px bar on the first frame of the move until the blur-in was added.
  GOES IN: references/motion-feel.md

- RULE: When music hosts are blocked, arrange a public-domain piece on sampled instruments from npm (tonejs-instrument-*-mp3) and pick the tempo so one bar is a round number of frames (here 100 f); then cut every scene on a bar line.
  EVIDENCE: revision 3's Gymnopédie at 54 BPM put all six cuts on bar lines with no retiming of the picture.
  GOES IN: references/audio.md
- RULE: A profile rig reads "lifting" better than a back view: bend from the hip with the shoulders riding the lean, drop the hips with bent knees, and aim the arms at the grip points every frame.
  EVIDENCE: S3 from behind read as a man standing still; the same beat in profile read as a lift at thumbnail size.
  GOES IN: references/motion-feel.md

## Skill feedback
- GOT IN THE WAY: Original mode assumes ElevenLabs and an image model exist. FIX: add a no-credentials fallback (code-drawn art + numpy synth, as in tools/make_audio.py).
- Tools written: tools/shot.cjs (stills), tools/make_audio.py (score + SFX placed by frame).

## Reviewer notes
- none yet
