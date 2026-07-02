-- Decoupled Global Free Resources Schema
-- Centered strictly on public educational content, fully isolated from any tenant schemas.

CREATE TABLE "PublicGlobalResource" (
    "id" VARCHAR(255) PRIMARY KEY,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "is_tenant_isolated" BOOLEAN DEFAULT FALSE NOT NULL,
    "framework" JSONB NOT NULL,
    "seo" JSONB NOT NULL,
    "payload" JSONB NOT NULL
);

-- Crucial for lightning-fast public global lookups without indexing tenant keys
CREATE INDEX "idx_public_global_res_slug" ON "PublicGlobalResource"("slug") WHERE is_tenant_isolated = FALSE;
CREATE INDEX "idx_public_global_res_framework" ON "PublicGlobalResource" USING gin ("framework");
