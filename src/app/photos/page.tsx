import type { Metadata } from "next";
import PhotosGallery from "@/components/PhotosGallery";
import { getPhotosManifest } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Photos — Aryan Aladar",
  description: "Photos from an iCloud Shared Album.",
};

// Shared Album asset URLs expire; always resolve a fresh feed.
export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const manifest = await getPhotosManifest();
  const isDemo = manifest.source === "demo";

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
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Photos</h1>
        </div>

        <PhotosGallery photos={manifest.photos} isDemo={isDemo} />
      </section>
    </main>
  );
}
