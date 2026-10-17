import { caminhoDetalhes, caminhoProjeto, proximoProjeto } from '@/lib/projetos'
import { TourConceito, type PassoTour } from '../TourConceito'
import { AntesDepois, ContatoNorte, ObrasFiltro } from './Interativos'
import './norte.css'

function proximoDe(slug: string) {
  const p = proximoProjeto(slug)
  return { nome: p.nome, href: caminhoProjeto(p.slug), descricao: `${p.segmento} · ${p.real ? 'projeto real' : 'conceito'}` }
}

const PASSOS: PassoTour[] = [
  {
    alvo: 'hero',
    titulo: 'A obra é a protagonista',
    texto:
      'A primeira tela é quase só imagem. O texto entra pequeno, como a legenda de uma galeria — quem procura arquitetura quer ver antes de ler.',
  },
  {
    alvo: 'obras',
    titulo: 'Filtrar pelo tipo de obra',
    texto:
      'Residencial, comercial ou interiores: o visitante encontra rápido algo parecido com o próprio projeto. Experimente os filtros.',
  },
  {
    alvo: 'antes',
    titulo: 'Antes e depois, sem precisar explicar',
    texto: 'Arraste a barra para comparar. A transformação convence mais que qualquer descrição.',
  },
  {
    alvo: 'processo',
    titulo: 'Etapas e prazos às claras',
    texto:
      'Quem contrata arquitetura tem medo do desconhecido. Mostrar o caminho, com prazos de referência, diminui a insegurança.',
  },
  {
    alvo: 'contato',
    titulo: 'Um contato que já chega qualificado',
    texto: 'Tipo de espaço e metragem em poucos toques: o ateliê recebe o pedido organizado e responde com mais precisão.',
  },
]

const ETAPAS = [
  ['Conversa', 'Entender o espaço, a rotina de quem vai usar e o orçamento.', '1 semana'],
  ['Estudo', 'Primeiras plantas, referências e a ideia geral do projeto.', '2 a 3 semanas'],
  ['Projeto', 'Detalhamento completo para orçar e construir sem surpresas.', '4 a 6 semanas'],
  ['Obra', 'Acompanhamento das visitas e das decisões até a entrega.', 'conforme a obra'],
]

export function Norte() {
  return (
    <TourConceito
      nome="Ateliê Norte"
      proximo={proximoDe('atelie-norte')}
      detalhes={caminhoDetalhes('atelie-norte')}
      intro={{
        titulo: 'Este é um conceito para um escritório de arquitetura.',
        texto:
          'Em 5 paradas, mostro por que cada parte foi pensada assim. As obras, os prazos e o formulário são de demonstração — nada é enviado.',
      }}
      passos={PASSOS}
    >
      <div className="an">
        <div className="an-wrap">
          <header className="an-nav">
            <span className="an-logo">NORTE</span>
            <nav className="an-links" aria-label="Ateliê">
              <a href="#obras">Obras</a>
              <a href="#processo">Como trabalhamos</a>
              <a href="#contato-norte">Contato</a>
            </nav>
            <a className="an-cta" href="#contato-norte">
              Fale com o ateliê
            </a>
          </header>

          <main>
            <section className="an-hero" aria-labelledby="an-titulo" data-tour="hero">
              <div className="an-cover" role="img" aria-label="Imagem ilustrativa de uma casa em concreto e vidro">
                <i />
                <b />
                <span className="an-cover-cap">Casa Pátio · 2025</span>
              </div>
              <div className="an-hero-row">
                <h1 className="an-h1" id="an-titulo">
                  Espaços que <em>respiram.</em>
                </h1>
                <p className="an-hero-txt">
                  Arquitetura residencial e interiores. Projetos pensados a partir da luz, do silêncio e da rotina de quem
                  vai morar.
                </p>
              </div>
            </section>

            <section className="an-sec" id="obras" aria-labelledby="an-obras-t">
              <div data-tour="obras">
                <div className="an-head">
                  <div>
                    <h2 className="an-h2" id="an-obras-t">
                      Obras
                    </h2>
                    <p className="an-sub">Uma seleção de projetos recentes.</p>
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <ObrasFiltro />
                </div>
              </div>
            </section>

            <section className="an-sec" aria-labelledby="an-ad-t">
              <div className="an-ad" data-tour="antes">
                <div>
                  <h2 className="an-h2" id="an-ad-t">
                    Antes e depois
                  </h2>
                  <p className="an-sub">Apartamento Alto: a sala ganhou luz e uma marcenaria contínua que esconde a bagunça.</p>
                </div>
                <AntesDepois />
              </div>
            </section>

            <section className="an-sec" id="processo" aria-labelledby="an-proc-t">
              <div data-tour="processo">
                <h2 className="an-h2" id="an-proc-t">
                  Como trabalhamos
                </h2>
                <p className="an-sub">Prazos de referência — cada projeto tem o seu ritmo.</p>
                <ol className="an-etapas">
                  {ETAPAS.map(([t, d, prazo], i) => (
                    <li key={t}>
                      <small>Etapa {String(i + 1).padStart(2, '0')}</small>
                      <h3>{t}</h3>
                      <p>{d}</p>
                      <b>{prazo}</b>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="an-sec" id="contato-norte" aria-labelledby="an-cont-t">
              <div className="an-contato" data-tour="contato">
                <div>
                  <h2 className="an-h2" id="an-cont-t">
                    Conte sobre o seu espaço
                  </h2>
                  <p className="an-sub">Três perguntas rápidas. Respondemos em até dois dias úteis.</p>
                </div>
                <ContatoNorte />
              </div>
            </section>
          </main>
          <footer className="an-foot">
            Ateliê Norte é um conceito criado por Gustavo Araújo para demonstrar um site de arquitetura. Obras, áreas e
            prazos são ilustrativos.
          </footer>
        </div>
      </div>
    </TourConceito>
  )
}
