/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
DROP COLUMN "parentId",
ADD COLUMN     "categoryId" TEXT;
