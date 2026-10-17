/**
 * Limite de envios para o WhatsApp (mesma ideia do bloqueio do login), dividido entre
 * o formulário de contato e o assistente de conversa: 3 envios em 10 min → espera de 5 min.
 * Fica só no navegador da pessoa (localStorage); não há servidor envolvido.
 */
export const MAX_ENVIOS = 3
const JANELA_MS = 10 * 60 * 1000
const ESPERA_MS = 5 * 60 * 1000
const CHAVE_ENVIOS = 'araujo:envios-contato'
/** Avisado na janela a cada envio, para o formulário e o assistente se atualizarem juntos. */
export const EVENTO_ENVIO = 'araujo:envio'

export function lerEnvios(): number[] {
  try {
    const bruto = JSON.parse(window.localStorage.getItem(CHAVE_ENVIOS) ?? '[]')
    return Array.isArray(bruto) ? bruto.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return []
  }
}

function gravarEnvios(lista: number[]) {
  try {
    window.localStorage.setItem(CHAVE_ENVIOS, JSON.stringify(lista))
  } catch {
    /* navegação privada: o limite vale só nesta aba */
  }
}

/** Situação do limite agora: quantos envios restam e até quando está bloqueado. */
export function situacaoEnvios(lista: number[], agora: number) {
  const recentes = lista.filter((t) => agora - t < JANELA_MS)
  if (recentes.length >= MAX_ENVIOS) {
    const liberaEm = recentes[MAX_ENVIOS - 1] + ESPERA_MS
    if (agora < liberaEm) return { restantes: 0, bloqueadoAte: liberaEm, recentes }
    return { restantes: MAX_ENVIOS, bloqueadoAte: null, recentes: [] }
  }
  return { restantes: MAX_ENVIOS - recentes.length, bloqueadoAte: null, recentes }
}

/** Registra um envio agora e devolve a lista atualizada. */
export function registrarEnvio(): number[] {
  const instante = Date.now()
  const lista = [...situacaoEnvios(lerEnvios(), instante).recentes, instante]
  gravarEnvios(lista)
  window.dispatchEvent(new Event(EVENTO_ENVIO))
  return lista
}

/** Milissegundos em "m:ss". */
export const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
