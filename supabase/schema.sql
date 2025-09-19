-- ConvertCast Database Schema for Supabase
-- This file contains the complete database schema for the ConvertCast platform

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('streamer', 'viewer', 'admin');
create type event_status as enum ('draft', 'scheduled', 'live', 'ended', 'cancelled');
create type message_type as enum ('chat', 'system', 'announcement');
create type overlay_type as enum ('alert', 'countdown', 'progress', 'gif_sound', 'persistent_message', 'marquee');
create type overlay_position as enum (
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right'
);
create type transaction_status as enum ('pending', 'succeeded', 'failed', 'cancelled', 'refunded');
create type payment_method as enum ('stripe', 'paypal');
create type notification_type as enum ('info', 'success', 'warning', 'error', 'event');

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  first_name text not null,
  last_name text not null,
  avatar text,
  role user_role default 'viewer',
  timezone text default 'UTC',
  email_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  streamer_id uuid references public.users(id) on delete cascade not null,
  scheduled_at timestamp with time zone not null,
  duration integer default 60, -- minutes
  timezone text default 'UTC',
  status event_status default 'draft',
  max_attendees integer,
  registration_required boolean default false,
  registration_fields jsonb default '[]'::jsonb,
  landing_page_config jsonb default '{}'::jsonb,
  stream_config jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Participants table
create table public.participants (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  company text,
  registration_data jsonb default '{}'::jsonb,
  joined_at timestamp with time zone,
  left_at timestamp with time zone,
  is_active boolean default false,
  watch_time integer default 0, -- seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Ensure one registration per email per event
  unique(event_id, email)
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  participant_id uuid references public.participants(id) on delete set null,
  sender_id uuid references public.users(id) on delete set null,
  sender_name text not null,
  sender_avatar text,
  content text not null,
  type message_type default 'chat',
  is_moderated boolean default false,
  is_pinned boolean default false,
  reactions jsonb default '[]'::jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Overlay elements table
create table public.overlay_elements (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  type overlay_type not null,
  position overlay_position not null,
  config jsonb default '{}'::jsonb,
  is_active boolean default false,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration integer, -- seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  participant_id uuid references public.participants(id) on delete cascade not null,
  amount decimal(10,2) not null,
  currency text default 'USD',
  status transaction_status default 'pending',
  payment_method payment_method not null,
  payment_intent_id text,
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics table
create table public.analytics (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null unique,
  total_views integer default 0,
  unique_viewers integer default 0,
  peak_concurrent_viewers integer default 0,
  average_watch_time integer default 0, -- seconds
  total_watch_time integer default 0, -- seconds
  chat_messages integer default 0,
  conversion_rate decimal(5,4) default 0.0,
  revenue decimal(10,2) default 0.0,
  engagement_rate decimal(5,4) default 0.0,
  drop_off_points jsonb default '[]'::jsonb,
  viewer_geography jsonb default '[]'::jsonb,
  device_breakdown jsonb default '[]'::jsonb,
  traffic_sources jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type notification_type not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index idx_events_streamer_id on public.events(streamer_id);
create index idx_events_scheduled_at on public.events(scheduled_at);
create index idx_events_status on public.events(status);
create index idx_participants_event_id on public.participants(event_id);
create index idx_participants_email on public.participants(email);
create index idx_participants_is_active on public.participants(is_active);
create index idx_messages_event_id on public.messages(event_id);
create index idx_messages_timestamp on public.messages(timestamp);
create index idx_overlay_elements_event_id on public.overlay_elements(event_id);
create index idx_overlay_elements_is_active on public.overlay_elements(is_active);
create index idx_transactions_event_id on public.transactions(event_id);
create index idx_transactions_participant_id on public.transactions(participant_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_is_read on public.notifications(is_read);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_users_updated_at before update on public.users
  for each row execute function update_updated_at_column();

create trigger update_events_updated_at before update on public.events
  for each row execute function update_updated_at_column();

create trigger update_transactions_updated_at before update on public.transactions
  for each row execute function update_updated_at_column();

create trigger update_analytics_updated_at before update on public.analytics
  for each row execute function update_updated_at_column();

-- Row Level Security (RLS) policies
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.participants enable row level security;
alter table public.messages enable row level security;
alter table public.overlay_elements enable row level security;
alter table public.transactions enable row level security;
alter table public.analytics enable row level security;
alter table public.notifications enable row level security;

-- Users policies
create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Events policies
create policy "Anyone can read published events" on public.events
  for select using (status in ('scheduled', 'live', 'ended'));

create policy "Streamers can manage own events" on public.events
  for all using (auth.uid() = streamer_id);

-- Participants policies
create policy "Participants can read own registrations" on public.participants
  for select using (auth.uid() = user_id or exists (
    select 1 from public.events e where e.id = event_id and e.streamer_id = auth.uid()
  ));

create policy "Anyone can register for events" on public.participants
  for insert with check (true);

create policy "Streamers can manage event participants" on public.participants
  for all using (exists (
    select 1 from public.events e where e.id = event_id and e.streamer_id = auth.uid()
  ));

-- Messages policies
create policy "Anyone can read messages for events they can access" on public.messages
  for select using (exists (
    select 1 from public.participants p
    where p.event_id = messages.event_id and p.user_id = auth.uid()
  ) or exists (
    select 1 from public.events e
    where e.id = messages.event_id and e.streamer_id = auth.uid()
  ));

create policy "Participants can send messages" on public.messages
  for insert with check (exists (
    select 1 from public.participants p
    where p.event_id = messages.event_id and p.user_id = auth.uid()
  ) or exists (
    select 1 from public.events e
    where e.id = messages.event_id and e.streamer_id = auth.uid()
  ));

-- Overlay elements policies
create policy "Streamers can manage overlays for own events" on public.overlay_elements
  for all using (exists (
    select 1 from public.events e where e.id = event_id and e.streamer_id = auth.uid()
  ));

create policy "Anyone can read active overlays for accessible events" on public.overlay_elements
  for select using (is_active = true and exists (
    select 1 from public.participants p
    where p.event_id = overlay_elements.event_id and p.user_id = auth.uid()
  ));

-- Transactions policies
create policy "Users can read own transactions" on public.transactions
  for select using (exists (
    select 1 from public.participants p
    where p.id = participant_id and p.user_id = auth.uid()
  ) or exists (
    select 1 from public.events e
    join public.participants p on p.event_id = e.id
    where p.id = participant_id and e.streamer_id = auth.uid()
  ));

-- Analytics policies
create policy "Streamers can read analytics for own events" on public.analytics
  for select using (exists (
    select 1 from public.events e where e.id = event_id and e.streamer_id = auth.uid()
  ));

-- Notifications policies
create policy "Users can manage own notifications" on public.notifications
  for all using (auth.uid() = user_id);

-- Functions for real-time subscriptions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, first_name, last_name)
  values (new.id, new.email, '', '');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all privileges on all tables in schema public to authenticated;
grant all privileges on all sequences in schema public to authenticated;

-- Additional helper functions
create or replace function public.get_event_participant_count(event_id uuid)
returns integer as $$
  select count(*)::integer from public.participants where event_id = $1;
$$ language sql stable;

create or replace function public.get_event_message_count(event_id uuid)
returns integer as $$
  select count(*)::integer from public.messages where event_id = $1;
$$ language sql stable;

-- Function to cleanup expired overlays
create or replace function public.cleanup_expired_overlays()
returns void as $$
begin
  update public.overlay_elements
  set is_active = false
  where is_active = true
    and end_time < now()
    and end_time is not null;
end;
$$ language plpgsql;