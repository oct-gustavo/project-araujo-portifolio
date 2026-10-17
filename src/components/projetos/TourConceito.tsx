'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SimboloA } from '@/components/marca/Logo'
import { AssistenteConversa } from '@/components/site/AssistenteConversa'
import './tour.css'

export type PassoTour = {
  /** Valor do atributo data-tour do elemento a destacar. */
  alvo: string
  titulo: string
  texto: string
}

type Props = {
  nome: string
  /** Faixa final do estúdio: próximo projeto. */
  proximo?: { nome: string; href: string; descricao: string }
  /** Página com cores, fontes e estilo do conceito (oferecida no fim do tour e na faixa final). */
  detalhes?: string
  intro: { titulo: string; texto: string }
  passos: PassoTour[]
  children: React.ReactNode
}

type Caixa = { top: number; left: number; width: number; height: number }

const FOLGA = 10 // espaço entre o destaque e o elemento
const MARGEM = 16

/**
 * Página de conceito com tour guiado.
 * O tour abre em toda visita (passo 0 = boas-vindas). Esc fecha, ← → navegam.
 * O destaque é um recorte com sombra; o resto da página continua clicável.
 */
export function TourConceito({ nome, proximo, detalhes, intro, passos, children }: Props) {
  const [passo, setPasso] = useState(0) // -1 = fechado
  const [alvo, setAlvo] = useState<Caixa | null>(null)
  const [caixaH, setCaixaH] = useState(0)
  const cartao = useRef<HTMLDivElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  const refazer = useRef<HTMLButtonElement>(null)
  const total = passos.length
  const atual = passo >= 1 ? passos[passo - 1] : null
  const aberto = passo >= 0
  const ultimo = passo === total

  const fechar = useCallback(() => {
    setPasso(-1)
    setAlvo(null)
    requestAnimationFrame(() => refazer.current?.focus())
  }, [])
  const avancar = useCallback(() => setPasso((p) => (p >= total ? -1 : p + 1)), [total])
  const voltar = useCallback(() => setPasso((p) => Math.max(0, p - 1)), [])

  // Leva o elemento do passo para o topo da tela.
  useEffect(() => {
    if (!atual) return
    const el = document.querySelector(`[data-tour="${atual.alvo}"]`)
    if (!el) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Elementos fixos (menu, barra de ações) já estão sempre na tela.
    const posicao = getComputedStyle(el).position
    if (posicao === 'fixed' || posicao === 'sticky') return
    // Leva o começo da área para logo abaixo da barra do estúdio: sobra espaço embaixo para a explicação.
    const r = el.getBoundingClientRect()
    window.scrollTo({ top: r.top + window.scrollY - 76, behavior: reduzir ? 'auto' : 'smooth' })
  }, [atual])

  // Acompanha a posição do elemento (rolagem, redimensionamento, animações).
  useEffect(() => {
    if (!atual) return
    let quadro = 0
    const medir = () => {
      const el = document.querySelector(`[data-tour="${atual.alvo}"]`)
      if (el) {
        const r = el.getBoundingClientRect()
        setAlvo((a) =>
          a && a.top === r.top && a.left === r.left && a.width === r.width && a.height === r.height
            ? a
            : { top: r.top, left: r.left, width: r.width, height: r.height },
        )
      }
      quadro = requestAnimationFrame(medir)
    }
    medir()
    return () => cancelAnimationFrame(quadro)
  }, [atual])

  // Altura do cartão para decidir se ele cabe abaixo ou acima do destaque.
  useLayoutEffect(() => {
    if (cartao.current) setCaixaH(cartao.current.offsetHeight)
  }, [passo, alvo?.width])

  // Foco no título a cada passo (o leitor de tela anuncia a explicação).
  useEffect(() => {
    if (aberto) titulo.current?.focus({ preventScroll: true })
  }, [passo, aberto])

  // Teclado: Esc fecha, setas navegam.
  useEffect(() => {
    if (!aberto) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
      else if (e.key === 'ArrowRight' && cartao.current?.contains(document.activeElement)) avancar()
      else if (e.key === 'ArrowLeft' && cartao.current?.contains(document.activeElement)) voltar()
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [aberto, fechar, avancar, voltar])

  // Posição do cartão: abaixo do destaque; se não couber, acima; no celular, preso embaixo.
  let estiloCartao: React.CSSProperties | undefined
  let classeCartao = 'tr-card'
  if (!atual) classeCartao += ' tr-centro'
  else if (alvo && typeof window !== 'undefined') {
    const vw = window.innerWidth
    const vh = window.innerHeight
    // No celular o cartão ocupa a largura: fica embaixo, ou em cima se o destaque estiver embaixo.
    if (vw < 640) {
      const baixo = alvo.height < vh * 0.6 && alvo.top + alvo.height / 2 > vh * 0.55
      classeCartao += baixo ? ' tr-topo' : ' tr-base'
    }
    if (vw >= 640) {
      const largura = Math.min(400, vw - MARGEM * 2)
      const left = Math.min(Math.max(alvo.left + alvo.width - largura, MARGEM), vw - largura - MARGEM)
      const abaixo = alvo.top + alvo.height + FOLGA + 14
      const acima = alvo.top - FOLGA - 14 - caixaH
      let top = abaixo + caixaH <= vh - MARGEM ? abaixo : acima >= MARGEM ? acima : vh - caixaH - MARGEM
      top = Math.max(MARGEM, top)
      estiloCartao = { top, left, width: largura }
    }
  }

  return (
    <div className="cx">
      <div className="cx-barra">
        <div className="cx-barra-in">
          <Link href="/#projetos" className="cx-voltar">
            <span aria-hidden="true">←</span> Voltar ao portfólio
          </Link>
          <span className="cx-nome">
            <SimboloA tamanho={18} corA="#ECEDF4" corCursor="#B9A3F0" />
            {nome} <small>Conceito</small>
          </span>
          <button ref={refazer} type="button" className="cx-refazer" onClick={() => setPasso(0)}>
            Refazer o tour <span aria-hidden="true">↺</span>
          </button>
        </div>
      </div>

      {children}

      <section className="cx-fim" aria-label="Continuar">
        <div className="cx-fim-in">
          <p className="cx-fim-t">
            Gostou da ideia? Um site assim pode ser feito <em>para o seu negócio.</em>
          </p>
          <div className="cx-fim-acoes">
            <Link className="cx-fim-btn" href="/#contato">
              Vamos conversar <span aria-hidden="true">→</span>
            </Link>
            {detalhes && (
              <Link className="cx-fim-det" href={detalhes}>
                Cores, fontes e estilo <span aria-hidden="true">→</span>
              </Link>
            )}
            {proximo && (
              <Link className="cx-fim-prox" href={proximo.href}>
                <small>Próximo projeto</small>
                <span>
                  {proximo.nome} <span aria-hidden="true">→</span>
                </span>
                <em>{proximo.descricao}</em>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Assistente de conversa: escondido enquanto o tour está aberto. */}
      <AssistenteConversa oculto={aberto} origem={`${nome} (conceito)`} />

      {aberto && (
        <>
          {atual && alvo ? (
            <div
              className="tr-spot"
              aria-hidden="true"
              style={{
                top: alvo.top - FOLGA,
                left: alvo.left - FOLGA,
                width: alvo.width + FOLGA * 2,
                height: alvo.height + FOLGA * 2,
              }}
            />
          ) : (
            <div className="tr-veu" aria-hidden="true" />
          )}
          <div
            ref={cartao}
            className={classeCartao}
            style={estiloCartao}
            role="dialog"
            aria-modal="false"
            aria-labelledby="tr-titulo"
            aria-describedby="tr-texto"
          >
            <p className="tr-n">{atual ? `${passo} de ${total}` : 'Proposta visual · tour guiado'}</p>
            <h2 className="tr-t" id="tr-titulo" ref={titulo} tabIndex={-1}>
              {atual ? atual.titulo : intro.titulo}
            </h2>
            <p className="tr-p" id="tr-texto">
              {atual ? atual.texto : intro.texto}
            </p>
            {atual && (
              <div className="tr-dots" aria-hidden="true">
                {passos.map((_, i) => (
                  <i key={i} className={i < passo ? 'on' : undefined} />
                ))}
              </div>
            )}
            {ultimo && detalhes ? (
              <div className="tr-fim">
                <p>Quer ver as cores, as fontes e o estilo por trás deste conceito?</p>
                <div className="tr-acoes">
                  <button className="tr-b" type="button" onClick={voltar}>
                    Voltar
                  </button>
                  <Link className="tr-b tr-pri" href={detalhes}>
                    Ver os detalhes <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <button className="tr-b tr-link tr-fechar" type="button" onClick={fechar}>
                  Fechar e explorar a página
                </button>
              </div>
            ) : (
            <div className="tr-acoes">
              {passo < total ? (
                <button className="tr-b tr-link" type="button" onClick={fechar}>
                  Pular tour
                </button>
              ) : (
                <span />
              )}
              <div>
                {passo >= 1 && (
                  <button className="tr-b" type="button" onClick={voltar}>
                    Voltar
                  </button>
                )}
                <button className="tr-b tr-pri" type="button" onClick={avancar}>
                  {passo === 0 ? 'Começar →' : passo < total ? 'Próximo →' : 'Concluir ✓'}
                </button>
              </div>
            </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
