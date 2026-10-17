import Link from 'next/link'
import { SimboloA } from '@/components/marca/Logo'
import { MockAdmin, MockCorretora } from '@/components/site/Mockups'
import { caminhoProjeto, projeto, proximoProjeto } from '@/lib/projetos'
import { AssistenteConversa } from '@/components/site/AssistenteConversa'
import './caso.css'

function MockImovel() {
  return (
    <div className="phone">
      <div className="screen">
        <div className="m-det">
          <div className="md-top">
            <i />
            <b />
          </div>
          <div className="md-gal">
            <span />
            <span />
            <span />
          </div>
          <div className="md-body">
            <span className="md-badge" />
            <div className="md-h" />
            <div className="md-l" />
            <div className="md-specs">
              <i />
              <i />
              <i />
            </div>
            <div className="md-form">
              <div className="md-in" />
              <div className="md-in" />
              <div className="md-in" />
              <div className="md-btn" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockCatalogo() {
  return (
    <div className="browser">
      <div className="browser-bar">
        <i />
        <i />
        <i />
        <b />
      </div>
      <div className="m-cor">
        <div className="mc-cards" style={{ paddingTop: '4cqw' }}>
          {['', 'b', 'c', 'c', '', 'b'].map((v, i) => (
            <div className="mc-card" key={i}>
              <div className={`mc-img ${v}`} />
              <div className="mc-l" />
              <div className="mc-l s" />
              <div className="mc-p" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const RECURSOS = [
  {
    titulo: 'Um catálogo que o cliente navega sozinho',
    texto:
      'Os imóveis à venda reunidos em uma vitrine com a cara da corretora: azul-noite, detalhes em champanhe e uma onda calma no topo.',
    pontos: [],
    visual: (
      <div className="w70">
        <MockCatalogo />
      </div>
    ),
  },
  {
    titulo: 'Cada imóvel com a sua própria página',
    texto: 'Galeria em mosaico que abre em tela cheia, informações organizadas e o contato sempre à mão, ao lado das fotos.',
    pontos: [
      'Fotos navegáveis pelo teclado e pelo toque no celular',
      'Imóvel reservado ou vendido avisa na hora — e sugere outros parecidos',
    ],
    claro: true,
    visual: (
      <div className="w30">
        <MockImovel />
      </div>
    ),
  },
  {
    titulo: 'O interesse chega pronto no WhatsApp',
    texto:
      'O cliente deixa nome, telefone e quando pretende comprar. A mensagem já sai com o imóvel escolhido — e cada contato fica registrado no painel.',
    pontos: [],
    visual: (
      <div style={{ width: '58%' }}>
        <div className="m-chat">
          <div className="mch-top">
            <i />
            <b />
          </div>
          <div className="mch-msg">
            <p>Olá, Patrícia! Tenho interesse neste imóvel:</p>
            <p>
              <strong>[Imóvel] · [Bairro], [Cidade]</strong>
            </p>
            <p>
              Nome: [Cliente]
              <br />
              Quando: nos próximos 3 meses
            </p>
            <span className="mch-time">agora</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    titulo: 'Um painel que só a corretora acessa',
    texto: 'Ela cadastra imóveis, organiza as fotos e decide o que aparece no site — sem depender de ninguém.',
    pontos: [
      'Endereço preenchido sozinho a partir do CEP',
      'Fotos comprimidas no próprio navegador antes de subir',
      'Confirmação antes de excluir, para evitar cliques errados',
    ],
    visual: (
      <div className="w70">
        <MockAdmin />
      </div>
    ),
  },
]

const CUIDADOS = [
  {
    titulo: 'Endereço protegido',
    texto: 'O site público mostra só bairro e cidade. O endereço completo fica apenas no painel da corretora.',
    icone: (
      <>
        <path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    titulo: 'Acesso em duas etapas',
    texto: 'O painel pede senha exclusiva e um código do celular. Depois de 3 tentativas erradas, o acesso é bloqueado por um tempo.',
    icone: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="1" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    titulo: 'Feito para todos',
    texto: 'Funciona bem no celular, pelo teclado e com leitores de tela — e respeita quem prefere menos animação.',
    icone: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.5l2.3 2.3 4.7-5" />
      </>
    ),
  },
]

export function CasoPatricia() {
  const p = projeto('patricia-rezende')
  const prox = proximoProjeto(p.slug)

  return (
    <div className="site" id="top">
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="cs-nav">
        <div className="wrap cs-nav-in">
          <Link className="brand" href="/" aria-label="Araújo — início">
            <SimboloA tamanho={30} corA="#ECEDF4" corCursor="#B9A3F0" />
            <span className="brand-name">Araújo</span>
          </Link>
          <Link className="cs-back" href="/#projetos">
            <span className="arr" aria-hidden="true">
              ←
            </span>{' '}
            Todos os projetos
          </Link>
          <Link className="btn btn-ghost nav-cta" href="/#contato">
            Vamos conversar <span className="arr">→</span>
          </Link>
        </div>
      </header>

      <main id="conteudo">
        <section className="cs-top" aria-labelledby="cs-titulo">
          <div className="cs-top-bg" />
          <div className="wrap">
            <p className="eyebrow">
              Case 01 · {p.area} · <span style={{ color: 'var(--violet-soft)' }}>Projeto real</span>
            </p>
            <h1 className="cs-title" id="cs-titulo">
              {p.nome}
            </h1>
            <p className="cs-lead">
              Um catálogo próprio para uma corretora parar de reenviar fotos a cada atendimento — e um painel só dela para
              publicar os imóveis que capta.
            </p>
            {p.siteNoAr ? (
              <div className="cs-actions">
                <a className="btn btn-primary" href={p.siteNoAr} target="_blank" rel="noopener noreferrer">
                  Ver o site no ar <span className="arr">↗</span>
                </a>
              </div>
            ) : null}
            <dl className="cs-meta">
              <div>
                <dt>Cliente</dt>
                <dd>{p.nome}, corretora de imóveis</dd>
              </div>
              <div>
                <dt>Entrega</dt>
                <dd>Site, catálogo e painel administrativo</dd>
              </div>
              {p.ano ? (
                <div>
                  <dt>Ano</dt>
                  <dd>{p.ano}</dd>
                </div>
              ) : null}
              <div>
                <dt>Por trás</dt>
                <dd>Next.js · Supabase · Vercel</dd>
              </div>
            </dl>

            <div className="cs-hero" aria-hidden="true">
              <div className="grain" />
              <div className="cs-h-browser">
                <MockCorretora />
              </div>
              <div className="cs-h-admin">
                <MockAdmin />
              </div>
              <div className="cs-h-phone">
                <MockImovel />
              </div>
            </div>
          </div>
        </section>

        <section className="cs-section" aria-labelledby="cs-desafio">
          <div className="wrap cs-challenge rv">
            <h2 className="cs-label" id="cs-desafio">
              O desafio
            </h2>
            <div>
              <p className="cs-statement">
                A cada atendimento, a mesma rotina: reenviar fotos, repetir informações e{' '}
                <em className="it">recomeçar a conversa do zero.</em>
              </p>
              <p className="cs-text">
                A Patrícia capta imóveis e atende os clientes pelo WhatsApp. Sem um lugar próprio para mostrar o que tem à
                venda, cada negociação dependia de mandar as fotos de novo. Ela precisava de uma vitrine que o cliente
                navegasse sozinho — e que só ela pudesse atualizar.
              </p>
            </div>
          </div>

          <div className="wrap cs-features">
            <h2 className="cs-label" style={{ marginBottom: 8 }}>
              O que foi construído
            </h2>
            {RECURSOS.map((r, i) => (
              <article className={`cs-feature${i % 2 ? ' rev' : ''}`} key={r.titulo}>
                <div className="rv">
                  <span className="cs-fnum" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="cs-ftitle">{r.titulo}</h3>
                  <p className="cs-ftext">{r.texto}</p>
                  {r.pontos.length > 0 && (
                    <ul className="cs-points">
                      {r.pontos.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={`cs-fvis rv-mask${r.claro ? ' light' : ''}`} aria-hidden="true">
                  {r.visual}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cs-section cs-paper paper-in" aria-labelledby="cs-ident">
          <div className="wrap">
            <p className="cs-label">Identidade visual</p>
            <h2 className="h2" id="cs-ident" style={{ marginTop: 22 }}>
              Séria, moderna e <em className="it">calma como o mar.</em>
            </h2>
            <p className="cs-text">
              Cores sólidas, sem degradês entre elas, e uma onda animada no topo da página que dá movimento sem pressa.
            </p>
            <div className="cs-id">
              <div className="cs-swatches">
                <div className="cs-sw" style={{ background: '#0F2B51', color: '#fff' }}>
                  <b>Azul-noite</b>
                  <span>#0F2B51</span>
                </div>
                <div className="cs-sw" style={{ background: '#232A38', color: '#fff' }}>
                  <b>Grafite</b>
                  <span>#232A38</span>
                </div>
                <div className="cs-sw" style={{ background: '#D9C08E', color: '#0F2B51' }}>
                  <b>Champanhe</b>
                  <span>#D9C08E</span>
                </div>
              </div>
              <div className="cs-type">
                <span className="cs-type-aa" aria-hidden="true">
                  Aa
                </span>
                <p className="cs-type-body">
                  Títulos em Poppins, textos em Source Sans 3: leitura confortável para quem está escolhendo um imóvel com
                  calma.
                </p>
                <div className="cs-type-row">
                  <span>
                    <b>Poppins</b> · títulos
                  </span>
                  <span>
                    <b>Source Sans 3</b> · textos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cs-section" aria-labelledby="cs-seg">
          <div className="wrap">
            <p className="cs-label">Cuidados invisíveis</p>
            <h2 className="h2" id="cs-seg" style={{ marginTop: 22 }}>
              O que o cliente não vê, <em className="it">mas faz diferença.</em>
            </h2>
            <div className="cs-sec">
              {CUIDADOS.map((c) => (
                <div className="cs-sec-item rv" key={c.titulo}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    {c.icone}
                  </svg>
                  <h3>{c.titulo}</h3>
                  <p>{c.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimento: descomente quando tiver uma frase da Patrícia (com autorização dela).
        <section className="cs-section" style={{ paddingTop: 0 }} aria-label="Depoimento">
          <div className="wrap">
            <figure className="cs-quote">
              <span className="cs-quote-mark" aria-hidden="true">“</span>
              <blockquote>…</blockquote>
              <figcaption>Patrícia Rezende · corretora de imóveis</figcaption>
            </figure>
          </div>
        </section>
        */}

        <section aria-label="Continuar">
          <div className="wrap">
            <Link className="cs-next" href={caminhoProjeto(prox.slug)}>
              <span>
                <small>Próximo projeto</small>
                <strong>{prox.nome}</strong>
                <em>
                  {prox.segmento} · {prox.real ? 'projeto real' : 'conceito com tour guiado'}
                </em>
              </span>
              <span className="arr" aria-hidden="true">
                →
              </span>
            </Link>
            <div className="cs-cta">
              <p>
                Quer algo assim para o <em className="it">seu negócio?</em>
              </p>
              <Link className="btn btn-primary" href="/#contato">
                Vamos conversar <span className="arr">→</span>
              </Link>
            </div>
            <div className="cs-foot">
              <span>© {new Date().getFullYear()} Gustavo Araújo</span>
              <a href="#top">Voltar ao topo ↑</a>
            </div>
          </div>
        </section>
      </main>
      <AssistenteConversa origem="Patrícia Rezende" />
    </div>
  )
}
