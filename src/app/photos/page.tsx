import type { Metadata } from "next";
import PhotosGallery from "@/components/PhotosGallery";
import { getPhotoDateRangeLabel, getPhotos, getPhotosManifest } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Photos — Aryan Aladar",
  description: "A living photo album synced from Apple Photos.",
};

export default function PhotosPage() {
  const manifest = getPhotosManifest();
  const photos = getPhotos();
  const rangeLabel = getPhotoDateRangeLabel(photos);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <section className="flex w-full flex-col gap-8">
        <div className="space-y-6">
          <p className="text-sm text-neutral-700">
            <a
              className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
              href="/"
            >
              ← back to home
            </a>
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Photos</h1>
            <p className="text-base text-neutral-800">
              {rangeLabel ?? "Add photos to your Website album and sync to publish them here."}
            </p>
            <p className="text-sm text-neutral-500">
              Synced from Apple Photos album “{manifest.album}”
              {manifest.updatedAt
                ? ` · updated ${new Date(manifest.updatedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`
                : null}
            </p>
          </div>
        </div>

        <PhotosGallery photos={photos} />
      </section>
    </main>
  );
}
