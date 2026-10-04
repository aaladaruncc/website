import photosManifest from "@/data/photos.json";
import { fetchSharedAlbum } from "@/lib/icloud-shared-album";

export type Photo = {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  date: string;
  caption?: string;
};

export type PhotosManifest = {
  album: string;
  source: "icloud-shared-album" | "demo";
  updatedAt: string | null;
  photos: Photo[];
};

function getSharedAlbumUrl(): string | null {
  const value =
    process.env.ICLOUD_SHARED_ALBUM_URL?.trim() ||
    process.env.NEXT_PUBLIC_ICLOUD_SHARED_ALBUM_URL?.trim();
  return value || null;
}

export function getDemoPhotosManifest(): PhotosManifest {
  const demo = photosManifest as Omit<PhotosManifest, "source"> & { source?: string };
  return {
    album: demo.album || "Website (demo)",
    source: "demo",
    updatedAt: demo.updatedAt ?? null,
    photos: demo.photos || [],
  };
}

export async function getPhotosManifest(): Promise<PhotosManifest> {
  const sharedUrl = getSharedAlbumUrl();

  if (!sharedUrl) {
    return getDemoPhotosManifest();
  }

  try {
    const album = await fetchSharedAlbum(sharedUrl);
    return {
      album: album.albumName,
      source: "icloud-shared-album",
      updatedAt: new Date().toISOString(),
      photos: album.photos,
    };
  } catch (error) {
    console.error("Failed to load iCloud Shared Album; falling back to demo photos.", error);
    return getDemoPhotosManifest();
  }
}

export async function getPhotos(): Promise<Photo[]> {
  return (await getPhotosManifest()).photos;
}

export function getPhotoDateRangeLabel(photos: Photo[]): string | null {
  if (photos.length === 0) return null;

  const timestamps = photos
    .map((photo) => Date.parse(photo.date))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (timestamps.length === 0) return null;

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const start = formatter.format(new Date(timestamps[0]));
  const end = formatter.format(new Date(timestamps[timestamps.length - 1]));

  if (start === end) return `From ${start}.`;
  return `From ${start} to ${end}.`;
}
