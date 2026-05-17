-- CareRoster Supabase schema
-- Run this in Supabase SQL Editor before using the app.

create extension if not exists pgcrypto;

create table if not exists facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists staff_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('RN','EN','AIN','ADMIN')),
  employment_type text not null check (employment_type in ('full-time','part-time','casual')),
  status text not null default 'active' check (status in ('active','inactive','on-leave')),
  contracted_hours numeric,
  hourly_rate numeric,
  facility_id uuid references facilities(id) on delete set null,
  hire_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff_members(id) on delete cascade,
  name text not null,
  expiry_date date not null,
  status text not null default 'valid' check (status in ('valid','expiring','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid references facilities(id) on delete set null,
  date date not null,
  shift_type text not null check (shift_type in ('morning','afternoon','night')),
  start_time time not null,
  end_time time not null,
  required_role text not null check (required_role in ('RN','EN','AIN','ADMIN','ANY')),
  status text not null default 'unfilled' check (status in ('unfilled','filled','partial')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shift_assignments (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references shifts(id) on delete cascade,
  staff_id uuid not null references staff_members(id) on delete cascade,
  status text not null default 'assigned' check (status in ('assigned','confirmed','completed','cancelled','no-show')),
  assigned_at timestamptz not null default now(),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_id, staff_id)
);

create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff_members(id) on delete cascade,
  leave_type text not null check (leave_type in ('annual','sick','personal','unpaid','other','emergency')),
  start_date date not null,
  end_date date not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  reason text,
  approved_by uuid references staff_members(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists availability (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff_members(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  shift_type text not null check (shift_type in ('morning','afternoon','night')),
  is_available boolean not null default true,
  effective_from date not null default current_date,
  effective_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (staff_id, day_of_week, shift_type, effective_from)
);

create table if not exists warnings (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff_members(id) on delete set null,
  shift_id uuid references shifts(id) on delete cascade,
  warning_type text not null check (warning_type in ('overtime','certification','understaffed','compliance','no-break')),
  severity text not null default 'warning' check (severity in ('info','warning','critical')),
  message text not null,
  resolved boolean not null default false,
  resolved_at timestamptz,
  resolved_by uuid references staff_members(id) on delete set null,
  created_at timestamptz not null default now()
);

insert into facilities (id, name, address, phone, email)
values ('00000000-0000-0000-0000-000000000001', 'Main Aged Care Facility', 'Ballarat VIC', null, null)
on conflict (id) do nothing;

insert into staff_members (first_name, last_name, email, phone, role, employment_type, status, contracted_hours, hourly_rate, facility_id, hire_date)
values
  ('Sarah', 'Johnson', 'sarah.johnson@example.com', '0400000001', 'RN', 'full-time', 'active', 38, 45, '00000000-0000-0000-0000-000000000001', current_date - 700),
  ('David', 'Martinez', 'david.martinez@example.com', '0400000002', 'EN', 'part-time', 'active', 30, 38, '00000000-0000-0000-0000-000000000001', current_date - 400),
  ('Ava', 'Brown', 'ava.brown@example.com', '0400000003', 'AIN', 'casual', 'active', 24, 32, '00000000-0000-0000-0000-000000000001', current_date - 250)
on conflict do nothing;

insert into shifts (facility_id, date, shift_type, start_time, end_time, required_role, status, notes)
values
  ('00000000-0000-0000-0000-000000000001', current_date, 'morning', '06:00', '14:00', 'RN', 'unfilled', 'Morning medication round'),
  ('00000000-0000-0000-0000-000000000001', current_date, 'afternoon', '14:00', '22:00', 'AIN', 'unfilled', 'Resident care support'),
  ('00000000-0000-0000-0000-000000000001', current_date + 1, 'night', '22:00', '06:00', 'EN', 'unfilled', null)
on conflict do nothing;

alter table facilities enable row level security;
alter table staff_members enable row level security;
alter table certifications enable row level security;
alter table shifts enable row level security;
alter table shift_assignments enable row level security;
alter table leave_requests enable row level security;
alter table availability enable row level security;
alter table warnings enable row level security;

create policy "authenticated read facilities" on facilities for select to authenticated using (true);
create policy "authenticated write facilities" on facilities for all to authenticated using (true) with check (true);
create policy "authenticated read staff" on staff_members for select to authenticated using (true);
create policy "authenticated write staff" on staff_members for all to authenticated using (true) with check (true);
create policy "authenticated read certifications" on certifications for select to authenticated using (true);
create policy "authenticated write certifications" on certifications for all to authenticated using (true) with check (true);
create policy "authenticated read shifts" on shifts for select to authenticated using (true);
create policy "authenticated write shifts" on shifts for all to authenticated using (true) with check (true);
create policy "authenticated read shift assignments" on shift_assignments for select to authenticated using (true);
create policy "authenticated write shift assignments" on shift_assignments for all to authenticated using (true) with check (true);
create policy "authenticated read leave" on leave_requests for select to authenticated using (true);
create policy "authenticated write leave" on leave_requests for all to authenticated using (true) with check (true);
create policy "authenticated read availability" on availability for select to authenticated using (true);
create policy "authenticated write availability" on availability for all to authenticated using (true) with check (true);
create policy "authenticated read warnings" on warnings for select to authenticated using (true);
create policy "authenticated write warnings" on warnings for all to authenticated using (true) with check (true);
