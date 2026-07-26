# Photos: Apple Photos album → Cloudflare CDN → `/photos`

This site mirrors the [Ajay Misra photos pattern](https://www.ajaymisra.com/photos):

1. You curate shots in a **specific Apple Photos album** on your iPhone/Mac
2. A sync job pulls that album and uploads optimized JPEGs to **Cloudflare R2**
3. The R2 bucket is served on a custom domain (CDN) like `cdn.yoursite.com`
4. `/photos` reads `src/data/photos.json` and renders a fast responsive grid

Apple does not expose a public “webhook when album changes” API, so the bridge is **rclone’s iCloud Photos backend** (or a manual export into `.photos-inbox/`).

---

## Quick demo (no Apple / Cloudflare yet)

```bash
npm run photos:seed   # downloads sample images + syncs into public/photos
npm run dev
# open http://localhost:3000/photos
```

---

## One-time setup

### 1. Create the album in Apple Photos

**On iPhone**

1. Open **Photos**
2. Tap **Albums** → **+** → **New Album**
3. Name it exactly: `Website` (or set `PHOTOS_ALBUM` later)
4. Open any photo → **Add to Album** → `Website`

**On Mac**

1. Open **Photos**
2. **File → New Album** → name it `Website`
3. Drag photos into that album

Anything you add to this album is what can appear on the site. Keep it curated.

> Tip: create the album on your phone, add from the Camera roll as you go. iCloud Photo Library must be enabled so rclone can see the same album.

### 2. Create Cloudflare R2 + CDN domain

1. Cloudflare dashboard → **R2** → **Create bucket** (e.g. `aryan-photos`)
2. Bucket → **Settings** → **Custom Domains** → add something like `cdn.yourdomain.com`
3. **Manage R2 API Tokens** → create a token with **Object Read & Write** on that bucket
4. Copy:
   - Account ID
   - Access Key ID
   - Secret Access Key
   - Public CDN base URL (`https://cdn.yourdomain.com`)

### 3. Configure env vars

```bash
cp .env.example .env.local
```

Fill in:

```bash
PHOTOS_ALBUM=Website
PHOTOS_CDN_URL=https://cdn.yourdomain.com
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=aryan-photos
R2_PREFIX=photos
RCLONE_ICLOUD_REMOTE=icloudphotos
```

Load them when syncing:

```bash
set -a && source .env.local && set +a
npm run photos:sync
```

Without R2 vars, sync stays in **local mode** and writes to `public/photos/` (fine for development).

### 4. Connect rclone to iCloud Photos

Install rclone (≥ the release that includes iCloud Photos support):

```bash
brew install rclone   # macOS
# or: https://rclone.org/install/
```

Create a Photos remote:

```bash
rclone config
```

Suggested answers:

- `n` — new remote
- name: `icloudphotos`
- storage: `iCloud Drive` / `iclouddrive`
- Apple ID: your iCloud email
- password: your Apple ID password (or app-specific if prompted)
- Trust / 2FA: complete the challenge on your device
- `service`: **`photos`** (important — not Drive)
- leave advanced defaults unless you know you need them

Verify the album is visible:

```bash
rclone lsd icloudphotos:PrimarySync/ --iclouddrive-service photos
rclone ls "icloudphotos:PrimarySync/Website" --iclouddrive-service photos
```

You should see the photos you added to `Website`.

---

## Daily workflow

1. On your phone, add (or remove) photos in the **Website** album
2. Wait a minute for iCloud to sync
3. On your Mac (or CI), run:

```bash
set -a && source .env.local && set +a
npm run photos:pull   # rclone → .photos-inbox/
npm run photos:sync   # optimize → R2 (or public/) → update photos.json
```

Or in one shot:

```bash
npm run photos:sync:icloud
```

4. Commit the updated `src/data/photos.json` (and `public/photos/*` if you’re in local mode), push, and deploy.

### Optional: GitHub Action

`.github/workflows/sync-photos.yml` can run on a schedule **if** you store R2 secrets in the repo.  
iCloud auth for rclone usually needs an interactive 2FA / trust token, so the most reliable loop is:

- **Mac launchd / cron** every hour: `photos:sync:icloud`
- or run sync manually after you curate

---

## What the sync does

For each image in `.photos-inbox/`:

1. Reads EXIF date (falls back to file mtime)
2. Auto-orients, resizes longest edge to 2048px
3. Writes a mozjpeg at ~82 quality
4. Content-hashes the bytes → stable `id` (so re-uploads stay cacheable)
5. Uploads to `R2` as `photos/{id}.jpg` with long-cache headers **or** writes `public/photos/{id}.jpg`
6. Rewrites `src/data/photos.json` newest-first
7. Prunes photos removed from the album (unless `--keep-deleted`)

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `rclone` can’t see `Website` | Confirm iCloud Photos is enabled, album name matches `PHOTOS_ALBUM`, and remote `service=photos` |
| HEIC fails to process | Install a recent `sharp` (already in package.json); macOS usually works. On Linux you may need `libheif` |
| Site shows old images | Hard refresh; CDN URLs are immutable per `id`, but the manifest must be redeployed |
| Local gallery empty | Run `npm run photos:seed` or put files in `.photos-inbox/` then `npm run photos:sync` |
| Don’t want Cloudflare yet | Skip R2 env vars — sync publishes to `public/photos/` on Vercel |

---

## Security notes

- Never commit `.env.local`, rclone config, or Apple session cookies
- `.photos-inbox/` and `.photos-sync-state.json` are gitignored
- R2 tokens should be scoped to the photos bucket only
