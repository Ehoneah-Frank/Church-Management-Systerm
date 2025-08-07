-- Supabase SQL: Create profiles table for user roles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('superAdmin', 'Admin', 'user')) not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ensure every user has a profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant access to authenticated users
alter table profiles enable row level security;
create policy "Profiles are viewable by users themselves" on profiles
  for select using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);
