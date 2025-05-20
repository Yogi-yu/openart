'use client';

import Image from 'next/image';

export default function SmartMedia({ src }: { src?: string }) {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400 text-xs">
        No image
      </div>
    );
  }

  const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(src);

  if (isImage) {
    return (
      <div className="relative w-full h-full rounded overflow-hidden">
        <Image
          src={src}
          alt="NFT media"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
        />
      </div>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-full flex items-center justify-center bg-zinc-800 text-blue-400 underline text-sm"
    >
      View media
    </a>
  );
}
