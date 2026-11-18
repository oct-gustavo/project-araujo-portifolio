'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Abertura da página: clipe curto (~2,6 s) da logo se desenhando, por cima de tudo, uma vez por sessão.
 *
 * - O vídeo é do próprio domínio (/hero/abertura.mp4), mudo e sem controles (CSP).
 * - O fundo do clipe é quase preto; com `mix-blend-mode: lighten` sobre a cor da página ele vira
 *   exatamente o fundo do site (#13111C), então a saída para a página não deixa emenda.
 * - O cursor "_" não veio no vídeo: é desenhado em código (CSS) na posição certa do quadro.
 * - Pula direto (sem tela de entrada) com "reduzir movimento", economia de dados, nova visita na
 *   mesma sessão, vídeo que demora a carregar ou erro ao tocar. Um clique/toque pula.
 * - O servidor já manda a camada (evita piscar o conteúdo antes); sem JavaScript, o CSS a tira sozinho.
 */

const CHAVE = 'araujo:abertura'
const ESPERA_CARREGAR_MS = 2000 // se o vídeo não tiver dados até aqui, pula
const PAUSA_FINAL_MS = 600 // segura a logo pronta antes de sair
const SAIDA_MS = 450 // fade para a página (mesmo valor do CSS)

type Fase = 'espera' | 'tocando' | 'saindo' | 'fim'

export function Abertura() {
  const [fase, setFase] = useState<Fase>('espera')
  const video = useRef<HTMLVideoElement>(null)
  const sair = useRef<((marcar: boolean) => void) | null>(null)

  useEffect(() => {
    const v = video.current
    const html = document.documentElement
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let jaVista = false
    try {
      jaVista = sessionStorage.getItem(CHAVE) === '1'
    } catch {}

    if (!v || reduz || conexao?.saveData || jaVista) {
      setFase('fim')
      return
    }

    const temporizadores: number[] = []
    let encerrado = false

    const encerrar = (marcar: boolean) => {
      if (encerrado) return
      encerrado = true
      if (marcar) {
        try {
          sessionStorage.setItem(CHAVE, '1')
        } catch {}
      }
      setFase('saindo')
      temporizadores.push(
        window.setTimeout(() => {
          html.style.overflow = ''
          setFase('fim')
        }, SAIDA_MS),
      )
    }
    sair.current = encerrar

    html.style.overflow = 'hidden'
    v.muted = true

    const aoTocar = () => setFase((f) => (f === 'espera' ? 'tocando' : f))
    const aoTerminar = () => {
      temporizadores.push(window.setTimeout(() => encerrar(true), PAUSA_FINAL_MS))
    }
    v.addEventListener('playing', aoTocar)
    v.addEventListener('ended', aoTerminar)

    temporizadores.push(
      window.setTimeout(() => {
        if (v.readyState < 3) encerrar(false) // vídeo lento: não faz o visitante esperar
      }, ESPERA_CARREGAR_MS),
      window.setTimeout(() => encerrar(true), 8000), // trava de segurança
    )

    const p = v.play()
    if (p) p.catch(() => encerrar(false))

    return () => {
      sair.current = null
      v.removeEventListener('playing', aoTocar)
      v.removeEventListener('ended', aoTerminar)
      temporizadores.forEach((t) => window.clearTimeout(t))
      html.style.overflow = ''
    }
  }, [])

  if (fase === 'fim') return null

  return (
    <div className={`pu-abertura pu-abertura-${fase}`} aria-hidden onClick={() => sair.current?.(true)}>
      <div className="pu-abertura-quadro">
        <video ref={video} className="pu-abertura-video" src="/hero/abertura.mp4" muted playsInline preload="auto" />
        <span className="pu-abertura-cursor" />
      </div>
    </div>
  )
}
