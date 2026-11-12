# Projeto Ativa — aplicativo PWA

Aplicativo pessoal para organizar hábitos, rotina, metas e evolução, com interface adaptada a celulares e computadores.

## Recursos disponíveis
- Checklist diário e hábitos personalizados, com dias, pilares e prioridades.
- Rotina com horários e registros de conclusão.
- Metas com prazo, área e acompanhamento de progresso.
- Calendário, histórico e indicadores de evolução.
- Personalização e preferências.
- Salvamento local, exportação/restauração de backup e cópia local de recuperação antes de substituir dados pela nuvem.
- Cadastro, login, recuperação de senha e sincronização protegida entre aparelhos via Supabase.
- Instalação como PWA e suporte offline básico para abrir a interface já armazenada.

## Limites importantes
- Os lembretes são apenas uma preferência de horário; notificações automáticas ainda não estão implementadas.
- A sincronização depende da configuração correta do Supabase, da tabela e das políticas RLS.
- A cópia de recuperação fica no navegador daquele aparelho. Mantenha também um arquivo de backup exportado em local seguro.
- Não use o aplicativo para armazenar dados médicos, financeiros sigilosos ou outras informações altamente sensíveis.

## Publicação
O projeto está publicado pelo GitHub Pages em:
https://lyaamiranda-lab.github.io/projeto-ativa/

Para atualizar, envie os arquivos modificados ao repositório. O service worker usa um nome de cache versionado; se uma atualização não aparecer imediatamente, feche e abra o aplicativo novamente ou atualize a página.

## Testes finais recomendados
Antes de depender exclusivamente do aplicativo, confira em seus aparelhos:
1. Criar e concluir hábitos, atividades da rotina e metas.
2. Exportar um backup e confirmar que o arquivo abre corretamente.
3. Entrar na mesma conta em dois aparelhos e verificar a sincronização.
4. Testar a recuperação de senha e o comportamento sem internet.
5. Reabrir o app depois de uma atualização e confirmar que os registros continuam presentes.

## Cadastro e sincronização com Supabase (integração inicial)

1. Abra `supabase-config.js` e substitua `COLE_A_CHAVE_PUBLICAVEL_AQUI` pela chave `sb_publishable_...` em Supabase → Configurações → Chaves de API. Nunca use `sb_secret_...` no navegador.
2. Confirme que a tabela `public.user_app_data` existe e tem RLS ativado com políticas SELECT/INSERT/UPDATE limitadas a `auth.uid() = user_id`.
3. Envie `index.html`, `supabase-config.js` e `service-worker.js` para a raiz do repositório GitHub Pages, substituindo os arquivos anteriores.
4. Aguarde o GitHub Pages atualizar e recarregue o app. Em Ajustes, use Criar conta/Entrar.
5. Se a confirmação por e-mail estiver ativa, confirme o e-mail antes de entrar.

Esta é uma integração inicial para teste. Antes de divulgar amplamente, valide cadastro, confirmação de e-mail, login, sincronização em dois navegadores e recuperação de senha. Não armazene informações sensíveis. A chave publicável é destinada ao cliente, mas a segurança depende das políticas RLS corretas. O app mantém o armazenamento local; no primeiro login, se já houver dados na nuvem, ele pergunta qual conjunto manter.

**Atualização de segurança:** a comparação de versão usa `IS NOT DISTINCT FROM`, que também trata corretamente valores nulos de `updated_at`. Se você já executou uma versão anterior desse script, execute novamente o conteúdo atualizado do arquivo SQL para substituir a função.

## Proteção de sincronização entre aparelhos

Foi preparado o script `supabase/migrations/20261112_protected_sync.sql`, que cria a função `save_user_app_data`. Ela só atualiza o registro se a versão no banco ainda for a mesma que o aparelho leu, evitando sobrescrever silenciosamente alterações feitas em outro aparelho.

**Etapa necessária antes de ativar essa proteção no aplicativo:**
1. No painel do Supabase, abra **SQL Editor**.
2. Abra o arquivo `supabase/migrations/20261112_protected_sync.sql` neste repositório e copie todo o conteúdo.
3. Cole no SQL Editor e clique em **Run**.
4. Só depois de confirmar a execução, a integração do aplicativo poderá passar a usar a gravação protegida.

O script não apaga os dados existentes. Ele depende da tabela `public.user_app_data`, da coluna `updated_at` do tipo `timestamptz` e das políticas RLS de acesso do próprio usuário.
