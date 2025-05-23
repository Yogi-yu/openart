export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    userAddress,
    tokenId,
    nftContract,
    price,
    currency,
    timestamp,
    listingId,
  } = body;

  try {
    const result = await prisma.purchaseHistory.create({
      data: {
        userAddress: userAddress.toLowerCase(),
        tokenId,
        nftContract,
        price,
        currency,
        timestamp: new Date(timestamp),
        listingId,
      },
    });

    console.log("✅ Successfully inserted purchase record:", result);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ Failed to insert into DB:", err);
    return new NextResponse("DB insert failed", { status: 500 });
  }
}
