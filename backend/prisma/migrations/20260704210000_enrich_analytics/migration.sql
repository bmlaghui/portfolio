ALTER TABLE "AnalyticsEvent"
ADD COLUMN "visitorHash" TEXT,
ADD COLUMN "sessionId" TEXT,
ADD COLUMN "referrer" TEXT,
ADD COLUMN "device" TEXT;

CREATE INDEX "AnalyticsEvent_visitorHash_idx" ON "AnalyticsEvent"("visitorHash");
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");
