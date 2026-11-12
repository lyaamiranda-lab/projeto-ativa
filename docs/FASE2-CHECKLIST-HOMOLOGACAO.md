# Homologação — fundação de dados da Fase 2

Esta lista é para a versão de prévia da branch `fase-2-planejamento`. Não executar na produção enquanto não houver aprovação.

## Verificações estáticas já realizadas
- [x] O módulo `phase2-data.js` é carregado antes do código principal.
- [x] O módulo é incluído na lista de arquivos do service worker.
- [x] A chave de cache foi alterada somente na branch de prévia.
- [x] A prévia desativa autenticação e sincronização Supabase para impedir gravação acidental na conta de produção.
- [x] O calendário integrado está roteado para o módulo da Fase 2.
- [x] Os formulários iniciais e ações de concluir/excluir passaram pela verificação estática.
- [x] Teste isolado da normalização: dados antigos preservados, registro válido mantido, data impossível rejeitada e limite de 500 registros aplicado.
- [x] Resumo de evolução ajustado para considerar os últimos sete dias nos indicadores semanais.
- [x] A normalização roda na inicialização dos dados locais.
- [x] Dados recebidos da nuvem passam pela mesma normalização.
- [x] Backups importados passam pela mesma normalização.
- [x] A detecção de progresso local considera as novas coleções.
- [x] Os oito campos novos são opcionais e iniciam como arrays vazios quando ausentes.
- [x] A branch de produção `main` não foi modificada.

## Testes funcionais necessários antes de publicar
- [ ] Abrir a prévia com dados antigos e verificar que hábitos, rotina, metas, calendário e evolução continuam presentes.
- [ ] Abrir a prévia sem dados e confirmar que o aplicativo inicia normalmente.
- [ ] Exportar um backup antigo, importá-lo na prévia e confirmar que os dados antigos continuam íntegros.
- [ ] Exportar um backup na prévia e confirmar que as novas coleções aparecem no JSON.
- [ ] Entrar na mesma conta em dois aparelhos e conferir sincronização e ausência de sobrescrita.
- [ ] Testar offline e reconexão.
- [ ] Confirmar que dados inválidos ou datas impossíveis não quebram a tela.
- [ ] Confirmar que textos digitados pelo usuário são exibidos como texto, nunca interpretados como HTML.
- [ ] Validar cada módulo da Fase 2 individualmente quando a interface estiver implementada.

## Limites desta etapa
A interface inicial para criar e excluir registros está implementada, mas ainda não há edição dos registros já salvos. A prévia usa armazenamento local isolado e não testa sincronização em nuvem; isso exige um ambiente Supabase de homologação separado. As verificações estáticas não substituem testes em navegador real. A versão de prévia não foi publicada no GitHub Pages e nenhuma alteração foi mesclada em `main`.
