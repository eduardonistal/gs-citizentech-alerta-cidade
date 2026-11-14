/**
 * Gera STLs ASCII imprimíveis (corpo + tampa) sem OpenSCAD.
 * Constrói o sólido por união de painéis (sem CSG invertido).
 * Uso: node scripts/gerar-stl.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "stl");
mkdirSync(outDir, { recursive: true });

const DIAS = 7;
const cellW = 28, cellD = 36, cellH = 22;
const wall = 2.2, gap = 1.6, floor = 2.4, wireH = 3.5;
const espW = 58, espD = 32, espH = 18;
const bodyW = DIAS * cellW + (DIAS + 1) * gap + wall * 2 + espW + wall;
const bodyD = cellD + wall * 2 + gap * 2;
const bodyH = cellH + floor + wireH;
const deckZ = floor + wireH;

/** @typedef {{x:number,y:number,z:number}} V */
/** @typedef {[V,V,V]} Tri */
/** @type {Tri[]} */
const tris = [];

const v = (x, y, z) => ({ x, y, z });

function addBox(x0, y0, z0, x1, y1, z1) {
  if (x1 <= x0 || y1 <= y0 || z1 <= z0) return;
  const p = [
    v(x0, y0, z0), v(x1, y0, z0), v(x1, y1, z0), v(x0, y1, z0),
    v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1),
  ];
  const faces = [
    [0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1],
    [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2],
  ];
  for (const f of faces) {
    tris.push([p[f[0]], p[f[1]], p[f[2]]], [p[f[0]], p[f[2]], p[f[3]]]);
  }
}

// Piso completo
addBox(0, 0, 0, bodyW, bodyD, floor);

// Piso do deck (acima do canal), deixando canal central oco
const chY0 = (bodyD - 6) / 2;
const chY1 = (bodyD + 6) / 2;
addBox(0, 0, floor, bodyW, chY0, deckZ);
addBox(0, chY1, floor, bodyW, bodyD, deckZ);
// fechamento nas pontas do canal
addBox(0, chY0, floor, wall, chY1, deckZ);
addBox(bodyW - wall, chY0, floor, bodyW, chY1, deckZ);

// Parede frontal / traseira / laterais
addBox(0, 0, deckZ, bodyW, wall, bodyH);
addBox(0, bodyD - wall, deckZ, bodyW, bodyD, bodyH);
addBox(0, wall, deckZ, wall, bodyD - wall, bodyH);
addBox(bodyW - wall, wall, deckZ, bodyW, bodyD - wall, bodyH);

// Separadores entre casinhas + moldura de gap
for (let i = 0; i <= DIAS; i++) {
  const x = wall + i * (cellW + gap);
  addBox(x, wall, deckZ, x + gap, bodyD - wall, bodyH);
}

// Parede entre última casinha e baia ESP32
{
  const x = wall + DIAS * (cellW + gap) + gap;
  addBox(x, wall, deckZ, x + wall, bodyD - wall, bodyH);
}

// Fundo da baia ESP32 (plataforma)
{
  const x = wall + gap + DIAS * (cellW + gap) + wall;
  const y = (bodyD - espD) / 2;
  addBox(x, y, deckZ, x + espW, y + espD, deckZ + 1.5);
  // paredes laterais internas da baia (USB fica na parede externa — deixamos fresta)
  addBox(x, y, deckZ, x + espW, y + wall, deckZ + espH);
  addBox(x, y + espD - wall, deckZ, x + espW, y + espD, deckZ + espH);
  addBox(x, y, deckZ, x + wall, y + espD, deckZ + espH);
  // parede externa com fresta USB
  const usbY0 = bodyD / 2 - 6;
  const usbY1 = bodyD / 2 + 6;
  const usbZ0 = deckZ + 3;
  const usbZ1 = deckZ + 11;
  addBox(bodyW - wall, wall, deckZ, bodyW, usbY0, bodyH);
  addBox(bodyW - wall, usbY1, deckZ, bodyW, bodyD - wall, bodyH);
  addBox(bodyW - wall, usbY0, deckZ, bodyW, usbY1, usbZ0);
  addBox(bodyW - wall, usbY0, usbZ1, bodyW, usbY1, bodyH);
}

// Bolsos reed: pequenos blocos com fenda (apoio do sensor)
for (let i = 0; i < DIAS; i++) {
  const x = wall + gap + i * (cellW + gap) + cellW / 2;
  addBox(x - 9, bodyD - wall - 3.5, deckZ + cellH - 4, x + 9, bodyD - wall, deckZ + cellH - 1);
}

function normal(a, b, c) {
  const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
  const vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
  let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  const len = Math.hypot(nx, ny, nz) || 1;
  return { x: nx / len, y: ny / len, z: nz / len };
}

function toStl(name, triangles) {
  let s = `solid ${name}\n`;
  for (const [a, b, c] of triangles) {
    const n = normal(a, b, c);
    s += `  facet normal ${n.x} ${n.y} ${n.z}\n    outer loop\n`;
    s += `      vertex ${a.x} ${a.y} ${a.z}\n`;
    s += `      vertex ${b.x} ${b.y} ${b.z}\n`;
    s += `      vertex ${c.x} ${c.y} ${c.z}\n`;
    s += `    endloop\n  endfacet\n`;
  }
  return s + `endsolid ${name}\n`;
}

writeFileSync(join(outDir, "corpo-porta-remedios.stl"), toStl("corpo", tris));

// Tampa
const lid = [];
function lidBox(x0, y0, z0, x1, y1, z1) {
  const p = [
    v(x0, y0, z0), v(x1, y0, z0), v(x1, y1, z0), v(x0, y1, z0),
    v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1),
  ];
  const faces = [
    [0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1],
    [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2],
  ];
  for (const f of faces) {
    lid.push([p[f[0]], p[f[1]], p[f[2]]], [p[f[0]], p[f[2]], p[f[3]]]);
  }
}
const lw = cellW - 0.4, ld = cellD - 0.4, lt = 2;
lidBox(0, 0, 0, lw, ld, lt);
lidBox(lw / 2 - 6, -3, 0, lw / 2 + 6, 0.2, lt);
// rebaixo do imã (anel aproximado por moldura)
const mx = lw / 2, my = ld - 4;
lidBox(mx - 3.5, my - 3.5, lt - 2, mx + 3.5, my - 2.5, lt);
lidBox(mx - 3.5, my + 2.5, lt - 2, mx + 3.5, my + 3.5, lt);
lidBox(mx - 3.5, my - 3.5, lt - 2, mx - 2.5, my + 3.5, lt);
lidBox(mx + 2.5, my - 3.5, lt - 2, mx + 3.5, my + 3.5, lt);

writeFileSync(join(outDir, "tampa-porta-remedios.stl"), toStl("tampa", lid));

console.log(`STL gerados em ${outDir}`);
console.log(`Corpo: ${bodyW.toFixed(1)} × ${bodyD.toFixed(1)} × ${bodyH.toFixed(1)} mm`);
console.log("Para versão com filetes/dobradiças precisas, use openscad/porta-remedios.scad");
