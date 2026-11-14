import { createServer } from '../server.mjs';

const server = createServer({
  ingestToken: process.env.GS_INGEST_TOKEN,
  alertsPath: '/tmp/alerta-cidade-alerts.json'
});

export default function handler(req, res) {
  server.emit('request', req, res);
}
