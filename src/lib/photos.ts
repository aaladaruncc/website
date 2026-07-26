import photosManifest from "@/data/photos.json";

export type Photo = {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  date: string;
};

export type PhotosManifest = {
  album: string;
  updatedAt: string | null;
  photos: Photo[];
};

export function getPhotosManifest(): PhotosManifest {
  return photosManifest as PhotosManifest;
}

export function getPhotos(): Photo[] {
  return getPhotosManifest().photos;
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
