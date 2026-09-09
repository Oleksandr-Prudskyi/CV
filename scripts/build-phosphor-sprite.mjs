import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const icons = {
  regular: [
    "map-pin",
    "phone",
    "envelope-simple",
    "copy",
    "user",
    "flag-pennant",
    "gear-six",
    "book-open-text",
    "barbell",
    "suitcase-simple",
    "calendar-blank",
    "graduation-cap",
    "check-circle",
  ],
  bold: [
    "factory",
    "caret-down",
    "wrench",
    "briefcase",
    "download-simple",
    "graduation-cap",
    "translate",
    "lightning",
  ],
  fill: [
    "map-pin",
    "phone",
    "envelope-simple",
    "certificate",
    "code",
    "flower-lotus",
  ],
};

const symbols = [];
for (const [variant, names] of Object.entries(icons)) {
  for (const name of names) {
    const suffix = variant === "regular" ? "" : `-${variant}`;
    const filePath = resolve(
      "node_modules/@phosphor-icons/core/assets",
      variant,
      `${name}${suffix}.svg`,
    );
    const svg = readFileSync(filePath, "utf-8");
    const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    const id = variant === "regular" ? `ph-${name}` : `ph-${variant}-${name}`;
    symbols.push(
      `<symbol id="${id}" viewBox="0 0 256 256" fill="currentColor">${inner}</symbol>`,
    );
  }
}

const sprite =
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${symbols.join("")}</svg>\n`;

writeFileSync(resolve("public/img/phosphor-sprite.svg"), sprite);
console.log(`Wrote ${symbols.length} symbols to public/img/phosphor-sprite.svg`);
