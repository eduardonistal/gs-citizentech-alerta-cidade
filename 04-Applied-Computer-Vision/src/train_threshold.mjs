/**
 * Treino leve e reproduzível sem Python/YOLO: aprende limiares HSV a partir de
 * imagens sintéticas rotuladas (água vs via). Não substitui YOLO quando houver
 * ambiente Python + pesos licenciados; serve como evidência funcional local.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataRoot = path.join(root, '..', 'data');

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHsv(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : delta / max;
  return { h, s, v: max };
}

export function createSyntheticDataset(seed = 42) {
  const samples = [];
  let state = seed;
  const rand = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  for (let i = 0; i < 40; i += 1) {
    const water = i % 2 === 0;
    const pixels = [];
    for (let p = 0; p < 64; p += 1) {
      if (water) {
        pixels.push({
          r: Math.floor(20 + rand() * 40),
          g: Math.floor(60 + rand() * 80),
          b: Math.floor(140 + rand() * 100)
        });
      } else {
        const gray = Math.floor(70 + rand() * 90);
        pixels.push({ r: gray, g: gray - 5, b: gray - 10 });
      }
    }
    samples.push({ id: `syn-${i}`, label: water ? 'water_on_road' : 'dry_road', pixels });
  }
  return samples;
}

export function trainThresholdModel(samples) {
  const water = samples.filter(s => s.label === 'water_on_road').flatMap(s => s.pixels);
  const dry = samples.filter(s => s.label === 'dry_road').flatMap(s => s.pixels);
  const avgChannel = (list, key) => list.reduce((sum, item) => sum + item[key], 0) / list.length;
  const waterBlue = avgChannel(water, 'b');
  const dryBlue = avgChannel(dry, 'b');
  const waterHue = water.map(rgbToHsv);
  const avg = (list, key) => list.reduce((sum, item) => sum + item[key], 0) / list.length;
  return {
    type: 'hsv_threshold_v1',
    trained_at: new Date().toISOString(),
    synthetic: true,
    blue_threshold: (waterBlue + dryBlue) / 2,
    h_min: clamp(avg(waterHue, 'h') - 40, 150, 260),
    h_max: clamp(avg(waterHue, 'h') + 40, 150, 280),
    s_min: 0.25,
    samples: samples.length
  };
}

export function predict(sample, model) {
  const votes = sample.pixels.map(pixel => {
    const hsv = rgbToHsv(pixel.r, pixel.g, pixel.b);
    const blueDominant = pixel.b > model.blue_threshold && pixel.b > pixel.r + 30;
    const waterHue = hsv.h >= model.h_min && hsv.h <= model.h_max && hsv.s >= model.s_min;
    return blueDominant || waterHue ? 1 : 0;
  });
  const score = votes.reduce((a, b) => a + b, 0) / votes.length;
  return {
    label: score >= 0.35 ? 'water_on_road' : 'dry_road',
    confidence: Number(score.toFixed(3))
  };
}

export function evaluate(samples, model) {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  const rows = samples.map(sample => {
    const prediction = predict(sample, model);
    const positive = sample.label === 'water_on_road';
    const predictedPositive = prediction.label === 'water_on_road';
    if (positive && predictedPositive) tp += 1;
    else if (!positive && predictedPositive) fp += 1;
    else if (!positive && !predictedPositive) tn += 1;
    else fn += 1;
    return { id: sample.id, expected: sample.label, ...prediction };
  });
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  return {
    synthetic: true,
    model_type: model.type,
    counts: { tp, fp, tn, fn },
    precision,
    recall,
    f1,
    rows
  };
}

export async function runTrainingPipeline() {
  const dataset = createSyntheticDataset(42);
  const train = dataset.slice(0, 28);
  const test = dataset.slice(28);
  const model = trainThresholdModel(train);
  const metrics = evaluate(test, model);

  await mkdir(path.join(dataRoot, 'generated'), { recursive: true });
  await writeFile(path.join(dataRoot, 'generated', 'threshold-model.json'), `${JSON.stringify(model, null, 2)}\n`);
  await writeFile(path.join(dataRoot, 'generated', 'threshold-metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);
  await writeFile(path.join(dataRoot, 'generated', 'dataset-manifest.json'), `${JSON.stringify({
    license: 'synthetic-generated-locally',
    count: dataset.length,
    classes: ['water_on_road', 'dry_road'],
    note: 'Imagens sintéticas geradas por amostragem RGB; não são fotografias reais.'
  }, null, 2)}\n`);

  return { model, metrics };
}

const isDirectRun = process.argv[1]
  && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const { model, metrics } = await runTrainingPipeline();
  console.log(JSON.stringify({
    model: model.type,
    metrics: {
      precision: metrics.precision,
      recall: metrics.recall,
      f1: metrics.f1,
      counts: metrics.counts
    }
  }, null, 2));
}
