create schema stamina;
create schema stamina_private;
create extension if not exists "uuid-ossp";

create table stamina.user (
  id uuid primary key default uuid_generate_v1mc(),
  name text check (char_length(name) < 20),
  created_at timestamp with time zone default now()
);

create unique index name_lower_case_idx on stamina.user (lower(name));  