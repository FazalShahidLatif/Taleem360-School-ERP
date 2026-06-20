-- 1. Guest User Session Tracking (Privacy-First)
CREATE TABLE nexus_guest_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(100) NOT NULL UNIQUE, -- The target destination for crypto rewards
    daily_counter INT DEFAULT 0, -- Hard upper limit guard (Max 10 quizzes per 24 hours)
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User-Generated Q&A Knowledge Warehouse (The Core Value Asset)
CREATE TABLE nexus_knowledge_base (
    qa_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_interest_topic VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL UNIQUE,
    question_type VARCHAR(30) NOT NULL, -- 'text_base', 'multiple_choice', 'fill_blank', 'true_false'
    correct_answer TEXT NOT NULL,
    json_options JSONB, -- Stores multi-choice arrays or text entry verification parameters
    seo_slug VARCHAR(255) UNIQUE, -- Auto-generated URL string to drive long-tail Google search engine traffic
    is_public_indexed BOOLEAN DEFAULT FALSE, -- Allows review checks before publishing to the front page
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crypto Transaction Ledger
CREATE TABLE nexus_payout_logs (
    tx_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(100) NOT NULL,
    qa_id UUID REFERENCES nexus_knowledge_base(qa_id),
    token_amount DECIMAL(18, 8) NOT NULL,
    blockchain_hash VARCHAR(100), -- Transaction hash string from the blockchain network
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seo_lookup ON nexus_knowledge_base (seo_slug) WHERE is_public_indexed = TRUE;
CREATE INDEX idx_wallet_throttle ON nexus_guest_sessions (wallet_address, last_played_at);
