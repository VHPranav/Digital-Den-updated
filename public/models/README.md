Drop the real emblem model here as `emblem.glb`.

Expected path referenced in code: `public/models/emblem.glb`
(see `EMBLEM_MODEL_PATH` in [src/components/hero/Emblem.tsx](../../src/components/hero/Emblem.tsx)).

Until the file exists, the hero scene renders a procedural placeholder
(ring + extruded "a") so the layout and animations can be built and
previewed without the final asset.
