create table claims (
  id serial primary key,
  policy_id int references public.policies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  claim_type text NOT NULL,
  amount MONEY NOT NULL,
  status text NOT NULL,
  submitted_date DATE NOT NULL,
  processed_date DATE,
  claimed_date DATE,
  description TEXT
);

//pending: add approved date, before claimed_date.

create table claim_documents (
  id serial primary key,
  claim_id integer not null references policies(id) on delete cascade,
  name text not null,
  url text not null
);


 