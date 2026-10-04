# Photos via iCloud Shared Album

`/photos` loads images straight from a **public iCloud Shared Album**.  
Apple hosts the files — no Cloudflare bucket, no rclone, no sync script.

## How it works

1. You create a Shared Album on your iPhone/Mac and add photos to it
2. You turn on **Public Website** and copy the share link
3. You set that link as `ICLOUD_SHARED_ALBUM_URL`
4. The site fetches Apple’s shared-album feed and renders the grid

Add a photo on your phone → it shows up on `/photos` after the next refresh (cached ~5 minutes).

---

## Connect your album (walkthrough)

### 1. Create the Shared Album

**iPhone**

1. Open **Photos**
2. **Albums** → **+** → **New Shared Album**
3. Name it something like `Website`
4. Add the photos you want public

**Mac**

1. Open **Photos**
2. **File → New Shared Album**
3. Name it `Website` and add photos

### 2. Make it publicly readable

1. Open the shared album
2. Tap/click the people / share controls
3. Turn on **Public Website**
4. Copy the public link — it looks like:
   `https://www.icloud.com/sharedalbum/#B0xxxxxxxx`

Anyone with the link can view the photos on Apple’s page. That’s what this site uses too.

### 3. Point the website at it

Locally:

```bash
cp .env.example .env.local
```

Set:

```bash
ICLOUD_SHARED_ALBUM_URL=https://www.icloud.com/sharedalbum/#B0xxxxxxxx
```

On Vercel (or your host): add the same env var in Project Settings → Environment Variables, then redeploy.

### 4. Run the site

```bash
npm run dev
# open http://localhost:3000/photos
```

Without the env var, `/photos` shows the bundled **demo** images so the page still works.

---

## Day-to-day use

- Add/remove photos in the Shared Album on your phone
- Wait for iCloud to sync
- Refresh `/photos`

No deploy needed when photos change.

---

## Notes

- Only photos are shown (videos in the album are skipped)
- Apple’s image URLs expire, so `/photos` fetches a fresh album feed on each request
- This uses Apple’s undocumented Shared Album web API — keep Public Website on
- Prefer a curated album you don’t mind being world-readable via the public link
