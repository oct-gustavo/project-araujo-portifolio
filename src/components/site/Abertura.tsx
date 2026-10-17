/**
 * Abertura do portfólio, na mesma linha da entrada do painel ("logo que voa"):
 * as peças do A se encaixam no centro, o scanner sobe preenchendo e o símbolo voa até o menu.
 * Só CSS (funciona sem JavaScript e respeita a CSP). Com "reduzir movimento" ela não aparece.
 */
export function Abertura() {
  return (
    <div className="intro" aria-hidden="true">
      <span className="intro-logo">
        <svg viewBox="0 0 100 100">
          <polygon className="peca pE" points="6,92 40,26 40,51 19,92" fill="none" stroke="#CFC8DC" strokeWidth="2.2" />
          <polygon className="peca pD" points="40,26 74,92 61,92 40,51" fill="none" stroke="#CFC8DC" strokeWidth="2.2" />
          <rect className="peca pB" x="26" y="69" width="28" height="9" fill="none" stroke="#CFC8DC" strokeWidth="2.2" />
          <rect className="peca pC" x="78" y="83" width="18" height="9" fill="none" stroke="#B9A3F0" strokeWidth="2.2" />
        </svg>
        <svg className="intro-cheio" viewBox="0 0 100 100">
          <path d="M6 92 L40 26 L74 92 L61 92 L40 51 L19 92 Z" fill="#ECEDF4" stroke="#ECEDF4" strokeWidth="2.2" />
          <rect x="26" y="69" width="28" height="9" fill="#ECEDF4" stroke="#ECEDF4" strokeWidth="2.2" />
          <rect x="78" y="83" width="18" height="9" fill="#B9A3F0" stroke="#B9A3F0" strokeWidth="2.2" />
        </svg>
        <span className="intro-scanner" />
      </span>
    </div>
  )
}
