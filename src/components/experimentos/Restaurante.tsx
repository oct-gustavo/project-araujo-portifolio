'use client'

import { useState } from 'react'
import { reais } from '@/lib/experimentos'
import { AvisoWhatsApp, FaixaExperimento } from './Comum'
import { CozinhaAnimada } from './CozinhaAnimada'

const NEGOCIO = 'Cantina Exemplo'

type Categoria = 'Pratos' | 'Massas' | 'Sobremesas' | 'Bebidas'
const CATEGORIAS: Categoria[] = ['Pratos', 'Massas', 'Sobremesas', 'Bebidas']

/** Cardápio fictício. */
const CARDAPIO: { id: string; cat: Categoria; nome: string; detalhe: string; preco: number; cor: string }[] = [
  { id: 'p1', cat: 'Pratos', nome: 'Prato executivo', detalhe: 'Arroz, feijão, salada e grelhado do dia', preco: 32, cor: '#D9C9A8' },
  { id: 'p2', cat: 'Pratos', nome: 'Frango assado', detalhe: 'Com batatas e legumes da estação', preco: 36, cor: '#E2C9A0' },
  { id: 'm1', cat: 'Massas', nome: 'Massa da casa', detalhe: 'Talharim ao molho de tomate fresco', preco: 38, cor: '#BCCDB5' },
  { id: 'm2', cat: 'Massas', nome: 'Lasanha', detalhe: 'Bolonhesa, gratinada no forno', preco: 42, cor: '#D8B49A' },
  { id: 's1', cat: 'Sobremesas', nome: 'Pudim', detalhe: 'Receita da família', preco: 14, cor: '#E2BFA0' },
  { id: 's2', cat: 'Sobremesas', nome: 'Torta de limão', detalhe: 'Fatia generosa', preco: 16, cor: '#E3DDA8' },
  { id: 'b1', cat: 'Bebidas', nome: 'Suco natural', detalhe: 'Laranja, maracujá ou abacaxi', preco: 10, cor: '#EBCB8E' },
  { id: 'b2', cat: 'Bebidas', nome: 'Água com gás', detalhe: 'Garrafa de 500 ml', preco: 6, cor: '#C9D8D6' },
]

export function Restaurante() {
  const [cat, setCat] = useState<Categoria | 'Tudo'>('Tudo')
  const [qtd, setQtd] = useState<Record<string, number>>({})
  const [entrega, setEntrega] = useState<'retirar' | 'entregar'>('retirar')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState<{ negocio: string; mensagem: string } | null>(null)

  const itens = CARDAPIO.filter((i) => (qtd[i.id] ?? 0) > 0)
  const total = itens.reduce((s, i) => s + i.preco * qtd[i.id], 0)
  const visiveis = CATEGORIAS.filter((c) => cat === 'Tudo' || c === cat)

  const mudar = (id: string, delta: number) => {
    setErro('')
    setQtd((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }))
  }

  const enviar = () => {
    if (itens.length === 0) {
      setErro('Adicione pelo menos um item ao pedido.')
      return
    }
    const linhas = itens.map((i) => `${qtd[i.id]}x ${i.nome}`).join(', ')
    setAviso({
      negocio: NEGOCIO,
      mensagem: `Olá! Quero fazer um pedido para ${entrega === 'retirar' ? 'retirar' : 'entrega'}: ${linhas}. Total ${reais(total)}.`,
    })
  }

  return (
    <>
      <FaixaExperimento />
      <header className="ex-wrap ex-cab">
        <a className="ex-logo ex-titulo" href="#inicio">
          {NEGOCIO}
        </a>
        <nav className="ex-menu" aria-label="Menu">
          <a href="#cardapio">Cardápio</a>
          <a href="#pedido">Seu pedido{itens.length > 0 ? ` (${itens.length})` : ''}</a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="rest-hero-fundo" aria-labelledby="rest-titulo">
          <CozinhaAnimada />
          <div className="ex-wrap rest-hero">
            <h1 id="rest-titulo" className="ex-titulo">
              Comida caseira, <em>feita hoje</em>
            </h1>
            <p>Monte seu pedido pelo cardápio do dia e envie direto pelo WhatsApp. Retire no balcão ou receba em casa.</p>
            <a className="ex-btn" href="#cardapio">
              Ver cardápio
            </a>
          </div>
        </section>

        <div className="ex-wrap rest-corpo">
          <section id="cardapio" aria-labelledby="rest-cardapio-titulo">
            <h2 id="rest-cardapio-titulo" className="sr-only">
              Cardápio do dia
            </h2>
            <div className="rest-cats" role="group" aria-label="Filtrar cardápio">
              {(['Tudo', ...CATEGORIAS] as const).map((c) => (
                <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>
            <div className="rest-menu">
              {visiveis.map((c) => (
                <div key={c}>
                  <h3 className="ex-titulo" style={{ fontSize: 26 }}>
                    {c}
                  </h3>
                  <ul className="rest-itens">
                    {CARDAPIO.filter((i) => i.cat === c).map((i) => (
                      <li key={i.id}>
                        <span className="rest-foto" style={{ background: i.cor }} aria-hidden="true" />
                        <span className="rest-item-txt">
                          <b>{i.nome}</b>
                          <small>{i.detalhe}</small>
                          <span className="rest-preco">{reais(i.preco)}</span>
                        </span>
                        <span className="rest-qtd">
                          <button
                            type="button"
                            onClick={() => mudar(i.id, -1)}
                            aria-label={`Tirar um ${i.nome}`}
                            disabled={!qtd[i.id]}
                            style={!qtd[i.id] ? { visibility: 'hidden' } : undefined}
                          >
                            −
                          </button>
                          <output aria-label={`Quantidade de ${i.nome}`}>{qtd[i.id] ?? 0}</output>
                          <button type="button" onClick={() => mudar(i.id, 1)} aria-label={`Adicionar um ${i.nome}`}>
                            +
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <aside id="pedido" className="rest-pedido" aria-labelledby="rest-pedido-titulo">
            <h2 id="rest-pedido-titulo" className="ex-titulo">
              Seu pedido
            </h2>
            {itens.length === 0 ? (
              <p className="rest-vazio">Use o + do cardápio para adicionar itens.</p>
            ) : (
              <ul className="rest-pedido-lista">
                {itens.map((i) => (
                  <li key={i.id}>
                    <span>
                      {qtd[i.id]}× {i.nome}
                    </span>
                    <span>{reais(i.preco * qtd[i.id])}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="rest-total" aria-live="polite">
              <span>Total</span>
              <span>{reais(total)}</span>
            </p>
            <fieldset>
              <legend className="ex-legenda">Como prefere?</legend>
              <div className="rest-entrega">
                <label>
                  <input
                    type="radio"
                    name="entrega"
                    checked={entrega === 'retirar'}
                    onChange={() => setEntrega('retirar')}
                  />
                  Retirar no balcão
                </label>
                <label>
                  <input
                    type="radio"
                    name="entrega"
                    checked={entrega === 'entregar'}
                    onChange={() => setEntrega('entregar')}
                  />
                  Entrega
                </label>
              </div>
            </fieldset>
            {erro && (
              <p className="ex-erro" role="alert">
                {erro}
              </p>
            )}
            <button className="ex-btn" type="button" onClick={enviar}>
              Enviar pedido pelo WhatsApp
            </button>
          </aside>
        </div>
      </main>

      <footer className="ex-wrap ex-rodape">
        <span>{NEGOCIO} · restaurante fictício</span>
        <span>Rua Exemplo, 300 · Vila Nova · todos os dias, das 11h às 15h</span>
      </footer>

      <AvisoWhatsApp aviso={aviso} aoFechar={() => setAviso(null)} />
    </>
  )
}
