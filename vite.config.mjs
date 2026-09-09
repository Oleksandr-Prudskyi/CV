import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const partialsDir = resolve("partials");

function replaceDataLoadBlocks(html, resolveFile) {
  const openRegex = /<div\s+data-load="([^"]+)"\s*>/g;
  let result = "";
  let lastIndex = 0;
  let match;
  while ((match = openRegex.exec(html)) !== null) {
    const partialPath = match[1];
    const startBlock = match.index;
    let depth = 1;
    const tagRegex = /<\/?div\b[^>]*>/g;
    tagRegex.lastIndex = openRegex.lastIndex;
    let tag;
    let endBlock = -1;
    while ((tag = tagRegex.exec(html)) !== null) {
      if (tag[0].startsWith("</")) depth--;
      else depth++;
      if (depth === 0) {
        endBlock = tag.index + tag[0].length;
        break;
      }
    }
    if (endBlock === -1) {
      throw new Error(
        `inline-partials: unbalanced <div data-load="${partialPath}">`,
      );
    }
    result += html.slice(lastIndex, startBlock);
    result += resolveFile(partialPath);
    lastIndex = endBlock;
    openRegex.lastIndex = endBlock;
  }
  result += html.slice(lastIndex);
  return result;
}

function inlinePartials() {
  return {
    name: "inline-partials",
    enforce: "pre",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return replaceDataLoadBlocks(html, (partialPath) => {
          const filePath = resolve(partialPath);
          if (!existsSync(filePath)) {
            throw new Error(`inline-partials: file not found: ${partialPath}`);
          }
          return readFileSync(filePath, "utf-8");
        });
      },
    },
    configureServer(server) {
      server.watcher.add(partialsDir);
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [inlinePartials()],
});
