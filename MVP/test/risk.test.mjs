import test from 'node:test';
import assert from 'node:assert/strict';
import { assessRainRisk } from '../src/risk.mjs';

test('marks heavy forecast rain as a preliminary high risk', () => {
  const result = assessRainRisk({ precipitationMm: 55, probabilityPct: 80 });

  assert.equal(result.level, 'alto');
  assert.equal(result.officialAlert, false);
  assert.match(result.message, /estimativa preliminar/i);
});

test('rejects invalid rainfall measurements instead of masking them', () => {
  assert.throws(
    () => assessRainRisk({ precipitationMm: -1, probabilityPct: 50 }),
    /precipitationMm/
  );
  assert.throws(
    () => assessRainRisk({ precipitationMm: 1, probabilityPct: 101 }),
    /probabilityPct/
  );
});
