'use client';

import { useContract, useDirectListings } from '@thirdweb-dev/react';
import SmartMedia from '@/components/SmartMedia';
import { useEffect, useState } from 'react';

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { contract } = useContract(
    '0xA674f0a263379D804D0205Fac0e0f6637625C90b',
    'marketplace-v3'
  );

  useEffect(() => {
    const fetchListings = async () => {
      if (!contract) return;

      try {
        setLoading(true);
        const allListings = await contract.directListings.getAllValid();

        const listingsWithMetadata = await Promise.all(
          allListings.map(async (listing) => {
            let metadata = listing.asset;
            const uri = listing.asset?.uri;

            try {
              if (uri && typeof uri === 'string') {
                let metadataUrl = uri.replace('ipfs://', 'https://ipfs.dweb.link/ipfs/');
                let res = await fetch(metadataUrl);
                if (!res.ok) {
                  metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                  res = await fetch(metadataUrl);
                }
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                metadata = await res.json();
                console.log('[Metadata] final metadata:', metadata);
              }
            } catch (err) {
              console.warn(`Failed to fetch metadata from ${uri}`, err);
            }

            return {
              ...listing,
              asset: {
                ...listing.asset,
                ...metadata,
              },
            };
          })
        );

        setListings(listingsWithMetadata);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [contract]);

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🖼️ NFT Market</h1>

      {loading && <p>Loading listings...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && listings.length === 0 && <p>No listings found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col border border-gray-700 rounded-md bg-zinc-900 p-2 shadow-sm"
          >
            <div className="w-full aspect-square overflow-hidden rounded">
              <SmartMedia src={listing.asset.image ?? undefined} />
            </div>

            <h2 className="text-base font-semibold mt-2 truncate">
              {listing.asset.name}
            </h2>
            <p className="text-xs text-zinc-400 mb-1 line-clamp-2">
              {listing.asset.description}
            </p>

            {listing.currencyValuePerToken ? (
              <p className="text-sm font-bold text-blue-400 mt-auto">
                {listing.currencyValuePerToken.displayValue}{' '}
                {listing.currencyValuePerToken.symbol}
              </p>
            ) : (
              <p className="text-xs text-zinc-500 mt-auto">No price</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
