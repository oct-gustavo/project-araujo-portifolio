import { EXPERIMENTOS, caminhoExperimento, type SlugExperimento } from '@/lib/experimentos'

/**
 * Miniaturas dos experimentos: só divs e CSS, sem imagens.
 * Cada uma tem a paleta de um "cliente" diferente; nomes e dados são fictícios.
 */

function MiniImobiliaria() {
  return (
    <div className="mini mini-imob" aria-hidden="true">
      <div className="mini-topo">
        <span className="mini-marca">Casa Exemplo</span>
        <span className="mini-menu">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="mini-imob-faixa">
        <span className="mini-imob-titulo">Encontre seu próximo lar</span>
        <div className="mini-imob-busca">
          <span />
          <span />
          <span className="mini-imob-ok" />
        </div>
      </div>
      <div className="mini-imob-lista">
        {['#C9D3E0', '#D8D2C2', '#BFCBBF'].map((cor, i) => (
          <div key={cor} className="mini-imob-card">
            <span className="mini-imob-foto" style={{ background: cor }} />
            <i style={{ width: ['80%', '70%', '85%'][i] }} />
            <i className="mini-imob-preco" style={{ width: ['50%', '45%', '55%'][i] }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniBarbearia() {
  return (
    <div className="mini mini-barb" aria-hidden="true">
      <div className="mini-topo">
        <span className="mini-marca mini-barb-marca">BARBEARIA EXEMPLO</span>
        <span className="mini-menu">
          <i />
          <i />
        </span>
      </div>
      <div className="mini-barb-hero">
        <span className="mini-barb-titulo">
          Corte e barba, <em>no seu horário</em>
        </span>
        <span className="mini-barb-botao">Agendar horário</span>
      </div>
      <div className="mini-barb-lista">
        {['Corte', 'Barba', 'Corte e barba'].map((s) => (
          <div key={s} className="mini-barb-item">
            <span>{s}</span>
            <i />
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniRestaurante() {
  return (
    <div className="mini mini-rest" aria-hidden="true">
      <div className="mini-topo">
        <span className="mini-marca">Cantina Exemplo</span>
        <span className="mini-rest-pedir">Pedir</span>
      </div>
      <div className="mini-rest-cab">
        <span className="mini-rest-titulo">Cardápio do dia</span>
        <i />
      </div>
      <div className="mini-rest-lista">
        {[
          { nome: 'Prato executivo', cor: '#D9C9A8', w: '75%' },
          { nome: 'Massa da casa', cor: '#BCCDB5', w: '60%' },
          { nome: 'Sobremesa', cor: '#E2BFA0', w: '68%' },
        ].map((p) => (
          <div key={p.nome} className="mini-rest-item">
            <span className="mini-rest-foto" style={{ background: p.cor }} />
            <div>
              <span>{p.nome}</span>
              <i style={{ width: p.w }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MINIATURAS: Record<SlugExperimento, () => React.JSX.Element> = {
  imobiliaria: MiniImobiliaria,
  barbearia: MiniBarbearia,
  restaurante: MiniRestaurante,
}

/** Cada cartão abre o site experimental em outra aba; a página de orçamento continua aberta. */
export function ListaExperimentos() {
  return (
    <ul className="pu-cards">
      {EXPERIMENTOS.map(({ slug, titulo, frase }) => {
        const Mini = MINIATURAS[slug]
        return (
          <li key={slug}>
            <a className="pu-card" href={caminhoExperimento(slug)} target="_blank" rel="noopener">
              <Mini />
              <div className="pu-card-txt">
                <h3>{titulo}</h3>
                <p className="pu-card-frase">{frase}</p>
                <p className="pu-etiqueta">Conceito, dados fictícios</p>
                <p className="pu-card-abrir">
                  Abrir experimento <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (abre em nova aba)</span>
                </p>
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
