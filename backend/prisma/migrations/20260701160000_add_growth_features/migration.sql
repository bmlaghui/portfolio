ALTER TABLE "Project"
ADD COLUMN "slug" TEXT,
ADD COLUMN "challenge" TEXT,
ADD COLUMN "challengeEn" TEXT,
ADD COLUMN "solution" TEXT,
ADD COLUMN "solutionEn" TEXT,
ADD COLUMN "results" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "resultsEn" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "role" TEXT,
ADD COLUMN "duration" TEXT;

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

CREATE TABLE "Testimonial" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "company" TEXT,
  "quote" TEXT NOT NULL,
  "quoteEn" TEXT,
  "avatarUrl" TEXT,
  "linkedin" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsletterSubscriber" (
  "id" SERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'fr',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

CREATE TABLE "AnalyticsEvent" (
  "id" SERIAL NOT NULL,
  "type" TEXT NOT NULL,
  "resource" TEXT,
  "resourceId" TEXT,
  "path" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");
