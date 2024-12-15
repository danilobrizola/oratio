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

CREATE POLICY "Enable read access for all users"
ON public.prayers
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Enable insert access for authenticated users only"
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

CREATE POLICY "Enable read access for all users"
ON public.prayer_counts
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Enable insert/delete access for authenticated users only"
ON public.prayer_counts
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para comments
DROP POLICY IF EXISTS "Enable read access for all users" ON comments;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON comments;
DROP POLICY IF EXISTS "Enable update/delete for users based on author_id" ON comments;

CREATE POLICY "Enable read access for all users"
ON public.comments
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Enable insert access for authenticated users only"
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
