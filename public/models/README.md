Drop Draco-compressed, size-optimized GLB models here, named with an `-opt` suffix
(e.g. `emblem-opt.glb`, `spinenw-opt.glb`).

Expected paths referenced in code: `public/models/emblem-opt.glb`
(see `EMBLEM_MODEL_PATH` in [src/components/hero/Emblem.tsx](../../src/components/hero/Emblem.tsx))
and `public/models/spinenw-opt.glb`
(see [src/components/SpinalCordBackground.tsx](../../src/components/SpinalCordBackground.tsx)).

Only `*-opt.glb` files are tracked in git (see `.gitignore`) — raw/unoptimized
source exports should stay local rather than getting committed.

Until `emblem-opt.glb` exists, the hero scene renders a procedural placeholder
(ring + extruded "a") so the layout and animations can be built and
previewed without the final asset.
