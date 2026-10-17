'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { usePathname } from 'next/navigation'
import { linkWhatsapp } from '@/lib/portfolio'
import { EVENTO_ENVIO, MAX_ENVIOS, lerEnvios, mmss, registrarEnvio, situacaoEnvios } from '@/lib/limiteEnvios'
import './assistente.css'

/* ------------------------------------------------------------------ roteiro */

const TIPOS = [
  'Site institucional',
  'Página para captar clientes',
  'Algo diferenciado',
  'Sistema / área administrativa',
  'Ainda não sei',
] as const
const PRAZOS = ['O quanto antes', 'Nos próximos meses', 'Só pesquisando por enquanto'] as const

type Respostas = { tipo?: string; prazo?: string; nome?: string; empresa?: string; ideia?: string }
/** 0 = boas-vindas · 1 tipo · 2 prazo · 3 nome · 4 ideia · 5 resumo */
type Passo = 0 | 1 | 2 | 3 | 4 | 5

const CHAVE_CONVERSA = 'araujo:assistente'
const CHAVE_DICA = 'araujo:assistente-dica'
const ATRASO_DICA_MS = 15000
const DIGITANDO_MS = 650
const LIMITE_IDEIA = 300

const primeiroNome = (nome = '') => nome.trim().split(/\s+/)[0] ?? ''

function perguntas(r: Respostas): string[] {
  return [
    'O que você quer criar?',
    'Boa. E para quando você imagina?',
    'Como posso te chamar?',
    `Prazer, ${primeiroNome(r.nome)}! Quer contar a ideia em uma frase? É opcional.`,
    'Pronto! Confira o resumo abaixo. A mensagem abre pronta no WhatsApp — você revisa e envia.',
  ]
}

function respostasDitas(r: Respostas): string[] {
  return [
    'Vamos lá',
    r.tipo ?? '',
    r.prazo ?? '',
    r.nome ? r.nome + (r.empresa ? ` · ${r.empresa}` : '') : '',
    r.ideia || 'Prefiro pular',
  ]
}

function mensagemWhatsapp(r: Respostas, origem?: string): string {
  return [
    'Olá, Gustavo! Vim pelo assistente do seu site.',
    '',
    `Nome: ${r.nome ?? ''}`,
    ...(r.empresa ? [`Empresa/negócio: ${r.empresa}`] : []),
    `Tipo de projeto: ${r.tipo ?? ''}`,
    `Prazo: ${r.prazo ?? ''}`,
    ...(origem ? [`Vi o projeto: ${origem}`] : []),
    ...(r.ideia ? ['', `Sobre a ideia: ${r.ideia}`] : []),
  ].join('\n')
}

/** Progresso salvo só durante a visita (sessionStorage): segue entre as páginas do site. */
function lerConversa(): { passo: Passo; r: Respostas } | null {
  try {
    const bruto = JSON.parse(window.sessionStorage.getItem(CHAVE_CONVERSA) ?? 'null')
    if (!bruto || typeof bruto !== 'object') return null
    const passo = Number(bruto.passo)
    if (!Number.isInteger(passo) || passo < 0 || passo > 5) return null
    const r: Respostas = {}
    for (const k of ['tipo', 'prazo', 'nome', 'empresa', 'ideia'] as const) {
      if (typeof bruto.r?.[k] === 'string') r[k] = bruto.r[k].slice(0, k === 'ideia' ? LIMITE_IDEIA : 80)
    }
    return { passo: passo as Passo, r }
  } catch {
    return null
  }
}
function gravar(chave: string, valor: unknown) {
  try {
    window.sessionStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    /* navegação privada: o progresso vale só enquanto a página estiver aberta */
  }
}

/* ------------------------------------------------------------------- ícones */

function SimboloA({ tamanho, cursor = true }: { tamanho: number; cursor?: boolean }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 28 L12.5 4 H16.5 L26 28 H21.8 L19.7 22.5 H9.3 L7.2 28 Z M10.8 18.6 H18.2 L14.5 8.9 Z"
      />
      {cursor && <rect x="27" y="24" width="4" height="4" fill="#9483F2" />}
    </svg>
  )
}

/* -------------------------------------------------------------- componente */

type Props = {
  /** Esconde tudo (ex.: enquanto o tour guiado está aberto). */
  oculto?: boolean
  /** Nome do projeto da página, entra na mensagem ("Vi o projeto: …"). */
  origem?: string
}

/**
 * Assistente de conversa: balão no canto, 4 perguntas com botões e entrega no WhatsApp
 * com tudo resumido. Não há servidor nem robô de verdade: é um roteiro fixo no navegador.
 */
export function AssistenteConversa({ oculto = false, origem }: Props) {
  const naHome = usePathname() === '/'
  const [aberto, setAberto] = useState(false)
  const [passo, setPasso] = useState<Passo>(0)
  const [r, setR] = useState<Respostas>({})
  const [digitando, setDigitando] = useState(false)
  const [erroNome, setErroNome] = useState('')
  const [dica, setDica] = useState(false)
  const [contatoNaTela, setContatoNaTela] = useState(false)
  const [envios, setEnvios] = useState<number[]>([])
  const [agora, setAgora] = useState(0)
  const [abriu, setAbriu] = useState(false)
  const [semNumero, setSemNumero] = useState(false)
  const [carregado, setCarregado] = useState(false)

  const lancador = useRef<HTMLButtonElement>(null)
  const painel = useRef<HTMLElement>(null)
  const log = useRef<HTMLDivElement>(null)
  const focarResposta = useRef(false)
  const avisoLimite = useRef<HTMLParagraphElement>(null)
  const timer = useRef<number | undefined>(undefined)

  // Retoma a conversa da visita e lê o limite de envios.
  useEffect(() => {
    const salvo = lerConversa()
    if (salvo) {
      setPasso(salvo.passo)
      setR(salvo.r)
    }
    const ler = () => {
      setEnvios(lerEnvios())
      setAgora(Date.now())
    }
    ler()
    setCarregado(true)
    window.addEventListener(EVENTO_ENVIO, ler)
    return () => window.removeEventListener(EVENTO_ENVIO, ler)
  }, [])

  useEffect(() => {
    if (carregado) gravar(CHAVE_CONVERSA, { passo, r })
  }, [carregado, passo, r])

  // Dica discreta: uma vez por visita, depois de alguns segundos.
  useEffect(() => {
    if (oculto || aberto) return
    let visto = false
    try {
      visto = window.sessionStorage.getItem(CHAVE_DICA) === '1'
    } catch {}
    if (visto) return
    const t = window.setTimeout(() => {
      setDica(true)
      gravar(CHAVE_DICA, 1)
    }, ATRASO_DICA_MS)
    return () => window.clearTimeout(t)
  }, [oculto, aberto])

  // Na página inicial, o balão sai de cena enquanto o formulário de contato está na tela.
  useEffect(() => {
    if (!naHome) return
    const alvo = document.getElementById('contato')
    if (!alvo || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(([e]) => setContatoNaTela(e.isIntersecting), { threshold: 0.2 })
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [naHome])

  // O tour abriu com a conversa aberta: fecha sem roubar o foco do tour.
  useEffect(() => {
    if (oculto) {
      setAberto(false)
      setDica(false)
    }
  }, [oculto])

  const { bloqueadoAte } = situacaoEnvios(envios, agora || Date.now())
  const bloqueado = bloqueadoAte !== null
  useEffect(() => {
    if (!bloqueado) return
    const t = window.setInterval(() => setAgora(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [bloqueado])

  const fechar = useCallback((devolverFoco = true) => {
    setAberto(false)
    if (devolverFoco) requestAnimationFrame(() => lancador.current?.focus())
  }, [])

  function abrir() {
    setAberto(true)
    setDica(false)
    gravar(CHAVE_DICA, 1)
    focarResposta.current = true
  }

  /** Vai para um passo, com o "digitando…" curto antes da próxima pergunta. */
  function ir(novo: Passo, respostas: Respostas = r) {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setR(respostas)
    setPasso(novo)
    setErroNome('')
    setAbriu(false)
    setSemNumero(false)
    window.clearTimeout(timer.current)
    if (reduzir) setDigitando(false)
    else {
      setDigitando(true)
      timer.current = window.setTimeout(() => setDigitando(false), DIGITANDO_MS)
    }
    focarResposta.current = true
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Esc fecha a conversa.
  useEffect(() => {
    if (!aberto) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const ativo = document.activeElement
      fechar(!ativo || ativo === document.body || (painel.current?.contains(ativo) ?? false))
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [aberto, fechar])

  // Rola até a última mensagem e leva o foco para a próxima resposta.
  useLayoutEffect(() => {
    if (!aberto) return
    const el = log.current
    if (el) el.scrollTop = el.scrollHeight
    if (focarResposta.current && !digitando) {
      focarResposta.current = false
      painel.current
        ?.querySelector<HTMLElement>('.cw-resp input, .cw-resp textarea, .cw-resp button, .cw-resp a')
        ?.focus({ preventScroll: true })
    }
  }, [aberto, passo, digitando, abriu])

  function enviarNome(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const f = ev.currentTarget.elements
    const campoNome = f.namedItem('nome') as HTMLInputElement
    const nome = campoNome.value.trim().replace(/\s+/g, ' ')
    const empresa = (f.namedItem('empresa') as HTMLInputElement).value.trim().replace(/\s+/g, ' ')
    if ((nome.match(/\p{L}/gu) ?? []).length < 2) {
      setErroNome(nome ? 'O nome precisa ter pelo menos 2 letras.' : 'Escreva seu nome para continuar.')
      campoNome.focus()
      return
    }
    ir(4, { ...r, nome, empresa })
  }

  function enviarIdeia(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const ideia = (ev.currentTarget.elements.namedItem('ideia') as HTMLTextAreaElement).value.trim()
    ir(5, { ...r, ideia })
  }

  function abrirWhatsapp() {
    setSemNumero(false)
    if (bloqueado) return
    const link = linkWhatsapp(mensagemWhatsapp(r, origem))
    if (!link) {
      setSemNumero(true)
      return
    }
    const lista = registrarEnvio()
    setEnvios(lista)
    setAgora(Date.now())
    window.open(link, '_blank', 'noopener,noreferrer')
    setAbriu(true)
    // Atingiu o limite agora: o botão some, então o foco vai para o aviso (não se perde na página).
    if (situacaoEnvios(lista, Date.now()).bloqueadoAte !== null) {
      requestAnimationFrame(() => avisoLimite.current?.focus())
    }
  }

  if (oculto) return null

  // Histórico: boas-vindas + pares (resposta da pessoa, próxima pergunta).
  const ditas = respostasDitas(r)
  const q = perguntas(r)
  const msgs: { de: 'bot' | 'eu'; texto: string }[] = [
    {
      de: 'bot',
      texto:
        'Oi! Eu sou o assistente do estúdio.\nEm 4 perguntas rápidas eu organizo a sua ideia e te levo direto para o WhatsApp do Gustavo.',
    },
  ]
  for (let i = 1; i <= passo; i++) {
    msgs.push({ de: 'eu', texto: ditas[i - 1] })
    if (!(i === passo && digitando)) msgs.push({ de: 'bot', texto: q[i - 1] })
  }
  const pronto = !digitando
  const etapa = passo === 5 ? 4 : Math.max(passo - 1, 0)
  const linkFormulario = naHome ? '#contato' : '/#contato'
  const escondido = !aberto && naHome && contatoNaTela

  return (
    <div className="cw">
      {dica && !aberto && !escondido && (
        <div className="cw-dica">
          <button className="cw-dica-x" type="button" aria-label="Fechar dica" onClick={() => setDica(false)}>
            ×
          </button>
          <p>
            <strong>Quer ajuda para começar?</strong>4 perguntas rápidas e eu te levo ao WhatsApp do Gustavo com tudo
            resumido.
          </p>
        </div>
      )}

      {aberto && (
        <section
          ref={painel}
          className="cw-painel"
          id="cw-painel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cw-titulo"
          aria-describedby="cw-sub"
        >
          <header className="cw-topo">
            <span className="cw-av" aria-hidden="true">
              <SimboloA tamanho={22} />
            </span>
            <div className="cw-quem">
              <h2 id="cw-titulo">Estúdio Araújo</h2>
              <p id="cw-sub">Assistente automático · sem cadastro</p>
            </div>
            {passo > 0 && (
              <button
                className="cw-ic"
                type="button"
                aria-label="Recomeçar a conversa"
                title="Recomeçar"
                onClick={() => ir(0, {})}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                </svg>
              </button>
            )}
            <button className="cw-ic" type="button" aria-label="Fechar conversa" title="Fechar (Esc)" onClick={() => fechar()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
          <div
            className="cw-prog"
            role="progressbar"
            aria-label="Perguntas respondidas"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={etapa}
          >
            {[0, 1, 2, 3].map((i) => (
              <i key={i} className={i < etapa ? 'on' : undefined} />
            ))}
          </div>

          <div ref={log} className="cw-log" role="log" aria-live="polite" aria-label="Conversa">
            {msgs.map((m, i) => (
              <p key={i} className={m.de === 'bot' ? 'cw-msg cw-bot' : 'cw-msg cw-eu'}>
                <span className="cw-sr">{m.de === 'bot' ? 'Assistente: ' : 'Você: '}</span>
                {m.texto}
              </p>
            ))}
            {digitando && (
              <div className="cw-dig" role="img" aria-label="Digitando">
                <i />
                <i />
                <i />
              </div>
            )}
            {passo === 5 && pronto && (
              <div className="cw-resumo">
                <h3>Resumo para o WhatsApp</h3>
                <dl>
                  <div>
                    <dt>Nome</dt>
                    <dd>{r.nome}</dd>
                  </div>
                  {r.empresa && (
                    <div>
                      <dt>Empresa</dt>
                      <dd>{r.empresa}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Projeto</dt>
                    <dd>{r.tipo}</dd>
                  </div>
                  <div>
                    <dt>Prazo</dt>
                    <dd>{r.prazo}</dd>
                  </div>
                  {origem && (
                    <div>
                      <dt>Vi o projeto</dt>
                      <dd>{origem}</dd>
                    </div>
                  )}
                  {r.ideia && (
                    <div>
                      <dt>Ideia</dt>
                      <dd>{r.ideia}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>

          <div className="cw-resp">
            {pronto && passo === 0 && (
              <div className="cw-ops">
                <button className="cw-op pri" type="button" onClick={() => ir(1)}>
                  Vamos lá <span aria-hidden="true">→</span>
                </button>
                <a className="cw-op" href={linkFormulario} onClick={() => fechar(false)}>
                  Prefiro o formulário
                </a>
              </div>
            )}

            {pronto && (passo === 1 || passo === 2) && (
              <>
                <p className="cw-resp-t" id="cw-opcoes">
                  {passo === 1 ? 'Tipo de projeto' : 'Prazo'} · escolha uma opção
                </p>
                <div className="cw-ops" role="group" aria-labelledby="cw-opcoes">
                  {(passo === 1 ? TIPOS : PRAZOS).map((o) => (
                    <button
                      key={o}
                      className="cw-op"
                      type="button"
                      onClick={() => (passo === 1 ? ir(2, { ...r, tipo: o }) : ir(3, { ...r, prazo: o }))}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                <div className="cw-linha">
                  <button className="cw-lk" type="button" onClick={() => ir((passo - 1) as Passo)}>
                    ← Voltar
                  </button>
                </div>
              </>
            )}

            {pronto && passo === 3 && (
              <form onSubmit={enviarNome} noValidate>
                <div className="cw-campo">
                  <label htmlFor="cw-nome">Seu nome</label>
                  <input
                    className="cw-in"
                    id="cw-nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    defaultValue={r.nome}
                    placeholder="Ex.: Ana Souza"
                    aria-required="true"
                    aria-invalid={erroNome ? true : undefined}
                    aria-describedby={erroNome ? 'cw-nome-erro' : undefined}
                    onChange={() => erroNome && setErroNome('')}
                  />
                  {erroNome && (
                    <p className="cw-err" id="cw-nome-erro">
                      {erroNome}
                    </p>
                  )}
                </div>
                <div className="cw-campo">
                  <label htmlFor="cw-emp">
                    Empresa ou negócio<small>opcional</small>
                  </label>
                  <input
                    className="cw-in"
                    id="cw-emp"
                    name="empresa"
                    type="text"
                    autoComplete="organization"
                    maxLength={80}
                    defaultValue={r.empresa}
                    placeholder="Ex.: Loja Flor de Lis"
                  />
                </div>
                <div className="cw-linha">
                  <button className="cw-lk" type="button" onClick={() => ir(2)}>
                    ← Voltar
                  </button>
                  <button className="cw-op pri" type="submit">
                    Continuar <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            )}

            {pronto && passo === 4 && (
              <form onSubmit={enviarIdeia} noValidate>
                <div className="cw-campo">
                  <label htmlFor="cw-ideia">
                    A ideia em uma frase<small>opcional</small>
                  </label>
                  <textarea
                    className="cw-in"
                    id="cw-ideia"
                    name="ideia"
                    maxLength={LIMITE_IDEIA}
                    defaultValue={r.ideia}
                    placeholder="Ex.: Quero mostrar meus arranjos e receber pedidos pelo WhatsApp."
                  />
                </div>
                <div className="cw-linha">
                  <button className="cw-lk" type="button" onClick={() => ir(5, { ...r, ideia: '' })}>
                    Pular
                  </button>
                  <button className="cw-op pri" type="submit">
                    Ver resumo <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            )}

            {pronto && passo === 5 && (
              <>
                {abriu && (
                  <p className="cw-ok" role="status">
                    Abri o WhatsApp em outra aba com a mensagem pronta. É só tocar em enviar.
                  </p>
                )}
                {semNumero && (
                  <p className="cw-ok" role="alert">
                    O WhatsApp ainda não está disponível por aqui.{' '}
                    <a href={linkFormulario} onClick={() => fechar(false)}>
                      Use o formulário de contato
                    </a>
                    .
                  </p>
                )}
                {bloqueado ? (
                  <p ref={avisoLimite} className="cw-ok" role="status" tabIndex={-1}>
                    Você já abriu {MAX_ENVIOS} conversas agora há pouco. Para evitar mensagens repetidas, aguarde{' '}
                    <strong>{mmss((bloqueadoAte ?? 0) - agora)}</strong>.
                  </p>
                ) : (
                  <button className="cw-op pri full" type="button" onClick={abrirWhatsapp}>
                    Abrir no WhatsApp <span aria-hidden="true">↗</span>
                    <span className="cw-sr"> (abre em outra aba)</span>
                  </button>
                )}
                <div className="cw-linha">
                  <button className="cw-lk" type="button" onClick={() => ir(4)}>
                    ← Corrigir algo
                  </button>
                  <button className="cw-lk" type="button" onClick={() => ir(0, {})}>
                    Recomeçar
                  </button>
                </div>
                <p className="cw-nota">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="4" y="10" width="16" height="11" rx="1" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  Nada fica gravado no site. A mensagem só sai quando você tocar em enviar no WhatsApp.
                </p>
              </>
            )}
          </div>
        </section>
      )}

      <button
        ref={lancador}
        type="button"
        className={`cw-lanc${aberto ? ' on' : ''}${escondido ? ' fora' : ''}`}
        aria-expanded={aberto}
        aria-controls={aberto ? 'cw-painel' : undefined}
        aria-hidden={escondido || undefined}
        tabIndex={escondido ? -1 : undefined}
        onClick={() => (aberto ? fechar() : abrir())}
      >
        <span className="cw-lanc-ico" aria-hidden="true">
          <SimboloA tamanho={18} cursor={false} />
          {!aberto && <i />}
        </span>
        <span className="cw-lanc-t">{aberto ? 'Fechar conversa' : 'Fale comigo'}</span>
      </button>
    </div>
  )
}
