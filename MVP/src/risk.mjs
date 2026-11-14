const levels = [
  { level: 'alto', message: 'Estimativa preliminar de chuva intensa. Consulte os canais oficiais.' },
  { level: 'atencao', message: 'Estimativa preliminar de atenção à chuva. Consulte os canais oficiais.' },
  { level: 'informativo', message: 'Sem indicação de chuva intensa nesta regra demonstrativa.' }
];

export function assessRainRisk({ precipitationMm, probabilityPct }) {
  if (!Number.isFinite(precipitationMm) || precipitationMm < 0) {
    throw new TypeError('precipitationMm deve ser um número finito não negativo');
  }
  if (!Number.isFinite(probabilityPct) || probabilityPct < 0 || probabilityPct > 100) {
    throw new TypeError('probabilityPct deve estar entre 0 e 100');
  }

  const result = precipitationMm >= 50 || probabilityPct >= 85
    ? levels[0]
    : precipitationMm >= 20 || probabilityPct >= 60
      ? levels[1]
      : levels[2];

  return {
    ...result,
    officialAlert: false,
    basis: 'heurística demonstrativa não oficial; não representa protocolo da Defesa Civil'
  };
}
