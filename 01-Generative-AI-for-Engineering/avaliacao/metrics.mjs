const MODES = ['baseline', 'rag', 'agent'];

function average(rows, key) {
  return averageValues(rows.map(row => row[key]));
}

function averageValues(values) {
  const finiteValues = values.filter(Number.isFinite);
  return finiteValues.length
    ? finiteValues.reduce((sum, value) => sum + value, 0) / finiteValues.length
    : null;
}

function taskCompliance(row) {
  if (row.valid_json !== true) return 0;
  if (row.abstention_decision_correct !== true) return 0;
  if (row.expected_abstain === true) return 1;
  if (!row.expected_citations?.length) return 1;
  return Number.isFinite(row.answer_citation_recall) ? row.answer_citation_recall : 0;
}

export function summarizeBenchmark(rows) {
  return Object.fromEntries(MODES.map(mode => {
    const cases = rows.filter(row => row.mode === mode);
    const validCases = cases.filter(row => row.valid_json === true);
    const correctDecisions = cases.filter(row =>
      row.valid_json === true && row.abstention_decision_correct === true
    );

    return [mode, {
      cases: cases.length,
      valid_output_rate: cases.length ? validCases.length / cases.length : null,
      retrieval_recall_at_1: average(cases, 'retrieval_recall_at_1'),
      retrieval_recall_at_3: average(cases, 'retrieval_recall_at_3'),
      answer_citation_recall: averageValues(cases.map(row =>
        row.valid_json === false && row.expected_citations?.length > 0
          ? 0
          : row.answer_citation_recall
      )),
      abstention_decision_accuracy: cases.length ? correctDecisions.length / cases.length : null,
      // Fração de casos em que a decisão e as citações batem com o gabarito.
      task_compliance: cases.length
        ? cases.reduce((sum, row) => sum + taskCompliance(row), 0) / cases.length
        : null
    }];
  }));
}
