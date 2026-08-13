import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyPartials() {
  return {
    name: "copy-partials",
    closeBundle() {
      var source = resolve("partials");
      var target = resolve("dist/partials");
      if (existsSync(source)) cpSync(source, target, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [copyPartials()],
});
