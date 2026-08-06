-- Storage: org-scoped access. Path convention: {organization_id}/{entity_type}/{entity_id}/{file}
create or replace function public.storage_path_org(_name text)
returns uuid language plpgsql immutable set search_path = public as $$
declare v uuid;
begin
  begin
    v := (storage.foldername(_name))[1]::uuid;
  exception when others then
    return null;
  end;
  return v;
end;
$$;
revoke all on function public.storage_path_org(text) from anon, authenticated;
grant execute on function public.storage_path_org(text) to authenticated;

create policy "org members read files" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('truck-documents','driver-documents','incident-evidence','maintenance-files',
                  'organisation-assets','profile-images','client-documents','trip-documents',
                  'reports','documents')
    and public.storage_path_org(name) in (select public.current_org_ids())
  );

create policy "org members upload files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('truck-documents','driver-documents','incident-evidence','maintenance-files',
                  'organisation-assets','profile-images','client-documents','trip-documents',
                  'reports','documents')
    and public.storage_path_org(name) in (select public.current_org_ids())
  );

create policy "org members update files" on storage.objects
  for update to authenticated
  using (public.storage_path_org(name) in (select public.current_org_ids()))
  with check (public.storage_path_org(name) in (select public.current_org_ids()));

create policy "org members delete files" on storage.objects
  for delete to authenticated
  using (public.storage_path_org(name) in (select public.current_org_ids()));

-- Lock down security-definer helpers to signed-in users only
revoke all on function public.is_org_member(uuid) from anon, authenticated;
revoke all on function public.current_org_ids() from anon, authenticated;
revoke all on function public.has_permission(uuid, text) from anon, authenticated;
revoke all on function public.has_role_key(uuid, text) from anon, authenticated;
revoke all on function public.audit_row_change() from anon, authenticated;
revoke all on function public.handle_new_user() from anon, authenticated;
revoke all on function public.set_updated_at() from anon, authenticated;

grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.current_org_ids() to authenticated, anon;
grant execute on function public.has_permission(uuid, text) to authenticated;
grant execute on function public.has_role_key(uuid, text) to authenticated;