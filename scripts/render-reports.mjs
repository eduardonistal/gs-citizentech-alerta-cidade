import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reports = [
  '02-Big-Data-Architecture-Data-Integration/docs/relatorio-tecnico.md',
  '04-Applied-Computer-Vision/docs/relatorio-tecnico.md',
  '05-Robotic-Process-Automation/docs/relatorio-tecnico.md',
  '06-Secure-DevOps-Tools-Cloud-Computing/docs/relatorio-tecnico.md'
];

for (const relativePath of reports) {
  const source = path.join(root, relativePath);
  const target = source.replace(/\.md$/i, '.pdf');
  const markdown = await readFile(source, 'utf8');
  await mkdir(path.dirname(target), { recursive: true });
  await renderPdf(markdown, target);
  console.log(`Generated ${path.relative(root, target)}`);
}

async function renderPdf(markdown, target) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 54, right: 52, bottom: 58, left: 52 },
    info: { Title: markdown.split(/\r?\n/, 1)[0].replace(/^#\s*/, ''), Producer: 'Alerta Cidade report renderer' }
  });
  const output = (await import('node:fs')).createWriteStream(target);
  doc.pipe(output);
  doc.font('Helvetica').fontSize(9).fillColor('#202b36');

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      doc.moveDown(0.35);
      continue;
    }
    if (/^---+$/.test(line)) {
      doc.moveDown(0.4);
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      doc.moveDown(level === 1 ? 0.6 : 0.35);
      doc.font('Helvetica-Bold')
        .fontSize(level === 1 ? 17 : level === 2 ? 13 : 10)
        .fillColor('#075985')
        .text(cleanInline(heading[2]), { paragraphGap: 3 });
      doc.font('Helvetica').fontSize(9).fillColor('#202b36');
      continue;
    }
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    const numbered = /^\d+\.\s+(.+)$/.exec(line);
    const text = cleanInline((bullet ?? numbered)?.[1] ?? line);
    doc.font(line.startsWith('**') ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(line.startsWith('|') ? 7.5 : 9)
      .text(text, {
        width: 490,
        indent: bullet ? 12 : 0,
        paragraphGap: 2,
        lineGap: 1
      });
    doc.font('Helvetica').fontSize(9);
  }
  doc.end();
  await new Promise((resolve, reject) => {
    output.once('finish', resolve);
    output.once('error', reject);
  });
}

function cleanInline(line) {
  return line
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1');
}
