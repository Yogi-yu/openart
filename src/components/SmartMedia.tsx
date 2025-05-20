'use client';

import Image from 'next/image';
import { resolveIPFSUrl } from '@/utils/resolveIPFSUrl';

export default function SmartMedia({ src }: { src?: string | null }) {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400 text-xs">
        No image
      </div>
    );
  }
console.log("[SmartMedia] src in:", src);
console.log("[SmartMedia] src resolved:", resolveIPFSUrl(src));

  const url = resolveIPFSUrl(src);
  const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(url);

  if (isImage) {
    return (
      <div className="relative w-full h-full rounded overflow-hidden">
        <Image
          src={url}
          alt="NFT media"
          fill
          unoptimized
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
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-full flex items-center justify-center bg-zinc-800 text-blue-400 underline text-sm"
    >
      View media
    </a>
  );
}
