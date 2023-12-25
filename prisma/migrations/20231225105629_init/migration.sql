/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "Otp_code_key" ON "Otp"("code");
