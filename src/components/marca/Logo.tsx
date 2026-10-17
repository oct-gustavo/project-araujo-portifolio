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
