# Homologação — fundação de dados da Fase 2

Esta lista é para a versão de prévia da branch `fase-2-planejamento`. Não executar na produção enquanto não houver aprovação.

## Verificações estáticas já realizadas
- [x] O módulo `phase2-data.js` é carregado antes do código principal.
- [x] O módulo é incluído na lista de arquivos do service worker.
- [x] A chave de cache foi alterada somente na branch de prévia.
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
A fundação de dados foi integrada, mas ainda não há interface para criar ou editar os novos registros. As verificações estáticas não substituem testes em navegador real. A versão de prévia não foi publicada no GitHub Pages e nenhuma alteração foi mesclada em `main`.
