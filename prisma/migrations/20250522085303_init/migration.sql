-- CreateTable
CREATE TABLE "PurchaseHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userAddress" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "nftContract" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "listingId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "PurchaseHistory_userAddress_idx" ON "PurchaseHistory"("userAddress");
