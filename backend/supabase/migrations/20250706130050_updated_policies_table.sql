create table policies (
  id serial primary key,
  name text not null,
  category text not null,
  provider text not null,
  coverage float not null,
  premium text not null,
  rating float not null,
  popular boolean not null,
  description text,
  features text[] not null
);

create table documents (
  id serial primary key,
  policy_id integer not null references policies(id) on delete cascade,
  name text not null,
  url text not null
);

create table reviews (
  id serial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text not null,
  rating float not null check (rating >= 1 and rating <= 5),
  comment text
);