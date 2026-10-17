'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { linkWhatsapp } from '@/lib/portfolio'
import { MAX_ENVIOS, lerEnvios, mmss, registrarEnvio, situacaoEnvios, EVENTO_ENVIO } from '@/lib/limiteEnvios'

/* ------------------------------------------------------------------ regras */

const TIPOS = [
  { valor: 'Presença', rotulo: 'Site institucional' },
  { valor: 'Conversão', rotulo: 'Página para captar clientes' },
  { valor: 'Experiência', rotulo: 'Algo diferenciado' },
  { valor: 'Sistemas', rotulo: 'Sistema / área administrativa' },
  { valor: 'Ainda não sei', rotulo: 'Ainda não sei' },
] as const

const LIMITE_IDEIA = 1200

type Campo = 'nome' | 'telefone' | 'email' | 'ideia'
type Valores = Record<Campo, string>
type Erros = Partial<Record<Campo, string>>

const ORDEM: Campo[] = ['nome', 'ideia', 'telefone', 'email']

/** Só dígitos, no máximo 11 (DDD + 9 dígitos). */
const digitos = (v: string) => v.replace(/\D/g, '').slice(0, 11)

/** Máscara progressiva: (11) 98765-4321 ou (11) 3456-7890. */
export function mascararTelefone(v: string): string {
  const d = digitos(v)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  const ddd = d.slice(0, 2)
  const resto = d.slice(2)
  if (resto.length <= 4) return `(${ddd}) ${resto}`
  const meio = resto.length === 9 ? 5 : 4
  return `(${ddd}) ${resto.slice(0, meio)}-${resto.slice(meio)}`
}

function validar(campo: Campo, v: Valores): string | undefined {
  const valor = v[campo].trim()
  switch (campo) {
    case 'nome':
      if (!valor) return 'Escreva seu nome para eu saber com quem estou falando.'
      if ((valor.match(/\p{L}/gu) ?? []).length < 2) return 'O nome precisa ter pelo menos 2 letras.'
      return
    case 'telefone': {
      if (!valor) return
      const d = digitos(valor)
      if (d.length < 10) return 'Número incompleto. Use DDD + número, ex.: (11) 98765-4321.'
      if (Number(d.slice(0, 2)) < 11) return 'Confira o DDD — ele vai de 11 a 99.'
      if (d.length === 11 && d[2] !== '9') return 'Celular com 11 dígitos começa com 9 depois do DDD.'
      return
    }
    case 'email':
      if (!valor) return
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return 'Esse e-mail parece incompleto. Ex.: nome@empresa.com.br'
      return
    case 'ideia':
      if (!valor) return 'Escreva pelo menos uma frase sobre o que você precisa.'
      if (valor.length < 10) return 'Conte um pouquinho mais (pelo menos 10 caracteres).'
      return
  }
}

function IconeErro() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v6M12 16.5v.5" />
    </svg>
  )
}

/* -------------------------------------------------------------- componente */

export function FormularioContato() {
  const [valores, setValores] = useState<Valores>({ nome: '', telefone: '', email: '', ideia: '' })
  const [tipo, setTipo] = useState<string>(TIPOS[0].valor)
  const [erros, setErros] = useState<Erros>({})
  const [mexidos, setMexidos] = useState<Partial<Record<Campo, boolean>>>({})
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [envios, setEnvios] = useState<number[]>([])
  const [agora, setAgora] = useState(0)
  const [enviado, setEnviado] = useState<string | null>(null)
  const [semNumero, setSemNumero] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const refs = {
    nome: useRef<HTMLInputElement>(null),
    telefone: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    ideia: useRef<HTMLTextAreaElement>(null),
  }

  // Lê o histórico de envios (fica no navegador da pessoa).
  // Também acompanha envios feitos pelo assistente de conversa (o limite é o mesmo).
  useEffect(() => {
    const ler = () => {
      setEnvios(lerEnvios())
      setAgora(Date.now())
    }
    ler()
    window.addEventListener(EVENTO_ENVIO, ler)
    return () => window.removeEventListener(EVENTO_ENVIO, ler)
  }, [])

  const { restantes, bloqueadoAte } = situacaoEnvios(envios, agora || Date.now())
  const bloqueado = bloqueadoAte !== null

  // Contagem regressiva enquanto estiver bloqueado.
  useEffect(() => {
    if (!bloqueado) return
    const t = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [bloqueado])

  // Qualquer link para #contato (botões "Vamos conversar", menu) leva ao formulário
  // e já deixa o primeiro campo selecionado.
  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function irParaFormulario(atualizarEndereco: boolean) {
      const form = formRef.current
      const nome = refs.nome.current
      if (!form || !nome) return
      // Posição pelo layout (offsetTop), não pelo retângulo na tela: o formulário entra com uma
      // animação de deslocamento e o retângulo ainda estaria "deslocado" no momento do clique.
      let topo = 0
      for (let el: HTMLElement | null = form; el; el = el.offsetParent as HTMLElement | null) topo += el.offsetTop
      window.scrollTo({ top: Math.max(0, topo - 96), behavior: reduzir ? 'auto' : 'smooth' })
      if (atualizarEndereco) history.replaceState(null, '', '#contato')
      let feito = false
      const focar = () => {
        if (feito) return
        feito = true
        nome.focus({ preventScroll: true })
      }
      if (reduzir) {
        focar()
        return
      }
      window.addEventListener('scrollend', focar, { once: true })
      window.setTimeout(focar, 900) // navegadores sem "scrollend"
    }

    function aoClicar(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href="#contato"]')
      if (!link) return
      e.preventDefault()
      irParaFormulario(true)
    }

    document.addEventListener('click', aoClicar)
    // Chegou pelo link direto (…/#contato): espera a abertura terminar e foca.
    let espera: number | undefined
    if (window.location.hash === '#contato') espera = window.setTimeout(() => irParaFormulario(false), reduzir ? 0 : 2500)
    return () => {
      document.removeEventListener('click', aoClicar)
      if (espera) window.clearTimeout(espera)
    }
  }, [])

  function atualizar(campo: Campo, valor: string) {
    const novos = { ...valores, [campo]: valor }
    setValores(novos)
    setEnviado(null)
    // Depois que o erro apareceu, ele some (ou muda) enquanto a pessoa corrige.
    if (erros[campo] !== undefined) setErros((e) => ({ ...e, [campo]: validar(campo, novos) }))
  }

  const aoDigitar = (campo: Campo) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!mexidos[campo]) setMexidos((m) => ({ ...m, [campo]: true }))
    let bruto = e.target.value
    if (campo === 'telefone') {
      // Apagou só um caractere da máscara ("-", ")", espaço)? Apaga o dígito anterior junto,
      // senão a máscara recolocaria o caractere e o campo pareceria travado.
      const antes = valores.telefone
      if (bruto.length < antes.length && digitos(bruto) === digitos(antes)) {
        const cursor = e.target.selectionStart ?? bruto.length
        const qtd = digitos(bruto.slice(0, cursor)).length
        const d = digitos(bruto)
        bruto = qtd > 0 ? d.slice(0, qtd - 1) + d.slice(qtd) : d
      }
      bruto = mascararTelefone(bruto)
    }
    atualizar(campo, bruto)
  }

  // Validação ao sair do campo (se a pessoa já escreveu algo nele ou já tentou enviar).
  const aoSair = (campo: Campo) => () => {
    if (!mexidos[campo] && !tentouEnviar) return
    setErros((e) => ({ ...e, [campo]: validar(campo, valores) }))
  }

  function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    setTentouEnviar(true)
    setSemNumero(false)
    if (bloqueado) return

    const novos: Erros = {}
    for (const c of ORDEM) novos[c] = validar(c, valores)
    setErros(novos)
    const primeiro = ORDEM.find((c) => novos[c])
    if (primeiro) {
      refs[primeiro].current?.focus()
      return
    }

    const v = Object.fromEntries(Object.entries(valores).map(([k, x]) => [k, x.trim()])) as Valores
    const empresa = (ev.currentTarget.elements.namedItem('empresa') as HTMLInputElement | null)?.value.trim() ?? ''
    const linhas = [
      'Olá, Gustavo! Vim pelo seu site.',
      '',
      `Nome: ${v.nome}`,
      ...(empresa ? [`Empresa/negócio: ${empresa}`] : []),
      `Tipo de projeto: ${TIPOS.find((t) => t.valor === tipo)?.rotulo ?? tipo}`,
      ...(v.telefone ? [`Telefone: ${v.telefone}`] : []),
      ...(v.email ? [`E-mail: ${v.email}`] : []),
      '',
      `Sobre a ideia: ${v.ideia}`,
    ]
    const link = linkWhatsapp(linhas.join('\n'))
    if (!link) {
      setSemNumero(true)
      return
    }

    const lista = registrarEnvio()
    setEnvios(lista)
    setAgora(Date.now())

    window.open(link, '_blank', 'noopener,noreferrer')
    setEnviado(link)
  }

  const listaErros = ORDEM.filter((c) => erros[c])
  const descr = (campo: Campo, ...extras: string[]) =>
    [...extras, erros[campo] ? `ct-${campo}-erro` : ''].filter(Boolean).join(' ') || undefined
  const classeCampo = (campo: Campo, extra = '') => `fx-field${extra}${erros[campo] ? ' fx-err' : ''}`
  const erro = (campo: Campo) =>
    erros[campo] ? (
      <p className="fx-errmsg" id={`ct-${campo}-erro`}>
        <IconeErro />
        {erros[campo]}
      </p>
    ) : null

  return (
    <form ref={formRef} className="fx rv" id="formulario-contato" onSubmit={enviar} aria-labelledby="ct-titulo" noValidate>
      <h3 className="fx-hi" id="ct-titulo">
        Três passos rápidos
      </h3>
      <p className="fx-intro">
        Ao enviar, a mensagem abre pronta no seu WhatsApp. Campos com <span className="req" aria-hidden="true">*</span>
        <span className="sr">asterisco</span> são obrigatórios.
      </p>

      {tentouEnviar && listaErros.length > 0 && (
        <p className="fx-summary" role="alert">
          <IconeErro />
          <span>
            {listaErros.length === 1
              ? 'Falta corrigir 1 campo. Ele está marcado abaixo.'
              : `Faltam corrigir ${listaErros.length} campos. Eles estão marcados abaixo.`}
          </span>
        </p>
      )}

      {/* 01 */}
      <section className="fx-step" aria-labelledby="ct-p1">
        <span className="fx-step-n" aria-hidden="true">
          01
        </span>
        <div>
          <h4 className="fx-step-t" id="ct-p1">
            Quem é você
          </h4>
          <p className="fx-step-d">Para eu saber com quem estou falando.</p>
        </div>
        <div className="fx-step-body fx-grid">
          <div className={classeCampo('nome')}>
            <label className="fx-label" htmlFor="ct-nome">
              Seu nome<span className="req" aria-hidden="true">*</span>
            </label>
            <input
              ref={refs.nome}
              className="fx-input"
              id="ct-nome"
              name="nome"
              type="text"
              autoComplete="name"
              maxLength={80}
              aria-required="true"
              aria-invalid={Boolean(erros.nome)}
              aria-describedby={descr('nome')}
              placeholder="Ex.: Ana Souza"
              value={valores.nome}
              onChange={aoDigitar('nome')}
              onBlur={aoSair('nome')}
            />
            {erro('nome')}
          </div>
          <div className="fx-field">
            <label className="fx-label" htmlFor="ct-empresa">
              Empresa ou negócio<span className="opt">(opcional)</span>
            </label>
            <input
              className="fx-input"
              id="ct-empresa"
              name="empresa"
              type="text"
              autoComplete="organization"
              maxLength={100}
              placeholder="Ex.: Loja Flor de Lis"
              onChange={() => setEnviado(null)}
            />
          </div>
        </div>
      </section>

      {/* 02 */}
      <section className="fx-step" aria-labelledby="ct-p2">
        <span className="fx-step-n" aria-hidden="true">
          02
        </span>
        <div>
          <h4 className="fx-step-t" id="ct-p2">
            O que você precisa
          </h4>
          <p className="fx-step-d">Escolha a opção mais próxima — não precisa ser exata.</p>
        </div>
        <div className="fx-step-body">
          <fieldset className="fx-fieldset">
            <legend className="fx-label">Tipo de projeto</legend>
            <div className="fx-radios">
              {TIPOS.map((t) => (
                <label className="fx-radio" key={t.valor}>
                  <input
                    type="radio"
                    name="tipo"
                    value={t.valor}
                    checked={tipo === t.valor}
                    onChange={() => setTipo(t.valor)}
                  />
                  <span>{t.rotulo}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={classeCampo('ideia')} style={{ marginTop: 22 }}>
            <label className="fx-label" htmlFor="ct-ideia">
              Conte um pouco sobre a ideia<span className="req" aria-hidden="true">*</span>
            </label>
            <p className="fx-help" id="ct-ideia-ajuda">
              O que você faz, para quem, e o que espera do site. Pode ser curto.
            </p>
            <textarea
              ref={refs.ideia}
              className="fx-input"
              id="ct-ideia"
              name="ideia"
              maxLength={LIMITE_IDEIA}
              aria-required="true"
              aria-invalid={Boolean(erros.ideia)}
              aria-describedby={descr('ideia', 'ct-ideia-ajuda', 'ct-ideia-conta')}
              placeholder="Ex.: Tenho uma floricultura e quero que os clientes vejam os arranjos e peçam pelo WhatsApp."
              value={valores.ideia}
              onChange={aoDigitar('ideia')}
              onBlur={aoSair('ideia')}
            />
            <div className="fx-under">
              {erro('ideia')}
              <p
                className={`fx-count${valores.ideia.length > LIMITE_IDEIA - 100 ? ' quase' : ''}`}
                id="ct-ideia-conta"
                aria-live={valores.ideia.length > LIMITE_IDEIA - 100 ? 'polite' : 'off'}
              >
                {valores.ideia.length} de {LIMITE_IDEIA} caracteres
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 */}
      <section className="fx-step" aria-labelledby="ct-p3">
        <span className="fx-step-n" aria-hidden="true">
          03
        </span>
        <div>
          <h4 className="fx-step-t" id="ct-p3">
            Como te respondo
          </h4>
          <p className="fx-step-d">A conversa começa pelo WhatsApp. Telefone e e-mail são alternativas.</p>
        </div>
        <div className="fx-step-body fx-grid">
          <div className={classeCampo('telefone')}>
            <label className="fx-label" htmlFor="ct-telefone">
              Telefone<span className="opt">(opcional)</span>
            </label>
            <input
              ref={refs.telefone}
              className="fx-input"
              id="ct-telefone"
              name="telefone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              aria-invalid={Boolean(erros.telefone)}
              aria-describedby={descr('telefone', 'ct-telefone-ajuda')}
              placeholder="(11) 98765-4321"
              value={valores.telefone}
              onChange={aoDigitar('telefone')}
              onBlur={aoSair('telefone')}
            />
            <p className="fx-help" id="ct-telefone-ajuda">
              Pode ser o WhatsApp. Só números, com DDD — a formatação é automática.
            </p>
            {erro('telefone')}
          </div>
          <div className={classeCampo('email')}>
            <label className="fx-label" htmlFor="ct-email">
              E-mail<span className="opt">(opcional)</span>
            </label>
            <input
              ref={refs.email}
              className="fx-input"
              id="ct-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={120}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={descr('email')}
              placeholder="nome@empresa.com.br"
              value={valores.email}
              onChange={aoDigitar('email')}
              onBlur={aoSair('email')}
            />
            {erro('email')}
          </div>
        </div>
      </section>

      {enviado && (
        <p className="fx-ok" role="status">
          Sua mensagem abriu no WhatsApp — é só tocar em enviar.{' '}
          <a href={enviado} target="_blank" rel="noopener noreferrer">
            Não abriu? Clique aqui.
          </a>
        </p>
      )}
      {semNumero && (
        <p className="fx-summary" role="alert">
          <IconeErro />
          <span>O WhatsApp ainda não foi configurado neste site (src/lib/portfolio.ts).</span>
        </p>
      )}

      <div className="fx-foot">
        <div className="fx-foot-info">
          <p className="fx-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1z" />
            </svg>
            Sem compromisso. A primeira conversa serve para entender a sua ideia.
          </p>
          {bloqueado ? (
            <p className="fx-limite bloqueado" role="status">
              Você já enviou {MAX_ENVIOS} mensagens. Para evitar envios repetidos, aguarde{' '}
              <strong>{mmss((bloqueadoAte ?? 0) - agora)}</strong> para enviar de novo.
            </p>
          ) : (
            restantes < MAX_ENVIOS && (
              <p className="fx-limite">
                envios restantes{' '}
                <span className="fx-quadrados" aria-hidden="true">
                  <span className="on">{'■'.repeat(restantes)}</span>
                  <span className="off">{'■'.repeat(MAX_ENVIOS - restantes)}</span>
                </span>
                <span className="sr">
                  {restantes} de {MAX_ENVIOS}
                </span>
              </p>
            )
          )}
        </div>
        <button className="btn btn-primary" type="submit" disabled={bloqueado}>
          Enviar pelo WhatsApp <span className="arr">→</span>
        </button>
      </div>
    </form>
  )
}
