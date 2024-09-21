/*
  Warnings:

  - You are about to drop the column `count` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "count";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_key" ON "Reaction"("userId", "postId");
