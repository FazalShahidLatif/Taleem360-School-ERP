-- 1. Authorized Guardians / Relatives Matrix
CREATE TABLE daycare_authorized_guardians (
    guardian_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daycare_child_id UUID NOT NULL, -- Reference to your isolated daycare child table
    guardian_name VARCHAR(100) NOT NULL,
    relationship_to_child VARCHAR(50) NOT NULL, -- 'Father', 'Mother', 'Driver', 'Nanny'
    cnic_or_passport VARCHAR(30), -- National identity verification for tracking inside Pakistan/Globally
    secure_pin_hash VARCHAR(255) NOT NULL, -- Salted & hashed 4-to-6 digit terminal pin
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_guardian_child FOREIGN KEY (daycare_child_id) REFERENCES daycare_children_isolated(daycare_child_id) ON DELETE CASCADE
);

-- Index for instant lookup at the front-desk entrance kiosk terminal
CREATE INDEX idx_active_guardian_pins ON daycare_authorized_guardians (secure_pin_hash) WHERE is_active = TRUE;

-- 2. Operating Hours Configuration Matrix
CREATE TABLE daycare_operating_hours (
    config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id VARCHAR(50) NOT NULL UNIQUE, -- E.g., 'islamabad-g11', 'london-central'
    timezone_name VARCHAR(50) DEFAULT 'Asia/Karachi', -- For local target evaluations
    closing_time_utc TIME NOT NULL, -- E.g., '13:00:00' (18:00 PKT stored in UTC)
    late_fee_per_minute DECIMAL(10, 2) DEFAULT 5.00, -- Charge amount (PKR, USD, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Billing Ledger Matrix for Daycare Late Fees and Base Tuition Fees
CREATE TABLE daycare_billing_ledger (
    invoice_id UUID DEFAULT gen_random_uuid() UNIQUE,
    daycare_child_id VARCHAR(50) NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    base_fee DECIMAL(10, 2) DEFAULT 8000.00,
    overtime_late_fees DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) DEFAULT 8000.00,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    synced_to_main_erp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (daycare_child_id, billing_period_start)
);


