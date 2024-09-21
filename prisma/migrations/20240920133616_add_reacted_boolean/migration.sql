/*
  Warnings:

  - You are about to drop the column `count` on the `Reaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "count",
ADD COLUMN     "reacted" BOOLEAN NOT NULL DEFAULT false;
