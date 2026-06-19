-- 1. Academy Institutional Tenant Isolation
CREATE TABLE academy_tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(150) NOT NULL,
    subdomain_mapping VARCHAR(100) UNIQUE, -- e.g., 'vertex-tech.taleem360.online'
    base_currency VARCHAR(10) DEFAULT 'PKR', -- Multi-currency ready (USD, AED, PKR)
    custom_branding_json JSONB DEFAULT '{}'::jsonb, -- Store theme primary colors, logos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Rolling Courses & Skill Tracks Matrix
CREATE TABLE academy_courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES academy_tenants(tenant_id) ON DELETE CASCADE,
    course_title VARCHAR(150) NOT NULL,
    course_category VARCHAR(50) NOT NULL, -- 'IT', 'Language', 'Vocational'
    duration_weeks INT NOT NULL,
    total_tuition_fee DECIMAL(12, 2) NOT NULL,
    certification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dynamic Student Cohort Enrollment (Loose Coupling Reference)
CREATE TABLE academy_enrollments_isolated (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES academy_tenants(tenant_id) ON DELETE CASCADE,
    course_id UUID REFERENCES academy_courses(course_id) ON DELETE CASCADE,
    t360_user_id UUID NOT NULL, -- References the global unified login profile account
    payment_plan_type VARCHAR(30) DEFAULT 'lump_sum', -- 'installment', 'subscription', 'lump_sum'
    current_progress_percentage INT DEFAULT 0,
    enrollment_status VARCHAR(20) DEFAULT 'active', -- 'completed', 'active', 'dropped'
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing strategy for ultra-fast dashboard queries across tenants
CREATE INDEX idx_tenant_course_lookup ON academy_courses (tenant_id);
CREATE INDEX idx_user_enrollment_lookup ON academy_enrollments_isolated (t360_user_id);

-- Tracks the parent payment schedule plan for a student's course enrollment
CREATE TABLE academy_installment_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL, -- References academy_enrollments_isolated
    tenant_id UUID NOT NULL,     -- References academy_tenants
    total_amount DECIMAL(12, 2) NOT NULL,
    total_installments INT NOT NULL DEFAULT 3,
    installments_paid INT NOT NULL DEFAULT 0,
    next_billing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'past_due'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tracks individual breakdown chunks and their corresponding Paddle transaction links
CREATE TABLE academy_installment_ledgers (
    ledger_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES academy_installment_plans(plan_id) ON DELETE CASCADE,
    installment_number INT NOT NULL,
    amount_due DECIMAL(12, 2) NOT NULL,
    paddle_invoice_id VARCHAR(100), -- Populated once Paddle creates the transaction
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'failed'
    paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_installment_lookup ON academy_installment_plans (enrollment_id);

CREATE TABLE academy_submissions_isolated (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL, -- Logical connection, no database foreign key
    course_id UUID NOT NULL,      -- Logical connection, no database foreign key
    assignment_title VARCHAR(150) NOT NULL,
    student_submission_payload TEXT NOT NULL, -- Raw content (code block, text essay, etc.)
    ai_evaluation_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'evaluated', 'failed'
    ai_raw_feedback JSONB,        -- Clean structured breakdown from Google AI Studio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pending_evaluations ON academy_submissions_isolated (ai_evaluation_status) WHERE ai_evaluation_status = 'pending';

-- 1. Private Tutor / Solo Profile Registry
CREATE TABLE tutor_profiles_isolated (
    tutor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    t360_user_id UUID NOT NULL UNIQUE, -- Links directly to global unified authentication sessions
    public_slug VARCHAR(100) NOT NULL UNIQUE, -- E.g., 'tutorname' creating 'tutorname.taleem360.online'
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD', -- Automatically changes based on geo-location targets (PKR, USD)
    is_whitelabel_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. High-Performance Availability Calendar Slots Matrix
CREATE TABLE tutor_availability_slots (
    slot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES tutor_profiles_isolated(tutor_id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0 (Sunday) to 6 (Saturday)
    start_time_utc TIME NOT NULL, -- Stored explicitly in UTC to ensure global scheduling accuracy
    end_time_utc TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 1-on-1 Secure Private Session Bookings
CREATE TABLE private_appointments_isolated (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES tutor_profiles_isolated(tutor_id) ON DELETE CASCADE,
    student_t360_user_id UUID NOT NULL, -- The accessing student customer's reference profile tag
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_link_payload VARCHAR(255), -- Automated Google Meet, Zoom, or built-in v2 whiteboard url
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tutor_public_slug ON tutor_profiles_isolated (public_slug);
CREATE INDEX idx_tutor_calendar_lookup ON tutor_availability_slots (tutor_id, day_of_week);

-- 4. Tutor Automated WhatsApp Delivery Ledger Tracking
CREATE TABLE tutor_whatsapp_logs (
    whatsapp_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL,               -- Reference to isolated tutor profile registry
    student_t360_user_id UUID NOT NULL,   -- Loose coupling reference to global profile
    appointment_id UUID,                  -- Optional linkage to the booking event
    invoice_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    recipient_phone VARCHAR(20) NOT NULL, -- Enforced absolute global country-code string (+92...)
    whatsapp_message_sid VARCHAR(100),   -- External tracking reference returned by the gateway provider
    delivery_status VARCHAR(30) DEFAULT 'queued', -- 'queued', 'sent', 'delivered', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_whatsapp_tracking_sid ON tutor_whatsapp_logs (whatsapp_message_sid);



