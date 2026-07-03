-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "blocks" JSONB;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "certificateUrl" TEXT;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
