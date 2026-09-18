-- CreateTable
CREATE TABLE "liked_characters" (
    "userId" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,

    CONSTRAINT "liked_characters_pkey" PRIMARY KEY ("userId","externalId")
);

-- CreateTable
CREATE TABLE "liked_locations" (
    "userId" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,

    CONSTRAINT "liked_locations_pkey" PRIMARY KEY ("userId","externalId")
);

-- CreateTable
CREATE TABLE "liked_episodes" (
    "userId" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,

    CONSTRAINT "liked_episodes_pkey" PRIMARY KEY ("userId","externalId")
);

-- AddForeignKey
ALTER TABLE "liked_characters" ADD CONSTRAINT "liked_characters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_locations" ADD CONSTRAINT "liked_locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_episodes" ADD CONSTRAINT "liked_episodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
