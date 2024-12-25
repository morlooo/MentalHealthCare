-- DropForeignKey
ALTER TABLE "formdatamaster" DROP CONSTRAINT "formdatamaster_user_id_fkey";

-- AddForeignKey
ALTER TABLE "formdatamaster" ADD CONSTRAINT "formdatamaster_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usermaster"("id") ON DELETE RESTRICT ON UPDATE SET NULL;
