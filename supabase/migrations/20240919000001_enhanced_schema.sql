-- ConvertCast Enhanced Database Schema
-- Production-ready schema for webinar platform
-- Created: September 19, 2025

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types for better data integrity
CREATE TYPE user_role AS ENUM ('admin', 'host', 'attendee', 'moderator');
CREATE TYPE event_status AS ENUM ('draft', 'scheduled', 'live', 'completed', 'cancelled');
CREATE TYPE event_type AS ENUM ('webinar', 'meeting', 'workshop', 'conference');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'unpaid');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  role user_role DEFAULT 'attendee',
  timezone VARCHAR(50) DEFAULT 'UTC',
  phone VARCHAR(20),
  company VARCHAR(255),
  job_title VARCHAR(255),
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Organizations for multi-tenant support
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  industry VARCHAR(100),
  company_size VARCHAR(50),
  billing_email VARCHAR(255),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization memberships
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'attendee',
  permissions JSONB DEFAULT '{}',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  slug VARCHAR(200) UNIQUE NOT NULL,
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  event_type event_type DEFAULT 'webinar',
  status event_status DEFAULT 'draft',

  -- Scheduling
  scheduled_start_time TIMESTAMP WITH TIME ZONE,
  scheduled_end_time TIMESTAMP WITH TIME ZONE,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- Capacity and registration
  max_attendees INTEGER,
  registration_required BOOLEAN DEFAULT TRUE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  allow_registrations_after_start BOOLEAN DEFAULT FALSE,

  -- Pricing
  is_paid BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Content
  cover_image_url TEXT,
  agenda JSONB DEFAULT '[]',
  tags VARCHAR(50)[] DEFAULT '{}',

  -- Streaming settings
  streaming_settings JSONB DEFAULT '{}',
  recording_enabled BOOLEAN DEFAULT TRUE,
  chat_enabled BOOLEAN DEFAULT TRUE,
  qa_enabled BOOLEAN DEFAULT TRUE,
  polls_enabled BOOLEAN DEFAULT TRUE,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Event registrations
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Registration details
  registration_form_data JSONB DEFAULT '{}',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,

  -- Attendance tracking
  attended BOOLEAN DEFAULT FALSE,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  total_watch_time INTERVAL,

  -- Payment (if paid event)
  payment_status payment_status DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  payment_id VARCHAR(255),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Event sessions (for multi-session events)
CREATE TABLE public.event_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  presenter_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timing
  scheduled_start_time TIMESTAMP WITH TIME ZONE,
  scheduled_end_time TIMESTAMP WITH TIME ZONE,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,

  -- Content
  presentation_url TEXT,
  recording_url TEXT,
  notes TEXT,

  -- Order in event
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time interactions (chat, polls, Q&A)
CREATE TABLE public.interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Interaction type and content
  interaction_type VARCHAR(50) NOT NULL, -- 'chat', 'poll_response', 'question', 'reaction'
  content JSONB NOT NULL,

  -- Moderation
  is_moderated BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  moderated_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Polls and surveys
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  poll_type VARCHAR(50) DEFAULT 'multiple_choice', -- 'multiple_choice', 'single_choice', 'text', 'rating'
  options JSONB DEFAULT '[]',

  -- Timing
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,

  -- Settings
  allow_multiple_votes BOOLEAN DEFAULT FALSE,
  show_results_live BOOLEAN DEFAULT TRUE,
  is_anonymous BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Poll responses
CREATE TABLE public.poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  response JSONB NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(poll_id, user_id)
);

-- Analytics and metrics
CREATE TABLE public.event_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,

  -- Basic metrics
  total_registrations INTEGER DEFAULT 0,
  total_attendees INTEGER DEFAULT 0,
  peak_concurrent_viewers INTEGER DEFAULT 0,
  average_watch_time INTERVAL,
  total_watch_time INTERVAL,

  -- Engagement metrics
  total_chat_messages INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  total_poll_responses INTEGER DEFAULT 0,

  -- Technical metrics
  average_bitrate INTEGER,
  stream_quality_score DECIMAL(3,2),

  -- Calculated at
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Raw data (for detailed analysis)
  raw_data JSONB DEFAULT '{}'
);

-- Subscriptions and billing
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Subscription details
  plan_name VARCHAR(100) NOT NULL,
  status subscription_status DEFAULT 'active',

  -- Billing cycle
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Dates
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,

  -- Payment provider data
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Usage tracking
CREATE TABLE public.usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,

  -- Metric details
  metric_name VARCHAR(100) NOT NULL, -- 'events_hosted', 'attendees_total', 'storage_used_mb'
  metric_value INTEGER NOT NULL,

  -- Period
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,

  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Notification content
  title VARCHAR(255) NOT NULL,
  message TEXT,
  notification_type VARCHAR(50) NOT NULL, -- 'event_reminder', 'payment_due', 'system_update'

  -- Delivery
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,

  -- Channels
  email_sent BOOLEAN DEFAULT FALSE,
  sms_sent BOOLEAN DEFAULT FALSE,
  push_sent BOOLEAN DEFAULT FALSE,

  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhooks for integrations
CREATE TABLE public.webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Webhook details
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  events VARCHAR(50)[] NOT NULL, -- ['event.created', 'event.started', 'registration.created']

  -- Security
  secret_key VARCHAR(255),

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_scheduled_start ON events(scheduled_start_time);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_interactions_event_id ON interactions(event_id);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (these will be expanded based on specific requirements)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view events they host or are registered for" ON events FOR SELECT
USING (
  host_id = auth.uid() OR
  id IN (SELECT event_id FROM event_registrations WHERE user_id = auth.uid())
);

CREATE POLICY "Hosts can manage their events" ON events FOR ALL USING (host_id = auth.uid());

CREATE POLICY "Users can view their registrations" ON event_registrations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development (optional)
-- INSERT INTO users (id, email, first_name, last_name, role) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'admin@convertcast.com', 'Admin', 'User', 'admin'),
-- ('00000000-0000-0000-0000-000000000002', 'host@convertcast.com', 'Host', 'User', 'host');

COMMENT ON TABLE users IS 'Extended user profiles with preferences and metadata';
COMMENT ON TABLE organizations IS 'Multi-tenant organizations for enterprise customers';
COMMENT ON TABLE events IS 'Webinar events with comprehensive scheduling and settings';
COMMENT ON TABLE event_registrations IS 'User registrations for events with attendance tracking';
COMMENT ON TABLE interactions IS 'Real-time interactions like chat, polls, and Q&A';
COMMENT ON TABLE subscriptions IS 'Billing and subscription management';
COMMENT ON TABLE notifications IS 'Multi-channel notification system';