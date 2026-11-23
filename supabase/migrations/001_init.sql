-- =====================================================================
-- Faris Lee Properties: Supabase schema (converted from Base44 entities)
-- Run in: Supabase Dashboard > SQL Editor
-- =====================================================================

-- IDs are TEXT (default = uuid string) so IDs exported from Base44 can be
-- imported unchanged. Listing URLs contain the listing id, so this keeps old links working.

-- Admin check: reads app_metadata.role from the signed-in user's JWT.
-- app_metadata can only be changed server-side, never by the user.
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

create or replace function public.set_updated_date()
returns trigger language plpgsql as $$
begin new.updated_date = now(); return new; end $$;

-- ---------- brokers ----------
create table public.brokers (
  id            text primary key default gen_random_uuid()::text,
  slug          text not null unique,
  name          text not null,
  title         text,
  license       text,
  phone         text,
  email         text,
  image         text,
  "thumbImage"  text,
  bio           text[] default '{}',
  "order"       numeric default 0,
  created_date  timestamptz default now(),
  updated_date  timestamptz default now(),
  created_by    text
);

-- ---------- listings ----------
create table public.listings (
  id               text primary key default gen_random_uuid()::text,
  title            text,
  address          text not null,
  city             text,
  state            text,
  zip              text,
  price            numeric not null,
  status           text not null default 'active' check (status in ('active','pending','sold')),
  property_type    text check (property_type in ('Single Tenant','Multi Tenant','Grocery Anchored')),
  bedrooms         numeric,
  bathrooms        numeric,
  sqft             numeric,
  image_url        text,
  images           text[] default '{}',
  description      text,
  highlights       text[] default '{}',
  brokers          text[] default '{}',
  commission_rate  numeric default 2.5,
  cap_rate         numeric,
  noi              numeric,
  year_built       numeric,
  listing_number   text,
  listed_date      date,
  closing_date     date,
  coe_psa          text,
  offers           numeric,
  om_url           text,
  latitude         numeric,
  longitude        numeric,
  created_date     timestamptz default now(),
  updated_date     timestamptz default now(),
  created_by       text
);

-- ---------- news_stories ----------
create table public.news_stories (
  id            text primary key default gen_random_uuid()::text,
  title         text not null,
  slug          text,
  publish_date  date not null,
  image_url     text,
  excerpt       text,
  body          text,
  category      text,
  published     boolean default true,
  homepage      boolean default false,
  tagline       text,
  sale_price    numeric,
  sqft          numeric,
  city          text,
  state         text,
  created_date  timestamptz default now(),
  updated_date  timestamptz default now(),
  created_by    text
);

-- ---------- subscribers ----------
create table public.subscribers (
  id            text primary key default gen_random_uuid()::text,
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text,
  company       text,
  job_title     text,
  om_downloads  jsonb default '[]'::jsonb,
  created_date  timestamptz default now(),
  updated_date  timestamptz default now(),
  created_by    text
);
create unique index subscribers_email_lower_idx on public.subscribers (lower(email));

-- ---------- om_downloads ----------
create table public.om_downloads (
  id                text primary key default gen_random_uuid()::text,
  subscriber_email  text not null,
  listing_id        text not null,
  listing_address   text,
  listing_title     text,
  created_date      timestamptz default now(),
  updated_date      timestamptz default now(),
  created_by        text
);

-- updated_date triggers
do $$ declare t text; begin
  foreach t in array array['brokers','listings','news_stories','subscribers','om_downloads'] loop
    execute format('create trigger set_updated_date before update on public.%I
                    for each row execute function public.set_updated_date()', t);
  end loop;
end $$;

-- =====================================================================
-- Row Level Security (this is what protects your data, since the anon key is public)
-- =====================================================================
alter table public.brokers      enable row level security;
alter table public.listings     enable row level security;
alter table public.news_stories enable row level security;
alter table public.subscribers  enable row level security;
alter table public.om_downloads enable row level security;

-- brokers: public read, admin write
create policy "brokers read"   on public.brokers for select using (true);
create policy "brokers insert" on public.brokers for insert with check (public.is_admin());
create policy "brokers update" on public.brokers for update using (public.is_admin());
create policy "brokers delete" on public.brokers for delete using (public.is_admin());

-- listings: public sees only active, admin sees all + writes
create policy "listings read"   on public.listings for select using (status = 'active' or public.is_admin());
create policy "listings insert" on public.listings for insert with check (public.is_admin());
create policy "listings update" on public.listings for update using (public.is_admin());
create policy "listings delete" on public.listings for delete using (public.is_admin());

-- news: public sees only published, admin sees all + writes
create policy "news read"   on public.news_stories for select using (published = true or public.is_admin());
create policy "news insert" on public.news_stories for insert with check (public.is_admin());
create policy "news update" on public.news_stories for update using (public.is_admin());
create policy "news delete" on public.news_stories for delete using (public.is_admin());

-- subscribers: admin only (public signs up via the RPC function below)
create policy "subscribers admin all" on public.subscribers for all
  using (public.is_admin()) with check (public.is_admin());

-- om_downloads: anyone can log a download, only admin can read/change
create policy "om_downloads insert" on public.om_downloads for insert with check (true);
create policy "om_downloads read"   on public.om_downloads for select using (public.is_admin());
create policy "om_downloads update" on public.om_downloads for update using (public.is_admin());
create policy "om_downloads delete" on public.om_downloads for delete using (public.is_admin());

-- =====================================================================
-- Public sign-up RPC functions (SECURITY DEFINER = bypass RLS safely)
-- Lets visitors register / check "returning" status WITHOUT being able to
-- read the subscriber list.
-- =====================================================================
create or replace function public.subscriber_exists(p_email text)
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.subscribers where lower(email) = lower(p_email));
$$;

create or replace function public.subscriber_signup(
  p_first_name text, p_last_name text, p_email text,
  p_phone text default null, p_company text default null, p_job_title text default null
) returns boolean   -- true = returning subscriber, false = new
language plpgsql security definer set search_path = public as $$
declare existing_id text;
begin
  select id into existing_id from public.subscribers where lower(email) = lower(p_email);
  if existing_id is not null then
    update public.subscribers
       set company   = coalesce(nullif(p_company,''),   company),
           job_title = coalesce(nullif(p_job_title,''), job_title)
     where id = existing_id;
    return true;
  end if;
  insert into public.subscribers(first_name,last_name,email,phone,company,job_title)
  values (p_first_name,p_last_name,p_email,p_phone,p_company,p_job_title);
  return false;
end $$;

-- Logs an OM download and appends it to the subscriber's om_downloads array
create or replace function public.log_om_download(
  p_email text, p_listing_id text, p_listing_address text, p_listing_title text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.om_downloads(subscriber_email, listing_id, listing_address, listing_title)
  values (p_email, p_listing_id, p_listing_address, p_listing_title);

  update public.subscribers
     set om_downloads = coalesce(om_downloads,'[]'::jsonb) || jsonb_build_array(jsonb_build_object(
           'property_address', coalesce(p_listing_address,''),
           'property_title',   coalesce(p_listing_title,''),
           'downloaded_at',    to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')))
   where lower(email) = lower(p_email);
end $$;

grant execute on function public.subscriber_exists(text) to anon, authenticated;
grant execute on function public.subscriber_signup(text,text,text,text,text,text) to anon, authenticated;
grant execute on function public.log_om_download(text,text,text,text) to anon, authenticated;

-- =====================================================================
-- Storage bucket for admin image uploads
-- =====================================================================
insert into storage.buckets (id, name, public) values ('uploads','uploads', true)
on conflict (id) do nothing;

create policy "uploads public read"  on storage.objects for select using (bucket_id = 'uploads');
create policy "uploads admin insert" on storage.objects for insert with check (bucket_id = 'uploads' and public.is_admin());
create policy "uploads admin update" on storage.objects for update using (bucket_id = 'uploads' and public.is_admin());
create policy "uploads admin delete" on storage.objects for delete using (bucket_id = 'uploads' and public.is_admin());
