/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId,emoji]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_userId_postId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_emoji_key" ON "Reaction"("userId", "postId", "emoji");
