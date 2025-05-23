import { getContract, readContract } from "thirdweb";
import { getAllListings } from "thirdweb/extensions/marketplace";
import { client } from "@/app/client";
import { bscTestnet } from "thirdweb/chains";

// Minimal ABI for ownerOf
const ERC721_ABI = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

/**
 * Fetch listings and attach live owner info to each listing.
 */
export async function fetchListingsWithOwners(
  marketplaceAddress: string,
) {
  const marketplace = getContract({
    client,
    chain: bscTestnet,
    address: marketplaceAddress,
    
  });

  const rawListings = await getAllListings({ contract: marketplace });

  const enriched = await Promise.all(
    rawListings.map(async (listing) => {
      try {
        const nftContract = getContract({
          client,
          chain: bscTestnet,
          address: listing.asset.tokenAddress,
          abi: ERC721_ABI,
        });
        // console.log("⏳ Checking owner of", listing.asset.tokenAddress, listing.asset.id);

        const owner = await readContract({
          contract: nftContract,
          method: "ownerOf",
          params: [BigInt(listing.asset.id)],
          
        });

        return {
          ...listing,
          asset: {
            ...listing.asset,
            owner,
          },
        };
      } catch (error) {
        console.error("Failed to fetch owner for tokenId", listing.asset.id, error);
        return {
          ...listing,
          asset: {
            ...listing.asset,
            owner: null,
          },
        };
      }
    })
  );

  return enriched;
}