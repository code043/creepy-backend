/*
  Warnings:

  - Changed the type of `content` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;
