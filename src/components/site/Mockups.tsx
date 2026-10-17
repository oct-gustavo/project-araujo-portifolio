/**
 * Miniaturas dos projetos, desenhadas em HTML/CSS (escalam com a largura via unidades cqw).
 * Quando tiver prints reais, pode trocar qualquer uma por <Image />.
 */

function Browser({ children }: { children: React.ReactNode }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <i />
        <i />
        <i />
        <b />
      </div>
      {children}
    </div>
  )
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone">
      <div className="screen">{children}</div>
    </div>
  )
}

const WAVE_BACK = 'M0 40 C100 15 200 15 300 40 S500 65 600 40 S800 15 900 40 S1100 65 1200 40 V80 H0 Z'
const WAVE_FRONT = 'M0 48 C100 30 200 30 300 48 S500 66 600 48 S800 30 900 48 S1100 66 1200 48 V80 H0 Z'

export function MockCorretora() {
  return (
    <Browser>
      <div className="m-cor">
        <div className="mc-hero">
          <div className="mc-nav">
            <span>Patrícia Rezende</span>
            <span>Imóveis</span>
          </div>
          <div className="mc-h">Imóveis escolhidos com cuidado.</div>
          <div className="mc-bar" />
          <div className="mc-bar s" />
          <div className="mc-btn" />
          <svg className="mc-wave back" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
            <path fill="#EEF0F4" d={WAVE_BACK} />
          </svg>
          <svg className="mc-wave" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
            <path fill="#EEF0F4" d={WAVE_FRONT} />
          </svg>
        </div>
        <div className="mc-cards">
          {['', 'b', 'c'].map((v) => (
            <div className="mc-card" key={v || 'a'}>
              <div className={`mc-img ${v}`} />
              <div className="mc-l" />
              <div className="mc-l s" />
              <div className="mc-p" />
            </div>
          ))}
        </div>
      </div>
    </Browser>
  )
}

export function MockAdmin() {
  return (
    <Browser>
      <div className="m-adm">
        <div className="ma-side">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="ma-main">
          <div className="ma-top">
            <b />
            <span />
          </div>
          {['', 'off', ''].map((s, i) => (
            <div className="ma-row" key={i}>
              <i />
              <b />
              <span className={s} />
            </div>
          ))}
        </div>
      </div>
    </Browser>
  )
}

export function MockClinica({ withRows = false }: { withRows?: boolean }) {
  return (
    <Phone>
      <div className="m-cli">
        <div className="cl-nav">
          <span className="cl-logo">
            <i />
            Lumen
          </span>
          <span className="cl-menu" />
        </div>
        <div className="cl-img" />
        <div className="cl-h">Seu sorriso, no seu tempo.</div>
        <div className="cl-bar" />
        <div className="cl-bar s" />
        <span className="cl-btn">Agendar avaliação</span>
        {withRows && (
          <>
            <div className="cl-row">
              <i />
              <b />
            </div>
            <div className="cl-row">
              <i />
              <b />
            </div>
          </>
        )}
      </div>
    </Phone>
  )
}

export function MockArquitetura() {
  return (
    <Browser>
      <div className="m-arq">
        <div className="ar-nav">
          <span className="ar-logo">NORTE</span>
          <span className="ar-links">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="ar-h">
          Espaços que <em>respiram.</em>
        </div>
        <div className="ar-grid">
          <div className="ar-big" />
          <div className="ar-col">
            <div className="ar-s1" />
            <div className="ar-s2" />
          </div>
        </div>
        <div className="ar-cap">
          <i />
          <i />
        </div>
      </div>
    </Browser>
  )
}

export function MockRestaurante() {
  return (
    <Phone>
      <div className="m-res">
        <div className="rs-nav">
          <i />
          <span className="rs-logo">Casa Alba</span>
          <i />
        </div>
        <div className="rs-plate" />
        <div className="rs-h">Sabores da estação.</div>
        <div className="rs-bar" />
        <span className="rs-btn">Reservar mesa</span>
      </div>
    </Phone>
  )
}

export function MockCardapio() {
  return (
    <Phone>
      <div className="m-menu">
        <div className="mn-h">Cardápio</div>
        <div className="mn-tabs">
          <i />
          <i />
          <i />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="mn-item">
              <b />
              <i />
              <span />
            </div>
            <div className="mn-sub" />
          </div>
        ))}
      </div>
    </Phone>
  )
}
