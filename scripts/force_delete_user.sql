-- Função para forçar a exclusão de um usuário e suas referências
CREATE OR REPLACE FUNCTION public.force_delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Excluir todos os comentários do usuário
    DELETE FROM public.comments WHERE author_id = user_id;
    
    -- Excluir todos os prayer_counts do usuário
    DELETE FROM public.prayer_counts WHERE user_id = user_id;
    
    -- Excluir todos os comentários nas orações do usuário
    DELETE FROM public.comments 
    WHERE prayer_id IN (SELECT id FROM public.prayers WHERE author_id = user_id);
    
    -- Excluir todas as orações do usuário
    DELETE FROM public.prayers WHERE author_id = user_id;
    
    -- Excluir o usuário da tabela users com FORCE
    ALTER TABLE public.users DISABLE TRIGGER ALL;
    DELETE FROM public.users WHERE id = user_id;
    ALTER TABLE public.users ENABLE TRIGGER ALL;
    
    -- Garantir que o email do usuário seja liberado
    UPDATE public.users SET email = NULL WHERE id = user_id;
END;
$$;
