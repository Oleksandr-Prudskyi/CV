import { spawn } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = resolve(import.meta.dirname, "..");
const sourceHtml = resolve(projectRoot, "public", "Oleksandr_Prudskyi.print-cv.html");
const outputDir = resolve(projectRoot, "public", "Files");
const outputPdf = resolve(outputDir, "Oleksandr_Prudskyi.CV.pdf");

const browserCandidates = [
  "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const browserExe = browserCandidates.find((p) => existsSync(p));
if (!browserExe) {
  console.error("No Chromium-based browser found. Install Brave, Chrome or Edge.");
  process.exit(1);
}

if (!existsSync(sourceHtml)) {
  console.error(`Source HTML not found: ${sourceHtml}`);
  process.exit(1);
}

if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

const sourceUrl = pathToFileURL(sourceHtml).href;

const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=10000",
  `--print-to-pdf=${outputPdf}`,
  sourceUrl,
];

console.log(`Rendering: ${sourceUrl}`);
console.log(`Output:    ${outputPdf}`);
console.log(`Browser:   ${browserExe}`);

const child = spawn(browserExe, args, { stdio: "inherit" });

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Browser exited with code ${code}`);
    process.exit(code ?? 1);
  }
  if (!existsSync(outputPdf)) {
    console.error("PDF was not created.");
    process.exit(1);
  }
  const size = statSync(outputPdf).size;
  console.log(`Done. ${(size / 1024).toFixed(1)} KB`);
});
