-- CreateTable
CREATE TABLE "usermaster" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "usermaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formdatamaster" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "mood_rating" VARCHAR(255) NOT NULL,
    "current_stress_level" VARCHAR(255) NOT NULL,
    "feelings" VARCHAR(255) NOT NULL,

    CONSTRAINT "formdatamaster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "formdatamaster" ADD CONSTRAINT "formdatamaster_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usermaster"("id") ON DELETE RESTRICT ON UPDATE SET NULL;
