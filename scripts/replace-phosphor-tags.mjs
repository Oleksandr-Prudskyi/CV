import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const partialsDir = resolve("partials");
const files = readdirSync(partialsDir).filter((f) => f.endsWith(".html"));

const pattern =
  /<i\s+class="(ph|ph-bold|ph-fill)\s+ph-([a-z0-9-]+)((?:\s+[a-z0-9_-]+)*)"((?:\s+[a-z-]+="[^"]*")*)\s*>\s*<\/i>/gi;

let totalReplaced = 0;

for (const name of files) {
  const path = join(partialsDir, name);
  const src = readFileSync(path, "utf-8");
  let count = 0;
  const out = src.replace(
    pattern,
    (_full, variantClass, iconName, extraClasses, extraAttrs) => {
      count += 1;
      const symbolId =
        variantClass === "ph"
          ? `ph-${iconName}`
          : `${variantClass}-${iconName}`;
      const classAttr = `ph-icon${extraClasses}`.trim();
      const attrs = extraAttrs.replace(/\s*aria-hidden="[^"]*"/gi, "").trim();
      const attrPart = attrs ? ` ${attrs}` : "";
      return `<svg class="${classAttr}" aria-hidden="true"${attrPart}><use href="/img/phosphor-sprite.svg#${symbolId}"/></svg>`;
    },
  );
  if (count > 0) {
    writeFileSync(path, out);
    console.log(`${name}: ${count} replacements`);
    totalReplaced += count;
  }
}

console.log(`Total: ${totalReplaced}`);
