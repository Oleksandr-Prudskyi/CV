import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyPartials() {
  return {
    name: "copy-partials",
    closeBundle() {
      ["Files", "partials", "js", "img"].forEach(function (folder) {
        var source = resolve(folder);
        var target = resolve("dist", folder);
        if (existsSync(source)) cpSync(source, target, { recursive: true });
      });
    },
  };
}

export default defineConfig({
  plugins: [copyPartials()],
});
