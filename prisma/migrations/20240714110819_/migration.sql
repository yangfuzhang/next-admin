/*
  Warnings:

  - A unique constraint covering the columns `[botId]` on the table `Bot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `botId` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "botId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSuper" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Bot_botId_key" ON "Bot"("botId");
