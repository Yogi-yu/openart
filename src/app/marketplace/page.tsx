

// page.tsx
'use client';

import { useContract, useValidDirectListings } from '@thirdweb-dev/react';
import { useEffect, useState } from 'react';
import { ListingCard } from './ListingCard';

export default function MarketplacePage() {
  const [ready, setReady] = useState(false);
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
    if (typeof window !== 'undefined' && contract) {
      console.log('[MarketplacePage] useEffect triggered');
      console.log('[MarketplacePage] contract ready:', contract);
      setReady(true);
    }
  }, [contract]);

  useEffect(() => {
    console.log('[MarketplacePage] listings updated:', listings);
    console.log('[MarketplacePage] isLoading:', isLoading);
    console.log('[MarketplacePage] error:', error);
  }, [listings, isLoading, error]);

  if (!ready) return <div className="text-white p-6 text-sm">Loading...</div>;

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🖼️ NFT Market</h1>
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
