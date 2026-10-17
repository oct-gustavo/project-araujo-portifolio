'use client'

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Carregando } from '@/components/marca/Carregando'
import { postar } from '@/lib/postar'
import e from './entrar.module.css'

type Etapa = 'credenciais' | 'codigo' | 'backup' | 'bloqueado' | 'liberado'

const A = 'M6 92 L40 26 L74 92 L61 92 L40 51 L19 92 Z'
const atraso = (s: number): CSSProperties => ({ animationDelay: `calc(var(--t0) + ${s}s)` })
const digitar = (letras: number, s: number): CSSProperties =>
  ({ '--w': `${letras}ch`, animationTimingFunction: `steps(${letras}, end)`, animationDelay: `calc(var(--t0) + ${s}s)` }) as CSSProperties

function Tentativas({ restantes }: { restantes: number }) {
  return (
    <span className={e.tentativas} aria-label={`${restantes} de 3 tentativas restantes`}>
      tentativas{' '}
      <span className={e.quadrado} aria-hidden="true">
        <span className={e.quadradoOn}>{'■'.repeat(restantes)}</span>
        <span className={e.quadradoOff}>{'■'.repeat(3 - restantes)}</span>
      </span>
    </span>
  )
}

export function TelaEntrar() {
  const router = useRouter()
  const [etapa, setEtapa] = useState<Etapa>('credenciais')
  const [primeiraVez, setPrimeiraVez] = useState(true)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [emailMascarado, setEmailMascarado] = useState('')
  const [digitos, setDigitos] = useState<string[]>(Array(6).fill(''))
  const [backup, setBackup] = useState('')
  const [restantes, setRestantes] = useState(3)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [bloqueadoAte, setBloqueadoAte] = useState<number | null>(null)
  const [agora, setAgora] = useState(() => Date.now())
  const caixas = useRef<(HTMLInputElement | null)[]>([])

  // Contagem regressiva do bloqueio.
  useEffect(() => {
    if (etapa !== 'bloqueado' || !bloqueadoAte) return
    const t = setInterval(() => {
      const n = Date.now()
      setAgora(n)
      if (n >= bloqueadoAte) {
        setEtapa('credenciais')
        setRestantes(3)
        setBloqueadoAte(null)
        setErro(null)
      }
    }, 1000)
    return () => clearInterval(t)
  }, [etapa, bloqueadoAte])

  function irPara(nova: Etapa) {
    setPrimeiraVez(false)
    setErro(null)
    setEtapa(nova)
  }

  function tratarFalha(status: number, dados: Record<string, unknown>, tipo: 'credenciais' | 'codigo') {
    if (status === 429 && typeof dados.bloqueadoAte === 'string') {
      setBloqueadoAte(new Date(dados.bloqueadoAte).getTime())
      setAgora(Date.now())
      irPara('bloqueado')
      return
    }
    if (status === 401 && dados.erro === 'sessao') {
      irPara('credenciais')
      setErro('sua sessão expirou. entre de novo.')
      return
    }
    if (status === 401 && typeof dados.restantes === 'number') {
      setRestantes(dados.restantes)
      setErro(
        tipo === 'credenciais'
          ? 'e-mail ou senha incorretos.'
          : 'o código não confere. confira o horário do celular e tente de novo.',
      )
      return
    }
    setErro('não foi possível continuar agora. tente de novo em instantes.')
  }

  async function enviarCredenciais(ev: FormEvent) {
    ev.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro(null)
    const { status, dados } = await postar('/api/auth/login', { email, senha })
    setEnviando(false)
    if (status === 200 && dados.proxima === 'configurar') {
      router.replace('/configurar-2fa')
      return
    }
    if (status === 200 && dados.proxima === '2fa') {
      setSenha('')
      setEmailMascarado(String(dados.email ?? ''))
      irPara('codigo')
      setTimeout(() => caixas.current[0]?.focus(), 450)
      return
    }
    tratarFalha(status, dados, 'credenciais')
  }

  async function enviarCodigo(codigo: string) {
    if (enviando) return
    setEnviando(true)
    setErro(null)
    const { status, dados } = await postar('/api/auth/2fa', { codigo })
    setEnviando(false)
    if (status === 200 && dados.ok) {
      irPara('liberado')
      router.replace('/leads')
      return
    }
    if (status === 200 && dados.proxima === 'configurar') {
      router.replace('/configurar-2fa')
      return
    }
    setDigitos(Array(6).fill(''))
    setTimeout(() => caixas.current[0]?.focus(), 30)
    tratarFalha(status, dados, 'codigo')
  }

  async function enviarBackup(ev: FormEvent) {
    ev.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro(null)
    const { status, dados } = await postar('/api/auth/backup', { codigo: backup })
    setEnviando(false)
    if (status === 200 && dados.proxima === 'configurar') {
      router.replace('/configurar-2fa')
      return
    }
    setBackup('')
    tratarFalha(status, dados, 'codigo')
  }

  function mudarDigito(i: number, valor: string) {
    const numeros = valor.replace(/\D/g, '')
    const novos = [...digitos]
    if (numeros.length > 1) {
      // Colou o código inteiro.
      numeros.slice(0, 6 - i).split('').forEach((n, k) => (novos[i + k] = n))
    } else {
      novos[i] = numeros
    }
    setDigitos(novos)
    const proximo = novos.findIndex((d) => d === '')
    if (numeros && proximo !== -1) caixas.current[proximo]?.focus()
    if (novos.every((d) => d !== '')) enviarCodigo(novos.join(''))
  }

  function teclaDigito(i: number, tecla: string) {
    if (tecla === 'Backspace' && !digitos[i] && i > 0) caixas.current[i - 1]?.focus()
  }

  const minutos = bloqueadoAte ? Math.max(0, Math.ceil((bloqueadoAte - agora) / 1000)) : 0
  const relogio = `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`

  return (
    <div className={e.tela} style={primeiraVez ? undefined : ({ '--t0': '0s' } as CSSProperties)}>
      <header className={e.topo}>
        <span className={e.voo} aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <polygon className={`${e.peca} ${e.pE}`} points="6,92 40,26 40,51 19,92" fill="none" stroke="#CFC8DC" strokeWidth="2" />
            <polygon className={`${e.peca} ${e.pD}`} points="40,26 74,92 61,92 40,51" fill="none" stroke="#CFC8DC" strokeWidth="2" />
            <rect className={`${e.peca} ${e.pB}`} x="26" y="69" width="28" height="9" fill="none" stroke="#CFC8DC" strokeWidth="2" />
            <rect className={`${e.peca} ${e.pC}`} x="78" y="83" width="18" height="9" fill="none" stroke="#B9A3F0" strokeWidth="2" />
          </svg>
          <svg className={e.preencheUmaVez} viewBox="0 0 100 100">
            <path d={A} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="26" y="69" width="28" height="9" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" />
            <rect className={e.pisca} x="78" y="83" width="18" height="9" fill="#B9A3F0" stroke="#B9A3F0" strokeWidth="2" />
          </svg>
          <span className={e.scanner} />
        </span>
        <span className={`${e.nome} ${e.surge}`} style={atraso(0)}>
          araújo<span>_</span>
        </span>
      </header>

      <main className={e.centro}>
        <h1 className="sr-only">Entrar</h1>

        {etapa === 'credenciais' && (
          <form className={e.form} onSubmit={enviarCredenciais} noValidate>
            <span className={`${e.regua} ${e.reguaTopo}`} style={atraso(0.1)} />
            <label className={e.linhaCampo}>
              <span className={`${e.prompt} ${e.surge}`} style={atraso(0.35)} aria-hidden="true">›</span>
              <span className={e.rotulo}><span className={e.digita} style={digitar(6, 0.4)}>e-mail</span></span>
              <input
                className={`${e.entrada} ${e.surge}`} style={atraso(0.7)}
                type="email" name="email" autoComplete="username" required placeholder="_"
                value={email} onChange={(ev) => setEmail(ev.target.value)} autoFocus={!primeiraVez}
              />
              <span className={e.regua} style={atraso(0.3)} />
            </label>
            <label className={e.linhaCampo}>
              <span className={`${e.prompt} ${e.surge}`} style={atraso(0.55)} aria-hidden="true">›</span>
              <span className={e.rotulo}><span className={e.digita} style={digitar(5, 0.6)}>senha</span></span>
              <input
                className={`${e.entrada} ${e.surge}`} style={atraso(0.9)}
                type="password" name="senha" autoComplete="current-password" required placeholder="_"
                value={senha} onChange={(ev) => setSenha(ev.target.value)}
              />
              <span className={e.regua} style={atraso(0.5)} />
            </label>
            {erro && <p className={e.erro} role="alert" style={{ paddingTop: 16 }}>× {erro}</p>}
            <div className={`${e.acoes} ${e.surge}`} style={atraso(1.05)}>
              <Tentativas restantes={restantes} />
              <button type="submit" className={e.tecla} disabled={enviando || !email || !senha}>
                {enviando ? <Carregando tamanho={18} rotulo="Conferindo" /> : null}
                continuar <span aria-hidden="true">↵</span>
              </button>
            </div>
          </form>
        )}

        {(etapa === 'codigo' || etapa === 'backup') && (
          <div className={e.bloco}>
            <div className={e.form}>
              <span className={`${e.regua} ${e.reguaTopo}`} />
              <div className={`${e.linhaFeita} ${e.surge}`}>
                <span className={e.prompt}>✓</span><span className={e.rotulo}>e-mail</span>
                <span className={e.valorFeito}>{emailMascarado}</span>
                <span className={e.regua} />
              </div>
              <div className={`${e.linhaFeita} ${e.surge}`} style={{ animationDelay: '.08s' }}>
                <span className={e.prompt}>✓</span><span className={e.rotulo}>senha</span>
                <span className={e.valorFeito} style={{ letterSpacing: '.2em' }}>••••••••</span>
                <span className={e.regua} />
              </div>
            </div>

            {etapa === 'codigo' && (
              <fieldset className={e.surge} style={{ border: 0, margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14, animationDelay: '.2s' }} disabled={enviando}>
                <legend className={e.legenda}>
                  <span className={e.prompt} aria-hidden="true">›</span>
                  <span className={e.digita} style={digitar(22, 0.25)}>código do autenticador</span>
                </legend>
                <div className={e.digitos}>
                  {digitos.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { caixas.current[i] = el }}
                      className={`${e.digito} ${erro ? e.digitoErro : ''}`}
                      inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'}
                      maxLength={i === 0 ? 6 : 1} placeholder="·"
                      aria-label={`Dígito ${i + 1} de 6`}
                      value={d}
                      onChange={(ev) => mudarDigito(i, ev.target.value)}
                      onKeyDown={(ev) => teclaDigito(i, ev.key)}
                    />
                  ))}
                </div>
                <div className={e.relogioTotp}>
                  <div className={e.trilho} aria-hidden="true"><div className={e.barraTotp} /></div>
                  <span>{enviando ? 'conferindo…' : 'renova a cada 30s'}</span>
                </div>
              </fieldset>
            )}

            {etapa === 'backup' && (
              <form id="form-backup" onSubmit={enviarBackup} className={e.surge} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, color: '#fff' }}>
                  <span style={{ display: 'flex', gap: 16 }}>
                    <span className={e.prompt} aria-hidden="true">›</span>
                    <span className={e.digita} style={digitar(16, 0.05)}>código de backup</span>
                  </span>
                  <input
                    className={e.campoBackup} type="text" maxLength={9} placeholder="xxxx-xxxx"
                    autoComplete="off" spellCheck={false} autoFocus
                    value={backup} onChange={(ev) => setBackup(ev.target.value)}
                  />
                </label>
                <span className={e.nota}>cada código funciona uma vez. depois dele, você configura o app de novo.</span>
              </form>
            )}

            {erro && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p className={e.erro} role="alert">× {erro}</p>
                <Tentativas restantes={restantes} />
              </div>
            )}

            <div className={`${e.acoes} ${e.surge}`} style={{ paddingTop: 0, animationDelay: '.35s' }}>
              <button type="button" className={e.link} onClick={() => irPara(etapa === 'codigo' ? 'backup' : 'codigo')}>
                {etapa === 'codigo' ? 'usar código de backup' : 'usar o app autenticador'}
              </button>
              {etapa === 'codigo' ? (
                <button type="button" className={e.tecla} disabled={enviando || digitos.some((d) => !d)} onClick={() => enviarCodigo(digitos.join(''))}>
                  {enviando ? <Carregando tamanho={18} rotulo="Conferindo" /> : null}
                  entrar <span aria-hidden="true">↵</span>
                </button>
              ) : (
                <button type="submit" form="form-backup" className={e.tecla} disabled={enviando || backup.replace(/[^a-z0-9]/gi, '').length !== 8}>
                  {enviando ? <Carregando tamanho={18} rotulo="Conferindo" /> : null}
                  entrar <span aria-hidden="true">↵</span>
                </button>
              )}
            </div>
          </div>
        )}

        {etapa === 'bloqueado' && (
          <div className={`${e.bloco} ${e.surge}`} role="status" aria-live="polite">
            <span style={{ fontSize: 14, color: '#fff' }}>
              <span style={{ color: 'var(--erro-claro)' }} aria-hidden="true">■</span>&nbsp;&nbsp;acesso bloqueado
            </span>
            <div className={e.contador}>
              <span className={e.contadorNum}>{relogio}</span>
              <span className={e.nota}>até liberar</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
              muitas tentativas erradas. o acesso volta sozinho quando o tempo zerar.
            </p>
            <Tentativas restantes={0} />
          </div>
        )}

        {etapa === 'liberado' && (
          <div className={`${e.bloco} ${e.surge}`} role="status" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, fontSize: 15 }}>
            <Carregando tamanho={22} rotulo="Abrindo" />
            <span><span className={e.prompt}>✓</span> acesso liberado</span>
          </div>
        )}
      </main>

      <footer className={`${e.rodape} ${e.surge}`} style={atraso(1.25)}>
        <span>{etapa === 'codigo' || etapa === 'backup' ? 'etapa 2 de 2' : '2fa ativo'}</span>
        <span>v1</span>
      </footer>
    </div>
  )
}
