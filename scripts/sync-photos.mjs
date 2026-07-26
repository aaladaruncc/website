#!/usr/bin/env node
/**
 * Sync photos for the /photos page.
 *
 * Modes:
 * 1) Local inbox (default for demos / no Cloudflare yet)
 *    Place images in .photos-inbox/ (or pull them with rclone --pull)
 *    → writes optimized JPEGs to public/photos/
 *    → updates src/data/photos.json with /photos/... URLs
 *
 * 2) Cloudflare R2 CDN (production)
 *    Same inbox processing, then uploads to R2 and writes CDN URLs.
 *
 * Optional Apple Photos pull (requires rclone + iCloud Photos remote):
 *   npm run photos:pull
 *   npm run photos:sync
 */

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { S3Client, PutObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import exifr from "exifr";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const INBOX_DIR = path.join(root, ".photos-inbox");
const PUBLIC_DIR = path.join(root, "public", "photos");
const MANIFEST_PATH = path.join(root, "src", "data", "photos.json");
const STATE_PATH = path.join(root, ".photos-sync-state.json");

const ALBUM = process.env.PHOTOS_ALBUM || "Website";
const MAX_EDGE = Number(process.env.PHOTOS_MAX_EDGE || 2048);
const JPEG_QUALITY = Number(process.env.PHOTOS_JPEG_QUALITY || 82);
const CDN_URL = (process.env.PHOTOS_CDN_URL || "").replace(/\/$/, "");
const R2_BUCKET = process.env.R2_BUCKET_NAME || "";
const R2_PREFIX = (process.env.R2_PREFIX || "photos").replace(/^\/|\/$/g, "");
const RCLONE_REMOTE = process.env.RCLONE_ICLOUD_REMOTE || "icloudphotos";
const DRY_RUN = process.argv.includes("--dry-run");
const PULL = process.argv.includes("--pull");
const KEEP_DELETED = process.argv.includes("--keep-deleted");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"]);

function hasR2Config() {
  return Boolean(
    CDN_URL &&
      R2_BUCKET &&
      process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY
  );
}

function createR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

async function ensureDirs() {
  await fs.mkdir(INBOX_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
}

async function loadJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(full)));
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      // Skip Live Photo companion movies are not in IMAGE_EXTS; also skip obvious edits junk
      if (/\.mov$/i.test(entry.name)) continue;
      files.push(full);
    }
  }
  return files;
}

function contentId(buffer) {
  return createHash("sha1").update(buffer).digest("hex").slice(0, 24);
}

async function readCaptureDate(filePath, buffer) {
  try {
    const exif = await exifr.parse(buffer, {
      pick: ["DateTimeOriginal", "CreateDate", "ModifyDate"],
    });
    const raw = exif?.DateTimeOriginal || exif?.CreateDate || exif?.ModifyDate;
    if (raw instanceof Date && !Number.isNaN(raw.valueOf())) {
      return raw.toISOString();
    }
  } catch {
    // fall through
  }

  const stats = await fs.stat(filePath);
  return stats.mtime.toISOString();
}

async function processImage(filePath) {
  const original = await fs.readFile(filePath);
  const image = sharp(original, { failOn: "none" }).rotate();
  const meta = await image.metadata();

  const width = meta.width || 0;
  const height = meta.height || 0;
  if (!width || !height) {
    throw new Error(`Could not read dimensions for ${filePath}`);
  }

  const resized = image.resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  const jpeg = await resized.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  const outMeta = await sharp(jpeg).metadata();
  const id = contentId(jpeg);
  const date = await readCaptureDate(filePath, original);

  return {
    id,
    buffer: jpeg,
    width: outMeta.width || width,
    height: outMeta.height || height,
    date,
    source: path.relative(root, filePath),
  };
}

function pullAlbumWithRclone() {
  const albumPath = `${RCLONE_REMOTE}:PrimarySync/${ALBUM}`;
  console.log(`Pulling Apple Photos album via rclone: ${albumPath}`);
  const result = spawnSync(
    "rclone",
    [
      "sync",
      albumPath,
      INBOX_DIR,
      "--iclouddrive-service",
      "photos",
      "--exclude",
      "*.MOV",
      "--exclude",
      "*.mov",
      "-v",
    ],
    { stdio: "inherit" }
  );
  if (result.status !== 0) {
    throw new Error(
      "rclone pull failed. Configure an iCloud Photos remote first — see docs/PHOTOS_SETUP.md"
    );
  }
}

async function uploadToR2(client, photo) {
  const key = `${R2_PREFIX}/${photo.id}.jpg`;
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: photo.buffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return `${CDN_URL}/${key}`;
}

async function listR2Keys(client) {
  const keys = [];
  let token;
  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        Prefix: `${R2_PREFIX}/`,
        ContinuationToken: token,
      })
    );
    for (const item of page.Contents || []) {
      if (item.Key) keys.push(item.Key);
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

async function pruneR2(client, keepIds) {
  const keys = await listR2Keys(client);
  const remove = keys.filter((key) => {
    const base = path.basename(key, ".jpg");
    return key.endsWith(".jpg") && !keepIds.has(base);
  });
  if (!remove.length) return;
  for (let i = 0; i < remove.length; i += 1000) {
    const chunk = remove.slice(i, i + 1000).map((Key) => ({ Key }));
    await client.send(
      new DeleteObjectsCommand({
        Bucket: R2_BUCKET,
        Delete: { Objects: chunk },
      })
    );
  }
  console.log(`Removed ${remove.length} stale object(s) from R2`);
}

async function prunePublic(keepIds) {
  const existing = await fs.readdir(PUBLIC_DIR).catch(() => []);
  for (const name of existing) {
    if (!name.endsWith(".jpg")) continue;
    const id = name.replace(/\.jpg$/, "");
    if (!keepIds.has(id)) {
      await fs.unlink(path.join(PUBLIC_DIR, name));
    }
  }
}

async function main() {
  await ensureDirs();

  if (PULL) {
    pullAlbumWithRclone();
  }

  const files = await walkFiles(INBOX_DIR);
  if (!files.length) {
    console.log(`No images found in ${path.relative(root, INBOX_DIR)}/`);
    console.log("Add photos there, or run: npm run photos:pull");
    return;
  }

  console.log(`Processing ${files.length} image(s) from inbox…`);
  const useR2 = hasR2Config();
  const client = useR2 ? createR2Client() : null;
  if (useR2) {
    console.log(`CDN mode: ${CDN_URL}/${R2_PREFIX}/`);
  } else {
    console.log("Local mode: writing to public/photos/ (set R2_* + PHOTOS_CDN_URL for Cloudflare CDN)");
  }

  const photos = [];
  const state = await loadJson(STATE_PATH, { bySource: {} });

  for (const filePath of files) {
    const rel = path.relative(root, filePath);
    try {
      if (DRY_RUN) {
        console.log(`[dry-run] would process ${rel}`);
        continue;
      }

      const processed = await processImage(filePath);
      let imageUrl;

      if (useR2) {
        imageUrl = await uploadToR2(client, processed);
      } else {
        const outPath = path.join(PUBLIC_DIR, `${processed.id}.jpg`);
        await fs.writeFile(outPath, processed.buffer);
        imageUrl = `/photos/${processed.id}.jpg`;
      }

      photos.push({
        id: processed.id,
        imageUrl,
        width: processed.width,
        height: processed.height,
        date: processed.date,
      });
      state.bySource[rel] = processed.id;
      console.log(`✓ ${rel} → ${processed.id}.jpg`);
    } catch (error) {
      console.error(`✗ ${rel}: ${error.message}`);
    }
  }

  if (DRY_RUN) return;

  photos.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const keepIds = new Set(photos.map((photo) => photo.id));

  if (!KEEP_DELETED) {
    if (useR2) await pruneR2(client, keepIds);
    await prunePublic(keepIds);
  }

  const manifest = {
    album: ALBUM,
    updatedAt: new Date().toISOString(),
    photos,
  };

  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  await fs.writeFile(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
  console.log(`Updated manifest with ${photos.length} photo(s) → ${path.relative(root, MANIFEST_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
