'use client'

import { useState } from 'react'
import { reais } from '@/lib/experimentos'
import { AvisoWhatsApp, FaixaExperimento } from './Comum'
import { FundoVideo } from './FundoVideo'

const NEGOCIO = 'Barbearia Exemplo'

/** Serviços e preços fictícios. */
const SERVICOS = [
  { nome: 'Corte', detalhe: 'Tesoura ou máquina, com lavagem', duracao: '40 min', preco: 45 },
  { nome: 'Barba', detalhe: 'Toalha quente e navalha', duracao: '30 min', preco: 35 },
  { nome: 'Corte e barba', detalhe: 'O combo completo', duracao: '1h10', preco: 70 },
  { nome: 'Sobrancelha', detalhe: 'Acabamento na navalha', duracao: '15 min', preco: 15 },
]

const DIAS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const HORARIOS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30']
/** Alguns horários aparecem como ocupados (fixos, para a demonstração). */
const ocupado = (dia: number, hora: number) => (dia * 3 + hora * 2) % 5 === 0

type Escolha = { servico: string; dia: number | null; hora: string }

export function Barbearia() {
  const [escolha, setEscolha] = useState<Escolha>({ servico: '', dia: null, hora: '' })
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState<{ negocio: string; mensagem: string } | null>(null)

  const confirmar = (e: React.FormEvent) => {
    e.preventDefault()
    const falta = !escolha.servico ? 'o serviço' : escolha.dia === null ? 'o dia' : !escolha.hora ? 'o horário' : ''
    if (falta) {
      setErro(`Escolha ${falta} para continuar.`)
      return
    }
    setErro('')
    const dia = DIAS[escolha.dia!].toLowerCase()
    setAviso({
      negocio: NEGOCIO,
      mensagem: `Olá! Quero agendar ${escolha.servico.toLowerCase()} na ${dia} às ${escolha.hora}. Pode confirmar?`,
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
          <a href="#servicos">Serviços</a>
          <a href="#agendar">Agendar</a>
          <a href="#onde">Onde fica</a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="barb-faixa" aria-labelledby="barb-titulo">
          <FundoVideo className="barb-fundo" base="/experimentos/midia/barbearia-base.mp4" />
          <div className="ex-wrap barb-faixa-in">
            <h1 id="barb-titulo" className="ex-titulo">
              Corte e barba, <em>no seu horário</em>
            </h1>
            <p>Escolha o serviço, o dia e o horário. A confirmação chega pelo WhatsApp.</p>
            <a className="ex-btn" href="#agendar">
              Agendar horário
            </a>
          </div>
        </section>

        <div className="ex-wrap barb-hero">
          <section id="servicos" className="barb-hero-txt" aria-labelledby="barb-servicos-titulo">
            <h2 id="barb-servicos-titulo" className="sr-only">
              Serviços e preços
            </h2>
            <ul className="barb-servicos">
              {SERVICOS.map((s) => (
                <li key={s.nome}>
                  <b>{s.nome}</b>
                  <small>
                    {s.detalhe} · {s.duracao}
                  </small>
                  <span>{reais(s.preco)}</span>
                </li>
              ))}
            </ul>
          </section>

          <form id="agendar" className="barb-agenda" onSubmit={confirmar} aria-labelledby="barb-agenda-titulo" noValidate>
            <h2 id="barb-agenda-titulo">Agendar horário</h2>

            <fieldset>
              <legend className="ex-legenda">1. Serviço</legend>
              <div className="barb-opcoes">
                {SERVICOS.map((s) => (
                  <label key={s.nome} className="barb-opcao">
                    <input
                      type="radio"
                      name="servico"
                      value={s.nome}
                      checked={escolha.servico === s.nome}
                      onChange={() => setEscolha({ ...escolha, servico: s.nome })}
                    />
                    <span>{s.nome}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="ex-legenda">2. Dia</legend>
              <div className="barb-opcoes">
                {DIAS.map((d, i) => (
                  <label key={d} className="barb-opcao">
                    <input
                      type="radio"
                      name="dia"
                      value={d}
                      checked={escolha.dia === i}
                      onChange={() => setEscolha({ ...escolha, dia: i, hora: '' })}
                    />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="ex-legenda">3. Horário</legend>
              {escolha.dia === null ? (
                <p className="barb-resumo">Escolha o dia para ver os horários livres.</p>
              ) : (
                <div className="barb-opcoes">
                  {HORARIOS.map((h, j) => {
                    const cheio = ocupado(escolha.dia!, j)
                    return (
                      <label key={h} className="barb-opcao">
                        <input
                          type="radio"
                          name="hora"
                          value={h}
                          disabled={cheio}
                          checked={escolha.hora === h}
                          onChange={() => setEscolha({ ...escolha, hora: h })}
                        />
                        <span>
                          {h}
                          {cheio && <span className="sr-only"> (ocupado)</span>}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </fieldset>

            <p className="barb-resumo" aria-live="polite">
              {escolha.servico && escolha.dia !== null && escolha.hora ? (
                <>
                  <b>{escolha.servico}</b> na {DIAS[escolha.dia].toLowerCase()} às <b>{escolha.hora}</b>
                </>
              ) : (
                'Nenhum horário escolhido ainda.'
              )}
            </p>
            {erro && (
              <p className="ex-erro" role="alert">
                {erro}
              </p>
            )}
            <button className="ex-btn" type="submit">
              Confirmar pelo WhatsApp
            </button>
          </form>
        </div>

        <section id="onde" className="ex-wrap ex-secao" aria-labelledby="barb-onde-titulo">
          <h2 id="barb-onde-titulo" className="ex-titulo ex-h2" style={{ textTransform: 'uppercase' }}>
            Onde fica
          </h2>
          <ul className="barb-onde">
            <li>
              <h3>Endereço</h3>
              <p>Rua Exemplo, 200 · Centro</p>
            </li>
            <li>
              <h3>Horário</h3>
              <p>Terça a sábado, das 9h às 19h</p>
            </li>
            <li>
              <h3>Pagamento</h3>
              <p>Pix, cartão ou dinheiro</p>
            </li>
          </ul>
        </section>
      </main>

      <footer className="ex-wrap ex-rodape">
        <span>{NEGOCIO} · barbearia fictícia</span>
        <span>Preços e horários de exemplo</span>
      </footer>

      <AvisoWhatsApp aviso={aviso} aoFechar={() => setAviso(null)} />
    </>
  )
}
