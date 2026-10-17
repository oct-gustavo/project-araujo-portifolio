import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { SimboloA } from '@/components/marca/Logo'
import { MockClinica, MockRestaurante } from '@/components/site/Mockups'
import { AssistenteConversa } from '@/components/site/AssistenteConversa'
import { caminhoProjeto, projeto, proximoProjeto } from '@/lib/projetos'
import { FICHAS, type Amostra, type Ficha } from './fichas'
import '../caso/caso.css'
import './detalhes.css'

/* ---------------------------------------------------- vitrine de cada conceito */

function VitrineLumen() {
  return (
    <div className="fd-site fd-lu">
      <div className="fd-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="fd-nav">
        <b className="fd-serif">Lumen</b>
        <span className="fd-pill">Agendar avaliação</span>
      </div>
      <div className="fd-in">
        <div>
          <p className="fd-h fd-serif">
            Seu sorriso, <em>no seu tempo.</em>
          </p>
          <p className="fd-p">Atendimento sem pressa, explicado do começo ao fim — para você chegar tranquilo.</p>
          <div className="fd-btns">
            <span className="fd-pill">Agendar avaliação</span>
            <span className="fd-pill o">Ver tratamentos</span>
          </div>
        </div>
        <div className="fd-lu-arco">
          <span>Seg a sex · 8h às 19h</span>
        </div>
      </div>
    </div>
  )
}

function VitrineNorte() {
  return (
    <div className="fd-site fd-an">
      <div className="fd-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="fd-nav">
        <b className="fd-an-logo">NORTE</b>
        <span className="fd-an-links">
          Obras <i /> Como trabalhamos <i /> Contato
        </span>
      </div>
      <div className="fd-an-capa">
        <i />
        <b />
        <span>Casa Pátio · 2025</span>
      </div>
      <div className="fd-an-linha">
        <p className="fd-h fd-serif">
          Espaços que <em>respiram.</em>
        </p>
        <p className="fd-p">Arquitetura residencial e interiores, a partir da luz, do silêncio e da rotina de quem vai morar.</p>
      </div>
    </div>
  )
}

function VitrineAlba() {
  return (
    <div className="fd-site fd-ca">
      <div className="fd-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="fd-nav">
        <b className="fd-serif fd-it">Casa Alba</b>
        <span className="fd-pill">Reservar mesa</span>
      </div>
      <div className="fd-in">
        <div>
          <span className="fd-ca-selo">
            <i /> Aberto agora · até 23h
          </span>
          <p className="fd-h fd-serif">
            Sabores da <em>estação.</em>
          </p>
          <p className="fd-p">Cozinha de produtos locais, com um cardápio que muda conforme o que a feira oferece.</p>
          <div className="fd-btns">
            <span className="fd-pill">Reservar mesa</span>
            <span className="fd-pill o">Ver cardápio</span>
          </div>
        </div>
        <div className="fd-ca-prato" />
      </div>
    </div>
  )
}

const VITRINES: Record<Ficha['slug'], { tela: ReactNode; celular?: ReactNode }> = {
  'clinica-lumen': { tela: <VitrineLumen />, celular: <MockClinica withRows /> },
  'atelie-norte': { tela: <VitrineNorte /> },
  'casa-alba': { tela: <VitrineAlba />, celular: <MockRestaurante /> },
}

/* ------------------------------------------------------------------ amostras */

function AmostraEstilo({ tipo }: { tipo: Amostra }) {
  switch (tipo) {
    case 'formas':
      return (
        <>
          <span className="fa-c" />
          <span className="fa-q" />
          <span className="fa-a" />
        </>
      )
    case 'botoes':
      return (
        <>
          <span className="fa-btn">Principal</span>
          <span className="fa-btn o">Secundário</span>
        </>
      )
    case 'alvos':
      return (
        <span className="fa-alvos">
          <i />
          <i className="on" />
          <i />
        </span>
      )
    case 'movimento':
      return <span className="fa-mov" />
    case 'linhas':
      return (
        <span className="fa-linhas">
          <i />
          <i />
          <i />
        </span>
      )
    case 'imagem':
      return (
        <span className="fa-grade">
          <i />
          <i />
          <i />
        </span>
      )
    case 'selo':
      return (
        <span className="fa-selo">
          <i /> Aberto agora
        </span>
      )
    case 'barra':
      return (
        <span className="fa-barra">
          <i className="on" />
          <i />
          <i />
        </span>
      )
  }
}

const ICONES: Record<Ficha['cuidados'][number]['icone'], ReactNode> = {
  contraste: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 7a5 5 0 0 1 0 10" fill="currentColor" />
    </>
  ),
  celular: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  teclado: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" />
    </>
  ),
  movimento: <path d="M4 12h10M10 6l6 6-6 6M20 6v12" />,
  busca: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </>
  ),
  velocidade: (
    <>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l4-5" />
    </>
  ),
}

/* -------------------------------------------------------------------- página */

/** Página "detalhes do projeto" de um conceito: ideia, decisões, cores, fontes e estilo. */
export function DetalhesConceito({ slug }: { slug: Ficha['slug'] }) {
  const f = FICHAS[slug]
  const p = projeto(slug)
  const prox = proximoProjeto(slug)
  const vitrine = VITRINES[slug]
  const tema = {
    '--fd-fundo': f.tema.fundo,
    '--fd-tinta': f.tema.tinta,
    '--fd-acao': f.tema.acao,
    '--fd-acao-tinta': f.tema.acaoTinta,
    '--fd-suave': f.tema.suave,
    '--fd-linha': f.tema.linha,
    '--fd-raio': f.tema.raio,
    '--fd-raio-btn': f.tema.raioBotao,
  } as CSSProperties

  return (
    <div className="site fd" id="top" style={tema}>
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
        <section className="cs-top" aria-labelledby="fd-titulo">
          <div className="cs-top-bg" />
          <div className="wrap">
            <p className="eyebrow">
              Conceito {f.numero} · {p.segmento} ·{' '}
              <span style={{ color: 'var(--violet-soft)' }}>Detalhes do projeto</span>
            </p>
            <h1 className="cs-title" id="fd-titulo">
              {p.nome}
            </h1>
            <p className="cs-lead">{f.lead}</p>
            <div className="cs-actions">
              <Link className="btn btn-primary" href={caminhoProjeto(slug)}>
                Ver o conceito com tour <span className="arr">→</span>
              </Link>
            </div>
            <dl className="cs-meta">
              {f.meta.map((m) => (
                <div key={m.rotulo}>
                  <dt>{m.rotulo}</dt>
                  <dd>{m.valor}</dd>
                </div>
              ))}
            </dl>

            <div className={vitrine.celular ? 'fd-hero' : 'fd-hero so-tela'} aria-hidden="true">
              {vitrine.tela}
              {vitrine.celular && <div className="fd-hero-cel">{vitrine.celular}</div>}
            </div>
          </div>
        </section>

        <section className="cs-section" aria-labelledby="fd-ideia">
          <div className="wrap cs-challenge">
            <h2 className="cs-label" id="fd-ideia">
              A ideia
            </h2>
            <div>
              <p className="cs-statement">
                {f.ideia.frase} <em className="it">{f.ideia.destaque}</em>
              </p>
              <p className="cs-text">{f.ideia.texto}</p>
              <p className="fd-aviso">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v.5M12 11v5" />
                </svg>
                <span>
                  <b>Este é um conceito.</b> A {p.nome} não é um cliente real: é uma proposta para mostrar como eu pensaria
                  um site para esse tipo de negócio.
                </span>
              </p>
            </div>
          </div>

          <div className="wrap">
            <h2 className="cs-label fd-mt">Decisões de design</h2>
            <ol className="fd-dec">
              {f.decisoes.map((d, i) => (
                <li key={d.titulo} className="rv">
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{d.titulo}</h3>
                  <p>{d.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="cs-section cs-paper paper-in" aria-labelledby="fd-cores">
          <div className="wrap">
            <p className="cs-label">Cores</p>
            <h2 className="h2" id="fd-cores" style={{ marginTop: 22 }}>
              {f.cores.titulo} <em className="it">{f.cores.destaque}</em>
            </h2>
            <p className="cs-text">{f.cores.texto}</p>
            <ul className="fd-cores">
              {f.cores.lista.map((c) => (
                <li key={c.hex} className="fd-cor">
                  <i style={{ background: c.hex }} aria-hidden="true" />
                  <div>
                    <b>{c.nome}</b>
                    <code>{c.hex}</code>
                    <small>{c.uso}</small>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="cs-label fd-mt">Tipografia</h2>
            <div className="fd-tipos">
              {f.fontes.map((t) => (
                <div className="fd-tipo" key={t.nome}>
                  <div className="fd-tipo-top">
                    <b>{t.nome}</b>
                    <span>{t.papel}</span>
                  </div>
                  <span className={`fd-tipo-aa fd-${t.familia}${t.italico ? ' fd-it' : ''}`} aria-hidden="true">
                    Aa
                  </span>
                  <p className={`fd-tipo-ex fd-${t.familia}${t.italico ? ' fd-it' : ''}${t.familia === 'serif' ? ' g' : ''}`}>
                    {t.exemplo}
                  </p>
                  <p className="fd-porque">
                    <b>Por quê</b>
                    {t.porque}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="cs-label fd-mt">Estilo</h2>
            <ul className="fd-estilo">
              {f.estilo.map((e) => (
                <li className="fd-est" key={e.titulo}>
                  <div className="fd-amostra" aria-hidden="true">
                    <AmostraEstilo tipo={e.amostra} />
                  </div>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cs-section" aria-labelledby="fd-todos">
          <div className="wrap">
            <p className="cs-label">Pensado para todos</p>
            <h2 className="h2" id="fd-todos" style={{ marginTop: 22 }}>
              O que não aparece, <em className="it">mas faz diferença.</em>
            </h2>
            <div className="cs-sec">
              {f.cuidados.map((c) => (
                <div className="cs-sec-item rv" key={c.titulo}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    {ICONES[c.icone]}
                  </svg>
                  <h3>{c.titulo}</h3>
                  <p>{c.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
      <AssistenteConversa origem={`${p.nome} (conceito)`} />
    </div>
  )
}
