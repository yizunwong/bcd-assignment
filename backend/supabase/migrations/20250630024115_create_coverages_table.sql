create table coverage (
  id serial primary key,
  policy_id int references public.policies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text not null,
  utilization_rate float not null,
  start_date date not null,
  end_date date not null,
  next_payment_date date not null
);