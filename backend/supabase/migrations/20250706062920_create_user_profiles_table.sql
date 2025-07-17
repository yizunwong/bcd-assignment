create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('policyholder', 'insurance_admin')),
  status text check (status in ('active', 'pending', 'suspended')),
  join_date date,
  kyc_status text check (kyc_status in ('verified', 'pending', 'flagged')),
  location text,
  login_attempts integer default 0,
  notes text,
  company text,
  policies integer,
  claims integer
);

create table roles (
  id text primary key,
  name text not null,
  description text,
  color text,
  settings jsonb
);

create table permissions (
  id text primary key,
  name text not null
);

create table role_permissions (
  role_id text references roles(id) on delete cascade,
  permission_id text references permissions(id) on delete cascade,
  enabled boolean default true,
  primary key (role_id, permission_id)
);

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  timestamp timestamp default now(),
  ip text
);
