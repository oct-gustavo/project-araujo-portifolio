import estilos from './carregando.module.css'

type Props = {
  /** Tamanho em px. Abaixo de 40 o contorno fica mais grosso para continuar visível. */
  tamanho?: number
  tema?: 'escuro' | 'claro'
  rotulo?: string
}

const A = 'M6 92 L40 26 L74 92 L61 92 L40 51 L19 92 Z'

/** Carregamento oficial: encaixe oco + scanner que sobe preenchendo e desce esvaziando. */
export function Carregando({ tamanho = 24, tema = 'escuro', rotulo = 'Carregando' }: Props) {
  const traco = tamanho >= 80 ? 1.8 : tamanho >= 40 ? 3.5 : 7
  const cores =
    tema === 'escuro'
      ? { oco: '#CFC8DC', cursorOco: '#B9A3F0', cheio: '#FFFFFF', cursor: '#B9A3F0', linha: '#B9A3F0', brilho: 'rgba(185,163,240,.8)' }
      : { oco: '#8B74C9', cursorOco: '#7A5CC8', cheio: '#24173D', cursor: '#7A5CC8', linha: '#7A5CC8', brilho: 'rgba(122,92,200,.55)' }
  const sobra = Math.max(4, Math.round(tamanho * 0.16))

  return (
    <span className={estilos.caixa} style={{ width: tamanho, height: tamanho }} role="status" aria-label={rotulo}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <polygon className={`${estilos.peca} ${estilos.esq}`} points="6,92 40,26 40,51 19,92" fill="none" stroke={cores.oco} strokeWidth={traco} />
        <polygon className={`${estilos.peca} ${estilos.dir}`} points="40,26 74,92 61,92 40,51" fill="none" stroke={cores.oco} strokeWidth={traco} />
        <rect className={`${estilos.peca} ${estilos.barra}`} x="26" y="69" width="28" height="9" fill="none" stroke={cores.oco} strokeWidth={traco} />
        <rect className={`${estilos.peca} ${estilos.cursor}`} x="78" y="83" width="18" height="9" fill="none" stroke={cores.cursorOco} strokeWidth={traco} />
      </svg>
      <svg className={estilos.preenchido} viewBox="0 0 100 100" aria-hidden="true">
        <path d={A} fill={cores.cheio} stroke={cores.cheio} strokeWidth={traco} />
        <rect x="26" y="69" width="28" height="9" fill={cores.cheio} stroke={cores.cheio} strokeWidth={traco} />
        <rect x="78" y="83" width="18" height="9" fill={cores.cursor} stroke={cores.cursor} strokeWidth={traco} />
      </svg>
      <span
        className={estilos.linha}
        aria-hidden="true"
        style={{
          left: -sobra, right: -sobra,
          height: tamanho >= 80 ? 2 : 1,
          background: cores.linha,
          boxShadow: `0 0 ${tamanho >= 80 ? 16 : 6}px ${tamanho >= 80 ? 3 : 1}px ${cores.brilho}`,
        }}
      />
    </span>
  )
}
