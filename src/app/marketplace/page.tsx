'use client';

import {
  useContract,
  useValidDirectListings,
} from '@thirdweb-dev/react';
import { useEffect, useState } from 'react';
import { resolveIPFSUrl } from '@/utils/resolveIPFSUrl';
import Image from 'next/image';
import { useHasMounted } from '@/hooks/useHasMounted';

interface ListingCardProps {
  listing: any;
}

// function ListingCard({ listing }: ListingCardProps) {
//   console.log('[ListingCard] render', listing.asset);
//   const [metadata, setMetadata] = useState<any>(null);

//   useEffect(() => {
//     const fetchMetadata = async () => {
//       try {
//         const uri = listing.asset.tokenUri || listing.asset.metadataUri;
//         if (!uri) return;

//         const url = resolveIPFSUrl(uri);
//         const res = await fetch(url);
//         const data = await res.json();
//         setMetadata(data);
//       } catch (err) {
//         console.warn('Failed to fetch metadata:', err);
//       }
//     };

//     fetchMetadata();
//   }, [listing]);

//   return (
//     <div className="flex flex-col border border-gray-700 rounded-md bg-zinc-900 p-2 shadow-sm">
//       <div className="w-full aspect-square overflow-hidden rounded bg-zinc-800">
//         {metadata?.image ? (
//            <Image
//     src={resolveIPFSUrl(metadata.image)}
//     alt="NFT"
//     unoptimized={true}
//     width={500}
//     height={500}
//     className="w-full h-full object-cover"
//   />
//         ) : (
//           <div className="flex items-center justify-center h-full text-zinc-400 text-sm">No image</div>
//         )}
//       </div>
//       <h2 className="text-base font-semibold mt-2 truncate">
//         {metadata?.name || 'Untitled'}
//       </h2>
//       <p className="text-xs text-zinc-400 mb-1 line-clamp-2">
//         {metadata?.description || 'No description'}
//       </p>
//       {listing.currencyValuePerToken ? (
//         <p className="text-sm font-bold text-blue-400 mt-auto">
//           {listing.currencyValuePerToken.displayValue}{' '}
//           {listing.currencyValuePerToken.symbol}
//         </p>
//       ) : (
//         <p className="text-xs text-zinc-500 mt-auto">No price</p>
//       )}
//     </div>
//   );
// }

function ListingCard({ listing }: { listing: any }) {
  const asset = listing.asset;

  return (
    <div className="flex flex-col border border-gray-700 rounded-md bg-zinc-900 p-2 shadow-sm">
      <div className="w-full aspect-square overflow-hidden rounded bg-zinc-800 relative">
        <Image
          src={asset.image}
          alt={asset.name || 'NFT'}
          unoptimized
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-base font-semibold mt-2 truncate">{asset.name || 'Untitled'}</h2>
      <p className="text-xs text-zinc-400 mb-1 line-clamp-2">
        {asset.description || 'No description'}
      </p>
      {listing.currencyValuePerToken ? (
        <p className="text-sm font-bold text-blue-400 mt-auto">
          {listing.currencyValuePerToken.displayValue} {listing.currencyValuePerToken.symbol}
        </p>
      ) : (
        <p className="text-xs text-zinc-500 mt-auto">No price</p>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  const [hasMounted, setHasMounted] = useState(false);

  const { contract } = useContract(
    '0xA674f0a263379D804D0205Fac0e0f6637625C90b',
    'marketplace-v3'
  );

  const {
    data: listings,
    isLoading,
    error,
  } = useValidDirectListings(contract);

  useEffect(() => {
    setHasMounted(true);
  }, []);

 if (!contract || !hasMounted || isLoading) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white">
      <p>Loading the marketplace...</p>
    </main>
  );
}

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🖼️ NFT Marketplace</h1>

      {isLoading && <p>Loading listings...</p>}
      {error instanceof Error && (
        <p className="text-red-500">Error: {error.message}</p>
      )}
      {!isLoading && listings?.length === 0 && <p>No listings found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {listings?.map((listing: any) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </main>
  );
}
