import { caminhoDetalhes, caminhoProjeto, proximoProjeto } from '@/lib/projetos'
import { TourConceito, type PassoTour } from '../TourConceito'
import { AbertoAgora, Cardapio, Reserva } from './Interativos'
import './alba.css'

function proximoDe(slug: string) {
  const p = proximoProjeto(slug)
  return { nome: p.nome, href: caminhoProjeto(p.slug), descricao: `${p.segmento} · ${p.real ? 'projeto real' : 'conceito'}` }
}

const PASSOS: PassoTour[] = [
  {
    alvo: 'hero',
    titulo: 'Está aberto? A resposta vem primeiro',
    texto:
      'É a pergunta que todo mundo faz antes de sair de casa. O selo usa o relógio de quem visita e mostra se a casa está aberta agora.',
  },
  {
    alvo: 'acoes',
    titulo: 'As três ações mais comuns, sempre à mão',
    texto: 'Reservar, ver o cardápio e saber como chegar ficam fixos na parte de baixo — no celular, ao alcance do polegar.',
  },
  {
    alvo: 'cardapio',
    titulo: 'Cardápio em texto, não em PDF',
    texto:
      'Abre rápido no celular, dá para filtrar por vegetariano e sem glúten, e o Google consegue ler os pratos. Experimente as abas e os filtros.',
  },
  {
    alvo: 'reserva',
    titulo: 'Reserva em poucos toques',
    texto: 'Pessoas, dia e horário em botões grandes. Aqui é demonstração; no site real, o pedido chegaria no WhatsApp da casa.',
  },
  {
    alvo: 'ambiente',
    titulo: 'O clima ajuda a decidir',
    texto: 'Fotos do salão e as informações de visita juntas: o cliente escolhe a ocasião certa e já sabe como chegar.',
  },
]

const Icone = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d={d} />
  </svg>
)

export function Alba() {
  return (
    <TourConceito
      nome="Casa Alba"
      proximo={proximoDe('casa-alba')}
      detalhes={caminhoDetalhes('casa-alba')}
      intro={{
        titulo: 'Este é um conceito para um restaurante.',
        texto:
          'Em 5 paradas, mostro por que cada parte foi pensada assim — principalmente para quem decide pelo celular. Pratos, preços e reservas são de demonstração.',
      }}
      passos={PASSOS}
    >
      <div className="ca">
        <div className="ca-wrap">
          <header className="ca-nav">
            <span className="ca-logo">Casa Alba</span>
            <nav className="ca-links" aria-label="Restaurante">
              <a href="#cardapio">Cardápio</a>
              <a href="#reservar">Reservas</a>
              <a href="#visite-alba">Como chegar</a>
            </nav>
            <a className="ca-btn" href="#reservar">
              Reservar mesa
            </a>
          </header>

          <main>
            <section className="ca-hero" aria-labelledby="ca-titulo" data-tour="hero">
              <div>
                <AbertoAgora />
                <h1 className="ca-h1" id="ca-titulo">
                  Sabores da <em>estação.</em>
                </h1>
                <p className="ca-lead">
                  Cozinha de produtos locais, com um cardápio que muda conforme o que a feira oferece.
                </p>
                <div className="ca-ctas">
                  <a className="ca-btn" href="#reservar">
                    Reservar mesa
                  </a>
                  <a className="ca-btn ghost" href="#cardapio">
                    Ver cardápio
                  </a>
                </div>
              </div>
              <div className="ca-plate" role="img" aria-label="Ilustração de um prato visto de cima" />
            </section>

            <section className="ca-sec" id="cardapio" aria-labelledby="ca-card-t">
              <div data-tour="cardapio">
                <h2 className="ca-h2" id="ca-card-t">
                  Cardápio
                </h2>
                <p className="ca-sub">Muda com a estação. Pergunte também pelo prato do dia.</p>
                <Cardapio />
              </div>
            </section>

            <section className="ca-sec" id="reservar" aria-labelledby="ca-res-t">
              <div className="ca-res" data-tour="reserva">
                <div>
                  <h2 className="ca-h2" id="ca-res-t">
                    Reserve sua mesa
                  </h2>
                  <p className="ca-sub">Para grupos acima de 12 pessoas, fale com a gente pelo WhatsApp.</p>
                </div>
                <Reserva />
              </div>
            </section>

            <section className="ca-sec" id="visite-alba" aria-labelledby="ca-amb-t">
              <div data-tour="ambiente">
                <h2 className="ca-h2" id="ca-amb-t">
                  O salão
                </h2>
                <p className="ca-sub">Mesas para dois, uma mesa comprida para grupos e um balcão de frente para a cozinha.</p>
                <div className="ca-amb" role="img" aria-label="Fotos ilustrativas do salão">
                  <span />
                  <span />
                  <span />
                </div>
                <dl className="ca-info">
                  <div>
                    <dt>Endereço</dt>
                    <dd>[Rua, número — Bairro, Cidade]</dd>
                  </div>
                  <div>
                    <dt>Horários</dt>
                    <dd>Ter a dom · 12h–15h e 19h–23h</dd>
                  </div>
                  <div>
                    <dt>Contato</dt>
                    <dd>[telefone] · WhatsApp</dd>
                  </div>
                </dl>
              </div>
            </section>
          </main>
          <footer className="ca-foot">
            Casa Alba é um conceito criado por Gustavo Araújo para demonstrar um site de restaurante. Pratos, preços e
            endereço são ilustrativos.
          </footer>
        </div>

        <nav className="ca-barra" aria-label="Ações rápidas" data-tour="acoes">
          <a href="#reservar">
            <Icone d="M5 5h14v15H5zM8 3v4M16 3v4M5 10h14" />
            Reservar
          </a>
          <a href="#cardapio">
            <Icone d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4" />
            Cardápio
          </a>
          <a href="#visite-alba">
            <Icone d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
            Como chegar
          </a>
        </nav>
      </div>
    </TourConceito>
  )
}
