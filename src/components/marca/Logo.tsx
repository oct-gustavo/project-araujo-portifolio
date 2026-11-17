type Props = {
  tamanho?: number
  comNome?: boolean
  corA?: string
  corCursor?: string
  className?: string
}

/** Logo "araújo_": A geométrico + cursor. */
export function SimboloA({ tamanho = 26, corA = '#FFFFFF', corCursor = '#B9A3F0' }: Omit<Props, 'comNome'>) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d="M6 92 L40 26 L74 92 L61 92 L40 51 L19 92 Z" fill={corA} />
      <rect x="26" y="69" width="28" height="9" fill={corA} />
      <rect x="78" y="83" width="18" height="9" fill={corCursor} />
    </svg>
  )
}

/* ---------- Marca do site público ("/"): A maciço com traço roxo embaixo ---------- */

/** Contorno do A (com o furo do meio) no quadro 0 0 200 200. */
export const CAMINHO_A_SITE = 'M100 28L152 150L126 150L116 124L84 124L74 150L48 150ZM100 70L108 100L92 100Z'

/** Ícone do site (favicon): o A sobre fundo grafite. */
export const ICONE_SITE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#24222D"/>' +
  `<path fill-rule="evenodd" fill="#EEEAF7" d="${CAMINHO_A_SITE}"/>` +
  '<rect x="58" y="162" width="84" height="9" fill="#9A80F5"/></svg>'

/** Símbolo do site sem fundo, para o cabeçalho. O painel continua usando o SimboloA. */
export function SimboloSite({ tamanho = 32, className }: { tamanho?: number; className?: string }) {
  return (
    <svg className={className} width={tamanho} height={tamanho} viewBox="26 26 148 148" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" fill="#EEEAF7" d={CAMINHO_A_SITE} />
      <rect x="58" y="162" width="84" height="9" fill="#9A80F5" />
    </svg>
  )
}

export function Logo({ tamanho = 26, comNome = true, corA = '#FFFFFF', corCursor = '#B9A3F0', className }: Props) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <SimboloA tamanho={tamanho} corA={corA} corCursor={corCursor} />
      {comNome && (
        <span style={{ fontFamily: 'var(--fonte-mono)', fontWeight: 500, fontSize: 16, color: corA, letterSpacing: '-0.02em' }}>
          araújo<span style={{ color: corCursor }}>_</span>
        </span>
      )}
      {!comNome && <span className="sr-only">araújo</span>}
    </span>
  )
}
