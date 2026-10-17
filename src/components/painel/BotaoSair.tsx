'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { postar } from '@/lib/postar'
import p from './painel.module.css'

export function BotaoSair() {
  const router = useRouter()
  const [saindo, setSaindo] = useState(false)
  return (
    <button
      type="button"
      className={p.sair}
      disabled={saindo}
      onClick={async () => {
        setSaindo(true)
        await postar('/api/auth/sair')
        router.replace('/entrar')
        router.refresh()
      }}
    >
      {saindo ? 'saindo…' : 'sair'}
    </button>
  )
}
