-- Adiciona a coluna provider_id à tabela users
ALTER TABLE users ADD COLUMN provider_id TEXT;

-- Atualiza as políticas de segurança para incluir o novo campo
ALTER POLICY "Enable insert for authenticated users only" ON "public"."users"
    USING (auth.uid() = id);

ALTER POLICY "Enable update for users based on id" ON "public"."users"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
