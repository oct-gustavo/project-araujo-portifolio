# projeto_araujo — regras do projeto

Ferramenta pessoal do Gustavo Araújo para organizar a captação de clientes (sites sob medida).
Ele encontra as empresas manualmente no Google Maps e cadastra aqui; o sistema organiza os leads,
prioriza e acompanha o contato. Uso exclusivo dele (um único usuário).

## Processo de trabalho
- Sempre planejar antes: listar o que será criado/alterado e esperar o OK antes de mexer em arquivos.
- Mudanças visuais: mostrar mockup antes de decidir.
- Comunicação curta e direta, em português.

## Stack
- Next.js 16 (App Router, `src/proxy.ts` no lugar de middleware), TypeScript, React 19.
- Supabase (Postgres + Auth com TOTP). Hospedagem na Vercel.
- Antes de usar APIs do Next, conferir `node_modules/next/dist/docs/` (a versão 16 mudou convenções).

## Regras de dados
- Nomes de tabelas e colunas em português.
- **Sem API do Google** (decisão para evitar qualquer cobrança): nada de Places API nem raspagem do Maps.
  Os leads são cadastrados manualmente; os dados digitados (nome, telefone, site, link do Maps, nota)
  são do próprio usuário e ficam gravados normalmente.
- Link do Maps: se for o link completo (`/maps/place/NOME/...`), o nome é extraído do próprio link no navegador.
  Links curtos (`maps.app.goo.gl`) só são guardados.
- Checagem de site (abre? HTTPS? funciona no celular?) é feita pelo servidor, sem serviços pagos.
- Não há mensagens automáticas: o contato é manual (ligação/WhatsApp).
- Meta semanal de leads (padrão 50) só acompanha o ritmo; não bloqueia nada.
- LGPD: dados de empresas para prospecção B2B; manter a lista "não contatar" e respeitá-la.

## Segurança (não afrouxar)
- Login: e-mail + senha exclusivos deste sistema, 2FA TOTP obrigatório, 10 códigos de backup (só hash scrypt).
- Bloqueio: 3 tentativas erradas (senha ou código) = 15 minutos, por e-mail e por IP (chaves HMAC).
- Páginas do painel exigem sessão aal2: conferido no `proxy.ts` e de novo no layout `(painel)`.
- Rotas de API: checar `origemValida`, validar entrada com zod, conferir sessão/admin no servidor.
- Tabelas internas com RLS ligado e sem políticas; acesso só pelo cliente admin (service_role) no servidor.
- CSP com nonce no `proxy.ts`. Nada de scripts externos.
- Nunca expor a service_role key no navegador (sem `NEXT_PUBLIC_`).

## Identidade visual
- Roxo meia-noite `#24173D`, roxo `#3B2370`, lilás `#B9A3F0`, grafite `#23222A`, fundo terminal `#17121F`.
- Cantos retos (2px no máximo), bordas finas, fontes Geist e Geist Mono (pacote `geist`, local).
- Logo: "A" geométrico + cursor (`araújo_`). Carregamento oficial: encaixe oco + scanner (`Carregando`).
- Login em estilo terminal com a entrada "logo que voa". Animações leves; respeitar `prefers-reduced-motion`.
- Mockups de referência no canvas do Claude Design ("Captação de Clientes — Mockups").

## Portfólio público (rota `/`)
- `/` é o portfólio do estúdio (única página pública e indexável). O painel continua em `/entrar`, `/leads` etc.
- `proxy.ts`: rotas em `ROTAS_PUBLICAS` recebem só a CSP, sem ler sessão do Supabase. Não colocar páginas do painel ali.
- Código: `src/components/site/` (seções, mockups, formulário, abertura) e `src/lib/portfolio.ts` (dados de contato).
- CSS em `src/components/site/site.css`, todo preso à classe `.site` (o CSS global do Next persiste entre rotas).
- Identidade própria, diferente do painel: estúdio criativo, escuro e frio, roxo como destaque; fonte Epilogue
  (`@fontsource-variable/epilogue`, local). Sem estética de terminal/código/startup e sem neon.
  Os mockups dos projetos usam Instrument Serif e Hanken Grotesk (só dentro deles).
- Abertura: mesma ideia da entrada do login (peças do A se encaixam, scanner preenche, símbolo voa até o menu), em CSS puro.
- Formulário de contato (3 passos numerados) não grava nada: monta a mensagem e abre o WhatsApp (`wa.me`).
  Rótulos sempre visíveis, coluna única, telefone com máscara (só números), validação ao sair do campo,
  resumo de erros com foco no primeiro campo errado, limite de 3 envios em 10 min (espera de 5 min, no navegador).
  Links para `#contato` levam ao formulário com o campo "Seu nome" já selecionado.
- Assistente de conversa (`src/components/site/AssistenteConversa.tsx` + `assistente.css`, preso à classe `.cw`):
  balão no canto, 4 perguntas com botões (tipo, prazo, nome/empresa, ideia opcional) e entrega no WhatsApp (`wa.me`)
  com resumo. Roteiro fixo no navegador, sem servidor e sem IA. Progresso guardado só durante a visita (sessionStorage).
  Divide com o formulário o limite de envios (`src/lib/limiteEnvios.ts`). Na `/` some enquanto o formulário está na tela;
  nas páginas de conceito fica escondido enquanto o tour está aberto. Esc fecha e devolve o foco ao balão.
- Mockups de referência no canvas do Claude Design ("Portfólio Araújo").
- Páginas de projeto em `/projetos/[slug]` (lista em `src/lib/projetos.ts`, também públicas no `proxy.ts`):
  - `patricia-rezende`: case real (`src/components/projetos/caso/`). Só fatos do projeto; ano, link e depoimento
    aparecem quando preenchidos (sem placeholder público).
  - `clinica-lumen`, `atelie-norte`, `casa-alba`: conceitos só visuais (sem servidor, nada é enviado), cada um com
    identidade própria e o tour guiado `TourConceito` (abre em toda visita; Esc fecha, ← → navegam, "Refazer o tour").
  - `/projetos/<conceito>/detalhes`: ficha de cada conceito no estilo do case (ideia, decisões de design, cores,
    fontes e estilo). Textos e cores em `src/components/projetos/detalhes/fichas.ts`; layout em `Detalhes.tsx` +
    `detalhes.css` (preso à classe `.fd`). O último passo do tour e a faixa final do conceito levam para ela.

## Ordem de construção
1. Login com 2FA ✔
2. Estrutura do painel + configurações (meta semanal, tipos de negócio, segurança)
3. Cadastro de leads (formulário rápido, link do Maps, duplicados, checagem do site)
4. Lista e detalhe dos leads (status, histórico, retornos)
5. Resumo semanal
6. Versão celular, exportar/importar CSV, deploy na Vercel e varredura de segurança/qualidade

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
