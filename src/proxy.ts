import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from '@/lib/env'

/**
 * Roda antes de toda página:
 * 1. gera um nonce novo e aplica a Content-Security-Policy;
 * 2. renova a sessão do Supabase (cookies);
 * 3. decide quem pode ver o quê:
 *    - / e /projetos/…   → portfólio público: livre, sem consultar o Supabase (só recebe a CSP)
 *    - /entrar           → livre (quem já entrou por completo vai para /leads)
 *    - /configurar-2fa   → precisa de senha ok e de NÃO ter 2FA confirmado
 *    - páginas do painel → precisam de senha + 2FA (nível aal2)
 *    - qualquer outro endereço, sem sessão completa → página 404 do portfólio (nunca a página em si)
 * As rotas /api fazem a própria verificação.
 */
/** Páginas abertas a qualquer visitante: o portfólio e as páginas de projeto. */
const ROTAS_PUBLICAS = new Set(['/'])
const PREFIXOS_PUBLICOS = ['/projetos/']
const ehPublica = (caminho: string) =>
  ROTAS_PUBLICAS.has(caminho) || PREFIXOS_PUBLICOS.some((p) => caminho.startsWith(p))

/** Páginas do painel: sem sessão completa, levam ao login. Ao criar uma página nova do painel, inclua aqui. */
const ROTAS_PAINEL = ['/leads', '/novo-lead', '/resumo', '/configuracoes']
const ehDoPainel = (caminho: string) => ROTAS_PAINEL.some((r) => caminho === r || caminho.startsWith(`${r}/`))
/** Pasta privada (começa com "_"): nunca vira rota, então o Next responde com a página 404. */
const CAMINHO_404 = '/_nao-encontrada'

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const dev = process.env.NODE_ENV === 'development'
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    // Em desenvolvimento o Next injeta estilos sem nonce (ferramentas do dev); em produção só com nonce.
    dev ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`,
    // Atributos style="" (animações com atraso, por exemplo). Não permite <style> injetado.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    dev ? '' : 'upgrade-insecure-requests',
  ]
    .filter(Boolean)
    .join('; ')

  const cabecalhos = new Headers(request.headers)
  cabecalhos.set('x-nonce', nonce)
  cabecalhos.set('Content-Security-Policy', csp)

  // Portfólio e projetos: não lê nem renova sessão (visitantes não têm cookies do painel).
  if (ehPublica(request.nextUrl.pathname)) {
    const publica = NextResponse.next({ request: { headers: cabecalhos } })
    publica.headers.set('Content-Security-Policy', csp)
    return publica
  }

  let resposta = NextResponse.next({ request: { headers: cabecalhos } })
  const cabecalhosSemCache: Record<string, string> = {}

  const supabase = createServerClient(
    SUPABASE_URL(),
    SUPABASE_CHAVE_PUBLICA(),
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (lista, headers) => {
          lista.forEach(({ name, value }) => request.cookies.set(name, value))
          cabecalhos.set('cookie', request.cookies.toString())
          resposta = NextResponse.next({ request: { headers: cabecalhos } })
          lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options))
          Object.assign(cabecalhosSemCache, headers)
        },
      },
    },
  )

  const { data } = await supabase.auth.getUser()
  const usuario = data.user
  let nivel: string | null = null
  let proximoNivel: string | null = null
  if (usuario) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    nivel = aal?.currentLevel ?? null
    proximoNivel = aal?.nextLevel ?? null
  }

  const caminho = request.nextUrl.pathname
  const completo = Boolean(usuario) && nivel === 'aal2'
  let destino: string | null = null

  if (caminho === '/entrar') {
    if (completo) destino = '/leads'
  } else if (caminho === '/configurar-2fa') {
    if (!usuario) destino = '/entrar'
    else if (completo) destino = '/leads'
    else if (proximoNivel === 'aal2') destino = '/entrar' // já tem 2FA: precisa digitar o código
  } else if (!completo) {
    if (ehDoPainel(caminho)) destino = '/entrar'
    else {
      // Endereço desconhecido para quem não entrou: mostra a 404 sem revelar se a página existe.
      // (Default-deny continua: a página pedida nunca é servida, só a 404.)
      const url = request.nextUrl.clone()
      url.pathname = CAMINHO_404
      url.search = ''
      const nao = NextResponse.rewrite(url, { request: { headers: cabecalhos } })
      resposta.cookies.getAll().forEach((c) => nao.cookies.set(c))
      nao.headers.set('Content-Security-Policy', csp)
      Object.entries(cabecalhosSemCache).forEach(([k, v]) => nao.headers.set(k, v))
      return nao
    }
  }

  if (destino) {
    const url = request.nextUrl.clone()
    url.pathname = destino
    url.search = ''
    const redirecionar = NextResponse.redirect(url)
    resposta.cookies.getAll().forEach((c) => redirecionar.cookies.set(c))
    resposta = redirecionar
  }

  resposta.headers.set('Content-Security-Policy', csp)
  Object.entries(cabecalhosSemCache).forEach(([k, v]) => resposta.headers.set(k, v))
  return resposta
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|fotos/|favicon.ico|icon.svg|robots.txt).*)'],
}
