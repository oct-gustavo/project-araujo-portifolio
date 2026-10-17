'use client'

import { useState, type FormEvent } from 'react'

/* ------------------------------------------------------------ obras + filtro */
type Tipo = 'Residencial' | 'Comercial' | 'Interiores'
const OBRAS: { nome: string; tipo: Tipo; info: string; textura: string }[] = [
  { nome: 'Casa Pátio', tipo: 'Residencial', info: 'Residencial · 240 m²', textura: 't1' },
  { nome: 'Estúdio Vale', tipo: 'Interiores', info: 'Interiores · 62 m²', textura: 't2' },
  { nome: 'Loja Ribeira', tipo: 'Comercial', info: 'Comercial · 95 m²', textura: 't3' },
  { nome: 'Apartamento Alto', tipo: 'Interiores', info: 'Interiores · 118 m²', textura: 't4' },
  { nome: 'Casa Encosta', tipo: 'Residencial', info: 'Residencial · 310 m²', textura: 't5' },
  { nome: 'Café Esquina', tipo: 'Comercial', info: 'Comercial · 70 m²', textura: 't6' },
]
const FILTROS = ['Todas', 'Residencial', 'Comercial', 'Interiores'] as const
/** Grade assimétrica quando todas as obras aparecem: 8+4 / 4+8 / 6+6. */
const LAYOUT: Record<number, string> = { 0: 'lg', 3: 'lg', 4: 'md', 5: 'md' }

export function ObrasFiltro() {
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('Todas')
  const lista = OBRAS.filter((o) => filtro === 'Todas' || o.tipo === filtro)
  return (
    <>
      <div className="an-filtros" role="group" aria-label="Filtrar obras por tipo">
        {FILTROS.map((f) => (
          <button
            key={f}
            type="button"
            className={f === filtro ? 'an-filtro on' : 'an-filtro'}
            aria-pressed={f === filtro}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {lista.length} obras mostradas
      </p>
      <div className="an-obras">
        {lista.map((o, i) => (
          <article key={o.nome} className={`an-obra ${filtro === 'Todas' ? (LAYOUT[i] ?? '') : lista.length === 2 ? 'md' : ''}`}>
            <figure>
              <span className={o.textura} role="img" aria-label={`Imagem ilustrativa da obra ${o.nome}`} />
            </figure>
            <h3>{o.nome}</h3>
            <p>{o.info}</p>
          </article>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------- antes/depois */
export function AntesDepois() {
  const [pos, setPos] = useState(50)
  return (
    <div>
      <div className="an-ad-box" role="img" aria-label="Comparação ilustrativa: sala antes e depois da reforma">
        <div className="an-ad-antes" />
        <div className="an-ad-depois" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} />
        <span className="an-ad-tag" style={{ left: 14 }}>
          Antes
        </span>
        <span className="an-ad-tag" style={{ right: 14 }}>
          Depois
        </span>
        <span className="an-ad-linha" style={{ left: `${pos}%` }} />
      </div>
      <label className="sr-only" htmlFor="an-comparar">
        Comparar antes e depois
      </label>
      <input
        id="an-comparar"
        className="an-ad-range"
        type="range"
        min={0}
        max={100}
        value={pos}
        aria-valuetext={`${100 - pos}% da imagem mostrando o depois`}
        onChange={(e) => setPos(Number(e.target.value))}
      />
      <div className="an-ad-range-l" aria-hidden="true">
        <span>← mais do depois</span>
        <span>mais do antes →</span>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- contato */
export function ContatoNorte() {
  const [enviado, setEnviado] = useState(false)
  function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviado(true)
  }
  return (
    <form className="an-form" onSubmit={enviar}>
      <fieldset className="an-fs">
        <legend>Que espaço é?</legend>
        <div className="an-chips">
          {['Casa', 'Apartamento', 'Comercial'].map((t, i) => (
            <label className="an-chip" key={t}>
              <input type="radio" name="espaco" value={t} defaultChecked={i === 0} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="an-fs">
        <legend>Tamanho aproximado</legend>
        <div className="an-chips">
          {['até 60 m²', '60 a 120 m²', '120 a 250 m²', 'mais de 250 m²'].map((t, i) => (
            <label className="an-chip" key={t}>
              <input type="radio" name="metragem" value={t} defaultChecked={i === 1} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="an-label" htmlFor="an-ideia">
          O que você imagina para ele?
        </label>
        <textarea className="an-area" id="an-ideia" placeholder="Ex.: integrar cozinha e sala, mais luz natural…" />
      </div>
      {enviado ? (
        <p className="an-ok" role="status">
          Demonstração: no site real, essas respostas chegariam para o ateliê já organizadas.
        </p>
      ) : (
        <button className="an-enviar" type="submit">
          Enviar
        </button>
      )}
    </form>
  )
}
