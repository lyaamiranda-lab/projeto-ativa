-- Projeto Ativa: gravação protegida contra sobrescrita entre aparelhos.
-- Execute uma única vez no Supabase: SQL Editor > New query > Run.
-- Requer public.user_app_data(user_id uuid, app_data jsonb, updated_at timestamptz)
-- e políticas RLS de INSERT/UPDATE para auth.uid() = user_id.

create or replace function public.save_user_app_data(
  p_app_data jsonb,
  p_expected_updated_at timestamptz default null
)
returns table(saved_updated_at timestamptz, conflict boolean)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_saved_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Autenticação necessária';
  end if;

  insert into public.user_app_data (user_id, app_data, updated_at)
  values (auth.uid(), p_app_data, now())
  on conflict (user_id) do update
    set app_data = excluded.app_data,
        updated_at = excluded.updated_at
    where public.user_app_data.updated_at = p_expected_updated_at
  returning updated_at into v_saved_at;

  if not found then
    return query select null::timestamptz, true;
  else
    return query select v_saved_at, false;
  end if;
end;
$$;

revoke all on function public.save_user_app_data(jsonb, timestamptz) from public;
grant execute on function public.save_user_app_data(jsonb, timestamptz) to authenticated;
