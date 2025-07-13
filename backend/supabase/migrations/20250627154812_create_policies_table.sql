create table policies (
  id serial primary key,
  name text not null,
  category text not null,
  provider text not null,
  coverage float not null,
  premium text not null,
  rating double not null,
  features text[] not null,
  popular boolean not null,
  description text,
  documents jsonb,
  reviews jsonb
);
