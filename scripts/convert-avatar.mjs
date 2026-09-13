import sharp from "sharp";
import { statSync } from "node:fs";
import { resolve } from "node:path";

const src = "A:/Archive/cv-archive/assets/inbox/Obrázek Codex 13. 9. 2026 21_56_07.png";
const dst = resolve("public/img/photo.webp");

const srcSize = statSync(src).size;
const meta = await sharp(src).metadata();
console.log(`Source: ${meta.width}×${meta.height}, ${(srcSize / 1024).toFixed(1)} KB`);

await sharp(src)
  .resize({ width: 1080, withoutEnlargement: true, fit: "inside" })
  .webp({ quality: 82, effort: 6 })
  .toFile(dst);

const outMeta = await sharp(dst).metadata();
const outSize = statSync(dst).size;
console.log(`Wrote: ${outMeta.width}×${outMeta.height}, ${(outSize / 1024).toFixed(1)} KB`);
console.log(`Saved: ${((1 - outSize / srcSize) * 100).toFixed(1)}%`);
