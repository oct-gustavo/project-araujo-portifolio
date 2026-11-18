'use client'

import { useEffect, useRef } from 'react'

/**
 * Fundo em vídeo das demos: um clipe base em loop e, se houver, um clipe de ação que entra de vez em quando.
 * Tudo é desenhado num <canvas> (a imagem parada fica por baixo, no CSS da própria demo).
 *
 * - Dois <video> do mesmo clipe se revezam com um fade curto, para esconder a emenda do loop.
 * - Os vídeos são do próprio domínio (/experimentos/midia/…), mudos e sem controles (CSP).
 * - Com "reduzir movimento" ou "economia de dados" não toca nada: fica só a imagem.
 * - Pausa sozinho quando a seção sai da tela.
 * - O recorte (object-position) vem da variável CSS `--pos`, igual à da imagem parada.
 */

const L = 1280
const A = 720
const SOBREPOSICAO = 0.5 // s de cruzamento entre uma volta do loop e a seguinte
const FADE_ACAO = 0.35 // s de entrada e saída do clipe de ação

type Props = {
  /** Classe da demo (define a imagem parada e o recorte no CSS). */
  className: string
  base: string
  acao?: string
  /** Tempo até a primeira ação e intervalo (min, max) entre as ações seguintes, em ms. */
  primeiraAcaoMs?: number
  intervaloAcaoMs?: readonly [number, number]
}

const tocar = (v: HTMLVideoElement) => {
  const p = v.play()
  if (p) p.catch(() => {})
}
const pronto = (v: HTMLVideoElement) => v.readyState >= 2 && v.duration > 0

export function FundoVideo({ className, base, acao, primeiraAcaoMs = 5000, intervaloAcaoMs = [14000, 24000] }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const tela = useRef<HTMLCanvasElement>(null)
  const refA = useRef<HTMLVideoElement>(null)
  const refB = useRef<HTMLVideoElement>(null)
  const refAcao = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = raiz.current
    const cv = tela.current
    const vA = refA.current
    const vB = refB.current
    const vAcao = refAcao.current
    if (!el || !cv || !vA || !vB) return

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (reduz || conexao?.saveData) return // fica só a imagem parada

    const ctx = cv.getContext('2d')
    if (!ctx) return
    cv.width = L
    cv.height = A
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    let atual = vA
    let proximo = vB
    let cruzando = false
    let acaoLigada = false
    let proximaAcao = performance.now() + primeiraAcaoMs
    let visivel = true
    let rodando = false
    let quadro = 0

    const desenhar = (agora: number) => {
      if (!pronto(atual)) return // enquanto isso, a imagem parada do CSS aparece
      const d = atual.duration
      const t = atual.currentTime
      ctx.globalAlpha = 1
      ctx.drawImage(atual, 0, 0, L, A)
      if (t > d - SOBREPOSICAO && !cruzando) {
        cruzando = true
        proximo.currentTime = 0
        tocar(proximo)
      }
      if (cruzando) {
        const pr = Math.min(1, Math.max(0, (t - (d - SOBREPOSICAO)) / SOBREPOSICAO))
        ctx.globalAlpha = pr
        ctx.drawImage(proximo, 0, 0, L, A)
        ctx.globalAlpha = 1
        if (atual.ended || t >= d - 0.03 || pr >= 1) {
          atual.pause()
          ;[atual, proximo] = [proximo, atual]
          cruzando = false
        }
      }
      if (!vAcao) return
      if (acaoLigada) {
        const ad = vAcao.duration
        const at = vAcao.currentTime
        const a = Math.min(1, at / FADE_ACAO) * Math.min(1, Math.max(0, (ad - at) / FADE_ACAO))
        if (vAcao.ended || at >= ad - 0.03) {
          acaoLigada = false
          vAcao.pause()
          const [min, max] = intervaloAcaoMs
          proximaAcao = agora + min + Math.random() * (max - min)
        } else {
          ctx.globalAlpha = a
          ctx.drawImage(vAcao, 0, 0, L, A)
          ctx.globalAlpha = 1
        }
      } else if (agora > proximaAcao && pronto(vAcao)) {
        vAcao.currentTime = 0
        tocar(vAcao)
        acaoLigada = true
        proximaAcao = agora + 60000
      }
    }

    const laco = (agora: number) => {
      if (!visivel) {
        rodando = false
        return
      }
      desenhar(agora)
      quadro = requestAnimationFrame(laco)
    }
    const iniciar = () => {
      if (rodando || !visivel) return
      rodando = true
      tocar(atual)
      quadro = requestAnimationFrame(laco)
    }

    const observador = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting
        if (visivel) iniciar()
        else {
          atual.pause()
          proximo.pause()
          vAcao?.pause()
          acaoLigada = false
          cruzando = false
        }
      },
      { threshold: 0.05 },
    )
    observador.observe(el)
    iniciar()

    return () => {
      cancelAnimationFrame(quadro)
      observador.disconnect()
      vA.pause()
      vB.pause()
      vAcao?.pause()
    }
  }, [intervaloAcaoMs, primeiraAcaoMs])

  return (
    <div className={`ex-fundo ${className}`} ref={raiz} aria-hidden="true">
      <canvas className="ex-fundo-tela" ref={tela} />
      <div className="ex-fundo-vu" />
      <video className="ex-video-oculto" ref={refA} src={base} muted playsInline preload="auto" tabIndex={-1} />
      <video className="ex-video-oculto" ref={refB} src={base} muted playsInline preload="auto" tabIndex={-1} />
      {acao && <video className="ex-video-oculto" ref={refAcao} src={acao} muted playsInline preload="auto" tabIndex={-1} />}
    </div>
  )
}
