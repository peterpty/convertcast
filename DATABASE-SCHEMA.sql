-- ConvertCast Enhanced Database Schema
-- Production-ready schema for enterprise webinar platform
-- Based on senior backend engineer analysis for scalability

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Custom types for better data integrity
CREATE TYPE user_role AS ENUM ('admin', 'host', 'attendee', 'moderator');
CREATE TYPE event_status AS ENUM ('draft', 'scheduled', 'live', 'completed', 'cancelled');
CREATE TYPE registration_status AS ENUM ('registered', 'confirmed', 'attended', 'no_show', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'unpaid', 'trialing');
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'push', 'in_app');
CREATE TYPE integration_type AS ENUM ('calendar', 'email', 'crm', 'analytics', 'streaming');

-- =============================================
-- CORE USER MANAGEMENT
-- =============================================

-- Enhanced users table with enterprise features
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'attendee',
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',

    -- Authentication & Security
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),

    -- Profile & Preferences
    bio TEXT,
    company VARCHAR(255),
    job_title VARCHAR(255),
    website_url TEXT,
    linkedin_url TEXT,
    twitter_handle VARCHAR(50),

    -- Subscription & Billing
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'trialing',
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),

    -- Activity & Analytics
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    login_count INTEGER DEFAULT 0,
    events_hosted INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    total_watch_time_minutes INTEGER DEFAULT 0,

    -- Audit & Compliance
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Indexes for performance
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Optimized indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_active ON users(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- ORGANIZATIONS & TEAMS
-- =============================================

-- Organizations for enterprise accounts
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,

    -- Billing & Subscription
    subscription_tier VARCHAR(50) DEFAULT 'team',
    billing_email VARCHAR(255),
    max_hosts INTEGER DEFAULT 5,
    max_events_per_month INTEGER DEFAULT 50,
    max_attendees_per_event INTEGER DEFAULT 1000,

    -- Settings
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    branding_enabled BOOLEAN DEFAULT FALSE,
    custom_domain VARCHAR(255),

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Organization members with roles
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',

    -- Permissions
    can_create_events BOOLEAN DEFAULT TRUE,
    can_manage_members BOOLEAN DEFAULT FALSE,
    can_access_billing BOOLEAN DEFAULT FALSE,
    can_manage_settings BOOLEAN DEFAULT FALSE,

    -- Audit
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES users(id),

    UNIQUE(organization_id, user_id)
);

-- =============================================
-- EVENTS & WEBINARS
-- =============================================

-- Enhanced events table with enterprise features
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    host_id UUID REFERENCES users(id) NOT NULL,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[],
    language VARCHAR(10) DEFAULT 'en',

    -- Scheduling
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (ends_at - starts_at))/60) STORED,

    -- Status & Visibility
    status event_status DEFAULT 'draft',
    visibility VARCHAR(20) DEFAULT 'public', -- public, private, unlisted
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern JSONB, -- {type: 'weekly', interval: 1, days: ['monday'], ends_at: '2024-12-31'}

    -- Registration & Capacity
    registration_required BOOLEAN DEFAULT TRUE,
    registration_opens_at TIMESTAMPTZ,
    registration_closes_at TIMESTAMPTZ,
    max_attendees INTEGER,
    waitlist_enabled BOOLEAN DEFAULT TRUE,
    approval_required BOOLEAN DEFAULT FALSE,

    -- Pricing & Monetization
    is_paid BOOLEAN DEFAULT FALSE,
    price_cents INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_product_id VARCHAR(255),
    stripe_price_id VARCHAR(255),

    -- Content & Media
    thumbnail_url TEXT,
    cover_image_url TEXT,
    presentation_slides_url TEXT,
    resource_links JSONB, -- [{title: '', url: '', type: 'pdf'}]

    -- Streaming & Recording
    stream_key VARCHAR(255) UNIQUE,
    stream_url TEXT,
    recording_enabled BOOLEAN DEFAULT TRUE,
    auto_record BOOLEAN DEFAULT TRUE,
    recording_url TEXT,
    recording_duration_seconds INTEGER,

    -- Interactive Features
    chat_enabled BOOLEAN DEFAULT TRUE,
    qa_enabled BOOLEAN DEFAULT TRUE,
    polls_enabled BOOLEAN DEFAULT TRUE,
    reactions_enabled BOOLEAN DEFAULT TRUE,
    screen_share_enabled BOOLEAN DEFAULT TRUE,
    breakout_rooms_enabled BOOLEAN DEFAULT FALSE,

    -- Branding & Customization
    brand_colors JSONB, -- {primary: '#6366f1', secondary: '#8b5cf6'}
    custom_css TEXT,
    thank_you_message TEXT,
    follow_up_message TEXT,

    -- Analytics & Metrics
    total_registrations INTEGER DEFAULT 0,
    total_attendees INTEGER DEFAULT 0,
    peak_concurrent_viewers INTEGER DEFAULT 0,
    total_watch_time_minutes INTEGER DEFAULT 0,
    engagement_score DECIMAL(3,2) DEFAULT 0,

    -- SEO & Marketing
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    social_image_url TEXT,

    -- Audit & Compliance
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT valid_duration CHECK (ends_at > starts_at),
    CONSTRAINT valid_price CHECK (price_cents >= 0),
    CONSTRAINT valid_slug CHECK (slug IS NULL OR slug ~* '^[a-z0-9-]+$')
);

-- Performance indexes for events
CREATE INDEX idx_events_host ON events(host_id, status);
CREATE INDEX idx_events_organization ON events(organization_id, status);
CREATE INDEX idx_events_starts_at ON events(starts_at);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_slug ON events(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_events_active ON events(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- REGISTRATION & ATTENDEES
-- =============================================

-- Event registrations with detailed tracking
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),

    -- Registration Details
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    job_title VARCHAR(255),

    -- Custom Fields (defined per event)
    custom_fields JSONB, -- {industry: 'tech', company_size: '100-500'}

    -- Status & Tracking
    status registration_status DEFAULT 'registered',
    registration_source VARCHAR(100), -- direct, social, email, partner
    utm_campaign VARCHAR(255),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),

    -- Attendance Tracking
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    watch_time_minutes INTEGER DEFAULT 0,
    interactions_count INTEGER DEFAULT 0, -- chat messages, polls, reactions

    -- Payment (for paid events)
    payment_status payment_status,
    payment_amount_cents INTEGER,
    stripe_payment_intent_id VARCHAR(255),

    -- Communication Preferences
    email_reminders BOOLEAN DEFAULT TRUE,
    sms_reminders BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,

    -- Audit
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(event_id, email),
    CONSTRAINT valid_watch_time CHECK (watch_time_minutes >= 0)
);

-- Indexes for registration queries
CREATE INDEX idx_registrations_event ON event_registrations(event_id, status);
CREATE INDEX idx_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_registrations_email ON event_registrations(email);
CREATE INDEX idx_registrations_joined ON event_registrations(joined_at) WHERE joined_at IS NOT NULL;

-- =============================================
-- REAL-TIME INTERACTIONS
-- =============================================

-- Chat messages during events
CREATE TABLE event_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES event_registrations(id),

    -- Message Content
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'chat', -- chat, question, announcement, system

    -- Moderation
    is_moderated BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    replied_to_id UUID REFERENCES event_messages(id),

    -- Reactions
    reactions JSONB DEFAULT '{}', -- {thumbs_up: 5, heart: 2}

    -- Audit
    sent_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_content CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 1000)
);

-- Live polls and surveys
CREATE TABLE event_polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),

    -- Poll Details
    question TEXT NOT NULL,
    poll_type VARCHAR(20) DEFAULT 'multiple_choice', -- multiple_choice, single_choice, text, rating
    options JSONB, -- ['Option 1', 'Option 2', 'Option 3']

    -- Settings
    is_anonymous BOOLEAN DEFAULT TRUE,
    allow_multiple_votes BOOLEAN DEFAULT FALSE,
    show_results_live BOOLEAN DEFAULT TRUE,

    -- Status
    is_active BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,

    -- Results
    total_votes INTEGER DEFAULT 0,
    results JSONB DEFAULT '{}', -- {option1: 45, option2: 23, option3: 67}

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll responses
CREATE TABLE poll_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID REFERENCES event_polls(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES event_registrations(id),

    -- Response Data
    selected_options JSONB, -- [0, 2] for multiple choice indices
    text_response TEXT, -- For text polls
    rating_value INTEGER, -- For rating polls (1-5 or 1-10)

    -- Audit
    submitted_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_rating CHECK (rating_value IS NULL OR (rating_value >= 1 AND rating_value <= 10))
);

-- =============================================
-- ANALYTICS & REPORTING
-- =============================================

-- Detailed event analytics
CREATE TABLE event_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,

    -- Timestamp for time-series data
    recorded_at TIMESTAMPTZ DEFAULT NOW(),

    -- Viewer Metrics
    concurrent_viewers INTEGER DEFAULT 0,
    total_unique_viewers INTEGER DEFAULT 0,
    new_vs_returning JSONB DEFAULT '{"new": 0, "returning": 0}',

    -- Engagement Metrics
    chat_messages_count INTEGER DEFAULT 0,
    poll_responses_count INTEGER DEFAULT 0,
    reactions_count INTEGER DEFAULT 0,
    questions_count INTEGER DEFAULT 0,

    -- Technical Metrics
    average_bitrate DECIMAL(10,2),
    connection_quality JSONB, -- {excellent: 80, good: 15, poor: 5}
    device_breakdown JSONB, -- {desktop: 60, mobile: 35, tablet: 5}
    browser_breakdown JSONB, -- {chrome: 65, safari: 20, firefox: 10, other: 5}

    -- Geographic Data
    geographic_breakdown JSONB, -- {US: 45, UK: 20, CA: 15, other: 20}
    timezone_breakdown JSONB,

    -- Drop-off Analysis
    viewer_dropoff_points JSONB -- [{time: 300, viewers: 150}, {time: 600, viewers: 120}]
);

-- User activity tracking
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),

    -- Activity Details
    activity_type VARCHAR(50) NOT NULL, -- login, event_create, event_join, message_send, poll_vote
    activity_data JSONB, -- Additional context data

    -- Context
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),

    -- Audit
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BILLING & SUBSCRIPTIONS
-- =============================================

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- Pricing
    price_monthly_cents INTEGER NOT NULL,
    price_yearly_cents INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',

    -- Limits & Features
    max_events_per_month INTEGER,
    max_attendees_per_event INTEGER,
    max_storage_gb INTEGER,
    recording_enabled BOOLEAN DEFAULT TRUE,
    analytics_enabled BOOLEAN DEFAULT TRUE,
    custom_branding BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,

    -- Stripe Integration
    stripe_product_id VARCHAR(255),
    stripe_price_monthly_id VARCHAR(255),
    stripe_price_yearly_id VARCHAR(255),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    plan_id UUID REFERENCES subscription_plans(id),

    -- Subscription Details
    status subscription_status DEFAULT 'active',
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly

    -- Stripe Integration
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),

    -- Billing Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,

    -- Usage Tracking
    events_used_this_month INTEGER DEFAULT 0,
    storage_used_gb DECIMAL(10,2) DEFAULT 0,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ
);

-- =============================================
-- NOTIFICATIONS & COMMUNICATIONS
-- =============================================

-- Notification templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type notification_type NOT NULL,
    trigger_event VARCHAR(100) NOT NULL, -- event_reminder, registration_confirmation, etc.

    -- Template Content
    subject VARCHAR(255), -- For email/sms
    body_text TEXT,
    body_html TEXT, -- For email

    -- Settings
    send_delay_minutes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification queue
CREATE TABLE notification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES notification_templates(id),
    user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),

    -- Delivery Details
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),

    -- Content (merged with template)
    subject VARCHAR(255),
    body_text TEXT,
    body_html TEXT,

    -- Status & Tracking
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed, bounced
    attempts INTEGER DEFAULT 0,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    -- Error Handling
    error_message TEXT,

    -- External IDs
    provider_message_id VARCHAR(255), -- For tracking with email/sms providers

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INTEGRATIONS & WEBHOOKS
-- =============================================

-- Third-party integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),

    -- Integration Details
    provider VARCHAR(50) NOT NULL, -- google_calendar, outlook, zoom, hubspot, mailchimp
    integration_type integration_type NOT NULL,

    -- Configuration
    config JSONB NOT NULL, -- Provider-specific configuration
    credentials JSONB, -- Encrypted credentials

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMPTZ,
    sync_error TEXT,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook endpoints
CREATE TABLE webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),

    -- Endpoint Details
    url TEXT NOT NULL,
    secret_key VARCHAR(255) NOT NULL,

    -- Event Subscriptions
    events TEXT[] NOT NULL, -- ['event.started', 'registration.created', 'message.sent']

    -- Status & Health
    is_active BOOLEAN DEFAULT TRUE,
    last_success_at TIMESTAMPTZ,
    consecutive_failures INTEGER DEFAULT 0,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook delivery logs
CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint_id UUID REFERENCES webhook_endpoints(id),

    -- Request Details
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,

    -- Response Tracking
    status_code INTEGER,
    response_body TEXT,
    response_time_ms INTEGER,

    -- Retry Logic
    attempt_number INTEGER DEFAULT 1,
    max_attempts INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Events: Users can see public events or events they're involved with
CREATE POLICY "Users can view events" ON events
    FOR SELECT USING (
        visibility = 'public' OR
        host_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM event_registrations
            WHERE event_id = events.id AND user_id = auth.uid()
        )
    );

-- Event hosts can manage their own events
CREATE POLICY "Hosts can manage own events" ON events
    FOR ALL USING (host_id = auth.uid());

-- Registrations: Users can see their own registrations, hosts can see event registrations
CREATE POLICY "Users can view registrations" ON event_registrations
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_registrations.event_id AND events.host_id = auth.uid()
        )
    );

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique event slugs
CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
        NEW.slug := REGEXP_REPLACE(NEW.slug, '\s+', '-', 'g');
        NEW.slug := SUBSTRING(NEW.slug, 1, 50);

        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM events WHERE slug = NEW.slug AND id != NEW.id) LOOP
            NEW.slug := NEW.slug || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_event_slug_trigger BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION generate_event_slug();

-- Function to update event statistics
CREATE OR REPLACE FUNCTION update_event_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update registration count
    UPDATE events SET
        total_registrations = (
            SELECT COUNT(*) FROM event_registrations
            WHERE event_id = NEW.event_id AND status != 'cancelled'
        )
    WHERE id = NEW.event_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_stats_trigger AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_stats();

-- =============================================
-- INITIAL DATA & SEED
-- =============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, slug, description, price_monthly_cents, price_yearly_cents, max_events_per_month, max_attendees_per_event, max_storage_gb, custom_branding, api_access) VALUES
('Free', 'free', 'Perfect for getting started', 0, 0, 3, 50, 1, false, false),
('Starter', 'starter', 'Great for small businesses', 2900, 29000, 10, 200, 10, false, false),
('Professional', 'professional', 'Ideal for growing teams', 9900, 99000, 50, 1000, 100, true, true),
('Enterprise', 'enterprise', 'For large organizations', 29900, 299000, 500, 10000, 1000, true, true);

-- Insert default notification templates
INSERT INTO notification_templates (name, type, trigger_event, subject, body_text, body_html) VALUES
('Event Reminder - 24 Hours', 'email', 'event_reminder_24h',
 'Reminder: {{event_title}} starts tomorrow!',
 'Hi {{attendee_name}},\n\nThis is a friendly reminder that you''re registered for "{{event_title}}" which starts tomorrow at {{event_time}}.\n\nJoin here: {{join_url}}\n\nSee you there!',
 '<h2>Hi {{attendee_name}},</h2><p>This is a friendly reminder that you''re registered for "<strong>{{event_title}}</strong>" which starts tomorrow at {{event_time}}.</p><p><a href="{{join_url}}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Join Event</a></p><p>See you there!</p>'),

('Registration Confirmation', 'email', 'registration_confirmed',
 'You''re registered for {{event_title}}!',
 'Hi {{attendee_name}},\n\nThanks for registering for "{{event_title}}"!\n\nEvent Details:\nDate: {{event_date}}\nTime: {{event_time}}\n\nJoin here: {{join_url}}\n\nWe''ll send you a reminder before the event starts.',
 '<h2>Hi {{attendee_name}},</h2><p>Thanks for registering for "<strong>{{event_title}}</strong>"!</p><h3>Event Details:</h3><ul><li>Date: {{event_date}}</li><li>Time: {{event_time}}</li></ul><p><a href="{{join_url}}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Join Event</a></p><p>We''ll send you a reminder before the event starts.</p>');

-- Create indexes for better performance on large datasets
CREATE INDEX CONCURRENTLY idx_event_analytics_recorded_at ON event_analytics(recorded_at);
CREATE INDEX CONCURRENTLY idx_user_activity_logs_occurred_at ON user_activity_logs(occurred_at);
CREATE INDEX CONCURRENTLY idx_webhook_deliveries_created_at ON webhook_deliveries(created_at);
CREATE INDEX CONCURRENTLY idx_notification_queue_scheduled_for ON notification_queue(scheduled_for) WHERE status = 'pending';

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- LIVE STREAMING & VIEWER MANAGEMENT
-- =============================================

-- Live streams table for real-time streaming
CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    streamer_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Stream configuration
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stream_key VARCHAR(100) UNIQUE NOT NULL,
    mux_stream_id VARCHAR(100),
    mux_playback_id VARCHAR(100),
    stream_url TEXT,

    -- Stream status and settings
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'live', 'ended', 'error')),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    max_viewers INTEGER DEFAULT 1000,
    is_public BOOLEAN DEFAULT true,

    -- Interactive features
    enable_chat BOOLEAN DEFAULT true,
    enable_ai_chat BOOLEAN DEFAULT false,
    enable_registration BOOLEAN DEFAULT true,
    ai_sales_mode BOOLEAN DEFAULT false,

    -- AI and conversion settings
    conversion_goals JSONB DEFAULT '[]',
    ai_model_config JSONB DEFAULT '{}',

    -- Real-time analytics
    peak_viewers INTEGER DEFAULT 0,
    total_viewers INTEGER DEFAULT 0,
    chat_messages_count INTEGER DEFAULT 0,
    conversion_events INTEGER DEFAULT 0,
    total_revenue_cents INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stream viewers (anonymous and identified)
CREATE TABLE stream_viewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,

    -- Viewer identification (optional for anonymous viewers)
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),

    -- Session tracking
    session_id VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,

    -- Viewing behavior
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 1,

    -- Conversion and behavioral analysis
    conversion_score DECIMAL(3,2) DEFAULT 0.0,
    purchase_intent VARCHAR(20) DEFAULT 'unknown' CHECK (purchase_intent IN ('low', 'medium', 'high', 'unknown')),
    behavior_signals JSONB DEFAULT '{}',

    -- AI analysis results
    ai_analysis JSONB DEFAULT '{}',
    ai_recommendations JSONB DEFAULT '[]',

    -- Geographic and device data
    country VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(20), -- desktop, mobile, tablet
    browser VARCHAR(50),

    -- Engagement metrics
    interactions_count INTEGER DEFAULT 0,
    chat_messages_sent INTEGER DEFAULT 0,
    time_to_first_interaction INTEGER, -- seconds

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AI-POWERED CHAT SYSTEM
-- =============================================

-- Chat messages with comprehensive AI analysis
CREATE TABLE stream_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES stream_viewers(id) ON DELETE CASCADE,

    -- Message content
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'emoji', 'system', 'ai_suggestion', 'streamer_response')),

    -- AI analysis results
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    purchase_intent_score DECIMAL(3,2), -- 0.0 to 1.0
    urgency_score DECIMAL(3,2), -- 0.0 to 1.0
    engagement_score DECIMAL(3,2), -- 0.0 to 1.0

    -- AI-detected entities and topics
    detected_entities JSONB DEFAULT '[]', -- products, features, competitors mentioned
    conversation_topics JSONB DEFAULT '[]',
    objection_signals JSONB DEFAULT '[]',
    buying_signals JSONB DEFAULT '[]',

    -- Comprehensive AI analysis
    ai_analysis JSONB DEFAULT '{}',

    -- Moderation and filtering
    is_flagged BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    moderation_reason VARCHAR(100),
    toxicity_score DECIMAL(3,2),

    -- Response tracking
    replied_to_id UUID REFERENCES stream_chat_messages(id),
    streamer_responded BOOLEAN DEFAULT false,

    sent_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,

    CONSTRAINT valid_message_length CHECK (LENGTH(message) > 0 AND LENGTH(message) <= 1000)
);

-- AI chat suggestions for streamers
CREATE TABLE ai_chat_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES stream_viewers(id) ON DELETE CASCADE,
    message_id UUID REFERENCES stream_chat_messages(id),

    -- Suggestion details
    suggestion_type VARCHAR(50) NOT NULL, -- 'sales_opportunity', 'objection_handling', 'engagement_boost', 'product_recommendation'
    suggestion_text TEXT NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL,
    priority_level VARCHAR(20) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),

    -- AI reasoning and context
    reasoning TEXT,
    context_data JSONB DEFAULT '{}',
    behavioral_triggers JSONB DEFAULT '[]',

    -- Recommended actions
    recommended_actions JSONB DEFAULT '[]',
    suggested_response TEXT,
    suggested_offer TEXT,
    suggested_registration_link BOOLEAN DEFAULT false,

    -- Streamer interaction
    is_acted_upon BOOLEAN DEFAULT false,
    streamer_response TEXT,
    action_taken VARCHAR(100),

    -- Effectiveness tracking
    led_to_conversion BOOLEAN DEFAULT false,
    conversion_value_cents INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    acted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 minutes')
);

-- =============================================
-- VIEWER REGISTRATION & CONVERSION SYSTEM
-- =============================================

-- Stream registrations (no-login required)
CREATE TABLE stream_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES stream_viewers(id) ON DELETE SET NULL,

    -- Viewer details
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(255),
    job_title VARCHAR(255),

    -- Registration context
    registration_source VARCHAR(50) DEFAULT 'direct', -- direct, ai_suggestion, chat_link, popup
    registration_trigger VARCHAR(100), -- what caused them to register
    triggered_by_suggestion_id UUID REFERENCES ai_chat_suggestions(id),

    -- UTM and tracking
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),

    -- Custom fields defined by streamer
    custom_fields JSONB DEFAULT '{}',

    -- Status and behavior
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'converted', 'unsubscribed')),
    attended_stream BOOLEAN DEFAULT false,
    attended_at TIMESTAMPTZ,

    -- Conversion tracking
    converted BOOLEAN DEFAULT false,
    conversion_value_cents INTEGER DEFAULT 0,
    conversion_details JSONB DEFAULT '{}',

    -- Communication preferences
    email_marketing_consent BOOLEAN DEFAULT false,
    sms_marketing_consent BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase/conversion events during streams
CREATE TABLE stream_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES stream_viewers(id) ON DELETE SET NULL,
    registration_id UUID REFERENCES stream_registrations(id) ON DELETE SET NULL,

    -- Conversion details
    conversion_type VARCHAR(50) NOT NULL, -- 'purchase', 'signup', 'demo_request', 'consultation_booking'
    product_name VARCHAR(255),
    product_sku VARCHAR(100),
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    quantity INTEGER DEFAULT 1,

    -- Payment processing
    stripe_payment_intent_id VARCHAR(100),
    stripe_customer_id VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),

    -- Invoicing
    invoice_number VARCHAR(100),
    invoice_url TEXT,
    invoice_sent_at TIMESTAMPTZ,

    -- Conversion attribution
    conversion_trigger VARCHAR(100), -- 'ai_suggestion', 'manual_offer', 'chat_link', 'call_to_action'
    ai_suggestion_id UUID REFERENCES ai_chat_suggestions(id),
    ai_contribution_score DECIMAL(3,2) DEFAULT 0.0,

    -- Customer information for invoice
    customer_details JSONB NOT NULL, -- {name, email, address, tax_id, etc.}

    -- Fulfillment
    fulfillment_status VARCHAR(20) DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    fulfillment_details JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ
);

-- =============================================
-- AUTOMATED NOTIFICATION CAMPAIGNS
-- =============================================

-- Campaign templates with advanced scheduling
CREATE TABLE notification_campaign_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    streamer_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Template details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(30) DEFAULT 'event_reminder',

    -- Multi-channel templates
    email_template JSONB, -- {subject, html_content, text_content}
    sms_template JSONB, -- {content, character_count}

    -- Advanced scheduling (relative to event time)
    notification_schedule JSONB NOT NULL, -- [{offset_hours: -336, channels: ['email']}, {offset_hours: -24, channels: ['email', 'sms']}]
    timezone VARCHAR(50) DEFAULT 'UTC',

    -- Personalization and segmentation
    personalization_fields JSONB DEFAULT '[]',
    audience_segments JSONB DEFAULT '[]', -- conditions for who receives this

    -- A/B testing
    ab_test_enabled BOOLEAN DEFAULT false,
    ab_test_variants JSONB DEFAULT '[]',

    -- Status and usage
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active campaigns for specific events
CREATE TABLE notification_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    template_id UUID REFERENCES notification_campaign_templates(id) ON DELETE CASCADE,
    streamer_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Campaign configuration
    name VARCHAR(255) NOT NULL,
    target_audience_count INTEGER DEFAULT 0,

    -- Schedule override (if different from template)
    custom_schedule JSONB,
    timezone VARCHAR(50),

    -- Status and tracking
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    total_scheduled INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,

    -- A/B testing results
    ab_test_variant JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual notification sends with comprehensive tracking
CREATE TABLE notification_sends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES notification_campaigns(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES stream_registrations(id) ON DELETE CASCADE,

    -- Send details
    send_type VARCHAR(20) NOT NULL CHECK (send_type IN ('email', 'sms')),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),

    -- Personalized content
    subject VARCHAR(255),
    content_text TEXT NOT NULL,
    content_html TEXT,

    -- Delivery scheduling and status
    scheduled_for TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced', 'spam', 'unsubscribed')),

    -- Delivery tracking
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,

    -- Provider integration
    provider VARCHAR(20), -- 'mailgun', 'twilio', 'sendgrid'
    provider_message_id VARCHAR(255),
    provider_status VARCHAR(50),

    -- Error handling
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    next_retry_at TIMESTAMPTZ,

    -- A/B testing
    ab_variant VARCHAR(50),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BEHAVIORAL ANALYTICS & AI INSIGHTS
-- =============================================

-- Viewer behavior tracking for AI analysis
CREATE TABLE viewer_behavior_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID REFERENCES stream_viewers(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,

    -- Event details
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'scroll', 'click', 'hover', 'message_sent', 'registration_form_viewed', etc.
    event_data JSONB DEFAULT '{}',

    -- Context
    page_url TEXT,
    element_selector VARCHAR(255),
    timestamp_offset_seconds INTEGER, -- offset from stream start

    -- AI analysis
    intent_score DECIMAL(3,2),
    engagement_level VARCHAR(20), -- 'low', 'medium', 'high'

    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI model training data and insights
CREATE TABLE ai_model_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,

    -- Model performance metrics
    model_version VARCHAR(50),
    total_predictions INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(4,3),

    -- Conversion insights
    total_conversions_predicted INTEGER DEFAULT 0,
    actual_conversions INTEGER DEFAULT 0,
    conversion_prediction_accuracy DECIMAL(4,3),

    -- Top performing patterns
    high_conversion_patterns JSONB DEFAULT '[]',
    behavioral_indicators JSONB DEFAULT '{}',
    optimal_intervention_timing JSONB DEFAULT '{}',

    -- Recommendations for streamers
    streamer_insights JSONB DEFAULT '{}',
    improvement_suggestions JSONB DEFAULT '[]',

    analyzed_at TIMESTAMPTZ DEFAULT NOW(),
    stream_ended_at TIMESTAMPTZ
);

-- =============================================
-- ENHANCED INDEXES FOR PERFORMANCE
-- =============================================

-- Live streaming indexes
CREATE INDEX idx_live_streams_streamer_status ON live_streams(streamer_id, status);
CREATE INDEX idx_live_streams_status_started ON live_streams(status, started_at DESC);
CREATE INDEX idx_stream_viewers_stream_session ON stream_viewers(stream_id, session_id);
CREATE INDEX idx_stream_viewers_conversion_score ON stream_viewers(conversion_score DESC) WHERE conversion_score > 0.5;
CREATE INDEX idx_stream_viewers_joined ON stream_viewers(joined_at DESC);

-- Chat and AI indexes
CREATE INDEX idx_chat_messages_stream_time ON stream_chat_messages(stream_id, sent_at DESC);
CREATE INDEX idx_chat_messages_ai_analysis ON stream_chat_messages USING GIN(ai_analysis);
CREATE INDEX idx_chat_messages_purchase_intent ON stream_chat_messages(purchase_intent_score DESC) WHERE purchase_intent_score > 0.7;
CREATE INDEX idx_ai_suggestions_stream_confidence ON ai_chat_suggestions(stream_id, confidence_score DESC);
CREATE INDEX idx_ai_suggestions_pending ON ai_chat_suggestions(created_at DESC) WHERE is_acted_upon = false AND expires_at > NOW();

-- Registration and conversion indexes
CREATE INDEX idx_stream_registrations_email ON stream_registrations(email);
CREATE INDEX idx_stream_registrations_stream_status ON stream_registrations(stream_id, status);
CREATE INDEX idx_stream_conversions_stream_amount ON stream_conversions(stream_id, amount_cents DESC);
CREATE INDEX idx_stream_conversions_payment_status ON stream_conversions(payment_status, created_at DESC);

-- Notification indexes
CREATE INDEX idx_notification_sends_scheduled ON notification_sends(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_notification_sends_campaign_status ON notification_sends(campaign_id, status);
CREATE INDEX idx_notification_campaigns_event ON notification_campaigns(event_id, status);

-- Behavioral analytics indexes
CREATE INDEX idx_behavior_events_viewer_time ON viewer_behavior_events(viewer_id, occurred_at DESC);
CREATE INDEX idx_behavior_events_stream_type ON viewer_behavior_events(stream_id, event_type);

-- =============================================
-- ENHANCED ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on new tables
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewer_behavior_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_insights ENABLE ROW LEVEL SECURITY;

-- Streamers can manage their own streams and data
CREATE POLICY "Streamers can manage their streams" ON live_streams
    FOR ALL USING (streamer_id = auth.uid());

CREATE POLICY "Streamers can view their stream analytics" ON stream_viewers
    FOR SELECT USING (
        stream_id IN (SELECT id FROM live_streams WHERE streamer_id = auth.uid())
    );

CREATE POLICY "Streamers can manage their chat" ON stream_chat_messages
    FOR ALL USING (
        stream_id IN (SELECT id FROM live_streams WHERE streamer_id = auth.uid())
    );

CREATE POLICY "Streamers can view AI suggestions" ON ai_chat_suggestions
    FOR ALL USING (
        stream_id IN (SELECT id FROM live_streams WHERE streamer_id = auth.uid())
    );

-- Public viewing policies for anonymous viewers
CREATE POLICY "Anyone can view public streams" ON live_streams
    FOR SELECT USING (is_public = true AND status = 'live');

CREATE POLICY "Viewers can access public stream chat" ON stream_chat_messages
    FOR SELECT USING (
        stream_id IN (SELECT id FROM live_streams WHERE is_public = true AND status = 'live')
    );

-- =============================================
-- ADVANCED FUNCTIONS FOR STREAMING OPERATIONS
-- =============================================

-- Function to update viewer duration and behavior metrics
CREATE OR REPLACE FUNCTION update_viewer_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update duration when viewer leaves
    IF NEW.left_at IS NOT NULL AND OLD.left_at IS NULL THEN
        NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.left_at - NEW.joined_at));

        -- Update stream total viewers count
        UPDATE live_streams
        SET total_viewers = total_viewers + 1
        WHERE id = NEW.stream_id;
    END IF;

    -- Update conversion score based on behavior
    IF NEW.behavior_signals IS DISTINCT FROM OLD.behavior_signals THEN
        NEW.conversion_score = calculate_conversion_score(NEW.id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_viewer_metrics
    BEFORE UPDATE ON stream_viewers
    FOR EACH ROW
    EXECUTE FUNCTION update_viewer_metrics();

-- Function to calculate advanced conversion score
CREATE OR REPLACE FUNCTION calculate_conversion_score(p_viewer_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    base_score DECIMAL := 0.0;
    duration_factor DECIMAL := 0.0;
    chat_factor DECIMAL := 0.0;
    behavior_factor DECIMAL := 0.0;
    ai_factor DECIMAL := 0.0;
    viewer_record RECORD;
BEGIN
    -- Get comprehensive viewer data
    SELECT
        duration_seconds,
        chat_messages_sent,
        interactions_count,
        behavior_signals,
        ai_analysis
    INTO viewer_record
    FROM stream_viewers
    WHERE id = p_viewer_id;

    -- Duration factor (0.0 - 0.3)
    duration_factor = CASE
        WHEN viewer_record.duration_seconds > 1800 THEN 0.3  -- 30+ minutes
        WHEN viewer_record.duration_seconds > 900 THEN 0.2   -- 15+ minutes
        WHEN viewer_record.duration_seconds > 300 THEN 0.1   -- 5+ minutes
        ELSE 0.0
    END;

    -- Chat engagement factor (0.0 - 0.4)
    SELECT COALESCE(AVG(purchase_intent_score), 0.0) * 0.4
    INTO chat_factor
    FROM stream_chat_messages
    WHERE viewer_id = p_viewer_id AND purchase_intent_score > 0.0;

    -- Behavior signals factor (0.0 - 0.2)
    behavior_factor = COALESCE(
        (viewer_record.behavior_signals->>'engagement_score')::DECIMAL * 0.2,
        0.0
    );

    -- AI analysis factor (0.0 - 0.1)
    ai_factor = COALESCE(
        (viewer_record.ai_analysis->>'conversion_probability')::DECIMAL * 0.1,
        0.0
    );

    RETURN LEAST(1.0, duration_factor + chat_factor + behavior_factor + ai_factor);
END;
$$ LANGUAGE plpgsql;

-- Function to process AI chat analysis
CREATE OR REPLACE FUNCTION process_chat_message_ai()
RETURNS TRIGGER AS $$
DECLARE
    analysis_result JSONB;
BEGIN
    -- Mark for AI processing (this would trigger external AI service)
    -- In production, this would enqueue the message for AI analysis
    NEW.processed_at = NULL; -- Will be updated when AI processing completes

    -- Immediate basic sentiment analysis (placeholder)
    IF NEW.message ILIKE '%buy%' OR NEW.message ILIKE '%purchase%' OR NEW.message ILIKE '%price%' THEN
        NEW.purchase_intent_score = 0.7;
    ELSIF NEW.message ILIKE '%interested%' OR NEW.message ILIKE '%tell me more%' THEN
        NEW.purchase_intent_score = 0.5;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_process_chat_ai
    BEFORE INSERT ON stream_chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION process_chat_message_ai();

-- Function to auto-generate AI suggestions
CREATE OR REPLACE FUNCTION generate_ai_suggestions()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-generate suggestion for high purchase intent messages
    IF NEW.purchase_intent_score > 0.7 AND NEW.message_type = 'text' THEN
        INSERT INTO ai_chat_suggestions (
            stream_id,
            viewer_id,
            message_id,
            suggestion_type,
            suggestion_text,
            confidence_score,
            priority_level,
            reasoning
        ) VALUES (
            NEW.stream_id,
            NEW.viewer_id,
            NEW.id,
            'sales_opportunity',
            'This viewer is showing strong purchase intent. Consider offering a direct link to purchase or schedule a demo.',
            NEW.purchase_intent_score,
            CASE
                WHEN NEW.purchase_intent_score > 0.8 THEN 'urgent'
                ELSE 'high'
            END,
            'High purchase intent detected in chat message: "' || LEFT(NEW.message, 50) || '..."'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_ai_suggestions
    AFTER INSERT OR UPDATE ON stream_chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION generate_ai_suggestions();

-- Comments for documentation
COMMENT ON TABLE live_streams IS 'Real-time streaming sessions with AI-powered features and viewer management';
COMMENT ON TABLE stream_viewers IS 'Anonymous and identified stream viewers with behavioral analysis and conversion tracking';
COMMENT ON TABLE stream_chat_messages IS 'Chat messages with comprehensive AI analysis for sales and engagement insights';
COMMENT ON TABLE ai_chat_suggestions IS 'AI-generated suggestions for streamers to improve conversions and engagement';
COMMENT ON TABLE stream_registrations IS 'No-login required registrations for stream access with conversion tracking';
COMMENT ON TABLE stream_conversions IS 'Purchase and conversion events during live streams with full invoicing support';
COMMENT ON TABLE notification_campaign_templates IS 'Reusable campaign templates with advanced scheduling and personalization';
COMMENT ON TABLE notification_campaigns IS 'Active notification campaigns with comprehensive tracking and A/B testing';
COMMENT ON TABLE notification_sends IS 'Individual notification deliveries with detailed engagement tracking';
COMMENT ON TABLE viewer_behavior_events IS 'Granular viewer behavior tracking for AI analysis and conversion optimization';
COMMENT ON TABLE ai_model_insights IS 'AI model performance metrics and insights for continuous improvement';

-- Comments for documentation
COMMENT ON TABLE events IS 'Core events/webinars table with comprehensive features for enterprise webinar platform';
COMMENT ON TABLE event_registrations IS 'Event registration and attendance tracking with payment support';
COMMENT ON TABLE event_analytics IS 'Time-series analytics data for detailed event performance tracking';
COMMENT ON TABLE user_subscriptions IS 'User subscription management with Stripe integration';
COMMENT ON COLUMN events.stream_key IS 'Unique key for OBS/streaming software integration';
COMMENT ON COLUMN events.engagement_score IS 'Calculated engagement score based on interactions (0.00-1.00)';