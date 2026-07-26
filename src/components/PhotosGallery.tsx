"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Photo } from "@/lib/photos";

function PhotoCard({
  photo,
  priority = false,
  sizes,
  onOpen,
}: {
  photo: Photo;
  priority?: boolean;
  sizes: string;
  onOpen: (photo: Photo) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      className="group block w-full overflow-hidden rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
      aria-label={`Open photo from ${new Date(photo.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`}
    >
      <Image
        src={photo.imageUrl}
        alt=""
        width={photo.width}
        height={photo.height}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full object-cover transition duration-300 group-hover:opacity-90"
      />
    </button>
  );
}

function columnize(photos: Photo[], columnCount: number): Photo[][] {
  const columns: Photo[][] = Array.from({ length: columnCount }, () => []);
  photos.forEach((photo, index) => {
    columns[index % columnCount].push(photo);
  });
  return columns;
}

export default function PhotosGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<Photo | null>(null);
  const twoCol = useMemo(() => columnize(photos, 2), [photos]);
  const threeCol = useMemo(() => columnize(photos, 3), [photos]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (!active) return;

      const index = photos.findIndex((photo) => photo.id === active.id);
      if (event.key === "ArrowRight" && index < photos.length - 1) {
        setActive(photos[index + 1]);
      }
      if (event.key === "ArrowLeft" && index > 0) {
        setActive(photos[index - 1]);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, photos]);

  if (photos.length === 0) {
    return (
      <div className="space-y-3 text-base text-neutral-700">
        <p>No photos yet.</p>
        <p>
          Create an Apple Photos album named <span className="font-medium text-neutral-900">Website</span>,
          add a few shots, then run the sync script. See{" "}
          <a
            className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
            href="https://github.com/aaladaruncc/website/blob/main/docs/PHOTOS_SETUP.md"
          >
            PHOTOS_SETUP.md
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            priority={index < 2}
            sizes="92vw"
            onOpen={setActive}
          />
        ))}
      </div>

      <div className="hidden gap-3 sm:grid sm:grid-cols-2 md:hidden">
        {twoCol.map((column, columnIndex) => (
          <div key={`two-${columnIndex}`} className="flex flex-col gap-3">
            {column.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                priority={columnIndex === 0 && index < 2}
                sizes="(min-width: 640px) 45vw, 92vw"
                onOpen={setActive}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="hidden gap-3 md:grid md:grid-cols-3">
        {threeCol.map((column, columnIndex) => (
          <div key={`three-${columnIndex}`} className="flex flex-col gap-3">
            {column.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                priority={columnIndex < 2 && index === 0}
                sizes="(min-width: 768px) 240px, 45vw"
                onOpen={setActive}
              />
            ))}
          </div>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-sm text-white/80 transition hover:text-white"
            onClick={() => setActive(null)}
          >
            Close
          </button>
          <div
            className="relative max-h-[90vh] max-w-[min(92vw,1100px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={active.imageUrl}
              alt=""
              width={active.width}
              height={active.height}
              className="max-h-[90vh] w-auto object-contain"
              sizes="92vw"
              priority
            />
            <p className="mt-3 text-center text-sm text-white/70">
              {new Date(active.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
