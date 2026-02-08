/*
  Warnings:

  - You are about to drop the column `bio` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `profile` table. All the data in the column will be lost.
  - Added the required column `title_en` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_pt` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "bio",
DROP COLUMN "title",
ADD COLUMN     "bio_en" TEXT[],
ADD COLUMN     "bio_pt" TEXT[],
ADD COLUMN     "title_en" TEXT NOT NULL,
ADD COLUMN     "title_pt" TEXT NOT NULL;
