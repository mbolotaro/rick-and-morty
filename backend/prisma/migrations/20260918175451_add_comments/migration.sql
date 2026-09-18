-- CreateEnum
CREATE TYPE "CommentResource" AS ENUM ('characters', 'locations', 'episodes');

-- CreateEnum
CREATE TYPE "CommentRate" AS ENUM ('UP', 'DOWN');

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "resource" "CommentResource" NOT NULL,
    "externalId" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_comments" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "value" "CommentRate" NOT NULL,

    CONSTRAINT "rate_comments_pkey" PRIMARY KEY ("userId","commentId")
);

-- CreateIndex
CREATE INDEX "comments_resource_externalId_createdAt_idx" ON "comments"("resource", "externalId", "createdAt");

-- CreateIndex
CREATE INDEX "comments_userId_createdAt_idx" ON "comments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "rate_comments_commentId_value_idx" ON "rate_comments"("commentId", "value");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_comments" ADD CONSTRAINT "rate_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_comments" ADD CONSTRAINT "rate_comments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
