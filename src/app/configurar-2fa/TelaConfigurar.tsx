'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { Carregando } from '@/components/marca/Carregando'
import { SimboloA } from '@/components/marca/Logo'
import { postar } from '@/lib/postar'
import e from '../entrar/entrar.module.css'
import c from './configurar.module.css'

type Etapa = 'carregando' | 'qr' | 'confirmar' | 'codigos' | 'erro'

const digitar = (letras: number): CSSProperties =>
  ({ '--w': `${letras}ch`, animationTimingFunction: `steps(${letras}, end)`, animationDelay: '0s' }) as CSSProperties

/**
 * O Supabase pode devolver o QR como SVG puro ou já como "data:image/svg+xml;utf-8,<svg…>"
 * (às vezes sem codificar). Extrai o SVG e monta um endereço de imagem válido.
 */
function qrParaImagem(valor: string): string {
  let svg = valor.trim()
  if (svg.startsWith('data:')) {
    svg = svg.slice(svg.indexOf(',') + 1)
    if (!svg.trimStart().startsWith('<')) {
      try { svg = decodeURIComponent(svg) } catch { /* mantém como veio */ }
    }
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function TelaConfigurar() {
  const router = useRouter()
  const [etapa, setEtapa] = useState<Etapa>('carregando')
  const [fatorId, setFatorId] = useState('')
  const [qr, setQr] = useState('')
  const [segredo, setSegredo] = useState('')
  const [digitos, setDigitos] = useState<string[]>(Array(6).fill(''))
  const [codigos, setCodigos] = useState<string[]>([])
  const [guardei, setGuardei] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [copiado, setCopiado] = useState<string | null>(null)
  const caixas = useRef<(HTMLInputElement | null)[]>([])
  const iniciou = useRef(false)

  useEffect(() => {
    if (iniciou.current) return
    iniciou.current = true
    ;(async () => {
      const { status, dados } = await postar('/api/auth/configurar-2fa/iniciar')
      if (status === 401) return router.replace('/entrar')
      if (status === 403) return router.replace('/leads')
      if (status !== 200) return setEtapa('erro')
      setFatorId(String(dados.fatorId))
      setQr(qrParaImagem(String(dados.qrSvg)))
      setSegredo(String(dados.segredo))
      setEtapa('qr')
    })()
  }, [router])

  // Avisa antes de sair da página com os códigos ainda na tela.
  useEffect(() => {
    if (etapa !== 'codigos' || guardei) return
    const aviso = (ev: BeforeUnloadEvent) => ev.preventDefault()
    window.addEventListener('beforeunload', aviso)
    return () => window.removeEventListener('beforeunload', aviso)
  }, [etapa, guardei])

  async function copiar(texto: string, qual: string) {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(qual)
      setTimeout(() => setCopiado(null), 1800)
    } catch {
      setCopiado(null)
    }
  }

  function baixarTxt() {
    const conteudo =
      'araújo_ · códigos de backup da verificação em duas etapas\n' +
      'cada código funciona uma única vez.\n\n' +
      codigos.map((cod, i) => `${String(i + 1).padStart(2, '0')}  ${cod}`).join('\n') +
      '\n'
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'araujo-codigos-backup.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function confirmar(codigo: string) {
    if (enviando) return
    setEnviando(true)
    setErro(null)
    const { status, dados } = await postar('/api/auth/configurar-2fa/confirmar', { fatorId, codigo })
    setEnviando(false)
    if (status === 200 && Array.isArray(dados.codigos)) {
      setCodigos(dados.codigos as string[])
      setEtapa('codigos')
      return
    }
    setDigitos(Array(6).fill(''))
    setTimeout(() => caixas.current[0]?.focus(), 30)
    if (status === 429) return router.replace('/entrar')
    if (status === 401 && dados.erro === 'sessao') return router.replace('/entrar')
    setErro(
      status === 401
        ? `o código não confere. confira o horário do celular.${typeof dados.restantes === 'number' ? ` restam ${dados.restantes} tentativas.` : ''}`
        : 'não foi possível confirmar agora. tente de novo.',
    )
  }

  function mudarDigito(i: number, valor: string) {
    const numeros = valor.replace(/\D/g, '')
    const novos = [...digitos]
    if (numeros.length > 1) numeros.slice(0, 6 - i).split('').forEach((n, k) => (novos[i + k] = n))
    else novos[i] = numeros
    setDigitos(novos)
    const proximo = novos.findIndex((d) => d === '')
    if (numeros && proximo !== -1) caixas.current[proximo]?.focus()
    if (novos.every((d) => d !== '')) confirmar(novos.join(''))
  }

  const passo = etapa === 'codigos' ? 3 : etapa === 'confirmar' ? 2 : 1

  return (
    <div className={e.tela} style={{ '--t0': '0s' } as CSSProperties}>
      <header className={c.topo}>
        <span className={e.topo}>
          <SimboloA />
          <span className={e.nome}>araújo<span>_</span></span>
        </span>
        <span className={c.passos} aria-label={`Etapa ${passo} de 3`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= passo ? c.passoOn : c.passoOff} />
          ))}
        </span>
      </header>

      <main className={c.centro}>
        <h1 className="sr-only">Configurar verificação em duas etapas</h1>

        {etapa === 'carregando' && (
          <div className={c.linhaCarregando}>
            <Carregando tamanho={26} rotulo="Gerando QR code" />
            <span>gerando QR code…</span>
          </div>
        )}

        {etapa === 'erro' && (
          <div className={e.bloco}>
            <p className={e.erro} role="alert">× não foi possível iniciar a configuração.</p>
            <button type="button" className={e.tecla} onClick={() => window.location.reload()}>tentar de novo ↵</button>
          </div>
        )}

        {etapa === 'qr' && (
          <section className={e.bloco}>
            <h2 className={c.titulo}><span className={e.prompt} aria-hidden="true">›</span><span className={e.digita} style={digitar(33)}>escaneie com seu app autenticador</span></h2>
            <div className={`${c.qrLinha} ${e.surge}`} style={{ animationDelay: '.3s' }}>
              <div className={c.qrFundo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} width={196} height={196} alt="QR code para cadastrar no app autenticador" />
              </div>
              <div className={c.chave}>
                <span className={e.nota}>não consegue escanear? digite a chave:</span>
                <code className={c.segredo}>{segredo.replace(/(.{4})/g, '$1 ').trim()}</code>
                <button type="button" className={c.fantasma} onClick={() => copiar(segredo, 'chave')}>
                  {copiado === 'chave' ? 'copiada ✓' : 'copiar chave'}
                </button>
                <span className={c.dica}>funciona com Google Authenticator, Microsoft Authenticator, 2FAS ou similar.</span>
              </div>
            </div>
            <div className={`${c.direita} ${e.surge}`} style={{ animationDelay: '.5s' }}>
              <button type="button" className={e.tecla} onClick={() => { setEtapa('confirmar'); setTimeout(() => caixas.current[0]?.focus(), 400) }}>
                já escaneei <span aria-hidden="true">↵</span>
              </button>
            </div>
          </section>
        )}

        {etapa === 'confirmar' && (
          <section className={e.bloco}>
            <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }} disabled={enviando}>
              <legend className={e.legenda}><span className={e.prompt} aria-hidden="true">›</span><span className={e.digita} style={digitar(28)}>confirme com o código do app</span></legend>
              <div className={`${e.digitos} ${e.surge}`} style={{ animationDelay: '.3s' }}>
                {digitos.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { caixas.current[i] = el }}
                    className={`${e.digito} ${erro ? e.digitoErro : ''}`}
                    inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    maxLength={i === 0 ? 6 : 1} placeholder="·" aria-label={`Dígito ${i + 1} de 6`}
                    value={d}
                    onChange={(ev) => mudarDigito(i, ev.target.value)}
                    onKeyDown={(ev) => { if (ev.key === 'Backspace' && !digitos[i] && i > 0) caixas.current[i - 1]?.focus() }}
                  />
                ))}
              </div>
              <span className={e.nota}>{enviando ? 'conferindo…' : 'isso prova que o app ficou sincronizado.'}</span>
            </fieldset>
            {erro && <p className={e.erro} role="alert">× {erro}</p>}
            <div className={c.entre}>
              <button type="button" className={c.fantasma} onClick={() => setEtapa('qr')}>voltar ao QR code</button>
              <button type="button" className={e.tecla} disabled={enviando || digitos.some((d) => !d)} onClick={() => confirmar(digitos.join(''))}>
                {enviando ? <Carregando tamanho={18} rotulo="Conferindo" /> : null}
                confirmar <span aria-hidden="true">↵</span>
              </button>
            </div>
          </section>
        )}

        {etapa === 'codigos' && (
          <section className={e.bloco} style={{ gap: 24 }}>
            <h2 className={c.titulo}><span className={e.prompt} aria-hidden="true">›</span><span className={e.digita} style={digitar(22)}>seus códigos de backup</span></h2>
            <p className={`${c.aviso} ${e.surge}`} style={{ animationDelay: '.2s' }}>
              eles aparecem <strong>só agora</strong>. cada um funciona uma vez, caso você perca o celular.
              <br />guarde fora deste computador: papel, cofre de senhas.
            </p>
            <ol className={`${c.lista} ${e.surge}`} style={{ animationDelay: '.35s' }}>
              {codigos.map((cod, i) => (
                <li key={cod}><span>{String(i + 1).padStart(2, '0')}</span>{cod}</li>
              ))}
            </ol>
            <div className={`${c.botoes} ${e.surge}`} style={{ animationDelay: '.45s' }}>
              <button type="button" className={c.fantasma} onClick={() => copiar(codigos.join('\n'), 'todos')}>
                {copiado === 'todos' ? 'copiados ✓' : 'copiar todos'}
              </button>
              <button type="button" className={c.fantasma} onClick={baixarTxt}>baixar .txt</button>
            </div>
            <div className={`${c.final} ${e.surge}`} style={{ animationDelay: '.55s' }}>
              <label className={c.confirmo}>
                <input type="checkbox" checked={guardei} onChange={(ev) => setGuardei(ev.target.checked)} />
                guardei os códigos em lugar seguro
              </label>
              <button type="button" className={e.tecla} disabled={!guardei} onClick={() => router.replace('/leads')}>
                concluir <span aria-hidden="true">↵</span>
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className={e.rodape}>
        <span>{`configuração ${passo} de 3`}</span>
        <span>primeiro acesso</span>
      </footer>
    </div>
  )
}
