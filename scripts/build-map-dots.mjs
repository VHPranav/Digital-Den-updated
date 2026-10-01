// Precomputes the dotted world map behind the Partners hero
// (src/components/partners/DottedWorldMap.tsx).
// An even grid is laid over a Miller-projected world (lat -58..83, Antarctica
// cropped) and only points on land are kept (Natural Earth 110m via world-atlas).
// Output: public/data/map-dots.json = { cols, rows, aspect, dots: [x, y, ...] }
// with x, y normalised to 0..1 of the map frame. Run: node scripts/build-map-dots.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

const DEG = Math.PI / 180;
const millerY = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * DEG));
const millerLat = (y) => (2.5 * Math.atan(Math.exp(0.8 * y)) - 0.625 * Math.PI) / DEG;

const LAT_TOP = 83;
const LAT_BOTTOM = -58;
const yTop = millerY(LAT_TOP);
const yBottom = millerY(LAT_BOTTOM);
const width = 2 * Math.PI;
const height = yTop - yBottom;

const COLS = 220;
const step = width / COLS;
const ROWS = Math.round(height / step);

const dots = [];
for (let r = 0; r < ROWS; r++) {
  const y = yTop - (r + 0.5) * step;
  const lat = millerLat(y);
  for (let c = 0; c < COLS; c++) {
    const lng = -180 + ((c + 0.5) / COLS) * 360;
    if (geoContains(land, [lng, lat])) dots.push(+((c + 0.5) / COLS).toFixed(4), +((r + 0.5) / ROWS).toFixed(4));
  }
}

writeFileSync(
  'public/data/map-dots.json',
  JSON.stringify({ cols: COLS, rows: ROWS, aspect: +(width / height).toFixed(4), latTop: LAT_TOP, latBottom: LAT_BOTTOM, dots }),
);
console.log(`${dots.length / 2} land dots, grid ${COLS}x${ROWS}, aspect ${(width / height).toFixed(3)}`);
