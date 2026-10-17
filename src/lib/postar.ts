type Resposta = { status: number; dados: Record<string, unknown> }

/** Envia JSON para as rotas internas. Nunca lança erro: devolve status 0 se a rede falhar. */
export async function enviar(metodo: 'POST' | 'PUT' | 'DELETE', url: string, corpo?: unknown): Promise<Resposta> {
  try {
    const r = await fetch(url, {
      method: metodo,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const dados = (await r.json().catch(() => ({}))) as Record<string, unknown>
    return { status: r.status, dados }
  } catch {
    return { status: 0, dados: {} }
  }
}

export const postar = (url: string, corpo?: unknown) => enviar('POST', url, corpo)
