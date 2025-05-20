'use client';

import Image from 'next/image';

export function resolveImageURL(url?: string | null): string | null {
  if (!url) return null;

  const cleanHash = url.replace('ipfs://', '').replace('https://', '');

  if (url.startsWith('ipfs://')) {
    return `https://nftstorage.link/ipfs/${cleanHash}`;
  }

  if (url.includes('.ipfscdn.io')) {
    const urlObj = new URL(url);
    const ipfsHash = urlObj.pathname.split('/ipfs/')[1];
    return `https://nftstorage.link/ipfs/${ipfsHash}`;
  }

  return url;
}

export default function SmartMedia({ src }: { src?: string }) {
  const resolvedSrc = resolveImageURL(src);

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
