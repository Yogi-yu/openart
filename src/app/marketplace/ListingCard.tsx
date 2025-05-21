// ListingCard.tsx
'use client';

import Image from 'next/image';
import { resolveIPFSUrl } from '@/utils/resolveIPFSUrl';

interface ListingCardProps {
  listing: any;
}

export function ListingCard({ listing }: ListingCardProps) {
  const asset = listing.asset;
  const name = asset?.name || 'Untitled';
  const description = asset?.description || 'No description';
  const imageSrc = resolveIPFSUrl(asset?.image);
  const price = listing.currencyValuePerToken?.displayValue;
  const symbol = listing.currencyValuePerToken?.symbol;

  console.log('[ListingCard] listing:', listing);
  console.log('[ListingCard] image resolved:', imageSrc);

  return (
    <div className="flex flex-col border border-gray-700 rounded-md bg-zinc-900 p-2 shadow-sm">
      <div className="w-full aspect-square overflow-hidden rounded">
        <Image
          src={imageSrc || ''}
          alt={name}
          width={300}
          height={300}
          className="object-cover object-center w-full h-full rounded"
          unoptimized
        />
      </div>
      <h2 className="text-base font-semibold mt-2 truncate">{name}</h2>
      <p className="text-xs text-zinc-400 mb-1 line-clamp-2">{description}</p>
      {price ? (
        <p className="text-sm font-bold text-blue-400 mt-auto">
          {price} {symbol}
        </p>
      ) : (
        <p className="text-xs text-zinc-500 mt-auto">No price</p>
      )}
    </div>
  );
}