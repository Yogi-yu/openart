'use client';

import {
  useContract,
  useValidDirectListings,
} from '@thirdweb-dev/react';
import { useEffect, useState } from 'react';
import SmartMedia from '@/components/SmartMedia';
import { resolveIPFSUrl } from '@/utils/resolveIPFSUrl';
import { useHasMounted } from '@/hooks/useHasMounted';



export default function MarketplacePage() {
   const hasMounted = useHasMounted();
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

 
if (!contract || !hasMounted || isLoading) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white">
      <p>Loading the marketplace...</p>
    </main>
  );
}

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🖼️ NFT Market</h1>

      {isLoading && <p>Loading listings...</p>}
      {error instanceof Error && (
        <p className="text-red-500">Error: {error.message}</p>
      )}
      {!isLoading && listings?.length === 0 && <p>No listings found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {listings?.map((listing) => (
          <ListingCard key={listing.id} metadataUrl={listing.asset.image} listing={listing} />
        ))}
      </div>
    </main>
  );
}

function ListingCard({ metadataUrl, listing }: { metadataUrl?: string | null; listing: any }) {

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>('Untitled');
  const [description, setDescription] = useState<string>('');

useEffect(() => {
async function loadMetadata() {
  if (!metadataUrl) return;

  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(metadataUrl);

  if (isImage) {
    setImageUrl(resolveIPFSUrl(metadataUrl));
    setName(listing.asset.name || 'Untitled');
    setDescription(listing.asset.description || '');
    return;
  }

  try {
    const res = await fetch(resolveIPFSUrl(metadataUrl));
    const json = await res.json();
    setImageUrl(resolveIPFSUrl(json.image));
    setName(json.name || 'Untitled');
    setDescription(json.description || '');
  } catch (err) {
    console.error('Failed to fetch metadata:', err);
  }
}

  loadMetadata();
}, [metadataUrl]);

  return (
    <div className="flex flex-col border border-gray-700 rounded-md bg-zinc-900 p-2 shadow-sm">
      <div className="w-full aspect-square overflow-hidden rounded">
        <SmartMedia src={imageUrl ?? undefined} />
      </div>

      <h2 className="text-base font-semibold mt-2 truncate">{name}</h2>
      <p className="text-xs text-zinc-400 mb-1 line-clamp-2">{description}</p>

      {listing.currencyValuePerToken ? (
        <p className="text-sm font-bold text-blue-400 mt-auto">
          {listing.currencyValuePerToken.displayValue}{' '}
          {listing.currencyValuePerToken.symbol}
        </p>
      ) : (
        <p className="text-xs text-zinc-500 mt-auto">No price</p>
      )}
    </div>
  );
}
