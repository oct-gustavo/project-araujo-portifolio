# Checagem de site — o que dá para encontrar

Referência do botão **"checar site"** do cadastro de lead. A análise olha só a **página pública**,
do mesmo jeito que o navegador de qualquer visitante: uma visita à página inicial, a leitura da
resposta do servidor e, no máximo, os arquivos públicos `robots.txt` e `sitemap.xml`.

O resultado fica salvo no lead e vira argumento de venda: você chega na conversa com problemas
concretos e uma frase simples para explicar cada um.

---

## Regra de ouro

**Só observar, nunca sondar.** O sistema não tenta entrar em áreas restritas, não testa senhas,
não envia formulários, não procura páginas escondidas, não varre portas e não tenta injetar nada.
Esse tipo de teste só pode ser feito em sites **seus** (ou com autorização por escrito do dono).

---

## Como ler a tabela

- **Gravidade**: o quanto o problema pesa para o negócio do cliente.
  - **Alta**: perde cliente hoje (site fora do ar, aviso de "não seguro", quebrado no celular).
  - **Média**: atrapalha a imagem ou o Google.
  - **Baixa**: detalhe técnico; bom para mostrar cuidado, mas não é o argumento principal.
- **Como o sistema vê**: de onde vem a informação (sempre algo público).
- **Como explicar ao cliente**: frase pronta, sem termo técnico.

---

## 1. O site abre?

| Problema | Gravidade | Como o sistema vê | Como explicar ao cliente |
|---|---|---|---|
| Site fora do ar (erro 500, 502, 503) | Alta | Código de resposta do servidor | "Hoje quem clica no seu site no Google cai numa página de erro." |
| Página não encontrada (404) no endereço do Maps | Alta | Código 404 na página inicial | "O link do seu perfil no Google leva para uma página que não existe." |
| Domínio não existe mais / não responde | Alta | Falha ao localizar o endereço ou tempo esgotado | "O endereço do site parou de funcionar; o cliente não encontra nada." |
| Domínio à venda ou página padrão da hospedagem | Alta | Texto típico de "domínio à venda", "site em construção", "It works!" | "O site mostra uma página da hospedagem, não da sua empresa." |
| Demora muito para responder (> 3 s) | Média | Tempo até o primeiro dado chegar | "O site demora para abrir; muita gente desiste antes de carregar." |
| Muitos redirecionamentos seguidos | Baixa | Contagem de redirecionamentos até a página final | "O site passa por vários endereços antes de abrir, o que deixa tudo mais lento." |

## 2. Segurança visível

Tudo aqui aparece na própria resposta pública do site. Nada é testado à força.

| Problema | Gravidade | Como o sistema vê | Como explicar ao cliente |
|---|---|---|---|
| Sem HTTPS (sem cadeado) | Alta | O site só responde em `http://` | "O navegador mostra **'Não seguro'** ao lado do seu endereço; isso espanta cliente." |
| HTTP não leva para HTTPS | Média | Visita em `http://` não redireciona para `https://` | "Quem digita o endereço sem o 's' cai na versão sem cadeado." |
| Certificado vencido | Alta | Data de validade do certificado | "O navegador mostra uma tela vermelha de alerta antes de abrir o site." |
| Certificado vence em menos de 15 dias | Média | Data de validade do certificado | "Daqui a poucos dias o site vai começar a mostrar alerta de segurança." |
| Certificado com nome errado | Alta | Domínio do certificado ≠ endereço do site | "O navegador avisa que o site pode ser falso." |
| Conteúdo misto (imagens/scripts em `http` dentro de página `https`) | Média | Endereços `http://` no código da página | "Parte do site carrega sem proteção, e o cadeado some ou fica com aviso." |
| Formulário enviando para `http` | Alta | Atributo `action` do formulário aponta para `http://` | "O que o cliente digita no formulário viaja sem proteção." |
| Falta HSTS | Baixa | Cabeçalho `Strict-Transport-Security` ausente | "Falta uma configuração que obriga o navegador a sempre usar a versão segura." |
| Falta proteção contra o site ser embutido em outro (clickjacking) | Baixa | Sem `X-Frame-Options` nem `frame-ancestors` | "Outro site poderia exibir o seu por dentro dele, para enganar visitantes." |
| Falta CSP | Baixa | Cabeçalho `Content-Security-Policy` ausente | "Falta uma camada de proteção contra códigos maliciosos." |
| Falta `X-Content-Type-Options` | Baixa | Cabeçalho ausente | Detalhe técnico — usar só como reforço. |
| Versão do servidor ou da plataforma exposta | Média | Cabeçalhos `Server` / `X-Powered-By` ou a tag `generator` no código (ex.: "WordPress 5.2") | "O site mostra para qualquer um qual sistema usa e em que versão, o que ajuda quem quer atacar." |
| Plataforma/biblioteca visivelmente antiga | Média | Versões citadas no próprio código da página (ex.: jQuery 1.x, WordPress muito antigo) | "O site usa peças antigas que não recebem mais atualização de segurança." |
| Cookies sem proteção | Baixa | Cabeçalho `Set-Cookie` sem `Secure` / `HttpOnly` / `SameSite` | Detalhe técnico — usar só como reforço. |

> Observação: o sistema **não confirma** se uma versão antiga tem falha explorável. Ele só aponta o
> que está visível. A frase certa é "está desatualizado", nunca "seu site foi/pode ser invadido".

## 3. Celular

| Problema | Gravidade | Como o sistema vê | Como explicar ao cliente |
|---|---|---|---|
| Não se adapta ao celular | Alta | Falta a tag `viewport` no código | "No celular o site aparece minúsculo; o cliente precisa dar zoom para ler." |
| Botões e links muito pequenos | Média | Análise de celular do PageSpeed (nível 2) | "No celular é difícil acertar os botões com o dedo." |
| Texto pequeno demais no celular | Média | Análise de celular do PageSpeed (nível 2) | "As letras ficam pequenas demais na tela do celular." |
| Conteúdo mais largo que a tela | Média | Análise de celular do PageSpeed (nível 2) | "No celular a página 'escorrega' para os lados." |

## 4. Velocidade

| Problema | Gravidade | Como o sistema vê | Como explicar ao cliente |
|---|---|---|---|
| Página muito pesada (> 3 MB) | Média | Tamanho somado da página | "O site gasta muito do plano de dados de quem abre pelo celular." |
| Nota de desempenho baixa (< 50) no celular | Alta | PageSpeed (nível 2) | "No teste do próprio Google, seu site tira nota X de 100 no celular." |
| Imagens enormes / sem compressão | Média | PageSpeed (nível 2) | "As fotos estão pesadas demais e deixam o site lento." |
| Conteúdo principal demora a aparecer (LCP > 4 s) | Média | PageSpeed (nível 2) | "O cliente fica olhando uma tela vazia por alguns segundos." |
| Layout "pulando" enquanto carrega (CLS alto) | Baixa | PageSpeed (nível 2) | "A página se mexe enquanto carrega e o cliente clica no lugar errado." |

## 5. Google (SEO básico)

| Problema | Gravidade | Como o sistema vê | Como explicar ao cliente |
|---|---|---|---|
| Página bloqueada para o Google (`noindex`) | Alta | Tag `robots` com `noindex` ou `robots.txt` bloqueando tudo | "O site está configurado para **não aparecer** no Google." |
| Sem título ou título genérico ("Home", "Início") | Média | Tag `<title>` | "No Google o seu site aparece só como 'Home', sem o nome da empresa." |
| Sem descrição | Média | Tag `meta description` | "O Google mostra um texto aleatório embaixo do seu link." |
| Sem título principal (H1) ou com vários | Baixa | Tags `<h1>` | Detalhe técnico — usar só como reforço. |
| Imagens sem descrição (`alt`) | Baixa | Atributo `alt` vazio | "O Google não entende as fotos do site." |
| Sem prévia para WhatsApp/Instagram | Média | Tags Open Graph (`og:title`, `og:image`) | "Quando alguém manda o link do seu site no WhatsApp, não aparece foto nem título." |
| Sem `sitemap.xml` | Baixa | Arquivo público inexistente | Detalhe técnico — usar só como reforço. |
| Sem ícone na aba (favicon) | Baixa | Ícone ausente | "Na aba do navegador aparece um ícone em branco no lugar da sua marca." |

## 6. Acessibilidade

| Problema | Gravidade | Como o sistema vê | Como explicar ao cliente |
|---|---|---|---|
| Texto com pouco contraste | Média | PageSpeed (nível 2) | "Algumas partes são difíceis de ler, principalmente no sol ou para quem enxerga pouco." |
| Campos de formulário sem nome | Baixa | Campos sem `label` | "Leitores de tela não conseguem dizer o que cada campo pede." |
| Idioma da página não definido | Baixa | Atributo `lang` ausente | Detalhe técnico — usar só como reforço. |

## 7. Contato e venda (o que mais pesa para o dono)

| Problema | Gravidade | Como o sistema vê | Como explicar ao cliente |
|---|---|---|---|
| Sem botão de WhatsApp | Alta | Nenhum link `wa.me` / `api.whatsapp.com` na página | "Quem entra no site não tem um jeito rápido de te chamar no WhatsApp." |
| Telefone que não é clicável | Média | Telefone escrito sem link `tel:` | "No celular, o cliente precisa copiar o número na mão para ligar." |
| Sem endereço ou mapa | Média | Nenhum endereço / link do Maps na página | "O cliente não descobre onde fica a empresa pelo site." |
| Links quebrados na página inicial | Média | Até 20 links internos da página inicial testados uma vez cada | "Alguns botões do site levam para páginas que não existem." |
| Rodapé com ano antigo (ex.: © 2019) | Baixa | Ano no rodapé | "O site passa a impressão de abandonado." |
| Link para redes sociais quebrado | Baixa | Links de Instagram/Facebook que não abrem | "O botão do Instagram no site não funciona." |

---

## Os dois níveis da checagem

**Nível 1 — servidor do próprio sistema (sempre, custo zero).**
Uma visita à página inicial e leitura da resposta: seções 1, 2, 3 (viewport), 5 (exceto notas),
6 (campos e idioma) e 7. Leva poucos segundos.

**Nível 2 — PageSpeed Insights (opcional, gratuito).**
É a API pública do Google que roda o Lighthouse (o mesmo da aba do Chrome) e devolve notas de
desempenho, celular, acessibilidade e SEO. Não exige conta paga nem cartão; o limite gratuito é
de 25 mil consultas por dia, muito acima do nosso uso. Ativamos só se você quiser.

## Limites (para não prometer o que não dá)

- É um **retrato do momento**: o site pode mudar depois.
- Alguns sites bloqueiam visitas automáticas; nesse caso o resultado diz "não foi possível analisar".
- Sites montados inteiramente por JavaScript podem mostrar menos coisas no nível 1 (o nível 2 cobre).
- A análise aponta sinais visíveis; **não** garante que o site tem ou não tem falha de segurança.

## O que fica de fora (só nos seus sites)

Testes que **sondam** o site — tentar logins, procurar páginas escondidas, testar formulários com
dados maliciosos, varrer portas, ferramentas como OWASP ZAP em modo ativo. Isso só em sites seus
ou com autorização por escrito do dono.
