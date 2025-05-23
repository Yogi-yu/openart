'use client';

import Image from 'next/image';
import { resolveIPFSUrl } from '@/utils/resolveIPFSUrl';

export default function SmartMedia({ src }: { src?: string | null }) {
  const resolvedSrc = resolveIPFSUrl(src ?? undefined);

  // console.log('[SmartMedia] src in:', src);
  // console.log('[SmartMedia] src resolved:', resolvedSrc);

  if (!resolvedSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400 text-xs">
        No image
      </div>
    );
  }

  const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(resolvedSrc);

  if (isImage) {
    return (
      <div className="relative w-full h-full rounded overflow-hidden">
        <Image
          src={resolvedSrc}
          alt="NFT media"
          fill
          unoptimized
          className="object-cover object-center"
        />
      </div>
    );
  }

  return (
    <a
      href={resolvedSrc}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-full flex items-center justify-center bg-zinc-800 text-blue-400 underline text-sm"
    >
      View media
    </a>
  );
}
