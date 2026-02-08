/*
  Warnings:

  - You are about to drop the column `description` on the `projects` table. All the data in the column will be lost.
  - Added the required column `description_en` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_pt` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "description",
ADD COLUMN     "description_en" TEXT NOT NULL,
ADD COLUMN     "description_pt" TEXT NOT NULL;
