-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availableFor" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "brandColor" TEXT DEFAULT '#000000',
ADD COLUMN     "currentlyHacking" TEXT,
ADD COLUMN     "currentlyLearning" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "pronouns" TEXT,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "userName" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "work" TEXT;
