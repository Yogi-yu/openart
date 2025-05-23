export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const history = await prisma.purchaseHistory.findMany({
    where: {
      userAddress: address.toLowerCase(),
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return NextResponse.json(history);
}
