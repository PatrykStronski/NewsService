/*
  Warnings:

  - You are about to drop the `NewsEnt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NewsEnt" DROP CONSTRAINT "NewsEnt_authorId_fkey";

-- DropTable
DROP TABLE "NewsEnt";

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "status" "NewsStatus" NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
