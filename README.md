# Projeto Ativa — PWA v1 (primeira versão instalável)

Esta pasta transforma o protótipo visual em uma primeira versão web instalável (PWA). Ela preserva as telas, os hábitos predefinidos, os ícones, a rotina semanal, os ajustes e o histórico local.

## O que já funciona
- Interface adaptada a celulares.
- Checklist diário, hábitos personalizados e seleção dos dias da semana.
- Rotina, pilares e resumo de evolução.
- Salvamento local no navegador.
- Manifesto, ícones de aplicativo e service worker para instalação e cache básico offline.

## O que ainda não está implementado
- Cadastro/login e sincronização entre aparelhos.
- Notificações automáticas reais.
- Pagamentos ou plano Premium.
- Backup na nuvem.

**Importante:** os dados ficam no navegador/aparelho utilizado. Se os dados do site forem apagados ou você trocar de aparelho, os registros podem não estar disponíveis. Não registre informações sensíveis nesta versão de testes.

## Como testar no computador
1. Instale o [Visual Studio Code](https://code.visualstudio.com/) se ainda não tiver.
2. Descompacte esta pasta em seu computador.
3. No VS Code, abra a pasta `projeto-ativa-pwa-v1`.
4. Instale a extensão **Live Server** (Ritwick Dey).
5. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
6. Confira o checklist e a navegação. A instalação PWA exige um contexto seguro (HTTPS ou localhost); abrir o arquivo com duplo clique não testa isso corretamente.

## Como publicar gratuitamente para testes com GitHub Pages
1. Crie uma conta no [GitHub](https://github.com/) se ainda não tiver.
2. Crie um repositório público chamado `projeto-ativa`.
3. Envie os arquivos desta pasta para a raiz do repositório: `index.html`, `manifest.webmanifest`, `service-worker.js`, a pasta `icons` e este `README.md`.
4. No repositório, abra **Settings → Pages**.
5. Em **Build and deployment**, escolha **Deploy from a branch**; selecione `main` e `/ (root)`; clique em **Save**.
6. Aguarde a publicação e abra o endereço indicado pelo GitHub Pages. Ele normalmente tem o formato `https://SEU-USUARIO.github.io/projeto-ativa/`.
7. Teste o link no celular. No Android/Chrome, use o menu do navegador e escolha **Instalar app** ou **Adicionar à tela inicial**, conforme aparecer. No iPhone/Safari, toque em **Compartilhar → Adicionar à Tela de Início**.

Os nomes dos menus podem variar conforme idioma e versão. Não publique dados pessoais no repositório; este pacote não contém dados reais de usuários.

## Atualizações
Depois de editar arquivos, envie as alterações ao mesmo repositório. O navegador pode manter arquivos antigos em cache por algum tempo; feche e abra o app novamente se uma atualização não aparecer.

## Próxima etapa recomendada
Depois de validar com um pequeno grupo, implementar autenticação e banco de dados (por exemplo, Supabase), incluindo regras de acesso por usuário e política de privacidade antes de recolher dados pessoais. A versão PWA estática atual não é ainda adequada para tratar contas ou dados sensíveis.
