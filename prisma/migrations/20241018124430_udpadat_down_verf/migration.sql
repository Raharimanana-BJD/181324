/*
  Warnings:

  - You are about to drop the `DownloadVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DownloadVerification" DROP CONSTRAINT "DownloadVerification_productId_fkey";

-- DropTable
DROP TABLE "DownloadVerification";

-- CreateTable
CREATE TABLE "downloadVerification" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "downloadVerification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "downloadVerification" ADD CONSTRAINT "downloadVerification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
