'use client'

import { useEffect, useState } from 'react'

/** Mostra o endereço que a pessoa tentou abrir (lido do navegador, nunca enviado a lugar nenhum). */
export function CaminhoTentado() {
  const [caminho, setCaminho] = useState('')
  useEffect(() => {
    try {
      setCaminho(decodeURIComponent(window.location.pathname).slice(0, 80))
    } catch {
      setCaminho(window.location.pathname.slice(0, 80))
    }
  }, [])
  if (!caminho || caminho === '/') return null
  return (
    <>
      {' '}
      Você tentou abrir <code>{caminho}</code>.
    </>
  )
}
