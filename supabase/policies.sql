-- Reset das políticas existentes
drop policy if exists "Qualquer um pode ver comentários" on comments;
drop policy if exists "Usuários autenticados podem criar comentários" on comments;
drop policy if exists "Usuários podem editar seus próprios comentários" on comments;
drop policy if exists "Usuários podem deletar seus próprios comentários" on comments;

-- Políticas para a tabela comments
alter table comments enable row level security;

create policy "Qualquer um pode ver comentários"
on comments for select
to authenticated, anon
using (true);

create policy "Usuários autenticados podem criar comentários"
on comments for insert
to authenticated
with check (
  auth.uid() = author_id AND
  exists (
    select 1 from users
    where users.id = auth.uid()
  )
);

create policy "Usuários podem editar seus próprios comentários"
on comments for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Usuários podem deletar seus próprios comentários"
on comments for delete
to authenticated
using (auth.uid() = author_id);

-- Políticas para a tabela prayers
alter table prayers enable row level security;

create policy "Qualquer um pode ver orações"
on prayers for select
to authenticated, anon
using (true);

create policy "Usuários autenticados podem criar orações"
on prayers for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Usuários podem editar suas próprias orações"
on prayers for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Usuários podem deletar suas próprias orações"
on prayers for delete
to authenticated
using (auth.uid() = author_id);

-- Políticas para a tabela prayer_counts
alter table prayer_counts enable row level security;

create policy "Qualquer um pode ver contagens de orações"
on prayer_counts for select
to authenticated, anon
using (true);

create policy "Usuários autenticados podem criar contagens"
on prayer_counts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias contagens"
on prayer_counts for delete
to authenticated
using (auth.uid() = user_id);

-- Políticas para a tabela users
alter table users enable row level security;

create policy "Qualquer um pode ver usuários"
on users for select
to authenticated, anon
using (true);

create policy "Usuários podem editar seus próprios dados"
on users for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Usuários autenticados podem criar seus próprios dados"
on users for insert
to authenticated
with check (auth.uid() = id);

create policy "Usuários podem deletar seus próprios dados"
on users for delete
to authenticated
using (auth.uid() = id);
