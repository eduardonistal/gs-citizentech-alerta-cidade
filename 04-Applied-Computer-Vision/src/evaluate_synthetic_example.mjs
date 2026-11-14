const description =
  'Toy binary-label metric example only; not real image provenance, YOLO training, object-detection mAP, or model performance.';

export function evaluateBinaryLabels(groundTruth, predictions) {
  if (!Array.isArray(groundTruth) || !Array.isArray(predictions)) {
    throw new TypeError('Ground truth and predictions must be arrays.');
  }
  if (groundTruth.length === 0 || predictions.length === 0) {
    throw new RangeError('Ground truth and predictions must be non-empty.');
  }
  if (groundTruth.length !== predictions.length) {
    throw new RangeError('Ground truth and predictions must have the same length.');
  }
  if (![...groundTruth, ...predictions].every((label) => label === 0 || label === 1)) {
    throw new TypeError('Ground truth and predictions must contain only binary labels 0 or 1.');
  }

  let true_positives = 0;
  let false_positives = 0;
  let false_negatives = 0;
  let true_negatives = 0;

  for (let index = 0; index < groundTruth.length; index += 1) {
    if (groundTruth[index] === 1 && predictions[index] === 1) {
      true_positives += 1;
    } else if (groundTruth[index] === 0 && predictions[index] === 1) {
      false_positives += 1;
    } else if (groundTruth[index] === 1 && predictions[index] === 0) {
      false_negatives += 1;
    } else {
      true_negatives += 1;
    }
  }

  const precisionDenominator = true_positives + false_positives;
  const recallDenominator = true_positives + false_negatives;
  const f1Denominator = 2 * true_positives + false_positives + false_negatives;

  return {
    true_positives,
    false_positives,
    false_negatives,
    true_negatives,
    precision: precisionDenominator === 0 ? null : true_positives / precisionDenominator,
    recall: recallDenominator === 0 ? null : true_positives / recallDenominator,
    f1: f1Denominator === 0 ? null : (2 * true_positives) / f1Denominator,
    synthetic: true,
    model_evaluated: false,
    description,
  };
}
