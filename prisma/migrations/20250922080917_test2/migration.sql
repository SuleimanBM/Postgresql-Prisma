/*
  Warnings:

  - You are about to drop the column `userId` on the `UserPreference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userPreferenceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- DropIndex
DROP INDEX "public"."UserPreference_userId_key";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "userPreferenceId" TEXT;

-- AlterTable
ALTER TABLE "public"."UserPreference" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "User_userPreferenceId_key" ON "public"."User"("userPreferenceId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_userPreferenceId_fkey" FOREIGN KEY ("userPreferenceId") REFERENCES "public"."UserPreference"("id") ON DELETE SET NULL ON UPDATE CASCADE;
