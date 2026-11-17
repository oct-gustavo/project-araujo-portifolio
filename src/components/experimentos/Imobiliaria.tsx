'use client'

import { useEffect, useRef, useState } from 'react'
import { reais } from '@/lib/experimentos'
import { AvisoWhatsApp, FaixaExperimento } from './Comum'

const NEGOCIO = 'Casa Exemplo'

const TIPOS = ['Apartamento', 'Casa', 'Comércio'] as const
/** Cidades de exemplo (fictícias). */
const CIDADES = ['Porto Claro', 'Vale Verde', 'Serra Azul', 'Lagoa Clara'] as const
/** Bairros de exemplo de cada cidade. */
const BAIRROS: Record<(typeof CIDADES)[number], string[]> = {
  'Porto Claro': ['Centro', 'Beira-mar'],
  'Vale Verde': ['Centro', 'Jardim das Flores'],
  'Serra Azul': ['Centro', 'Alto da Serra'],
  'Lagoa Clara': ['Vila Nova', 'Margem Sul'],
}
/** "Centro" existe em várias cidades: o filtro guarda cidade e bairro juntos. */
const chaveBairro = (cidade: string, bairro: string) => `${cidade}|${bairro}`

type Finalidade = 'comprar' | 'alugar'

type Imovel = {
  cod: string
  finalidade: Finalidade
  tipo: (typeof TIPOS)[number]
  cidade: (typeof CIDADES)[number]
  bairro: string
  /** 0 para imóveis comerciais. */
  quartos: number
  area: number
  vagas: number
  /** Valor de venda ou aluguel mensal. */
  preco: number
  cor: string
  destaque?: string
}

/** Imóveis fictícios. */
const IMOVEIS: Imovel[] = [
  { cod: 'CE-101', finalidade: 'comprar', tipo: 'Apartamento', cidade: 'Porto Claro', bairro: 'Centro', quartos: 2, area: 68, vagas: 1, preco: 420000, cor: '#C9D3E0', destaque: 'Novo' },
  { cod: 'CE-102', finalidade: 'comprar', tipo: 'Casa', cidade: 'Vale Verde', bairro: 'Jardim das Flores', quartos: 3, area: 140, vagas: 2, preco: 690000, cor: '#D8D2C2' },
  { cod: 'CE-103', finalidade: 'comprar', tipo: 'Apartamento', cidade: 'Porto Claro', bairro: 'Beira-mar', quartos: 4, area: 180, vagas: 3, preco: 1250000, cor: '#BFCBBF', destaque: 'Vista mar' },
  { cod: 'CE-104', finalidade: 'comprar', tipo: 'Comércio', cidade: 'Serra Azul', bairro: 'Centro', quartos: 0, area: 120, vagas: 2, preco: 540000, cor: '#CFC6D6', destaque: 'Esquina' },
  { cod: 'CE-107', finalidade: 'comprar', tipo: 'Casa', cidade: 'Serra Azul', bairro: 'Alto da Serra', quartos: 4, area: 220, vagas: 3, preco: 980000, cor: '#D6CDB8', destaque: 'Piscina' },
  { cod: 'CE-108', finalidade: 'comprar', tipo: 'Comércio', cidade: 'Vale Verde', bairro: 'Centro', quartos: 0, area: 65, vagas: 1, preco: 310000, cor: '#C8CEDC' },
  { cod: 'CE-105', finalidade: 'alugar', tipo: 'Apartamento', cidade: 'Lagoa Clara', bairro: 'Vila Nova', quartos: 1, area: 42, vagas: 1, preco: 1400, cor: '#E0D3C4' },
  { cod: 'CE-106', finalidade: 'alugar', tipo: 'Casa', cidade: 'Lagoa Clara', bairro: 'Margem Sul', quartos: 2, area: 90, vagas: 1, preco: 2100, cor: '#C4D3CF' },
  { cod: 'CE-109', finalidade: 'alugar', tipo: 'Apartamento', cidade: 'Porto Claro', bairro: 'Beira-mar', quartos: 3, area: 98, vagas: 2, preco: 3800, cor: '#D3CCE0', destaque: 'Mobiliado' },
  { cod: 'CE-110', finalidade: 'alugar', tipo: 'Comércio', cidade: 'Porto Claro', bairro: 'Centro', quartos: 0, area: 80, vagas: 1, preco: 4500, cor: '#D9D0BF', destaque: 'Térreo' },
  { cod: 'CE-111', finalidade: 'alugar', tipo: 'Casa', cidade: 'Vale Verde', bairro: 'Jardim das Flores', quartos: 3, area: 150, vagas: 2, preco: 2800, cor: '#C6D6C2' },
  { cod: 'CE-112', finalidade: 'alugar', tipo: 'Apartamento', cidade: 'Serra Azul', bairro: 'Alto da Serra', quartos: 2, area: 60, vagas: 1, preco: 1900, cor: '#CBD5DD' },
]

type Filtro = { tipo: string; cidade: string; bairro: string; quartos: number }
const SEM_FILTRO: Filtro = { tipo: '', cidade: '', bairro: '', quartos: 0 }

const passa = (i: Imovel, f: Filtro) =>
  (!f.tipo || i.tipo === f.tipo) &&
  (!f.cidade || i.cidade === f.cidade) &&
  (!f.bairro || chaveBairro(i.cidade, i.bairro) === f.bairro) &&
  i.quartos >= f.quartos

const local = (i: Imovel) => `${i.bairro}, ${i.cidade}`
const nomeImovel = (i: Imovel) => `${i.tipo} · ${local(i)}`
const comercial = (i: Imovel) => i.quartos === 0
const valor = (i: Imovel) => (i.finalidade === 'alugar' ? `${reais(i.preco)}/mês` : reais(i.preco))

export function Imobiliaria() {
  /** Comprar/Alugar troca a lista na hora; os outros filtros valem ao clicar em Buscar. */
  const [finalidade, setFinalidade] = useState<Finalidade>('comprar')
  const [rascunho, setRascunho] = useState<Filtro>(SEM_FILTRO)
  const [filtro, setFiltro] = useState<Filtro>(SEM_FILTRO)
  const [aberto, setAberto] = useState<Imovel | null>(null)
  const [aviso, setAviso] = useState<{ negocio: string; mensagem: string } | null>(null)
  const ficha = useRef<HTMLDialogElement>(null)

  const lista = IMOVEIS.filter((i) => i.finalidade === finalidade && passa(i, filtro))
  const alugar = finalidade === 'alugar'

  useEffect(() => {
    const d = ficha.current
    if (!d) return
    if (aberto && !d.open) d.showModal()
    if (!aberto && d.open) d.close()
  }, [aberto])

  const falar = (i: Imovel | null) => {
    const mensagem = i
      ? `Olá! Vi no site o imóvel ${i.cod} (${i.tipo.toLowerCase()} no bairro ${i.bairro}, em ${i.cidade}, ${i.finalidade === 'alugar' ? 'para alugar por' : 'à venda por'} ${valor(i)}) e gostaria de mais informações.`
      : 'Olá! Vim pelo site e gostaria de ajuda para encontrar um imóvel.'
    setAberto(null)
    setAviso({ negocio: NEGOCIO, mensagem })
  }

  const limpar = () => {
    setRascunho(SEM_FILTRO)
    setFiltro(SEM_FILTRO)
  }

  return (
    <>
      <FaixaExperimento />
      <header className="ex-wrap ex-cab">
        <a className="ex-logo" href="#inicio">
          {NEGOCIO}
        </a>
        <nav className="ex-menu" aria-label="Menu">
          <a href="#imoveis">Imóveis</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="imob-hero" aria-labelledby="imob-titulo">
          <div className="ex-wrap imob-hero-in">
            <h1 id="imob-titulo" className="ex-titulo">
              Encontre seu <em>próximo lar</em>
            </h1>
            <p>Apartamentos, casas e pontos comerciais selecionados, com visita marcada direto com o corretor.</p>
            <form
              className="imob-busca"
              role="search"
              aria-label="Buscar imóveis"
              onSubmit={(e) => {
                e.preventDefault()
                setFiltro(rascunho)
                document.getElementById('imoveis')?.scrollIntoView()
              }}
            >
              <fieldset className="imob-finalidade">
                <legend className="sr-only">Quero</legend>
                {(
                  [
                    ['comprar', 'Comprar'],
                    ['alugar', 'Alugar'],
                  ] as const
                ).map(([v, rotulo]) => (
                  <label key={v}>
                    <input
                      type="radio"
                      name="finalidade"
                      value={v}
                      checked={finalidade === v}
                      onChange={() => setFinalidade(v)}
                    />
                    <span>{rotulo}</span>
                  </label>
                ))}
              </fieldset>
              <div className="ex-campo">
                <label htmlFor="imob-tipo">Tipo</label>
                <select id="imob-tipo" value={rascunho.tipo} onChange={(e) => setRascunho({ ...rascunho, tipo: e.target.value })}>
                  <option value="">Todos</option>
                  {TIPOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="ex-campo">
                <label htmlFor="imob-cidade">Cidade</label>
                <select
                  id="imob-cidade"
                  value={rascunho.cidade}
                  onChange={(e) => {
                    const cidade = e.target.value
                    const manter = cidade && rascunho.bairro.startsWith(`${cidade}|`)
                    setRascunho({ ...rascunho, cidade, bairro: manter ? rascunho.bairro : '' })
                  }}
                >
                  <option value="">Todas</option>
                  {CIDADES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="ex-campo">
                <label htmlFor="imob-bairro">Bairro</label>
                <select
                  id="imob-bairro"
                  value={rascunho.bairro}
                  onChange={(e) => {
                    const bairro = e.target.value
                    // Escolher um bairro também escolhe a cidade dele.
                    setRascunho({ ...rascunho, bairro, cidade: bairro ? bairro.split('|')[0] : rascunho.cidade })
                  }}
                >
                  <option value="">Todos</option>
                  {rascunho.cidade
                    ? BAIRROS[rascunho.cidade as keyof typeof BAIRROS].map((b) => (
                        <option key={b} value={chaveBairro(rascunho.cidade, b)}>
                          {b}
                        </option>
                      ))
                    : CIDADES.map((c) => (
                        <optgroup key={c} label={c}>
                          {BAIRROS[c].map((b) => (
                            <option key={b} value={chaveBairro(c, b)}>
                              {b}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                </select>
              </div>
              <div className="ex-campo">
                <label htmlFor="imob-quartos">Quartos</label>
                <select
                  id="imob-quartos"
                  value={rascunho.quartos}
                  onChange={(e) => setRascunho({ ...rascunho, quartos: Number(e.target.value) })}
                >
                  <option value={0}>Qualquer</option>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </div>
              <button className="ex-btn" type="submit">
                Buscar
              </button>
            </form>
          </div>
        </section>

        <section id="imoveis" className="ex-wrap ex-secao" aria-labelledby="imob-lista-titulo">
          <div className="imob-lista-cab">
            <h2 id="imob-lista-titulo" className="ex-titulo ex-h2">
              {alugar ? 'Imóveis para alugar' : 'Imóveis à venda'}
            </h2>
            <p className="ex-vivo" aria-live="polite">
              {lista.length === 1 ? '1 imóvel encontrado' : `${lista.length} imóveis encontrados`}
            </p>
          </div>
          {lista.length > 0 ? (
            <ul className="imob-lista">
              {lista.map((i) => (
                <li key={i.cod} className="imob-card">
                  <div className="imob-foto" style={{ background: i.cor }} aria-hidden="true">
                    {i.destaque && <span>{i.destaque}</span>}
                  </div>
                  <div className="imob-card-txt">
                    <h3>{i.tipo}</h3>
                    <p className="imob-local">{local(i)}</p>
                    <p className="imob-dados">
                      {comercial(i) ? 'Ponto comercial' : `${i.quartos} ${i.quartos === 1 ? 'quarto' : 'quartos'}`} ·{' '}
                      {i.area} m² · {i.vagas} {i.vagas === 1 ? 'vaga' : 'vagas'}
                    </p>
                    <p className="imob-preco">{valor(i)}</p>
                    <button className="ex-btn ex-btn-linha" type="button" onClick={() => setAberto(i)}>
                      Ver detalhes<span className="sr-only"> de {nomeImovel(i)}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="imob-vazio">
              <p>Nenhum imóvel com esses filtros. Tente outro bairro, outra cidade ou menos quartos.</p>
              <button className="ex-btn ex-btn-linha" type="button" onClick={limpar}>
                Limpar filtros
              </button>
            </div>
          )}
        </section>

        <section id="sobre" className="ex-wrap ex-secao" aria-labelledby="imob-sobre-titulo">
          <div className="ex-secao-cab">
            <h2 id="imob-sobre-titulo" className="ex-titulo ex-h2">
              Como a Casa Exemplo trabalha
            </h2>
            <p className="ex-texto">Atendimento de perto, do primeiro contato até a entrega das chaves.</p>
          </div>
          <ul className="imob-sobre">
            <li>
              <h3>Visita marcada</h3>
              <p>Você escolhe o imóvel e combina o melhor horário direto com o corretor.</p>
            </li>
            <li>
              <h3>Documentação em dia</h3>
              <p>Cada imóvel é conferido antes de entrar no catálogo.</p>
            </li>
            <li>
              <h3>Financiamento</h3>
              <p>Ajudamos a simular e a reunir os papéis para o banco.</p>
            </li>
          </ul>
        </section>

        <section id="contato" className="imob-contato" aria-labelledby="imob-contato-titulo">
          <div className="ex-wrap ex-secao">
            <div className="ex-secao-cab">
              <h2 id="imob-contato-titulo" className="ex-titulo ex-h2">
                Não achou o que procura?
              </h2>
              <p>Conte o que você precisa e o corretor separa opções para você.</p>
            </div>
            <button className="ex-btn" type="button" onClick={() => falar(null)}>
              Falar com o corretor
            </button>
          </div>
        </section>
      </main>

      <footer className="ex-wrap ex-rodape">
        <span>{NEGOCIO} · imobiliária fictícia</span>
        <span>Rua Exemplo, 100 · Centro</span>
      </footer>

      <dialog
        ref={ficha}
        className="imob-ficha"
        aria-labelledby="imob-ficha-titulo"
        onClose={() => setAberto(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setAberto(null)
        }}
      >
        {aberto && (
          <>
            <div className="imob-ficha-foto" style={{ background: aberto.cor }} aria-hidden="true" />
            <div className="imob-ficha-in">
              <p className="imob-dados">Código {aberto.cod}</p>
              <h2 id="imob-ficha-titulo">{nomeImovel(aberto)}</h2>
              <p className="imob-preco">
                {aberto.finalidade === 'alugar' ? 'Aluguel ' : 'Venda '}
                {valor(aberto)}
              </p>
              <dl>
                <div>
                  <dt>{comercial(aberto) ? 'Uso' : 'Quartos'}</dt>
                  <dd>{comercial(aberto) ? 'Comercial' : aberto.quartos}</dd>
                </div>
                <div>
                  <dt>Área</dt>
                  <dd>{aberto.area} m²</dd>
                </div>
                <div>
                  <dt>Vagas</dt>
                  <dd>{aberto.vagas}</dd>
                </div>
              </dl>
              <div className="imob-ficha-acoes">
                <button className="ex-btn" type="button" onClick={() => falar(aberto)}>
                  Falar com o corretor
                </button>
                <button className="ex-btn ex-btn-linha" type="button" onClick={() => setAberto(null)}>
                  Fechar
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>

      <AvisoWhatsApp aviso={aviso} aoFechar={() => setAviso(null)} />
    </>
  )
}
