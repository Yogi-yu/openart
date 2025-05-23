'use client';

import { useEffect, useState } from 'react';
import { getOwnedNFTs } from 'thirdweb/extensions/erc721';
import { getContract } from 'thirdweb';
import { useActiveAccount } from 'thirdweb/react';
import { client } from '@/app/client';
import { bscTestnet } from 'thirdweb/chains';
import SmartMedia from '@/components/SmartMedia';
import { resolveIPFSUrl } from '@/utils/resolveIPFSUrl';
import { getAllListings } from 'thirdweb/extensions/marketplace';

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
const NFT_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;

export default function MyCollectionsPage() {
  const account = useActiveAccount();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!account?.address) return;

      setLoading(true);

      try {
        const nftContract = getContract({
          client,
          address: NFT_COLLECTION_ADDRESS,
          chain: bscTestnet,
        });

        const marketplace = getContract({
          client,
          address: MARKETPLACE_ADDRESS,
          chain: bscTestnet,
        });

        const [owned, allListings] = await Promise.all([
          getOwnedNFTs({ contract: nftContract, owner: account.address }),
          getAllListings({ contract: marketplace }),
        ]);

        const enriched = owned.map((nft) => {
          const listing = allListings.find(
            (l) =>
              l.assetContractAddress.toLowerCase() === nft.tokenAddress.toLowerCase() &&
              l.tokenId.toString() === nft.id.toString()
          );
          return { ...nft, listing };
        });
          
        setNfts(enriched);

        const res = await fetch(`/api/user-history?address=${account.address}`);

        if (!res.ok) {
          console.error("Failed to fetch user history:", res.status);
          return;
        }

        const history = await res.json();
        setPurchaseHistory(history);

    
      } catch (err) {
        console.error('Failed to load Collections:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [account?.address]);

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🎒 My NFTs</h1>

      {!account && <p>Please connect your wallet.</p>}
      {loading && <p>Loading your Collections...</p>}
      {!loading && nfts.length === 0 && <p>You don’t own any Collections.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {nfts.map((nft) => {
        const matchingPurchase = purchaseHistory
          .filter(
            (h) =>
              h.tokenId === `${nft.id}n` &&
              h.nftContract.toLowerCase() === nft.tokenAddress.toLowerCase()
          )
          .sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
     
          return (
            <div
              key={nft.id}
              className="border border-gray-700 rounded bg-zinc-900 p-2 shadow-sm"
            >
              <div className="aspect-square overflow-hidden rounded">
                <SmartMedia src={resolveIPFSUrl(nft.metadata?.image)} />
              </div>
              <h2 className="mt-2 text-base font-semibold truncate">
                {nft.metadata?.name || 'Untitled'}
              </h2>
              <p className="text-xs text-zinc-400 truncate">
                {nft.metadata?.description || 'No description.'}
              </p>

              {nft.listing ? (
                <p className="mt-2 text-sm font-bold text-blue-400">
                  Listed for {nft.listing.currencyValuePerToken.displayValue}{' '}
                  {nft.listing.currencyValuePerToken.symbol}
                </p>
              ) : (
                <p className="mt-2 text-xs text-zinc-500 italic">Not listed</p>
              )}

              {matchingPurchase && (
                <p className="text-xs text-zinc-400 mt-1">
                  Bought for {matchingPurchase.price} {matchingPurchase.currency} on{' '}
                   {new Date(matchingPurchase.timestamp).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}