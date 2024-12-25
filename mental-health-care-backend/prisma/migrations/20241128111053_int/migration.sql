/*
  Warnings:

  - Changed the type of `mood_rating` on the `formdatamaster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `current_stress_level` on the `formdatamaster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "formdatamaster" DROP COLUMN "mood_rating",
ADD COLUMN     "mood_rating" INTEGER NOT NULL,
DROP COLUMN "current_stress_level",
ADD COLUMN     "current_stress_level" INTEGER NOT NULL;
