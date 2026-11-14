import fs from "node:fs";
import zlib from "node:zlib";

const data = fs.readFileSync("docs/Desafio-FIAP-GS-CitizenTech 4ES.pdf");
const s = data.toString("binary");
const streamRe = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
const lines = [];
let m;

function unescapePdf(str) {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

while ((m = streamRe.exec(s))) {
  let out;
  try {
    out = zlib.inflateSync(Buffer.from(m[1], "binary")).toString("latin1");
  } catch {
    continue;
  }

  const ops = [];
  const re = /\[((?:[^\]\\]|\\.)*)\]\s*TJ|\(((?:[^)\\]|\\.)*)\)\s*Tj/g;
  let mm;
  while ((mm = re.exec(out))) {
    if (mm[1] != null) {
      const parts = [...mm[1].matchAll(/\(((?:[^)\\]|\\.)*)\)/g)].map((x) =>
        unescapePdf(x[1]),
      );
      ops.push(parts.join(""));
    } else {
      ops.push(unescapePdf(mm[2]));
    }
  }
  const text = ops.join("");
  if (text.trim().length > 30) lines.push(text);
}

const all = lines.join("\n\n---PAGE---\n\n");
fs.writeFileSync("docs/_pdf_text.txt", all, "utf8");
console.log("blocks", lines.length, "chars", all.length);
