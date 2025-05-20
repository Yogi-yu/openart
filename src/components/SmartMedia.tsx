'use client';

import Image from 'next/image';

export function resolveIPFSUrl(url?: string | null): string {
  if (!url) return '';

  try {
    // Handle ipfs:// links
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    }

    // Handle cf-ipfs.com
    if (url.includes('cf-ipfs.com')) {
      const urlObj = new URL(url);
      const hash = urlObj.hostname.split('.')[0];
      const path = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
      return `https://nftstorage.link/ipfs/${hash}/${path}`;
    }

    return url;
  } catch (e) {
    return '';
  }
}





export default function SmartMedia({ src }: { src?: string }) {
  const resolvedSrc = resolveIPFSUrl(src);

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
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
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
