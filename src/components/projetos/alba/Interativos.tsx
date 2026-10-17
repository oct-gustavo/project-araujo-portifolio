'use client'

import { useEffect, useState } from 'react'

/* ------------------------------------------------------------- aberto agora */
// Horário de exemplo: terça a domingo, 12h–15h e 19h–23h. Segunda fechado.
const TURNOS: [number, number][] = [
  [12 * 60, 15 * 60],
  [19 * 60, 23 * 60],
]
const hhmm = (m: number) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`

function situacao(agora: Date): { aberto: boolean; texto: string } {
  const dia = agora.getDay() // 0 = domingo, 1 = segunda
  const min = agora.getHours() * 60 + agora.getMinutes()
  if (dia !== 1) {
    for (const [ini, fim] of TURNOS) if (min >= ini && min < fim) return { aberto: true, texto: `Aberto agora · fecha às ${hhmm(fim)}` }
    const prox = TURNOS.find(([ini]) => min < ini)
    if (prox) return { aberto: false, texto: `Fechado agora · abre às ${hhmm(prox[0])}` }
  }
  const amanhaSegunda = (dia + 1) % 7 === 1
  return { aberto: false, texto: amanhaSegunda ? 'Fechado agora · abre terça às 12h' : 'Fechado agora · abre amanhã às 12h' }
}

/** Mostra se o restaurante está aberto, pelo relógio de quem visita. */
export function AbertoAgora() {
  const [s, setS] = useState<{ aberto: boolean; texto: string } | null>(null)
  useEffect(() => {
    const atualizar = () => setS(situacao(new Date()))
    atualizar()
    const t = setInterval(atualizar, 60_000)
    return () => clearInterval(t)
  }, [])
  return (
    <p className={`ca-status${s && !s.aberto ? ' fechado' : ''}`}>
      <i aria-hidden="true" />
      {s ? s.texto : 'Terça a domingo · almoço e jantar'}
    </p>
  )
}

/* ---------------------------------------------------------------- cardápio */
type Item = { nome: string; desc: string; preco: string; veg?: boolean; sg?: boolean }
const CARDAPIO: Record<string, Item[]> = {
  Entradas: [
    { nome: 'Pão da casa', desc: 'Fermentação natural, manteiga de ervas.', preco: 'R$ 18', veg: true },
    { nome: 'Abobrinha na brasa', desc: 'Coalhada, hortelã e castanhas.', preco: 'R$ 32', veg: true, sg: true },
    { nome: 'Peixe curado', desc: 'Limão-cravo, pepino e azeite verde.', preco: 'R$ 42', sg: true },
  ],
  Principais: [
    { nome: 'Arroz de cogumelos', desc: 'Cogumelos da estação e queijo curado.', preco: 'R$ 64', veg: true, sg: true },
    { nome: 'Peixe do dia', desc: 'Purê de mandioquinha e legumes assados.', preco: 'R$ 78', sg: true },
    { nome: 'Costela lenta', desc: '12 horas no forno, farofa de ervas.', preco: 'R$ 82' },
  ],
  Sobremesas: [
    { nome: 'Pudim de tapioca', desc: 'Calda de coco queimado.', preco: 'R$ 26', veg: true, sg: true },
    { nome: 'Torta de limão', desc: 'Merengue tostado na hora.', preco: 'R$ 28', veg: true },
  ],
  Bebidas: [
    { nome: 'Limonada de capim-santo', desc: 'Feita na hora.', preco: 'R$ 14', veg: true, sg: true },
    { nome: 'Vinho da casa', desc: 'Taça — pergunte a seleção do dia.', preco: 'R$ 32', veg: true, sg: true },
  ],
}
const ABAS = Object.keys(CARDAPIO)

export function Cardapio() {
  const [aba, setAba] = useState(ABAS[1])
  const [veg, setVeg] = useState(false)
  const [sg, setSg] = useState(false)
  const itens = CARDAPIO[aba].filter((i) => (!veg || i.veg) && (!sg || i.sg))

  function teclar(e: React.KeyboardEvent, i: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + ABAS.length) % ABAS.length
    setAba(ABAS[n])
    document.getElementById(`ca-aba-${n}`)?.focus()
  }

  return (
    <>
      <div className="ca-abas" role="tablist" aria-label="Seções do cardápio">
        {ABAS.map((a, i) => (
          <button
            key={a}
            id={`ca-aba-${i}`}
            role="tab"
            type="button"
            className="ca-aba"
            aria-selected={a === aba}
            aria-controls="ca-painel"
            tabIndex={a === aba ? 0 : -1}
            onClick={() => setAba(a)}
            onKeyDown={(e) => teclar(e, i)}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="ca-filtros" role="group" aria-label="Filtros">
        <button type="button" className="ca-filtro" aria-pressed={veg} onClick={() => setVeg((v) => !v)}>
          Vegetariano
        </button>
        <button type="button" className="ca-filtro" aria-pressed={sg} onClick={() => setSg((v) => !v)}>
          Sem glúten
        </button>
      </div>
      <div id="ca-painel" role="tabpanel" aria-labelledby={`ca-aba-${ABAS.indexOf(aba)}`}>
        {itens.length ? (
          <ul className="ca-itens">
            {itens.map((i) => (
              <li className="ca-item" key={i.nome}>
                <h3>
                  {i.nome}
                  {i.veg && <small>veg</small>}
                  {i.sg && <small>sem glúten</small>}
                </h3>
                <b>{i.preco}</b>
                <p>{i.desc}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ca-vazio">Nenhum prato desta seção com esses filtros.</p>
        )}
      </div>
    </>
  )
}

/* ----------------------------------------------------------------- reserva */
const DIAS = ['Hoje', 'Amanhã', 'Sábado', 'Domingo']
const HORAS = ['12:30', '13:30', '19:30', '20:30', '21:30']

export function Reserva() {
  const [pessoas, setPessoas] = useState(2)
  const [dia, setDia] = useState(DIAS[0])
  const [hora, setHora] = useState<string | null>(null)
  const [pedido, setPedido] = useState(false)

  return (
    <div className="ca-res-box">
      <div>
        <h3 id="ca-pessoas">Quantas pessoas?</h3>
        <div className="ca-step" role="group" aria-labelledby="ca-pessoas">
          <button type="button" aria-label="Menos uma pessoa" disabled={pessoas <= 1} onClick={() => setPessoas((p) => p - 1)}>
            −
          </button>
          <output aria-live="polite">
            {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
          </output>
          <button type="button" aria-label="Mais uma pessoa" disabled={pessoas >= 12} onClick={() => setPessoas((p) => p + 1)}>
            +
          </button>
        </div>
      </div>
      <div>
        <h3 id="ca-dia">Quando?</h3>
        <div className="ca-opcoes" role="group" aria-labelledby="ca-dia">
          {DIAS.map((d) => (
            <button key={d} type="button" className="ca-opcao" aria-pressed={d === dia} onClick={() => setDia(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 id="ca-hora">Horário</h3>
        <div className="ca-opcoes" role="group" aria-labelledby="ca-hora">
          {HORAS.map((h) => (
            <button key={h} type="button" className="ca-opcao" aria-pressed={h === hora} onClick={() => setHora(h)}>
              {h}
            </button>
          ))}
        </div>
      </div>
      <div className="ca-res-foot">
        <span aria-live="polite">
          {pedido
            ? 'Demonstração: no site real, o pedido chegaria no WhatsApp da casa.'
            : hora
              ? `${dia}, ${hora} · ${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'}`
              : 'Escolha um horário'}
        </span>
        <button className="ca-btn" type="button" disabled={!hora} onClick={() => setPedido(true)}>
          Reservar
        </button>
      </div>
    </div>
  )
}
