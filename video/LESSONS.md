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

## Skill feedback
- GOT IN THE WAY: Original mode assumes ElevenLabs and an image model exist. FIX: add a no-credentials fallback (code-drawn art + numpy synth, as in tools/make_audio.py).
- Tools written: tools/shot.cjs (stills), tools/make_audio.py (score + SFX placed by frame).

## Reviewer notes
- none yet
