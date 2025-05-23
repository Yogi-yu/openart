'use client';

import { useEffect, useState } from 'react';
import { getContract } from 'thirdweb';
import { getAllListings } from 'thirdweb/extensions/marketplace';
import { bscTestnet } from 'thirdweb/chains';
import { client } from '@/app/client';
import SmartMedia from '@/components/SmartMedia';
import { useActiveAccount } from "thirdweb/react";
import { sendTransaction } from "thirdweb";
import { useRef } from "react";


import { fetchListingsWithOwners } from "@/lib/fetchListingsWithOwners";
import { useConnectModal   } from "thirdweb/react";




import { buyFromListing } from "thirdweb/extensions/marketplace";

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
const NFT_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;



function resolveIPFSUrl(uri: string) {
  if (!uri) return '';
  return uri.startsWith('ipfs://')
    ? uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : uri;
}


export default function MarketplacePage() {
  const account = useActiveAccount();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { connect, isConnecting } = useConnectModal();
  // const [hasConnected, setHasConnected] = useState(false);
  const accountRef = useRef<string | null>(null);




const handleBuyNow = async (listing: any) => {
  if (!account?.address) {
    alert("⚠️ Wallet not connected");
    return;
  }

  const confirmed = window.confirm(
    `Do you want to purchase this NFT for ${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}?`
  );
  if (!confirmed) return;

  try {
    const contract = getContract({
      client,
      address: MARKETPLACE_ADDRESS,
      chain: bscTestnet,
    });

    const transaction = buyFromListing({
      contract,
      listingId: BigInt(listing.id),
      quantity: 1n,
      recipient: account.address,
    });

    await sendTransaction({ transaction, account });

    // ✅ Record purchase
    await fetch("/api/record-purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAddress: account.address,
        tokenId: listing.tokenId.toString(),
        nftContract: listing.assetContractAddress,
        price: listing.currencyValuePerToken.displayValue,
        currency: listing.currencyValuePerToken.symbol,
        timestamp: new Date().toISOString(),
        listingId: listing.id.toString(),
      }),
    });

    alert("✅ Purchase successful and recorded!");
  } catch (err: any) {
    console.error("❌ Purchase failed:", err);
    alert("❌ Purchase failed: " + err.message);
  }
};



  useEffect(() => {
    async function fetchListings() {
    if (!account?.address) {
        // setHasConnected(true);
        setListings(await fetchListingsWithOwners(
        MARKETPLACE_ADDRESS, 
      ));
        setLoading(false);
        return;
      }
      //  if (!account?.address) return;

      if (account.address === accountRef.current) return;
       accountRef.current = account.address;

      try {
        setLoading(true);

       const all = await fetchListingsWithOwners(
        MARKETPLACE_ADDRESS, 
      );  
    
       const visible = all.filter((l) => {
        const owner = l.asset?.owner?.toLowerCase?.();
        const user = account?.address?.toLowerCase?.();

        // If either is undefined, we keep it visible
        if (!owner || !user) return true;

        return owner !== user;
      });

      // show the listings that are not owned by the user

      console.log("🧼 All listings:", all);
      console.log("🧼 Filtered listings:", visible);

      console.log("account.address:", account?.address);
      // console.log("listing owners:", all.map(l => l.asset?.owner));

      setListings(visible);

        setError(null);
      } catch (err: any) {
        setError(err);
        console.error("❌ Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [account?.address]);

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
        className="flex flex-col rounded-xl border border-gray-700 bg-zinc-900 p-3 shadow-md"
      >
        <div className="w-full aspect-square overflow-hidden rounded-lg">
          <SmartMedia src={resolveIPFSUrl(listing.asset.metadata.image)} />
        </div>

        <h2 className="mt-3 text-lg font-semibold truncate text-white">
          {listing.asset.metadata.name}
        </h2>

        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
          {listing.asset.metadata.description || "No description available."}
        </p>

      <p className="mt-1 text-xs text-zinc-400 break-all">
  Owner: <span className="font-mono">{listing.asset.owner}</span>
</p>

        {listing.currencyValuePerToken ? (
          <p className="mt-2 text-sm font-bold text-blue-400">
            {listing.currencyValuePerToken.displayValue}{' '}
            {listing.currencyValuePerToken.symbol}
          </p>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">No price</p>
        )}

        {account ? (
          <button
            onClick={() => handleBuyNow(listing)}
            className="mt-2 bg-green-600 hover:bg-green-500 text-white text-sm py-1 px-3 rounded"
          >
            Buy Now
          </button>
        ) : (
          <button
            onClick={() => connect({ client })}
            className="mt-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm py-1 px-3 rounded"
          >
            Connect to Buy
          </button>
        )}
      </div>

          
        ))}
      </div>
      
    </main>
  );
}
