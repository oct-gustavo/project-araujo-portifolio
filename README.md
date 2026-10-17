# araújo_ · captação de clientes

Painel pessoal para encontrar empresas sem site (ou com site fraco), organizar os leads e acompanhar o contato.
A página inicial (`/`) é o **portfólio público** do estúdio; o painel fica em `/entrar`.

**Etapa atual: 2 — estrutura do painel e configurações.**

> Já tinha rodado a etapa 1? Só falta rodar `supabase/migrations/002_configuracoes.sql` no SQL Editor.

## Configurar pela primeira vez

### 1. Supabase (projeto NOVO, separado da corretora)
1. Crie um projeto em <https://supabase.com>.
2. **Authentication → Sign In / Providers**: desligue *Allow new users to sign up*.
3. **Authentication → Multi-Factor**: confira que **TOTP (App Authenticator)** está habilitado.
4. **SQL Editor**: cole e rode, nesta ordem, `supabase/migrations/001_acesso.sql` e `002_configuracoes.sql`.
5. **Authentication → Users → Add user → Create new user**: use um e-mail e uma senha
   **exclusivos deste sistema** (não reutilize senhas). Marque *Auto Confirm User*.
6. Volte ao **SQL Editor** e rode, trocando pelo seu e-mail:
   ```sql
   insert into public.usuarios_admin (id, email)
   select id, email from auth.users where email = 'SEU-EMAIL-AQUI';
   ```

### 2. Variáveis de ambiente
1. Copie `.env.example` para `.env.local`.
2. Preencha com os dados de **Project Settings → API Keys** do projeto novo:
   a chave **publishable** vai em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e a **secret**
   em `SUPABASE_SERVICE_ROLE_KEY`. Depois de mudar o `.env.local`, reinicie o `npm run dev`.
3. Gere o `SEGREDO_TENTATIVAS`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 3. Rodar
```bash
npm install
npm run dev
```
Abra <http://localhost:3000> para o portfólio e <http://localhost:3000/entrar> para o painel.

No primeiro acesso: e-mail e senha → tela de configurar o 2FA (QR code no app autenticador →
código de confirmação → **guarde os 10 códigos de backup**, eles aparecem uma única vez).

> Use `npm run dev` no seu computador. O `npm run start` local roda em http e a
> política de segurança (CSP) de produção força https — na Vercel isso funciona normalmente.

## Testes sugeridos (incluindo os negativos)
- Senha errada 3 vezes → bloqueio de 15 min com contador.
- Código do app errado → "o código não confere", tentativas diminuem; 3 erros → bloqueio.
- Abrir `/leads` sem login → volta para `/entrar`.
- Entrar só com a senha e tentar abrir `/leads` direto (sem o código) → volta para `/entrar`.
- Código de backup válido → leva para configurar o 2FA de novo (o app antigo deixa de valer).
- Usar o mesmo código de backup duas vezes → recusado.
- Botão **sair** na barra lateral → volta para `/entrar`.
- Configurações: mudar a meta e salvar → o número da barra lateral muda.
- Adicionar um tipo que já existe (ex.: "imobiliária") → aviso de duplicado.
- Gerar novos códigos de backup → os antigos deixam de funcionar no login.
- Alterar senha com a senha atual errada → conta como tentativa (3 = bloqueio).

## Portfólio (página `/`)
Os seus dados ficam em **`src/lib/portfolio.ts`**:

| Campo | O que colocar |
|---|---|
| `contato.whatsapp` | Só números, com DDI + DDD. Ex.: `5511987654321`. **Sem isso o formulário e o assistente não abrem o WhatsApp.** |
| `contato.whatsappTexto` | O número escrito, ex.: `(11) 98765-4321` |
| `contato.email` | Seu e-mail |
| `contato.instagramTexto` / `instagramUrl` | `@seuperfil` e o link |
| `redes.*` | Instagram, LinkedIn, Behance (a coluna "Redes" do rodapé só aparece com pelo menos um link) |
| `url` | Domínio final, quando tiver (SEO) |

- **Sua foto:** seção `Sobre` em `src/components/site/Secoes.tsx` (coloque a imagem em `public/`).
- **Páginas de projeto** (`/projetos/...`): o case da Patrícia e três conceitos com tour guiado.
  Em `src/lib/projetos.ts` preencha `siteNoAr` e `ano` da Patrícia quando tiver — o botão "Ver o site no ar" e o ano
  só aparecem preenchidos. O depoimento está comentado em `src/components/projetos/caso/CasoPatricia.tsx`.
- **Detalhes dos conceitos** (`/projetos/<conceito>/detalhes`): cores, fontes, estilo e decisões de cada conceito.
  Para mudar um texto ou uma cor, edite `src/components/projetos/detalhes/fichas.ts`. O fim do tour leva para lá.
- **Projetos:** lista `CASES` no mesmo arquivo. O "Ver projeto" só aparece quando o projeto tem `url`.
- **Formulário:** 3 passos (quem é você → o que precisa → como te respondo). Monta a mensagem e abre o WhatsApp; não grava nada.
  Telefone com máscara automática, erros explicados campo a campo, limite de 3 envios a cada 10 min (espera de 5 min).
  Qualquer botão "Vamos conversar" leva ao formulário com o campo "Seu nome" já selecionado.
- **Assistente de conversa:** balão "Fale comigo" no canto (na `/` e nas páginas de projeto). Faz 4 perguntas com
  botões e abre o WhatsApp com tudo resumido. É um roteiro fixo no navegador: sem servidor, sem IA, nada gravado.
  Divide com o formulário o limite de 3 envios. Nos conceitos, só aparece depois que o tour é fechado.
  Textos das perguntas e opções: topo de `src/components/site/AssistenteConversa.tsx`.
- **Testes sugeridos:** abrir `/` sem login (abre o portfólio, sem ir para `/entrar`); `/leads` sem login continua
  indo para `/entrar`; clicar em "Vamos conversar" (vai ao formulário com o nome selecionado); digitar letras no telefone (são ignoradas);
  enviar vazio (resumo + campos marcados) e preenchido (abre o WhatsApp); enviar 3 vezes (pede para aguardar);
  ativar "reduzir movimento" no sistema (sem abertura nem animações);
  assistente: responder as 4 perguntas, fechar com Esc, recarregar a página (a conversa continua), "Prefiro o formulário".

## Se aparecer "não foi possível continuar agora"
O terminal do `npm run dev` mostra a causa numa linha começando com `[api/...] erro interno:`.

## Deploy (Vercel)
Cadastre as 4 variáveis do `.env.example` em **Settings → Environment Variables** do projeto na Vercel.

## Estrutura
```
src/proxy.ts                         CSP com nonce + proteção das páginas (sessão aal2); "/" é pública
src/app/page.tsx                     portfólio público (única página indexável) + robots.ts
src/components/site/                 portfólio: seções, mockups, formulário → WhatsApp, assistente de conversa, abertura, site.css
src/lib/limiteEnvios.ts              limite de envios dividido entre formulário e assistente
src/lib/portfolio.ts                 dados de contato do portfólio
src/app/projetos/                    páginas de projeto (case real + conceitos)
src/components/projetos/             case da Patrícia, conceitos (lumen, norte, alba) e o tour guiado
src/lib/projetos.ts                  lista de projetos (home, páginas e "próximo projeto")
src/app/entrar/                      login terminal (entrada animada + 2FA + bloqueio)
src/app/configurar-2fa/              primeiro acesso: QR code, confirmação, códigos de backup
src/app/(painel)/                    painel: leads, novo-lead, resumo, configuracoes (layout confere admin + 2FA)
src/app/api/auth/                    login, 2fa, backup, configurar-2fa, sair
src/app/api/                         configuracoes, tipos-negocio, seguranca (códigos de backup, senha)
src/components/painel/               barra lateral, menu, cabeçalho
src/lib/dados/                       leitura e gravação das configurações
docs/checagem-de-site.md             o que o "checar site" consegue encontrar
src/lib/seguranca/                   tentativas/bloqueio, códigos de backup, sessão, helpers de API
src/lib/supabase/                    clientes do Supabase (sessão e admin)
src/components/marca/                logo e carregamento oficial
supabase/migrations/001_acesso.sql   tabelas de acesso + função de bloqueio
supabase/migrations/002_configuracoes.sql  configurações, tipos de negócio, permissões
```
