'use client'

import { useEffect, useRef } from 'react'

/** Faixa fixa no topo de todo experimento: deixa claro que é um conceito e leva ao orçamento. */
export function FaixaExperimento() {
  return (
    <div className="ex-faixa">
      <span>
        Experimento do <span className="ex-faixa-marca">araújo_</span>
        <span className="ex-faixa-sep"> · </span>
        <span className="ex-faixa-aviso">nomes e dados fictícios</span>
      </span>
      <a href="/#orcamento">Quero um site assim →</a>
    </div>
  )
}

type Aviso = { negocio: string; mensagem: string } | null

/**
 * No site real, o botão abriria o WhatsApp do negócio. Aqui nada é enviado:
 * a janela mostra a mensagem que seria mandada e oferece o orçamento.
 */
export function AvisoWhatsApp({ aviso, aoFechar }: { aviso: Aviso; aoFechar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (aviso && !d.open) d.showModal()
    if (!aviso && d.open) d.close()
  }, [aviso])

  return (
    <dialog
      ref={ref}
      className="ex-aviso"
      aria-labelledby="ex-aviso-titulo"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar()
      }}
    >
      {aviso && (
        <div className="ex-aviso-in">
          <h2 id="ex-aviso-titulo">Isto é um experimento</h2>
          <p>
            No site real, este botão abriria o WhatsApp da {aviso.negocio} com a mensagem abaixo. Aqui nada é enviado.
          </p>
          <blockquote>{aviso.mensagem}</blockquote>
          <div className="ex-aviso-acoes">
            <a className="ex-aviso-orc" href="/#orcamento">
              Quero um site assim
            </a>
            <button type="button" onClick={aoFechar}>
              Voltar ao site
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
