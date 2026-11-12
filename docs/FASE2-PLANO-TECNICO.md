# Projeto Ativa — Plano técnico da Fase 2

## Objetivo e regra de segurança

Evoluir o aplicativo sem interromper a versão estável v69, sem perder dados locais ou da nuvem e sem publicar alterações antes de testes funcionais. Todo desenvolvimento da Fase 2 acontece inicialmente na branch `fase-2-planejamento`; a branch `main` (produção) permanece intocada.

## Situação confirmada

- Aplicativo atual em produção: v69.
- Armazenamento local: objeto JSON completo no localStorage.
- Sincronização: tabela `public.user_app_data`, coluna `app_data` (jsonb), com `user_id` e `updated_at`.
- Backup: exportação/importação JSON já existente.
- RLS da tabela `user_app_data`: habilitado.
- Políticas verificadas visualmente no Supabase:
  - SELECT: `USING ((SELECT auth.uid() AS uid) = user_id)`.
  - INSERT: `WITH CHECK ((SELECT auth.uid() AS uid) = user_id)`.
  - UPDATE: `USING ((SELECT auth.uid() AS uid) = user_id)` e `WITH CHECK ((SELECT auth.uid() AS uid) = user_id)`.
- A tabela contém registro existente; não alterar nem apagar dados.
- O RPC de sincronização protegida existente deve ser preservado.

## Decisões de produto já alinhadas

Interface simples, com navegação principal enxuta. Diário privado e sem compartilhamento. Memórias da família apenas em texto, sem anexos de fotos. Exercícios com planejamento semanal e registro de atividades realizadas. Saúde focada inicialmente no acompanhamento dos exercícios, sem integração com prontuários ou dispositivos. Não implementar notificações automáticas nesta etapa.

Áreas da Fase 2:
1. Meu dia: visão resumida de hábitos, rotina, exercício previsto, tarefas e atalhos.
2. Saúde e exercícios: plano semanal e registros concluídos (data, atividade, duração, intensidade e observação opcional).
3. Diário privado: escala de humor e diário escrito/gratidão, acessível somente pela conta da própria usuária.
4. Espiritualidade: oração, leitura bíblica, meditação e reflexão, com registros opcionais.
5. Lar e família: tarefas domésticas com categoria/data/recorrência/status; momentos em família em texto.
6. Evolução: indicadores simples e revisão semanal.
7. Calendário integrado: eventos e registros das áreas acima.

## Estratégia de dados

Manter compatibilidade com o modelo atual e, na primeira entrega, acrescentar campos opcionais ao JSONB existente, sem criar novas tabelas nem modificar o esquema SQL. Campos propostos:

- `exercisePlan`: planos de exercício por dia da semana.
- `exerciseRecords`: sessões realizadas.
- `healthMetrics`: medidas opcionais inseridas manualmente, sem obrigação de preenchimento.
- `moodEntries`: registros de humor.
- `journalEntries`: textos privados do diário e gratidão.
- `spiritualEntries`: práticas e reflexões espirituais.
- `homeTasks`: tarefas da casa.
- `familyEntries`: memórias textuais de momentos em família.

Todos os campos são opcionais; instalações antigas devem iniciar com coleções vazias. Não substituir nem reinterpretar os campos atuais (`habits`, `checks`, `routineItems`, `routineChecks`, `goals`, `notes`, preferências e configurações).

## Requisitos obrigatórios de implementação

- Fazer backup local recuperável antes de qualquer migração de formato.
- Validar e sanitizar todos os novos campos ao carregar dados locais, dados da nuvem e backups importados.
- Validar tipos, datas ISO, limites de tamanho de texto, categorias permitidas, duração e tamanho máximo das coleções.
- Não renderizar conteúdo não confiável diretamente como HTML; escapar texto do usuário.
- Não sobrescrever dados locais com nuvem vazia ou inválida.
- Manter o mecanismo atual de detecção e tratamento de conflito de sincronização.
- Garantir que exportação/importação de backup inclua todos os novos campos.
- Garantir que o calendário e a evolução tolerem dados antigos sem os campos novos.
- Exclusões devem pedir confirmação e preservar o histórico quando aplicável.
- Não guardar senhas, tokens ou chaves privadas no JSON de dados.
- Diário não será compartilhado na interface. A proteção atual é por conta autenticada e RLS; não prometer criptografia ponta a ponta.

## Plano de entrega e testes

### Etapa A — fundação
Revisar funções de inicialização, validação, backup, restauração, sincronização e calendário. Implementar normalização retrocompatível e testes estáticos. Não mudar a produção.

### Etapa B — módulos
Adicionar os módulos em incrementos pequenos, mantendo o estilo visual e os fluxos existentes. Testar cada módulo isoladamente.

### Etapa C — integração
Testar dados antigos e novos, modo offline, sincronização em dois dispositivos, conflito, exportação/importação, calendário, exclusão e recuperação.

### Etapa D — homologação
Publicar apenas em branch/preview separado e solicitar à usuária testes práticos. Só depois de aprovação explícita preparar a publicação em produção e atualizar o cache do service worker.

## Critério de não regressão

A versão 69 permanece como referência estável. Nenhuma alteração será mesclada à `main` nem publicada no endereço de produção sem homologação e autorização da usuária.
