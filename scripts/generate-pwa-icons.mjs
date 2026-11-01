/**
 * Header logosundan PWA PNG ikonları üretir.
 * node scripts/generate-pwa-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "pwa", "icon.svg");
const outDir = path.join(root, "public", "pwa");

const svg = fs.readFileSync(svgPath);

for (const size of [192, 512]) {
  await sharp(svg)
    .resize(size, size, { fit: "contain", background: "#04140c" })
    .png()
    .toFile(path.join(outDir, `icon-${size}.png`));
  console.log(`Wrote icon-${size}.png`);
}
