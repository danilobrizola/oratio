-- Remover tabelas existentes se necessário
DROP TABLE IF EXISTS public.verification_tokens CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.prayer_counts CASCADE;
DROP TABLE IF EXISTS public.prayers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Criar tabela de usuários
CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    name text,
    email text UNIQUE,
    image text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de orações
CREATE TABLE public.prayers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    is_anonymous boolean DEFAULT false,
    prayer_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de contagem de orações
CREATE TABLE public.prayer_counts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    prayer_id uuid REFERENCES public.prayers(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(prayer_id, user_id)
);

-- Criar tabela de comentários
CREATE TABLE public.comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    prayer_id uuid REFERENCES public.prayers(id) ON DELETE CASCADE,
    author_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Políticas para users
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;

CREATE POLICY "Enable read access for all users"
ON public.users
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Enable insert access for authenticated users only"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Políticas para prayers
DROP POLICY IF EXISTS "Enable read access for all users" ON prayers;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON prayers;
DROP POLICY IF EXISTS "Enable update for users based on author_id" ON prayers;
DROP POLICY IF EXISTS "Enable delete for users based on author_id" ON prayers;

DROP POLICY IF EXISTS "Usuários autenticados podem ver orações" ON prayers;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir orações" ON prayers;

CREATE POLICY "Qualquer pessoa pode ver orações"
ON public.prayers
FOR SELECT
TO public
USING (true);

CREATE POLICY "Usuários autenticados podem inserir orações"
ON public.prayers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Enable update for users based on author_id"
ON public.prayers
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Enable delete for users based on author_id"
ON public.prayers
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Políticas para prayer_counts
DROP POLICY IF EXISTS "Enable read access for all users" ON prayer_counts;
DROP POLICY IF EXISTS "Enable insert/delete access for authenticated users only" ON prayer_counts;

DROP POLICY IF EXISTS "Usuários autenticados podem ver contagens" ON prayer_counts;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir contagens" ON prayer_counts;

CREATE POLICY "Qualquer pessoa pode ver contagens"
ON public.prayer_counts
FOR SELECT
TO public
USING (true);

CREATE POLICY "Usuários autenticados podem inserir contagens"
ON public.prayer_counts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Políticas para comments
DROP POLICY IF EXISTS "Enable read access for all users" ON comments;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON comments;
DROP POLICY IF EXISTS "Enable update/delete for users based on author_id" ON comments;

DROP POLICY IF EXISTS "Usuários autenticados podem ver comentários" ON comments;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir comentários" ON comments;

CREATE POLICY "Qualquer pessoa pode ver comentários"
ON public.comments
FOR SELECT
TO public
USING (true);

CREATE POLICY "Usuários autenticados podem inserir comentários"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Enable update/delete for users based on author_id"
ON public.comments
FOR ALL
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Função para incrementar o contador de orações de forma atômica
CREATE OR REPLACE FUNCTION increment_prayer_count(prayer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE prayers
  SET prayer_count = prayer_count + 1
  WHERE id = prayer_id;
END;
$$;

-- Garantir que a função só pode ser executada por usuários autenticados
REVOKE EXECUTE ON FUNCTION increment_prayer_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_prayer_count(uuid) TO authenticated;
