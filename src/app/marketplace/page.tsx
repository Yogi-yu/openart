'use client';

import {
  useContract,
  useValidDirectListings,
} from '@thirdweb-dev/react';
import SmartMedia from '@/components/SmartMedia';
import { useEffect, useState } from 'react';

export default function MarketplacePage() {
  const [ready, setReady] = useState(false);

  const { contract } = useContract(
    '0xA674f0a263379D804D0205Fac0e0f6637625C90b',
    'marketplace-v3'
  );
  const { data: listings, isLoading, error } = useValidDirectListings(contract);

  useEffect(() => {
    if (typeof window !== 'undefined' && contract) {
      setReady(true);
    }
  }, [contract]);

  if (!ready) return <div className="text-white p-6 text-sm">Loading...</div>;

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🖼️ NFT Market</h1>

      {isLoading && <p>Loading listings...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!isLoading && listings?.length === 0 && <p>No listings found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {listings?.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col border border-gray-700 rounded-md bg-zinc-900 p-2 shadow-sm"
          >
            <div className="w-full aspect-square overflow-hidden rounded">
              <SmartMedia src={listing.asset.image} />
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
