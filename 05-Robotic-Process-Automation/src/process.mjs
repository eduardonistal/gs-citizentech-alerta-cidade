export function buildAlertPayload(forecast, observedAt) {
  const daily = forecast?.daily;
  const dates = daily?.time;
  const amounts = daily?.precipitation_sum;
  const probabilities = daily?.precipitation_probability_max;
  if (!Array.isArray(dates) || !Array.isArray(amounts) || !Array.isArray(probabilities)
    || dates.length === 0 || dates.length !== amounts.length || dates.length !== probabilities.length) {
    throw new TypeError('daily precisa conter arrays alinhados de time, precipitation_sum e precipitation_probability_max');
  }
  if (typeof observedAt !== 'string' || Number.isNaN(Date.parse(observedAt))) {
    throw new TypeError('observedAt precisa ser timestamp válido');
  }

  const alerts = dates.map((date, index) => {
    const parsedDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00.000Z`)
      : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date
      || !Number.isFinite(amounts[index]) || amounts[index] < 0
      || !Number.isInteger(probabilities[index]) || probabilities[index] < 0 || probabilities[index] > 100) {
      throw new TypeError(`previsão inválida no índice ${index}`);
    }
    return {
      id: `sp-centro-${date}`,
      area: 'Área demonstrativa — Centro, São Paulo',
      precipitation_mm: amounts[index],
      probability_pct: probabilities[index],
      source_name: 'Open-Meteo',
      source_url: 'https://api.open-meteo.com/v1/forecast'
    };
  });

  return { observed_at: observedAt, alerts };
}
