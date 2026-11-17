'use client'

import { useState } from 'react'
import { PORTFOLIO } from '@/lib/portfolio'

const TIPOS = [
  { valor: 'corretor ou imobiliária', rotulo: 'Corretor ou imobiliária' },
  { valor: 'comércio local', rotulo: 'Comércio local' },
  { valor: 'prestação de serviços', rotulo: 'Prestação de serviços' },
  { valor: 'outro tipo de negócio', rotulo: 'Outro' },
]

/** Monta a mensagem do WhatsApp com o que a pessoa digitou. */
function montarMensagem(nome: string, tipo: string, texto: string) {
  const quem = nome.trim() ? `Olá! Meu nome é ${nome.trim()}.` : 'Olá!'
  const extra = texto.trim() ? ` ${texto.trim()}` : ''
  return `${quem} Tenho ${tipo} e gostaria de um orçamento de site.${extra}`
}

/**
 * Pedido de orçamento: não grava nada nem chama servidor.
 * O botão é um link para o WhatsApp, atualizado a cada tecla.
 */
export function FormularioOrcamento() {
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState(TIPOS[0].valor)
  const [texto, setTexto] = useState('')

  const numero = PORTFOLIO.contato.whatsapp.replace(/\D/g, '')
  const href = `https://wa.me/${numero}?text=${encodeURIComponent(montarMensagem(nome, tipo, texto))}`

  return (
    <form className="pu-form" onSubmit={(e) => e.preventDefault()} aria-label="Pedido de orçamento">
      <div className="pu-campo">
        <label htmlFor="orc-nome">Seu nome</label>
        <input
          id="orc-nome"
          type="text"
          autoComplete="name"
          placeholder="Como posso te chamar?"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
      <div className="pu-campo">
        <label htmlFor="orc-tipo">Tipo de negócio</label>
        <select id="orc-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.rotulo}
            </option>
          ))}
        </select>
      </div>
      <div className="pu-campo">
        <label htmlFor="orc-texto">O que você precisa?</label>
        <textarea
          id="orc-texto"
          rows={4}
          placeholder="Ex.: um site com catálogo de imóveis e botão de WhatsApp"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>
      <a className="pu-btn pu-btn-cheio pu-btn-largo" href={href} target="_blank" rel="noopener">
        Enviar pelo WhatsApp
      </a>
    </form>
  )
}
