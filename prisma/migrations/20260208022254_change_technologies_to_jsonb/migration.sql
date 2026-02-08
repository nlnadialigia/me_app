/*
  Warnings:

  - Changed the type of `technologies` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "technologies",
ADD COLUMN     "technologies" JSONB NOT NULL;
