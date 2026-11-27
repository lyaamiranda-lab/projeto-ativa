-- Ativa Habitus: suporte a lembretes push mesmo com o aplicativo fechado.
-- Execute no Supabase SQL Editor depois de publicar a Edge Function.

create table if not exists public.push_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users manage own push subscriptions" on public.push_subscriptions;
create policy "Users manage own push subscriptions"
  on public.push_subscriptions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.push_notification_log (
  id bigint generated always as identity primary key,
  subscription_id bigint not null references public.push_subscriptions(id) on delete cascade,
  habit_id text not null,
  local_date date not null,
  sent_at timestamptz not null default now(),
  unique(subscription_id, habit_id, local_date)
);

alter table public.push_notification_log enable row level security;
-- Sem políticas para usuários: somente a Edge Function com service_role acessa o log.
