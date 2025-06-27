create table policies (
  id serial primary key,
  name text not null,
  category text not null,
  provider text not null,
  coverage text,
  premium text,
  rating float,
  features text[],
  popular boolean,
  description text,
  documents jsonb,
  reviews jsonb
);
