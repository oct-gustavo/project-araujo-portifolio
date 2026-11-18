'use client'

import { useEffect, useRef } from 'react'

/**
 * Fundo animado do início: vídeo de fundo (digitando, em loop) com um clipe de ação
 * (espreguiçar) entrando de vez em quando, tudo desenhado num <canvas> e levemente desfocado.
 *
 * - Os vídeos são do próprio domínio (/hero/…), mudos e sem controles; nada de script externo (CSP).
 * - Antes do JavaScript (e com "reduzir movimento"), o que aparece é só a imagem parada (CSS).
 * - Pausa sozinho quando o início sai da tela.
 */

const L = 1280
const A = 720
const SOBREPOSICAO = 0.5 // s de cruzamento entre uma volta do loop e a seguinte
const FADE_ACAO = 0.35 // s de entrada e saída do clipe de ação
const PRIMEIRA_ACAO_MS = 7000
const INTERVALO_ACAO_MS = [22000, 38000] as const

type Particula = { x: number; y: number; r: number; v: number; a: number; fase: number }

const tocar = (v: HTMLVideoElement) => {
  const p = v.play()
  if (p) p.catch(() => {})
}
const pronto = (v: HTMLVideoElement) => v.readyState >= 2 && v.duration > 0

export function FundoAnimado() {
  const palco = useRef<HTMLDivElement>(null)
  const tela = useRef<HTMLCanvasElement>(null)
  const poeira = useRef<HTMLCanvasElement>(null)
  const refA = useRef<HTMLVideoElement>(null)
  const refB = useRef<HTMLVideoElement>(null)
  const refAcao = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const cv = tela.current
    const pv = poeira.current
    const raiz = palco.current?.closest('section')
    const vA = refA.current
    const vB = refB.current
    const acao = refAcao.current
    if (!cv || !pv || !raiz || !vA || !vB || !acao) return

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (reduz || conexao?.saveData) return // fica só a imagem parada

    const ctx = cv.getContext('2d')
    const px = pv.getContext('2d')
    if (!ctx || !px) return

    cv.width = L
    cv.height = A
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const img = new Image()
    img.src = '/hero/fundo.jpg'

    let atual = vA
    let proximo = vB
    let cruzando = false
    let acaoLigada = false
    let proximaAcao = performance.now() + PRIMEIRA_ACAO_MS
    let visivel = true
    let rodando = false
    let quadro = 0

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const medir = () => {
      pv.width = Math.round(raiz.clientWidth * dpr)
      pv.height = Math.round(raiz.clientHeight * dpr)
    }
    medir()
    const observarTamanho = new ResizeObserver(medir)
    observarTamanho.observe(raiz)

    const particulas: Particula[] = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.5,
      v: 0.00003 + Math.random() * 0.00007,
      a: 0.07 + Math.random() * 0.2,
      fase: Math.random() * 6.28,
    }))

    const desenhar = (agora: number) => {
      // fundo: vídeo (ou a imagem, até o vídeo estar pronto)
      if (!pronto(atual)) {
        if (img.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, L, A)
      } else {
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
        if (acaoLigada) {
          const ad = acao.duration
          const at = acao.currentTime
          const a = Math.min(1, at / FADE_ACAO) * Math.min(1, Math.max(0, (ad - at) / FADE_ACAO))
          if (acao.ended || at >= ad - 0.03) {
            acaoLigada = false
            acao.pause()
            const [min, max] = INTERVALO_ACAO_MS
            proximaAcao = agora + min + Math.random() * (max - min)
          } else {
            ctx.globalAlpha = a
            ctx.drawImage(acao, 0, 0, L, A)
            ctx.globalAlpha = 1
          }
        } else if (agora > proximaAcao && pronto(acao)) {
          acao.currentTime = 0
          tocar(acao)
          acaoLigada = true
          proximaAcao = agora + 60000
        }
      }

      // poeira
      px.clearRect(0, 0, pv.width, pv.height)
      for (const p of particulas) {
        p.y -= p.v * 16
        if (p.y < -0.02) {
          p.y = 1.02
          p.x = Math.random()
        }
        const x = (p.x + Math.sin(agora / 4000 + p.fase) * 0.006) * pv.width
        const y = p.y * pv.height
        px.fillStyle = `rgba(205,178,255,${p.a})`
        px.beginPath()
        px.arc(x, y, p.r * dpr, 0, 6.283)
        px.fill()
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
          acao.pause()
          acaoLigada = false
          cruzando = false
        }
      },
      { threshold: 0.05 },
    )
    observador.observe(raiz)
    iniciar()

    return () => {
      cancelAnimationFrame(quadro)
      observador.disconnect()
      observarTamanho.disconnect()
      vA.pause()
      vB.pause()
      acao.pause()
    }
  }, [])

  return (
    <div className="pu-fundo" aria-hidden="true">
      <div className="pu-palco" ref={palco}>
        <canvas className="pu-tela" ref={tela} />
      </div>
      <canvas className="pu-poeira" ref={poeira} />
      <div className="pu-fundo-vu" />
      <video className="pu-video-oculto" ref={refA} src="/hero/base.mp4" muted playsInline preload="auto" tabIndex={-1} />
      <video className="pu-video-oculto" ref={refB} src="/hero/base.mp4" muted playsInline preload="auto" tabIndex={-1} />
      <video className="pu-video-oculto" ref={refAcao} src="/hero/acao.mp4" muted playsInline preload="auto" tabIndex={-1} />
    </div>
  )
}
