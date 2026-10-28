import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { caminhoProjeto } from '@/lib/projetos'
import { SimboloA } from '@/components/marca/Logo'
import {
  MockAdmin,
  MockArquitetura,
  MockCardapio,
  MockClinica,
  MockCorretora,
  MockRestaurante,
} from './Mockups'
import { FormularioContato } from './FormularioContato'
import { PORTFOLIO, ehPlaceholder, linkWhatsapp } from '@/lib/portfolio'

/** atraso de animação via custom property */
const d = (s: string) => ({ '--d': s }) as CSSProperties

/* ------------------------------------------------------------------ HERO */
const SEGMENTS = [
  'Imobiliárias',
  'Clínicas',
  'Escritórios de advocacia',
  'Arquitetura',
  'Restaurantes',
  'Profissionais liberais',
  'Comércio local',
  'Estúdios & ateliês',
]

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" />
      <div className="grain" />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow fade" style={d('.1s')}>
              <span>
                <span className="eyebrow-long">{PORTFOLIO.nome} · </span>Design &amp; sites sob medida
              </span>
            </p>
            <h1 className="h-display" id="hero-title">
              <span className="line">
                <span style={d('.2s')}>Seu negócio merece</span>
              </span>
              <span className="line">
                <span style={d('.32s')}>uma presença</span>
              </span>
              <span className="line">
                <span style={d('.44s')}>
                  digital <em className="it">à altura.</em>
                </span>
              </span>
            </h1>
            <p className="hero-lead fade" style={d('.8s')}>
              Desenho e construo sites e experiências digitais personalizadas — modernas, elegantes e
              pensadas a partir do que torna o seu negócio único.
            </p>
            <div className="hero-ctas fade" style={d('1s')}>
              <a className="btn btn-primary" href="#contato">
                Vamos conversar <span className="arr">→</span>
              </a>
              <a className="ulink" href="#projetos">
                Ver projetos <span className="arr">↓</span>
              </a>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="par" style={{ position: 'absolute', inset: 0 }}>
              <div className="arch-line" />
              <span className="arch-dot" />
              <div className="arch" />
            </div>
            <div className="float-a">
              <div className="par s2">
                <div className="fade" style={d('.9s')}>
                  <div className="bob">
                    <MockCorretora />
                  </div>
                </div>
              </div>
            </div>
            <div className="float-b">
              <div className="par">
                <div className="fade" style={d('1.15s')}>
                  <div className="bob slow">
                    <MockClinica />
                  </div>
                </div>
              </div>
            </div>
            <p className="fig fade" style={d('1.4s')}>
              <span>Fig. 01</span>
              <b>Imobiliário &amp; saúde</b>
            </p>
          </div>
        </div>
      </div>

      <div className="marquee fade" style={d('1.3s')}>
        <span className="marquee-label">Para negócios como</span>
        <div className="marquee-view">
          <div className="marquee-track">
            {SEGMENTS.map((s) => (
              <span key={s}>{s}</span>
            ))}
            {SEGMENTS.map((s) => (
              <span key={`${s}-2`} aria-hidden="true">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- SOBRE */
const PILLARS = [
  ['Estratégia', 'Antes da forma, o porquê.'],
  ['Design', 'Uma identidade com intenção.'],
  ['Experiência', 'Navegação que conduz sem esforço.'],
  ['Personalização', 'Feito para você, nunca de prateleira.'],
  ['Performance', 'Rápido e leve em qualquer tela.'],
]

export function Sobre() {
  return (
    <section className="section" id="sobre" aria-labelledby="sobre-title">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-media rv">
            <div className="portrait-wrap">
              <div className="portrait">
                <Image
                  className="portrait-img"
                  src="/fotos/gustavo.jpg"
                  alt={`Retrato de ${PORTFOLIO.nome}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 460px"
                />
              </div>
            </div>
          </div>
          <div className="rv">
            <p className="eyebrow">Quem está por trás</p>
            <h2 className="about-statement" id="sobre-title">
              Cada projeto começa com uma conversa — <em className="it">não com um modelo pronto.</em>
            </h2>
            <p className="about-text">
              Sou {PORTFOLIO.nome}. Desenho e desenvolvo sites para empresas e profissionais que querem ser
              lembrados. Meu objetivo não é simplesmente entregar um site, e sim construir uma presença
              digital que faça sentido para o seu negócio, para o seu público e para onde você quer chegar.
            </p>
            <p className="about-sign">{PORTFOLIO.nome}</p>
          </div>
        </div>

        <ul className="pillars rv">
          {PILLARS.map(([w, t], i) => (
            <li className="pillar" key={w}>
              <small>{String(i + 1).padStart(2, '0')}</small>
              <span className="pillar-w">{w}</span>
              <p>{t}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- PORTFÓLIO */
type CaseMeta = {
  idx: string
  area: string
  real?: boolean
  name: string
  segment: string
  desc: string
  tags: string[]
  /** página do projeto em /projetos/[slug] */
  slug: string
}

const CASES: CaseMeta[] = [
  {
    idx: '01',
    area: 'Imobiliário',
    real: true,
    name: 'Patrícia Rezende',
    segment: 'Corretora de imóveis',
    desc: 'Um catálogo próprio, com painel exclusivo para a corretora publicar os imóveis que capta — e uma vitrine elegante para o cliente navegar sem depender de fotos pelo WhatsApp.',
    tags: ['Catálogo de imóveis', 'Painel exclusivo', 'Contato via WhatsApp'],
    slug: 'patricia-rezende',
  },
  {
    idx: '02',
    area: 'Saúde',
    name: 'Clínica Lumen',
    segment: 'Odontologia',
    desc: 'Uma presença calma e acolhedora, pensada para transmitir confiança antes mesmo da primeira consulta.',
    tags: ['Agendamento', 'Feito para o celular'],
    slug: 'clinica-lumen',
  },
  {
    idx: '03',
    area: 'Arquitetura',
    name: 'Ateliê Norte',
    segment: 'Arquitetura & interiores',
    desc: 'Um portfólio editorial em que o espaço em branco tem o mesmo peso que as obras.',
    tags: ['Portfólio', 'Galerias de obras'],
    slug: 'atelie-norte',
  },
  {
    idx: '04',
    area: 'Gastronomia',
    name: 'Casa Alba',
    segment: 'Restaurante',
    desc: 'Cardápio, reservas e atmosfera reunidos numa experiência pensada para quem decide pelo celular.',
    tags: ['Cardápio digital', 'Reservas'],
    slug: 'casa-alba',
  },
]

function CaseInfo({ c }: { c: CaseMeta }) {
  return (
    <div className="case-meta rv">
      <div className="case-idx">
        <span>
          {c.idx} — {c.area}
        </span>
        <span className={`badge${c.real ? ' real' : ''}`}>{c.real ? 'Projeto real' : 'Conceito'}</span>
      </div>
      <h3 className="case-name">{c.name}</h3>
      <p className="case-seg">{c.segment}</p>
      <p className="case-desc">{c.desc}</p>
      <ul className="tags">
        {c.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <Link className="ulink case-link" href={caminhoProjeto(c.slug)}>
        {c.real ? 'Ver o case' : 'Ver o conceito com tour'} <span className="arr">→</span>
        <span className="sr-only"> — {c.name}</span>
      </Link>
    </div>
  )
}

export function Projetos() {
  const [c1, c2, c3, c4] = CASES
  return (
    <section className="section" id="projetos" aria-labelledby="proj-title" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <p className="eyebrow">Trabalhos selecionados</p>
            <h2 className="h2" id="proj-title">
              Negócios diferentes, <em className="it">presenças únicas.</em>
            </h2>
          </div>
          <p className="sec-note">Cada negócio tem seu ritmo, seu público e sua linguagem. Cada site também.</p>
        </div>

        <div className="work-grid">
          <article className="case case-1">
            <div className="case-media rv-mask" aria-hidden="true">
              <div className="mock">
                <div className="rv-img">
                  <MockCorretora />
                </div>
              </div>
              <div className="mini-admin">
                <MockAdmin />
              </div>
            </div>
            <CaseInfo c={c1} />
          </article>

          <article className="case case-2">
            <div className="case-media rv-mask" aria-hidden="true">
              <div className="mock">
                <div className="rv-img">
                  <MockClinica withRows />
                </div>
              </div>
            </div>
            <CaseInfo c={c2} />
          </article>

          <article className="case case-3">
            <div className="case-media rv-mask" aria-hidden="true">
              <div className="mock">
                <div className="rv-img">
                  <MockArquitetura />
                </div>
              </div>
            </div>
            <CaseInfo c={c3} />
          </article>

          <article className="case case-4">
            <div className="case-media rv-mask" aria-hidden="true">
              <span className="case-bigtype">Alba</span>
              <div className="mock">
                <div className="res-phone">
                  <div className="rv-img">
                    <MockRestaurante />
                  </div>
                </div>
                <div className="res-phone b">
                  <div className="rv-img">
                    <MockCardapio />
                  </div>
                </div>
              </div>
            </div>
            <CaseInfo c={c4} />
          </article>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- SOLUÇÕES */
const SERVICES = [
  {
    title: 'Presença',
    desc: 'Sites institucionais, páginas profissionais e experiências digitais para empresas e profissionais.',
    ex: ['Site institucional', 'Página profissional', 'Portfólio'],
    level: 1,
    levelLabel: 'Essencial',
  },
  {
    title: 'Conversão',
    desc: 'Landing pages e páginas pensadas para transformar visitantes em contatos e oportunidades.',
    ex: ['Landing page', 'Página de campanha', 'Captação pelo WhatsApp'],
    level: 2,
    levelLabel: 'Focado',
  },
  {
    title: 'Experiência',
    desc: 'Interfaces personalizadas, experiências interativas e projetos digitais que fogem do comum.',
    ex: ['Catálogos interativos', 'Lançamentos', 'Experiências de marca'],
    level: 3,
    levelLabel: 'Avançado',
  },
  {
    title: 'Sistemas',
    desc: 'Projetos mais completos: plataformas, áreas administrativas e sistemas feitos sob medida.',
    ex: ['Painel administrativo', 'Área do cliente', 'Catálogo gerenciável'],
    level: 4,
    levelLabel: 'Completo',
  },
]

export function Solucoes() {
  return (
    <section className="section paper paper-in" id="solucoes" aria-labelledby="sol-title">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <p className="eyebrow">O que posso criar</p>
            <h2 className="h2" id="sol-title">
              Do essencial <em className="it">ao completo.</em>
            </h2>
          </div>
          <p className="sec-note">
            Projetos de tamanhos diferentes, com o mesmo cuidado. Você me conta o que precisa — eu proponho o
            caminho certo.
          </p>
        </div>
        <ol className="svc-list">
          {SERVICES.map((s, i) => (
            <li className="svc rv" key={s.title}>
              <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <ul className="svc-ex">
                {s.ex.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <div className="level">
                <span className="level-bars" aria-hidden="true">
                  {[1, 2, 3, 4].map((n) => (
                    <i key={n} className={n <= s.level ? 'on' : undefined} />
                  ))}
                </span>
                <small>{s.levelLabel}</small>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- PROCESSO */
const STEPS = [
  ['Entendimento', 'Conhecer o negócio, o público e o objetivo do projeto.'],
  ['Direção', 'Definir o conceito visual e a experiência que o site vai transmitir.'],
  ['Construção', 'Transformar a ideia em uma experiência real e funcional.'],
  ['Refinamento', 'Ajustar detalhes, interações e velocidade até ficar redondo.'],
  ['Entrega', 'Um projeto pronto para representar o seu negócio.'],
]

export function Processo() {
  return (
    <section className="section process" id="processo" aria-labelledby="proc-title">
      <div className="grain" />
      <div className="wrap" style={{ position: 'relative' }}>
        <div className="sec-head rv">
          <div>
            <p className="eyebrow">Como trabalho</p>
            <h2 className="h2" id="proc-title">
              Um bom site não começa <em className="it">pelo código.</em>
            </h2>
          </div>
          <p className="sec-note">
            Começa por entender quem você é, quem você quer alcançar e o que precisa acontecer quando alguém
            chega até você. O resto é consequência.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <span className="steps-line" aria-hidden="true" />
          <ol className="steps">
            {STEPS.map(([t, x], i) => (
              <li className="step rv" key={t}>
                <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="step-title">{t}</h3>
                <p className="step-text">{x}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- IMPACTO */
const IMPACT = ['Seu', 'próximo', 'projeto', 'pode', 'começar', 'com', 'uma']

export function Impacto() {
  return (
    <section className="impact" aria-labelledby="impact-title">
      <div className="rings" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="grain" />
      <div className="wrap">
        <h2 className="impact-title" id="impact-title">
          {IMPACT.map((w, i) => (
            <span key={w}>
              <span className={`w d${i + 1}`}>{w}</span>{' '}
            </span>
          ))}
          <span className="w d8 it">ideia.</span>
        </h2>
        <p className="impact-sub rv">Conte o que você imagina. O resto, a gente constrói junto.</p>
        <div className="impact-cta rv">
          <a className="btn btn-ghost" href="#contato">
            Vamos conversar <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- CONTATO */
export function Contato() {
  const wa = linkWhatsapp('Olá, Gustavo! Vim pelo seu site.')
  const { email, instagramTexto, instagramUrl, whatsappTexto } = PORTFOLIO.contato

  return (
    <section className="section" id="contato" aria-labelledby="contato-title">
      <div className="wrap">
        <div className="contact-grid">
          <div className="rv">
            <p className="eyebrow">Contato</p>
            <h2 className="h2" id="contato-title">
              Vamos conversar sobre o <em className="it">seu projeto.</em>
            </h2>
            <p className="contact-text">
              Atendo empresas, comércios e profissionais de diferentes segmentos. Conte sua ideia — mesmo que
              ela ainda esteja no começo. Eu respondo pessoalmente.
            </p>
            <div className="direct">
              <a href={wa ?? '#contato'} {...(wa ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <small>WhatsApp</small>
                <span>{whatsappTexto}</span>
                <em aria-hidden="true">↗</em>
              </a>
              <a href={ehPlaceholder(email) ? '#contato' : `mailto:${email}`}>
                <small>E-mail</small>
                {/* E-mail longo: letra um pouco menor e quebra de linha permitida antes do "@". */}
                <span className={email.length > 24 ? 'longo' : undefined}>
                  {email.includes('@') ? (
                    <>
                      {email.split('@')[0]}
                      <wbr />@{email.split('@').slice(1).join('@')}
                    </>
                  ) : (
                    email
                  )}
                </span>
                <em aria-hidden="true">↗</em>
              </a>
              <a
                href={instagramUrl || '#contato'}
                {...(instagramUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <small>Instagram</small>
                <span>{instagramTexto}</span>
                <em aria-hidden="true">↗</em>
              </a>
            </div>
          </div>
          <FormularioContato />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- FOOTER */
export function Rodape() {
  const wa = linkWhatsapp()
  const { email } = PORTFOLIO.contato
  const socials = [
    ['Instagram', PORTFOLIO.redes.instagram],
    ['LinkedIn', PORTFOLIO.redes.linkedin],
    ['Behance', PORTFOLIO.redes.behance],
  ].filter(([, url]) => url)

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="brand" href="#top" aria-label={`${PORTFOLIO.marca} — voltar ao início`}>
              <SimboloA tamanho={30} corA="#ECEDF4" corCursor="#B9A3F0" />
              <span className="brand-name">{PORTFOLIO.marca}</span>
            </a>
            <p className="foot-phrase">
              Presença digital pensada para cada negócio — <em className="it">nunca de modelo pronto.</em>
            </p>
          </div>
          <div className="foot-col">
            <h3>Navegação</h3>
            <ul>
              {[
                ['#sobre', 'Sobre'],
                ['#projetos', 'Projetos'],
                ['#solucoes', 'Soluções'],
                ['#processo', 'Processo'],
                ['#contato', 'Contato'],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h3>Contato</h3>
            <ul>
              <li>
                <a href={wa ?? '#contato'}>WhatsApp</a>
              </li>
              <li>
                <a href={ehPlaceholder(email) ? '#contato' : `mailto:${email}`}>E-mail</a>
              </li>
            </ul>
          </div>
          {socials.length > 0 && (
            <div className="foot-col">
              <h3>Redes</h3>
              <ul>
                {socials.map(([l, url]) => (
                  <li key={l}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="foot-mark" aria-hidden="true">
          {PORTFOLIO.marca}
        </p>
        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} {PORTFOLIO.nome}
          </span>
          <span>Design e desenvolvimento sob medida</span>
          <a href="#top">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  )
}
