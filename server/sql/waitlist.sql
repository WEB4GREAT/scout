create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  source text not null default 'website'
    check (source = 'website'),
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email),
  constraint waitlist_email_lowercase
    check (email = lower(email))
);

alter table public.waitlist enable row level security;

-- Intentionally create no public SELECT, INSERT, UPDATE, or DELETE policies.
-- The server uses its private service-role credential for inserts.
