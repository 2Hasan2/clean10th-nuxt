/*
  Warnings:

  - A unique constraint covering the columns `[upc]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `upc` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "upc" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_upc_key" ON "Product"("upc");
