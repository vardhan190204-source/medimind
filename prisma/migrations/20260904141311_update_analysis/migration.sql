/*
  Warnings:

  - You are about to drop the column `result` on the `Analysis` table. All the data in the column will be lost.
  - Added the required column `aiModel` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `differentialDx` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendations` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "result",
ADD COLUMN     "aiModel" TEXT NOT NULL,
ADD COLUMN     "differentialDx" JSONB NOT NULL,
ADD COLUMN     "recommendations" JSONB NOT NULL,
ADD COLUMN     "redFlags" TEXT[],
ADD COLUMN     "summary" TEXT NOT NULL;
