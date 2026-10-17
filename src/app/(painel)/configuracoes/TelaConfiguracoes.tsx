'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Cabecalho } from '@/components/painel/Cabecalho'
import { Carregando } from '@/components/marca/Carregando'
import { enviar, postar } from '@/lib/postar'
import c from './configuracoes.module.css'

type Configuracoes = { metaSemanal: number; cidadePadrao: string; regraSiteFraco: 'rigida' | 'branda' }
type Tipo = { id: string; nome: string; ordem: number }
type Props = { inicial: { configuracoes: Configuracoes; tipos: Tipo[]; codigosRestantes: number } }
type Aviso = { tipo: 'ok' | 'erro'; texto: string } | null

function mensagemDeErro(status: number, dados: Record<string, unknown>): string {
  if (status === 401) return 'sua sessão expirou. entre de novo.'
  if (status === 409) return 'esse tipo de negócio já existe.'
  if (status === 429) return 'muitas tentativas erradas. o acesso foi bloqueado por 15 minutos.'
  if (typeof dados.detalhe === 'string') return dados.detalhe
  if (status === 400) return 'confira os campos e tente de novo.'
  return 'não foi possível salvar agora. tente de novo.'
}

function AvisoLinha({ aviso }: { aviso: Aviso }) {
  if (!aviso) return null
  return (
    <p role={aviso.tipo === 'erro' ? 'alert' : 'status'} className={`${c.aviso} ${aviso.tipo === 'ok' ? c.avisoOk : c.avisoErro}`} style={{ margin: 0 }}>
      {aviso.texto}
    </p>
  )
}

export function TelaConfiguracoes({ inicial }: Props) {
  const router = useRouter()

  // ---------- prospecção ----------
  const [conf, setConf] = useState<Configuracoes>(inicial.configuracoes)
  const [salvando, setSalvando] = useState(false)
  const [avisoConf, setAvisoConf] = useState<Aviso>(null)
  const alterado = JSON.stringify(conf) !== JSON.stringify(inicial.configuracoes)

  async function salvarConf(ev?: FormEvent) {
    ev?.preventDefault()
    setSalvando(true)
    setAvisoConf(null)
    const { status, dados } = await enviar('PUT', '/api/configuracoes', conf)
    setSalvando(false)
    if (status === 401) return router.replace('/entrar')
    if (status === 200) {
      setAvisoConf({ tipo: 'ok', texto: 'configurações salvas.' })
      router.refresh() // atualiza a meta na barra lateral
    } else setAvisoConf({ tipo: 'erro', texto: mensagemDeErro(status, dados) })
  }

  // ---------- tipos de negócio ----------
  const [tipos, setTipos] = useState<Tipo[]>(inicial.tipos)
  const [novoTipo, setNovoTipo] = useState('')
  const [avisoTipos, setAvisoTipos] = useState<Aviso>(null)

  async function adicionarTipo(ev: FormEvent) {
    ev.preventDefault()
    const nome = novoTipo.trim()
    if (!nome) return
    setAvisoTipos(null)
    const { status, dados } = await postar('/api/tipos-negocio', { nome })
    if (status === 401) return router.replace('/entrar')
    if (status === 201) {
      setTipos((t) => [...t, dados.tipo as Tipo])
      setNovoTipo('')
    } else setAvisoTipos({ tipo: 'erro', texto: mensagemDeErro(status, dados) })
  }

  async function removerTipo(tipo: Tipo) {
    setAvisoTipos(null)
    const antes = tipos
    setTipos((t) => t.filter((x) => x.id !== tipo.id))
    const { status, dados } = await enviar('DELETE', `/api/tipos-negocio/${tipo.id}`)
    if (status === 401) return router.replace('/entrar')
    if (status !== 200) {
      setTipos(antes)
      setAvisoTipos({ tipo: 'erro', texto: mensagemDeErro(status, dados) })
    }
  }

  // ---------- códigos de backup ----------
  const [restantes, setRestantes] = useState(inicial.codigosRestantes)
  const [confirmandoCodigos, setConfirmandoCodigos] = useState(false)
  const [codigosNovos, setCodigosNovos] = useState<string[] | null>(null)
  const [guardei, setGuardei] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [avisoCodigos, setAvisoCodigos] = useState<Aviso>(null)

  async function gerarCodigos() {
    setGerando(true)
    setAvisoCodigos(null)
    const { status, dados } = await postar('/api/seguranca/codigos-backup')
    setGerando(false)
    setConfirmandoCodigos(false)
    if (status === 401) return router.replace('/entrar')
    if (status === 200 && Array.isArray(dados.codigos)) {
      setCodigosNovos(dados.codigos as string[])
      setRestantes((dados.codigos as string[]).length)
      setGuardei(false)
    } else setAvisoCodigos({ tipo: 'erro', texto: mensagemDeErro(status, dados) })
  }

  function baixarCodigos() {
    if (!codigosNovos) return
    const conteudo =
      'araújo_ · códigos de backup da verificação em duas etapas\ncada código funciona uma única vez.\n\n' +
      codigosNovos.map((cod, i) => `${String(i + 1).padStart(2, '0')}  ${cod}`).join('\n') + '\n'
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'araujo-codigos-backup.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ---------- senha ----------
  const [trocandoSenha, setTrocandoSenha] = useState(false)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [enviandoSenha, setEnviandoSenha] = useState(false)
  const [avisoSenha, setAvisoSenha] = useState<Aviso>(null)

  async function trocarSenha(ev: FormEvent) {
    ev.preventDefault()
    setAvisoSenha(null)
    if (novaSenha.length < 12) return setAvisoSenha({ tipo: 'erro', texto: 'a nova senha precisa ter pelo menos 12 caracteres.' })
    if (novaSenha !== confirmaSenha) return setAvisoSenha({ tipo: 'erro', texto: 'a confirmação não bate com a nova senha.' })
    setEnviandoSenha(true)
    const { status, dados } = await postar('/api/seguranca/senha', { senhaAtual, novaSenha })
    setEnviandoSenha(false)
    if (status === 200) {
      setSenhaAtual(''); setNovaSenha(''); setConfirmaSenha('')
      setTrocandoSenha(false)
      setAvisoSenha({ tipo: 'ok', texto: 'senha alterada.' })
      return
    }
    if (status === 401 && typeof dados.restantes === 'number') {
      return setAvisoSenha({ tipo: 'erro', texto: `senha atual incorreta. restam ${dados.restantes} tentativas.` })
    }
    if (status === 401) return router.replace('/entrar')
    setAvisoSenha({ tipo: 'erro', texto: mensagemDeErro(status, dados) })
  }

  return (
    <>
      <Cabecalho sobretitulo="Conta e preferências" titulo="Configurações">
        <button type="button" className={c.primario} onClick={() => salvarConf()} disabled={!alterado || salvando}>
          {salvando ? <Carregando tamanho={18} rotulo="Salvando" /> : null}
          Salvar alterações
        </button>
      </Cabecalho>

      <div className={c.grade}>
        {/* ---------- Prospecção ---------- */}
        <section className={c.secao} aria-labelledby="s-prosp">
          <h2 id="s-prosp" className={c.secaoTitulo}>Prospecção</h2>
          <form className={c.secaoCorpo} onSubmit={salvarConf}>
            <label className={c.campo}>
              Meta de leads por semana
              <input
                className={`${c.entrada} ${c.entradaCurta}`} type="number" min={1} max={500} required
                value={conf.metaSemanal}
                onChange={(e) => setConf({ ...conf, metaSemanal: Number(e.target.value) || 0 })}
              />
              <span className={c.ajuda}>Só acompanha seu ritmo: não bloqueia nada. Renova toda segunda-feira.</span>
            </label>
            <label className={c.campo}>
              Cidade padrão do cadastro
              <input
                className={c.entrada} type="text" maxLength={80} placeholder="Ex.: Ribeirão Preto, SP"
                value={conf.cidadePadrao}
                onChange={(e) => setConf({ ...conf, cidadePadrao: e.target.value })}
              />
            </label>
            <label className={c.campo}>
              Considerar &quot;site fraco&quot; quando
              <select
                className={c.entrada}
                value={conf.regraSiteFraco}
                onChange={(e) => setConf({ ...conf, regraSiteFraco: e.target.value as Configuracoes['regraSiteFraco'] })}
              >
                <option value="rigida">Não abre, sem HTTPS ou sem versão para celular</option>
                <option value="branda">Só quando não abre</option>
              </select>
            </label>
            <AvisoLinha aviso={avisoConf} />
            <button type="submit" hidden />
          </form>
        </section>

        {/* ---------- Tipos de negócio ---------- */}
        <section className={c.secao} aria-labelledby="s-tipos">
          <h2 id="s-tipos" className={c.secaoTitulo}>Tipos de negócio</h2>
          <div className={c.secaoCorpo}>
            <span className={c.ajuda}>Aparecem no cadastro de lead, nesta ordem.</span>
            <ul className={c.tipos}>
              {tipos.map((t) => (
                <li key={t.id} className={c.tipo}>
                  {t.nome}
                  <button type="button" className={c.remover} aria-label={`Remover ${t.nome}`} onClick={() => removerTipo(t)}>×</button>
                </li>
              ))}
              {tipos.length === 0 && <li className={c.ajuda}>Nenhum tipo cadastrado.</li>}
            </ul>
            <form className={c.adicionar} onSubmit={adicionarTipo}>
              <label className="sr-only" htmlFor="novo-tipo">Novo tipo de negócio</label>
              <input
                id="novo-tipo" className={c.entrada} type="text" maxLength={60} placeholder="Novo tipo, ex.: contabilidade"
                value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)}
              />
              <button type="submit" className={c.secundario} disabled={!novoTipo.trim()}>adicionar</button>
            </form>
            <AvisoLinha aviso={avisoTipos} />
          </div>
        </section>

        {/* ---------- Segurança ---------- */}
        <section className={c.secao} aria-labelledby="s-seg">
          <h2 id="s-seg" className={c.secaoTitulo}>Segurança</h2>
          <ul className={c.linhas}>
            <li className={c.linha}>
              <span className={c.linhaTexto}>
                <span className={c.linhaTitulo}>Verificação em duas etapas</span>
                <span className={`${c.linhaSub} ${c.ok}`}>Ativa · app autenticador</span>
              </span>
            </li>
            <li className={c.linha}>
              <span className={c.linhaTexto}>
                <span className={c.linhaTitulo}>Códigos de backup</span>
                <span className={c.linhaSub}>{restantes} de 10 ainda disponíveis</span>
              </span>
              {!confirmandoCodigos && !codigosNovos && (
                <button type="button" className={c.secundario} onClick={() => setConfirmandoCodigos(true)}>Gerar novos</button>
              )}
            </li>
          </ul>

          {confirmandoCodigos && (
            <div className={c.formSenha} role="alertdialog" aria-labelledby="conf-cod">
              <span id="conf-cod" style={{ fontSize: 14 }}>
                Os códigos atuais vão <strong>deixar de valer</strong> e 10 novos serão mostrados uma única vez. Continuar?
              </span>
              <div className={c.acoes}>
                <button type="button" className={c.secundario} onClick={() => setConfirmandoCodigos(false)}>cancelar</button>
                <button type="button" className={c.primario} onClick={gerarCodigos} disabled={gerando}>
                  {gerando ? <Carregando tamanho={18} rotulo="Gerando" /> : null}
                  gerar novos códigos
                </button>
              </div>
            </div>
          )}

          {codigosNovos && (
            <div className={c.caixaCodigos}>
              <span style={{ fontSize: 13, lineHeight: 1.6 }}>
                Seus novos códigos aparecem <strong>só agora</strong>. Guarde fora deste computador.
              </span>
              <ol className={c.codigos}>
                {codigosNovos.map((cod, i) => (
                  <li key={cod}><span>{String(i + 1).padStart(2, '0')}</span>{cod}</li>
                ))}
              </ol>
              <div className={c.acoes}>
                <label className={c.confirmo}>
                  <input type="checkbox" checked={guardei} onChange={(e) => setGuardei(e.target.checked)} />
                  guardei os códigos
                </label>
                <button type="button" className={c.secundario} onClick={() => navigator.clipboard?.writeText(codigosNovos.join('\n'))}>copiar</button>
                <button type="button" className={c.secundario} onClick={baixarCodigos}>baixar .txt</button>
                <button type="button" className={c.primario} disabled={!guardei} onClick={() => setCodigosNovos(null)}>concluir</button>
              </div>
            </div>
          )}
          {avisoCodigos && <div style={{ margin: '0 22px 22px' }}><AvisoLinha aviso={avisoCodigos} /></div>}

          <ul className={c.linhas} style={{ borderTop: '1px solid #ECEBEF' }}>
            <li className={c.linha}>
              <span className={c.linhaTexto}>
                <span className={c.linhaTitulo}>Senha</span>
                <span className={c.linhaSub}>Bloqueio após 3 tentativas erradas</span>
              </span>
              {!trocandoSenha && (
                <button type="button" className={c.secundario} onClick={() => { setTrocandoSenha(true); setAvisoSenha(null) }}>Alterar senha</button>
              )}
            </li>
          </ul>
          {trocandoSenha && (
            <form className={c.formSenha} onSubmit={trocarSenha}>
              <label className={c.campo}>Senha atual
                <input className={c.entrada} type="password" autoComplete="current-password" required value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
              </label>
              <label className={c.campo}>Nova senha
                <input className={c.entrada} type="password" autoComplete="new-password" minLength={12} required value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                <span className={c.ajuda}>Pelo menos 12 caracteres. Use uma senha exclusiva deste sistema.</span>
              </label>
              <label className={c.campo}>Confirmar nova senha
                <input className={c.entrada} type="password" autoComplete="new-password" required value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} />
              </label>
              <AvisoLinha aviso={avisoSenha} />
              <div className={c.acoes}>
                <button type="button" className={c.secundario} onClick={() => { setTrocandoSenha(false); setAvisoSenha(null) }}>cancelar</button>
                <button type="submit" className={c.primario} disabled={enviandoSenha}>
                  {enviandoSenha ? <Carregando tamanho={18} rotulo="Alterando" /> : null}
                  alterar senha
                </button>
              </div>
            </form>
          )}
          {!trocandoSenha && avisoSenha && <div style={{ margin: '0 22px 22px' }}><AvisoLinha aviso={avisoSenha} /></div>}
        </section>

        {/* ---------- Dados ---------- */}
        <section className={c.secao} aria-labelledby="s-dados">
          <h2 id="s-dados" className={c.secaoTitulo}>Dados</h2>
          <ul className={c.linhas}>
            {[
              ['Exportar leads', 'Planilha com todos os leads e anotações', 'Baixar CSV'],
              ['Importar planilha', 'Trazer leads que você já anotou em CSV', 'Escolher arquivo'],
              ['Lista de "não contatar"', 'Quem pediu para não ser contatado gera aviso no cadastro', 'Ver lista'],
            ].map(([titulo, sub, botao]) => (
              <li key={titulo} className={c.linha}>
                <span className={c.linhaTexto}>
                  <span className={c.linhaTitulo}>{titulo}</span>
                  <span className={c.linhaSub}>{sub}</span>
                </span>
                <button type="button" className={c.secundario} disabled title="Disponível depois do cadastro de leads">
                  {botao} · em breve
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
