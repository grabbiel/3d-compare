# Arena synthesis: 3D Compare

## Cross-judge (parent, after empty judge output)

| Criterion | C1 | C2 | C3 | C4 |
|---|---|---|---|---|
| 1 Domain model | 2 | 2 | 2 | 2 |
| 2 Backend decision | 2 | 2 | 2 | 2 |
| 3 3D model strategy | 1 | 1 | 2 | 1 |
| 4 Navigation | 2 | 2 | 2 | 2 |
| 5 Interface depth | 2 | 2 | 2 | 2 |
| 6 Module map | 1 | 2 | 2 | 1 |
| Total | 10 | 11 | 12 | 10 |

C3 wins criterion 3 because recipe stand-ins are first-class and unstick UI/nav without commissioned GLBs. C2 is close but assumes morph-target GLBs we do not have. C4's allometry needs measured bone chains we cannot ship in this slice. C1's Babylon host is a clean boundary but a heavier stack for a React+R3F-native team and slows the concurrent mesh streams.

## Base

**candidate-3** (Vite + React + R3F, dual persistent worlds, branded mm, recipe meshes first, no runtime backend).

## Grafts

- From C2: renderer-neutral scene projection idea (plan derived from document); Mondopoint-style shoe length tables; light quality governor later if needed.
- From C4: SizeCodec-style parse/format at the UI boundary; exact rendered height via uniform scale from referenceHeightMm (skip allometric segments for v1); optional URL hash share later.
- From C1: typed command Result unions; keep both mode documents across switches.

## Rejections

- Babylon isolated host (C1): deeper isolation than we need; R3F keeps React workstreams productive.
- Morph-target shoe sizing as hard dependency (C2): no authored morphs yet; use foot-length scale on recipe/GLB with lower-leg partially locked visually via recipe proportions.
- Unified Figure + Stage.render without R3F (C4): excellent long-term Stage, overbuilt for first runnable slice; revisit if GLB pipeline arrives.
- Go+AWS runtime API (all): no accounts, no mutable catalog.
- Go assetc now (C4): optional later; procedural recipes ship first.

## Verification of synthesis

Rubric satisfied: illegal mode mixes typed out; backend = none; six human + two foot recipes with scaling math; separate height/feet nav; small CompareApp surface; module ownership for parallel streams.
