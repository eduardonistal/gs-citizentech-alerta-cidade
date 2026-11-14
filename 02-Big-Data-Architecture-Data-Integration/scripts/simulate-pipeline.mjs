function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidRecord(record) {
  return record !== null
    && typeof record === 'object'
    && !Array.isArray(record)
    && isValidDate(record.date)
    && typeof record.precipitation_mm === 'number'
    && Number.isFinite(record.precipitation_mm)
    && record.precipitation_mm >= 0
    && typeof record.probability_percent === 'number'
    && Number.isFinite(record.probability_percent)
    && record.probability_percent >= 0
    && record.probability_percent <= 100;
}

function riskLevel(record) {
  if (record.precipitation_mm >= 50 || record.probability_percent >= 85) {
    return 'alto';
  }

  if (record.precipitation_mm >= 20 || record.probability_percent >= 60) {
    return 'atenção';
  }

  return 'baixo';
}

export function simulatePipeline(input) {
  if (input?.synthetic !== true) {
    throw new TypeError('input must include synthetic: true');
  }

  if (!Array.isArray(input.records)) {
    throw new TypeError('input.records must be an array');
  }

  const firstValidByDate = new Map();
  let rejectedCount = 0;
  let duplicateCount = 0;

  for (const record of input.records) {
    if (!isValidRecord(record)) {
      rejectedCount += 1;
      continue;
    }

    if (firstValidByDate.has(record.date)) {
      duplicateCount += 1;
      continue;
    }

    firstValidByDate.set(record.date, {
      date: record.date,
      precipitation_mm: record.precipitation_mm,
      probability_percent: record.probability_percent,
    });
  }

  const silver = [...firstValidByDate.values()].sort((a, b) => (
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  ));
  const gold = silver.map((record) => ({
    ...record,
    risk_level: riskLevel(record),
  }));

  return {
    synthetic: true,
    bronze_count: input.records.length,
    silver_count: silver.length,
    duplicate_count: duplicateCount,
    rejected_count: rejectedCount,
    gold,
  };
}
