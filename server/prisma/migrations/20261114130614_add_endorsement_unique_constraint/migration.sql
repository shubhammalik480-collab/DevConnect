/*
  Warnings:

  - A unique constraint covering the columns `[fromUserId,skillId]` on the table `Endorsement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Endorsement_fromUserId_skillId_key" ON "Endorsement"("fromUserId", "skillId");
