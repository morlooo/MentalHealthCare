/*
  Warnings:

  - Added the required column `name` to the `usermaster` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "formdatamaster" DROP CONSTRAINT "formdatamaster_user_id_fkey";

-- AlterTable
ALTER TABLE "usermaster" ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "formdatamaster" ADD CONSTRAINT "formdatamaster_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usermaster"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
