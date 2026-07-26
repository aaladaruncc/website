#!/usr/bin/env node
/**
 * Drop a handful of royalty-free demo images into .photos-inbox/
 * then run the sync script so /photos has something to show.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inbox = path.join(root, ".photos-inbox");

// Deterministic Unsplash Source images (landscape + portrait mix)
const DEMO = [
  {
    name: "demo-01-chapel-hill.jpg",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  },
  {
    name: "demo-02-coast.jpg",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80",
  },
  {
    name: "demo-03-city.jpg",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
  },
  {
    name: "demo-04-friends.jpg",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80",
  },
  {
    name: "demo-05-night.jpg",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=80",
  },
  {
    name: "demo-06-trail.jpg",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
  },
  {
    name: "demo-07-portraits.jpg",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80",
  },
  {
    name: "demo-08-skate.jpg",
    url: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1400&q=80",
  },
];

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

async function staggerManifestDates() {
  const manifestPath = path.join(root, "src", "data", "photos.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const base = Date.UTC(2024, 5, 1);
  manifest.photos = manifest.photos
    .map((photo, index) => ({
      ...photo,
      date: new Date(base + index * 1000 * 60 * 60 * 24 * 37).toISOString(),
    }))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  manifest.updatedAt = new Date().toISOString();
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function main() {
  await fs.mkdir(inbox, { recursive: true });
  console.log("Downloading demo photos into .photos-inbox/…");

  for (const item of DEMO) {
    const dest = path.join(inbox, item.name);
    process.stdout.write(`  ${item.name}… `);
    await download(item.url, dest);
    console.log("ok");
  }

  console.log("Running sync…");
  const result = spawnSync("node", ["scripts/sync-photos.mjs"], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status || 1);
  await staggerManifestDates();
  console.log("Demo gallery ready → open /photos");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
