import type { Photo } from "@/lib/photos";

type Derivative = {
  fileSize: number | string;
  checksum: string;
  width: number | string;
  height: number | string;
};

type StreamPhoto = {
  photoGuid: string;
  dateCreated?: string;
  caption?: string;
  mediaAssetType?: string;
  width?: number | string;
  height?: number | string;
  derivatives: Record<string, Derivative>;
};

type StreamResponse = {
  streamName?: string;
  photos?: StreamPhoto[];
  "X-Apple-MMe-Host"?: string;
};

type AssetItem = {
  url_expiry?: string;
  url_location: string;
  url_path: string;
};

type AssetsResponse = {
  items?: Record<string, AssetItem>;
};

const PHOTO_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function base62ToInt(input: string): number {
  return Array.from(input).reduce((result, char) => {
    const index = BASE62.indexOf(char);
    if (index < 0) return result;
    return result * 62 + index;
  }, 0);
}

function getPartitionFromToken(token: string): string {
  const partition =
    token[0] === "A" ? base62ToInt(token[1] ?? "0") : base62ToInt(token.substring(1, 3));
  return partition < 10 ? `0${partition}` : String(partition);
}

function extractToken(urlOrToken: string): string {
  const trimmed = urlOrToken.trim();
  const hashIndex = trimmed.indexOf("#");
  if (hashIndex >= 0) {
    return trimmed.slice(hashIndex + 1).split(/[/?&]/)[0];
  }
  const sharedMatch = trimmed.match(/sharedalbum\/(?:[^#]*#)?([A-Za-z0-9]+)/i);
  if (sharedMatch?.[1]) return sharedMatch[1];
  return trimmed.replace(/^#/, "");
}

async function postJson<T>(url: string, body: unknown): Promise<{ status: number; data: T }> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "User-Agent": PHOTO_UA,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T;
  return { status: response.status, data };
}

function pickBestDerivative(photo: StreamPhoto): Derivative | null {
  const derivatives = Object.values(photo.derivatives || {});
  if (!derivatives.length) return null;

  return derivatives
    .slice()
    .sort((a, b) => Number(b.fileSize) - Number(a.fileSize))[0];
}

function toIsoDate(value?: string): string {
  if (!value) return new Date().toISOString();
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
  // Apple sometimes returns "YYYY-MM-DD HH:mm:ss"
  const normalized = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const again = Date.parse(normalized);
  return Number.isFinite(again) ? new Date(again).toISOString() : new Date().toISOString();
}

async function fetchAssetMap(
  baseUrl: string,
  token: string,
  photoGuids: string[]
): Promise<Record<string, AssetItem>> {
  const items: Record<string, AssetItem> = {};
  const chunkSize = 200;

  for (let i = 0; i < photoGuids.length; i += chunkSize) {
    const chunk = photoGuids.slice(i, i + chunkSize);
    const { status, data } = await postJson<AssetsResponse>(
      `${baseUrl}/${token}/sharedstreams/webasseturls`,
      { photoGuids: chunk }
    );
    if (status !== 200 || !data.items) {
      throw new Error(`Failed to fetch iCloud asset URLs (HTTP ${status})`);
    }
    Object.assign(items, data.items);
  }

  return items;
}

export type SharedAlbumResult = {
  albumName: string;
  photos: Photo[];
};

/**
 * Load photos from a public iCloud Shared Album.
 * Pass either the full share URL or just the token after `#`.
 */
export async function fetchSharedAlbum(urlOrToken: string): Promise<SharedAlbumResult> {
  const token = extractToken(urlOrToken);
  if (!token) {
    throw new Error("Missing iCloud Shared Album token");
  }

  let partition = getPartitionFromToken(token);
  let baseUrl = `https://p${partition}-sharedstreams.icloud.com`;

  let { status, data } = await postJson<StreamResponse>(
    `${baseUrl}/${token}/sharedstreams/webstream`,
    { streamCtag: null }
  );

  // Apple redirects to the correct partition host with HTTP 330.
  if (status === 330 && data["X-Apple-MMe-Host"]) {
    baseUrl = `https://${data["X-Apple-MMe-Host"]}`;
    const redirected = await postJson<StreamResponse>(
      `${baseUrl}/${token}/sharedstreams/webstream`,
      { streamCtag: null }
    );
    status = redirected.status;
    data = redirected.data;
  }

  if (status !== 200) {
    throw new Error(`Failed to fetch iCloud Shared Album (HTTP ${status})`);
  }

  const streamPhotos = (data.photos || []).filter(
    (photo) => photo.mediaAssetType !== "video"
  );

  if (!streamPhotos.length) {
    return { albumName: data.streamName || "Shared Album", photos: [] };
  }

  const assetItems = await fetchAssetMap(
    baseUrl,
    token,
    streamPhotos.map((photo) => photo.photoGuid)
  );

  const photos: Photo[] = [];

  for (const photo of streamPhotos) {
    const derivative = pickBestDerivative(photo);
    if (!derivative) continue;

    const asset = assetItems[derivative.checksum];
    if (!asset) continue;

    photos.push({
      id: photo.photoGuid,
      imageUrl: `https://${asset.url_location}${asset.url_path}`,
      width: Number(derivative.width) || Number(photo.width) || 1600,
      height: Number(derivative.height) || Number(photo.height) || 1200,
      date: toIsoDate(photo.dateCreated),
      caption: photo.caption || undefined,
    });
  }

  photos.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return {
    albumName: data.streamName || "Shared Album",
    photos,
  };
}
