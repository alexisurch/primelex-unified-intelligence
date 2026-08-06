-- ============================================================
-- PrimeLex Logistics UIS — Multi-tenant platform foundation
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Enumerations ----------
create type public.org_status as enum ('active','suspended','trial','cancelled');
create type public.member_status as enum ('active','invited','suspended','removed');
create type public.invitation_status as enum ('pending','accepted','revoked','expired');
create type public.subscription_status as enum ('trialing','active','past_due','cancelled','expired');
create type public.audit_action as enum ('created','updated','deleted','restored','status_changed','login','logout','exported','approved','rejected');
create type public.notification_priority as enum ('low','normal','high','critical');
create type public.notification_status as enum ('unread','read','archived');
create type public.notification_type as enum (
  'fuel_alert','maintenance_alert','incident_alert','expiry_alert','trip_alert',
  'dispatch_alert','assignment','mention','system','billing'
);
create type public.integration_status as enum ('connected','disconnected','error','pending');
create type public.tracking_mode as enum ('manual','automated');

-- ---------- Shared helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- ORGANISATIONS
-- ============================================================
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  short_name text,
  industry text,
  country text,
  status public.org_status not null default 'trial',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid
);
create unique index organizations_slug_key on public.organizations (lower(slug)) where deleted_at is null;
create index organizations_status_idx on public.organizations (status) where deleted_at is null;

grant select, insert, update on public.organizations to authenticated;
grant select on public.organizations to anon; -- workspace-login lookup (slug/branding only)
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;

-- ---------- Membership & profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  job_title text,
  avatar_url text,
  last_organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.member_status not null default 'active',
  is_owner boolean not null default false,
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid,
  unique (organization_id, user_id)
);
create index organization_members_user_idx on public.organization_members (user_id) where deleted_at is null;
grant select, insert, update, delete on public.organization_members to authenticated;
grant all on public.organization_members to service_role;
alter table public.organization_members enable row level security;

-- ---------- Security-definer access helpers ----------
create or replace function public.is_org_member(_organization_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = _organization_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.deleted_at is null
  )
$$;

create or replace function public.current_org_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select m.organization_id from public.organization_members m
  where m.user_id = auth.uid() and m.status = 'active' and m.deleted_at is null
$$;

-- ============================================================
-- RBAC
-- ============================================================
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  module text not null,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);
grant select on public.permissions to authenticated;
grant all on public.permissions to service_role;
alter table public.permissions enable row level security;
create policy "permissions readable by authenticated" on public.permissions for select to authenticated using (true);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  key text not null,
  name text not null,
  description text,
  is_system boolean not null default false,
  rank int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid
);
create unique index roles_system_key on public.roles (key) where organization_id is null;
create unique index roles_org_key on public.roles (organization_id, key) where organization_id is not null;
grant select, insert, update, delete on public.roles to authenticated;
grant all on public.roles to service_role;
alter table public.roles enable row level security;

create table public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (role_id, permission_id)
);
grant select, insert, delete on public.role_permissions to authenticated;
grant all on public.role_permissions to service_role;
alter table public.role_permissions enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid,
  unique (organization_id, user_id, role_id)
);
create index user_roles_user_idx on public.user_roles (user_id, organization_id);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_permission(_organization_id uuid, _permission text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid()
      and ur.organization_id = _organization_id
      and p.key = _permission
  )
$$;

create or replace function public.has_role_key(_organization_id uuid, _role_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and ur.organization_id = _organization_id
      and r.key = _role_key
  )
$$;

-- ============================================================
-- ORGANISATION CONFIGURATION
-- ============================================================
create table public.organization_branding (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  logo_url text,
  logo_path text,
  favicon_url text,
  primary_color text not null default '#3b82f6',
  secondary_color text not null default '#8b5cf6',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.organization_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  timezone text not null default 'Africa/Lagos',
  currency text not null default 'NGN',
  distance_unit text not null default 'km',
  volume_unit text not null default 'litre',
  date_format text not null default 'dd MMM yyyy',
  fleet_tracking_mode public.tracking_mode not null default 'manual',
  fuel_variance_review_pct numeric(5,2) not null default 3.00,
  fuel_variance_critical_pct numeric(5,2) not null default 7.00,
  learning_baseline_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.organization_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  theme text not null default 'dark',
  density text not null default 'comfortable',
  email_notifications boolean not null default true,
  inapp_notifications boolean not null default true,
  digest_frequency text not null default 'daily',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index organization_preferences_org_user_key
  on public.organization_preferences (organization_id, coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table public.organization_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider_key text not null,
  provider_name text not null,
  category text,
  status public.integration_status not null default 'disconnected',
  config jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid,
  unique (organization_id, provider_key)
);

create table public.organization_billing (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  billing_email text,
  billing_name text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  payment_method_brand text,
  payment_method_last4 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan_code text not null default 'growth',
  plan_name text not null default 'Growth',
  status public.subscription_status not null default 'trialing',
  seats int not null default 5,
  amount_cents int not null default 0,
  currency text not null default 'NGN',
  interval text not null default 'month',
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid
);
create index subscriptions_org_idx on public.subscriptions (organization_id) where deleted_at is null;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null,
  name text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid
);
create unique index workspaces_slug_key on public.workspaces (lower(slug)) where deleted_at is null;

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role_id uuid references public.roles(id) on delete set null,
  status public.invitation_status not null default 'pending',
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid
);
create unique index invitations_pending_email_key
  on public.invitations (organization_id, lower(email)) where status = 'pending';

-- ============================================================
-- AUDIT
-- ============================================================
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text,
  actor_role text,
  module text not null default 'System',
  entity_type text not null,
  entity_id text,
  entity_label text,
  action public.audit_action not null,
  field_name text,
  previous_value text,
  new_value text,
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  notes text,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
create index audit_logs_org_created_idx on public.audit_logs (organization_id, created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);
create index audit_logs_module_idx on public.audit_logs (module);

grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;

create or replace function public.audit_row_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _old jsonb;
  _new jsonb;
  _org uuid;
  _action public.audit_action;
  _changed text[];
  _module text := coalesce(tg_argv[0], initcap(tg_table_name));
  _label text;
begin
  if tg_op = 'DELETE' then
    _old := to_jsonb(old); _new := null; _action := 'deleted';
  elsif tg_op = 'INSERT' then
    _old := null; _new := to_jsonb(new); _action := 'created';
  else
    _old := to_jsonb(old); _new := to_jsonb(new); _action := 'updated';
    select array_agg(key) into _changed
    from jsonb_each(_new) n
    where n.value is distinct from (_old -> n.key)
      and n.key not in ('updated_at','updated_by');
    if _changed is null then return new; end if;
    if 'deleted_at' = any(_changed) and _new->>'deleted_at' is not null then
      _action := 'deleted';
    elsif 'status' = any(_changed) then
      _action := 'status_changed';
    end if;
  end if;

  _org := nullif(coalesce(_new, _old) ->> 'organization_id', '')::uuid;
  if _org is null and tg_table_name = 'organizations' then
    _org := nullif(coalesce(_new, _old) ->> 'id', '')::uuid;
  end if;
  _label := coalesce(coalesce(_new,_old)->>'name', coalesce(_new,_old)->>'full_name', coalesce(_new,_old)->>'label');

  insert into public.audit_logs (
    organization_id, actor_id, actor_name, module, entity_type, entity_id, entity_label,
    action, field_name, previous_value, new_value, old_values, new_values, changed_fields
  ) values (
    _org, auth.uid(),
    (select p.full_name from public.profiles p where p.id = auth.uid()),
    _module, tg_table_name, coalesce(_new,_old)->>'id', _label,
    _action,
    case when array_length(_changed,1) = 1 then _changed[1] end,
    case when array_length(_changed,1) = 1 then _old->>_changed[1] end,
    case when array_length(_changed,1) = 1 then _new->>_changed[1] end,
    _old, _new, _changed
  );
  return coalesce(new, old);
end;
$$;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recipient_id uuid references auth.users(id) on delete cascade,
  type public.notification_type not null default 'system',
  priority public.notification_priority not null default 'normal',
  status public.notification_status not null default 'unread',
  title text not null,
  body text,
  module text,
  entity_type text,
  entity_id text,
  action_url text,
  assigned_to uuid references auth.users(id) on delete set null,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid
);
create index notifications_recipient_idx on public.notifications (recipient_id, status, created_at desc);
create index notifications_org_idx on public.notifications (organization_id, created_at desc);

-- ============================================================
-- FILES / DOCUMENTS
-- ============================================================
create table public.files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  bucket_id text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  category text,
  entity_type text,
  entity_id text,
  description text,
  expires_on date,
  uploaded_by uuid references auth.users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid,
  unique (bucket_id, storage_path)
);
create index files_org_entity_idx on public.files (organization_id, entity_type, entity_id) where deleted_at is null;

-- ============================================================
-- COMMENTS (collaboration panel)
-- ============================================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_role text,
  body text not null,
  mentions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid
);
create index comments_entity_idx on public.comments (organization_id, entity_type, entity_id) where deleted_at is null;

-- ============================================================
-- GRANTS + RLS for org-scoped tables
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'organization_branding','organization_settings','organization_preferences',
    'organization_integrations','organization_billing','subscriptions','workspaces',
    'invitations','notifications','files','comments'
  ] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format($f$create policy "members read %1$s" on public.%1$I for select to authenticated using (organization_id in (select public.current_org_ids()));$f$, t);
    execute format($f$create policy "members insert %1$s" on public.%1$I for insert to authenticated with check (organization_id in (select public.current_org_ids()));$f$, t);
    execute format($f$create policy "members update %1$s" on public.%1$I for update to authenticated using (organization_id in (select public.current_org_ids())) with check (organization_id in (select public.current_org_ids()));$f$, t);
    execute format($f$create policy "members delete %1$s" on public.%1$I for delete to authenticated using (organization_id in (select public.current_org_ids()));$f$, t);
    execute format('create trigger set_updated_at_%1$s before update on public.%1$I for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- Public (anon) read of branding + workspaces for the /{organisation}/login screen
create policy "public read branding" on public.organization_branding for select to anon using (true);
create policy "public read workspaces" on public.workspaces for select to anon using (deleted_at is null);
grant select on public.organization_branding to anon;
grant select on public.workspaces to anon;

-- organizations
create policy "members read organizations" on public.organizations
  for select to authenticated using (id in (select public.current_org_ids()));
create policy "public read organizations" on public.organizations
  for select to anon using (deleted_at is null);
create policy "settings managers update organizations" on public.organizations
  for update to authenticated
  using (public.has_permission(id, 'settings.manage'))
  with check (public.has_permission(id, 'settings.manage'));
create policy "authenticated create organizations" on public.organizations
  for insert to authenticated with check (created_by = auth.uid());

-- profiles
create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "read org member profiles" on public.profiles for select to authenticated
  using (exists (select 1 from public.organization_members m
                 where m.user_id = profiles.id and m.organization_id in (select public.current_org_ids())));
create policy "update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());

-- organization_members
create policy "read own memberships" on public.organization_members for select to authenticated
  using (user_id = auth.uid());
create policy "read org memberships" on public.organization_members for select to authenticated
  using (organization_id in (select public.current_org_ids()));
create policy "inviters manage memberships" on public.organization_members for insert to authenticated
  with check (public.has_permission(organization_id, 'users.invite'));
create policy "inviters update memberships" on public.organization_members for update to authenticated
  using (public.has_permission(organization_id, 'users.invite'))
  with check (public.has_permission(organization_id, 'users.invite'));

-- roles
create policy "read system roles" on public.roles for select to authenticated using (organization_id is null);
create policy "read org roles" on public.roles for select to authenticated
  using (organization_id in (select public.current_org_ids()));
create policy "manage org roles" on public.roles for all to authenticated
  using (organization_id is not null and public.has_permission(organization_id, 'settings.manage'))
  with check (organization_id is not null and public.has_permission(organization_id, 'settings.manage'));

-- role_permissions
create policy "read role permissions" on public.role_permissions for select to authenticated
  using (exists (select 1 from public.roles r where r.id = role_id
                 and (r.organization_id is null or r.organization_id in (select public.current_org_ids()))));
create policy "manage role permissions" on public.role_permissions for all to authenticated
  using (exists (select 1 from public.roles r where r.id = role_id and r.organization_id is not null
                 and public.has_permission(r.organization_id, 'settings.manage')))
  with check (exists (select 1 from public.roles r where r.id = role_id and r.organization_id is not null
                 and public.has_permission(r.organization_id, 'settings.manage')));

-- user_roles
create policy "read own user roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "read org user roles" on public.user_roles for select to authenticated
  using (organization_id in (select public.current_org_ids()));
create policy "manage org user roles" on public.user_roles for all to authenticated
  using (public.has_permission(organization_id, 'users.invite'))
  with check (public.has_permission(organization_id, 'users.invite'));

-- audit logs
create policy "members read audit" on public.audit_logs for select to authenticated
  using (organization_id in (select public.current_org_ids()));
create policy "members write audit" on public.audit_logs for insert to authenticated
  with check (organization_id in (select public.current_org_ids()));

-- notifications: restrict to own/broadcast rows on top of org scope
create policy "recipients read notifications" on public.notifications for select to authenticated
  using (organization_id in (select public.current_org_ids())
         and (recipient_id is null or recipient_id = auth.uid() or assigned_to = auth.uid()
              or public.has_permission(organization_id, 'settings.manage')));

-- updated_at on remaining tables
create trigger set_updated_at_organizations before update on public.organizations
  for each row execute function public.set_updated_at();
create trigger set_updated_at_profiles before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at_members before update on public.organization_members
  for each row execute function public.set_updated_at();
create trigger set_updated_at_roles before update on public.roles
  for each row execute function public.set_updated_at();

-- automatic audit triggers
create trigger audit_organizations after insert or update or delete on public.organizations
  for each row execute function public.audit_row_change('Organisation');
create trigger audit_members after insert or update or delete on public.organization_members
  for each row execute function public.audit_row_change('Users');
create trigger audit_user_roles after insert or delete on public.user_roles
  for each row execute function public.audit_row_change('Users');
create trigger audit_invitations after insert or update on public.invitations
  for each row execute function public.audit_row_change('Users');
create trigger audit_settings after insert or update on public.organization_settings
  for each row execute function public.audit_row_change('Settings');
create trigger audit_branding after insert or update on public.organization_branding
  for each row execute function public.audit_row_change('Settings');
create trigger audit_integrations after insert or update or delete on public.organization_integrations
  for each row execute function public.audit_row_change('Integrations');
create trigger audit_billing after insert or update on public.organization_billing
  for each row execute function public.audit_row_change('Billing');
create trigger audit_subscriptions after insert or update on public.subscriptions
  for each row execute function public.audit_row_change('Billing');
create trigger audit_files after insert or update or delete on public.files
  for each row execute function public.audit_row_change('Documents');
create trigger audit_workspaces after insert or update on public.workspaces
  for each row execute function public.audit_row_change('Organisation');

-- profile auto-creation on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
          new.email,
          new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SEED: permissions
-- ============================================================
insert into public.permissions (key, module, label) values
  ('truck.create','Fleet','Create trucks'),
  ('truck.update','Fleet','Update trucks'),
  ('truck.delete','Fleet','Delete trucks'),
  ('truck.view','Fleet','View trucks'),
  ('driver.create','Drivers','Create drivers'),
  ('driver.update','Drivers','Update drivers'),
  ('driver.delete','Drivers','Delete drivers'),
  ('driver.view','Drivers','View drivers'),
  ('trip.create','Trips','Create trips'),
  ('trip.update','Trips','Update trips'),
  ('trip.dispatch','Dispatch','Dispatch trips'),
  ('trip.view','Trips','View trips'),
  ('route.manage','Routes','Manage routes'),
  ('fuel.assign','Fuel','Assign fuel'),
  ('fuel.review','Fuel','Review fuel variances'),
  ('fuel.view','Fuel','View fuel records'),
  ('maintenance.create','Maintenance','Create maintenance jobs'),
  ('maintenance.approve','Maintenance','Approve maintenance'),
  ('maintenance.view','Maintenance','View maintenance'),
  ('incident.create','Incidents','Report incidents'),
  ('incident.close','Incidents','Close incidents'),
  ('incident.view','Incidents','View incidents'),
  ('client.manage','Clients','Manage clients'),
  ('document.upload','Documents','Upload documents'),
  ('document.delete','Documents','Delete documents'),
  ('reports.view','Reports','View reports'),
  ('reports.download','Reports','Download reports'),
  ('billing.view','Billing','View billing'),
  ('billing.manage','Billing','Manage billing'),
  ('users.invite','Users','Invite users'),
  ('users.manage','Users','Manage users'),
  ('settings.manage','Settings','Manage settings'),
  ('audit.view','Audit','View audit trail');

-- ============================================================
-- SEED: system roles + role permissions
-- ============================================================
insert into public.roles (organization_id, key, name, description, is_system, rank) values
  (null,'owner','Organisation Owner','Full access to everything',true,1),
  (null,'administrator','Administrator','Full operational and settings access',true,10),
  (null,'fleet_manager','Fleet Manager','Manages assigned trucks, drivers and trips',true,20),
  (null,'dispatcher','Dispatcher','Creates and dispatches trips',true,30),
  (null,'maintenance','Maintenance Officer','Manages maintenance jobs',true,40),
  (null,'compliance','Compliance Officer','Documents, incidents and compliance',true,50),
  (null,'finance','Finance','Fuel costs, billing and reports',true,60),
  (null,'viewer','Viewer','Read-only access',true,90);

-- owner + administrator: all permissions
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.organization_id is null and r.key in ('owner','administrator');

-- fleet manager
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in (
  'truck.view','truck.update','driver.view','driver.update','trip.create','trip.update','trip.view',
  'trip.dispatch','route.manage','fuel.assign','fuel.review','fuel.view','maintenance.create',
  'maintenance.view','incident.create','incident.view','document.upload','reports.view','audit.view')
where r.organization_id is null and r.key = 'fleet_manager';

-- dispatcher
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in (
  'truck.view','driver.view','trip.create','trip.update','trip.view','trip.dispatch','fuel.view','route.manage')
where r.organization_id is null and r.key = 'dispatcher';

-- maintenance
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in (
  'truck.view','maintenance.create','maintenance.approve','maintenance.view','document.upload')
where r.organization_id is null and r.key = 'maintenance';

-- compliance
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in (
  'driver.view','truck.view','incident.create','incident.close','incident.view',
  'document.upload','document.delete','reports.view','audit.view')
where r.organization_id is null and r.key = 'compliance';

-- finance
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in (
  'fuel.view','reports.view','reports.download','billing.view','billing.manage')
where r.organization_id is null and r.key = 'finance';

-- viewer
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in (
  'truck.view','driver.view','trip.view','fuel.view','maintenance.view','incident.view','reports.view')
where r.organization_id is null and r.key = 'viewer';

-- ============================================================
-- SEED: Prime Logistics LTD demonstration organisation
-- ============================================================
do $$
declare
  _org uuid := '11111111-1111-4111-8111-111111111111';
  _admin uuid := '22222222-2222-4222-8222-222222222222';
  _owner_role uuid;
begin
  select id into _owner_role from public.roles where organization_id is null and key = 'owner';

  if not exists (select 1 from auth.users where id = _admin) then
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) values (
      _admin, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@primelogistics.demo', crypt('PrimeDemo2026!', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Adeleke Oladipo"}'::jsonb, now(), now()
    );
    insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), _admin, _admin::text, 'email',
            format('{"sub":"%s","email":"admin@primelogistics.demo","email_verified":true}', _admin)::jsonb,
            now(), now(), now());
  end if;

  insert into public.organizations (id, slug, name, short_name, industry, country, status, is_demo, created_by)
  values (_org, 'prime-logistics', 'Prime Logistics LTD', 'PRIME LOGISTICS',
          'Logistics & Transportation', 'Nigeria', 'active', true, _admin)
  on conflict (id) do nothing;

  insert into public.profiles (id, full_name, email, job_title, last_organization_id)
  values (_admin, 'Adeleke Oladipo', 'admin@primelogistics.demo', 'Managing Director', _org)
  on conflict (id) do update set last_organization_id = _org;

  insert into public.organization_members (organization_id, user_id, status, is_owner, joined_at)
  values (_org, _admin, 'active', true, now())
  on conflict (organization_id, user_id) do nothing;

  insert into public.user_roles (organization_id, user_id, role_id)
  values (_org, _admin, _owner_role)
  on conflict do nothing;

  insert into public.organization_branding (organization_id, primary_color, secondary_color)
  values (_org, '#3b82f6', '#8b5cf6') on conflict (organization_id) do nothing;

  insert into public.organization_settings (organization_id, fleet_tracking_mode)
  values (_org, 'manual') on conflict (organization_id) do nothing;

  insert into public.organization_preferences (organization_id, user_id, theme)
  values (_org, null, 'dark');

  insert into public.organization_billing (organization_id, billing_email, billing_name, city, country)
  values (_org, 'billing@primelogistics.demo', 'Prime Logistics LTD', 'Lagos', 'Nigeria')
  on conflict (organization_id) do nothing;

  insert into public.subscriptions (organization_id, plan_code, plan_name, status, seats, amount_cents, currency,
                                    current_period_start, current_period_end)
  values (_org, 'enterprise', 'Enterprise', 'active', 50, 45000000, 'NGN',
          date_trunc('month', now()), date_trunc('month', now()) + interval '1 month');

  insert into public.workspaces (organization_id, slug, name, is_primary)
  values (_org, 'prime-logistics', 'Prime Logistics LTD', true)
  on conflict do nothing;

  insert into public.organization_integrations (organization_id, provider_key, provider_name, category, status)
  values
    (_org, 'gps_tracker', 'GPS Telematics', 'Tracking', 'disconnected'),
    (_org, 'fuel_cards', 'Fuel Card Provider', 'Fuel', 'disconnected'),
    (_org, 'accounting', 'Accounting Suite', 'Finance', 'disconnected')
  on conflict (organization_id, provider_key) do nothing;
end $$;