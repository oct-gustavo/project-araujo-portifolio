import { CAMINHO_A_SITE } from '@/components/marca/Logo'

/**
 * Abertura do site, na mesma linha da entrada do painel ("logo que voa"):
 * as duas metades do A e o traço roxo se encaixam, o scanner preenche e o símbolo voa até o cabeçalho.
 * Só CSS (funciona sem JavaScript e respeita a CSP), dura ~1,4 s e a página já está carregada por baixo.
 * Com "reduzir movimento" ela não aparece.
 */
export function Abertura() {
  return (
    <div className="pu-intro" aria-hidden="true">
      <span className="pu-intro-logo">
        <svg viewBox="26 26 148 148">
          <polygon
            className="pu-peca pu-pE"
            points="100,28 100,70 92,100 100,100 100,124 84,124 74,150 48,150"
            fill="none"
            stroke="#AAA5BE"
            strokeWidth="3"
          />
          <polygon
            className="pu-peca pu-pD"
            points="100,28 152,150 126,150 116,124 100,124 100,100 108,100 100,70"
            fill="none"
            stroke="#AAA5BE"
            strokeWidth="3"
          />
          <rect className="pu-peca pu-pB" x="58" y="162" width="84" height="9" fill="none" stroke="#9A80F5" strokeWidth="3" />
        </svg>
        <svg className="pu-intro-cheio" viewBox="26 26 148 148">
          <path fillRule="evenodd" fill="#EEEAF7" d={CAMINHO_A_SITE} />
          <rect x="58" y="162" width="84" height="9" fill="#9A80F5" />
        </svg>
        <span className="pu-intro-scanner" />
      </span>
    </div>
  )
}
