'use client';

import { useEffect, useState } from 'react';
import { getContract } from 'thirdweb';
import { getAllListings } from 'thirdweb/extensions/marketplace';
import { bscTestnet } from 'thirdweb/chains';
import { client } from '@/app/client';
import SmartMedia from '@/components/SmartMedia';

function resolveIPFSUrl(uri: string) {
  if (!uri) return '';
  return uri.startsWith('ipfs://')
    ? uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : uri;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);

        const contract = getContract({
          client,
          address: '0xA674f0a263379D804D0205Fac0e0f6637625C90b',
          chain: bscTestnet,
        });

        const results = await getAllListings({ contract });
        setListings(results);
        setError(null);
        console.log('✅ Listings fetched:', results);
      } catch (err: any) {
        setError(err);
        console.error("❌ Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

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
            
    <div className="w-full aspect-square overflow-hidden rounded">
  <SmartMedia src={resolveIPFSUrl(listing.asset.metadata.image)} />
</div>
          
            </div>

            <h2 className="text-base font-semibold mt-2 truncate">
              {listing.asset.metadata.name}
            </h2>
            <p className="text-xs text-zinc-400 mb-1 line-clamp-2">
              {listing.asset.metadata.description}
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
