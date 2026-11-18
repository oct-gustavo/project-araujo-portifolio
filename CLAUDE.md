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

## Página pública de orçamento (rota `/`)
- `/` é uma página única de pedido de orçamento (única página pública e indexável). O painel continua em `/entrar`, `/leads` etc.
  Não há páginas de projeto: os projetos reais aparecem em vídeos no TikTok e no Instagram. Não exibir nome, endereço
  ou dado real de clientes no site.
- `proxy.ts`: `/` (em `ROTAS_PUBLICAS`) e `/experimentos/` (em `PREFIXOS_PUBLICOS`) recebem só a CSP, sem ler sessão do
  Supabase. Não colocar páginas do painel ali.
- Páginas do painel ficam listadas em `ROTAS_PAINEL` no `proxy.ts` (sem sessão completa → `/entrar`).
  **Ao criar uma página nova do painel, incluir ali.** Qualquer outro endereço, para quem não entrou, recebe a 404
  (`src/app/not-found.tsx`, mesmo estilo da página) por rewrite para uma pasta privada — a página pedida nunca é servida.
- Seções, nesta ordem: cabeçalho (logo, âncoras "Experimentos" e "Como funciona", botão "Pedir orçamento"), início,
  experimentos (3 conceitos com miniaturas só em divs/CSS, `aria-hidden`, etiqueta "Conceito, dados fictícios"),
  como funciona (4 passos), orçamento (formulário) e rodapé (Instagram). Sem prazo nem preço em lugar nenhum.
- Código em `src/components/site/`: `PaginaUnica.tsx` (seções), `Experimentos.tsx` (miniaturas),
  `FormularioOrcamento.tsx`, `FundoAnimado.tsx`, `Abertura.tsx`, `fontes.ts`. Dados de contato em `src/lib/portfolio.ts`.
- CSS em `src/components/site/pagina-unica.css`, todo preso à classe `.pu` (o CSS global do Next persiste entre rotas).
- Identidade própria, diferente do painel: estúdio criativo para donos de negócio não técnicos. Tema escuro único:
  fundo `#13111C`, painéis `#1C1A26`/`#242232`, linhas `#34314A`, texto `#EEEAF7`, texto secundário `#AAA5BE`,
  destaque `#9A80F5` (texto sobre o roxo: `#13111C`). Cantos de 3–4px. Sem neon, brilho, gradiente, sombra decorativa
  nem estética de terminal/código/startup. Fonte Epilogue (400/500/600 + itálico) via `next/font/google`;
  Largura máxima 1200px, margem lateral mínima de 16px.
- Logo do site (nova, de 18/nov/2026, feita no Nano Banana): "A" em rede roxo + "araújo" branco em sans + cursor "_" lilás, com
  brilho na própria arte. É um PNG com fundo transparente em `public/marca/logo-araujo.png` (`LogoSite` em `PaginaUnica.tsx`,
  usada no cabeçalho, no rodapé e na 404). O favicon é o "A" da logo, em data URI (`src/components/marca/icone-site.ts`) e vale
  só para `/` e os experimentos; o painel continua com `src/app/icon.svg` e `SimboloA`. Para mexer na logo, gerar de novo o PNG
  a partir da arte original (fundo escuro vira transparência).
- Fundo animado do início (decisão do Gustavo, 18/nov/2026): ilustração do quarto (monitores com código) em vídeo, com desfoque
  leve (3,5px), camada escura chapada por cima (sem degradê) e poeira discreta. É a única exceção à regra "sem estética de código".
  Arquivos em `public/hero/` (`fundo.jpg` = imagem parada, `base.mp4` = digitando em loop, `acao.mp4` = espreguiçar, a cada
  22–38 s). `FundoAnimado.tsx` (client) desenha tudo num canvas, pausa fora da tela e não roda com `prefers-reduced-motion`
  ou "economia de dados" (fica só a imagem, que já está no CSS). `/hero/` e `/marca/` estão em `PREFIXOS_PUBLICOS` no `proxy.ts`
  (senão os arquivos cairiam na 404 para visitantes). Os vídeos são sem áudio e comprimidos (<500 KB no total).
- Abertura (18/nov/2026): a antiga (A que se encaixa + scanner) foi removida. A nova é um clipe de ~2,6 s feito no Flow
  (`public/hero/abertura.mp4`, ~120 KB, sem áudio: o original de 7,8 s foi cortado e acelerado 1,5x com ffmpeg), tocado por
  `Abertura.tsx` (client) numa camada fixa por cima da página, uma vez por sessão (`sessionStorage` `araujo:abertura`).
  O fundo do clipe é quase preto: `mix-blend-mode: lighten` sobre `#13111C` o iguala ao site (o fundo precisa estar no próprio
  `.pu-abertura-quadro`, porque o `transform` dele isola o grupo de mistura). O cursor "_" não veio no vídeo: é um `<span>`
  em CSS na posição medida no último quadro (89,3% / 58,75% do quadro 16:9). Pula direto com `prefers-reduced-motion`,
  "economia de dados", vídeo sem dados em 2 s ou erro ao tocar; clique/toque também pula. O servidor já manda a camada (não
  pisca o conteúdo) e, sem JavaScript, o CSS a tira sozinho em ~8,5 s. Se gerar outro clipe, remedir a posição do cursor.
  Fora isso, só transição de borda no hover dos cartões.
- Formulário não grava nada nem chama servidor: nome, tipo de negócio (select) e "O que você precisa?". O botão é um
  link `wa.me` (`target="_blank" rel="noopener"`) atualizado a cada tecla, com a mensagem
  "Olá! Meu nome é {nome}. Tenho {tipo} e gostaria de um orçamento de site. {texto}" (sem nome: começa só com "Olá!").
- Sites experimentais em `/experimentos/imobiliaria`, `/barbearia` e `/restaurante` (lista em `src/lib/experimentos.ts`):
  os cartões da home abrem cada um em nova aba. Código em `src/components/experimentos/` (um componente por site,
  `Comum.tsx` com a faixa "Experimento do araújo_" e a janela de aviso, `experimentos.css` preso à classe `.ex`).
  Cada site tem paleta e fontes próprias (`next/font/google`: Hanken Grotesk + Instrument Serif / Oswald / Fraunces).
  Tudo fictício e só no navegador: busca, agendamento e pedido funcionam, mas o botão de WhatsApp só mostra a mensagem
  que seria enviada (nada é mandado). Páginas com `noindex`. Endereços sempre "Rua Exemplo".
  Fundos animados (18/nov/2026): a imobiliária e a barbearia têm uma ilustração em vídeo no início (feita no Nano Banana e
  animada no Flow), desenhada por `FundoVideo.tsx` (client, mesmo esquema do hero: dois `<video>` do clipe base se revezando com
  fade de 0,5 s, clipe de ação opcional, pausa fora da tela, só a imagem com `prefers-reduced-motion`/economia de dados).
  Mídia em `public/experimentos/midia/` (`<demo>-base.mp4`, `<demo>-acao.mp4`, `<demo>.jpg` = imagem parada, que o CSS usa de
  fundo; `--pos` define o recorte). Imobiliária: loop + ação (as janelas acendem; o arquivo da ação já vem tocado para a frente
  e de volta, 7,8 s) e texto azul-marinho sobre o céu claro; a busca fica numa caixa de 520px para não cobrir a casa.
  Barbearia: só o loop, numa faixa no topo (`.barb-faixa`); serviços e agendamento ficam abaixo, sem vídeo atrás. No celular
  entra uma camada chapada por cima (sem degradê). Clipes sem áudio, 1280x720, <120 KB cada.
  Restaurante (Cantina): sem vídeo. A imagem parada (`cozinha.jpg`, no CSS `.rest-fundo`) ganha uma camada leve de SVG em
  `CozinhaAnimada.tsx` (vapor, sopro maior de vez em quando, folhas de manjericão e a luz da janela respirando), só CSS
  (transform/opacity) e parada com `prefers-reduced-motion`. As coordenadas seguem a imagem (viewBox 2576x1438,
  `xMaxYMid slice` = recorte `right center`): se trocar a imagem, refazer as posições.

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
