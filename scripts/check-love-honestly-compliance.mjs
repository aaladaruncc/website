import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pagePath = path.join(root, "src/app/love-honestly/page.tsx");
const gatePath = path.join(root, "src/app/analytics-gate.tsx");
const layoutPath = path.join(root, "src/app/layout.tsx");

const page = fs.readFileSync(pagePath, "utf8");
const gate = fs.readFileSync(gatePath, "utf8");
const layout = fs.readFileSync(layoutPath, "utf8");

const required = [
  'id="privacy"',
  'id="support"',
  'id="crisis-protocol"',
  "age 16 and over",
  "Foundation Models",
  "1-800-799-7233",
  "88788",
  "1-866-331-9474",
  "22522",
  "741741",
  "1-866-488-7386",
  "678678",
  "call or text",
  "988",
  "not therapy",
  "not an emergency service",
];

const failures = [];

for (const needle of required) {
  if (!page.includes(needle)) failures.push(`missing required content: ${needle}`);
}

if (page.includes("18+")) failures.push("stale 18+ target present");
if (page.includes("SUPPORT_EMAIL_REQUIRED")) failures.push("public support email is unresolved");
if (!gate.includes('pathname.startsWith("/love-honestly")')) {
  failures.push("Love Honestly route is not excluded from Vercel Analytics");
}
if (!layout.includes("<AnalyticsGate />")) failures.push("AnalyticsGate is not mounted");
if (layout.includes("<Analytics />")) failures.push("root Analytics bypass remains");

if (failures.length > 0) {
  console.error(failures.map((item) => `FAIL: ${item}`).join("\n"));
  process.exit(1);
}

console.log("Love Honestly compliance page checks passed.");
