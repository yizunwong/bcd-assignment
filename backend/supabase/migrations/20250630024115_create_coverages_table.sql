-- Create enum types
create type coverage_status as enum ('active', 'limitExceeded', 'expired', 'suspended');
create type notification_type as enum ('info', 'success', 'warning', 'error', 'alert');

create table coverage (
  id serial primary key,
  policy_id int references public.policies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status coverage_status not null,
  utilization_rate float not null,
  start_date date not null,
  end_date date not null,
  next_payment_date date not null,
  agreement_cid text
);