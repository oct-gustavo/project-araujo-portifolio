import { caminhoDetalhes, caminhoProjeto, proximoProjeto } from '@/lib/projetos'
import { TourConceito, type PassoTour } from '../TourConceito'
import { AgendaDemo } from './AgendaDemo'
import './lumen.css'

function proximoDe(slug: string) {
  const p = proximoProjeto(slug)
  return { nome: p.nome, href: caminhoProjeto(p.slug), descricao: `${p.segmento} · ${p.real ? 'projeto real' : 'conceito'}` }
}

const PASSOS: PassoTour[] = [
  {
    alvo: 'hero',
    titulo: 'Em 3 segundos, o paciente entende tudo',
    texto:
      'O que é, para quem e qual o próximo passo. A frase fala do medo mais comum — e a forma em arco suaviza o visual, longe da cara de hospital.',
  },
  {
    alvo: 'menu',
    titulo: 'O botão de agendar está sempre à vista',
    texto: 'Ele acompanha a rolagem da página. Quem decidiu marcar não precisa procurar como.',
  },
  {
    alvo: 'tratamentos',
    titulo: 'Linguagem simples, sem termos técnicos',
    texto:
      'Cada tratamento diz o que é e quanto tempo leva. Quem entende o que vai acontecer chega mais tranquilo — e agenda com mais facilidade.',
  },
  {
    alvo: 'agenda',
    titulo: 'Agendar sem precisar ligar',
    texto:
      'Dia e horário em botões grandes, fáceis de tocar no celular. Experimente clicar — aqui é só demonstração. No site real, iria para a agenda da clínica ou para o WhatsApp da recepção.',
  },
  {
    alvo: 'equipe',
    titulo: 'Rostos antes da cadeira',
    texto: 'Ver quem vai atender reduz a ansiedade e cria confiança antes da primeira consulta.',
  },
  {
    alvo: 'visite',
    titulo: 'Tudo para chegar, no mesmo lugar',
    texto: 'Endereço, horários e contato juntos, com o mapa a um toque. Pensado para quem está no celular, já a caminho.',
  },
]

const TRATAMENTOS = [
  ['Avaliação', 'Uma conversa e um exame para entender o que você precisa. Sem compromisso.', '40 min'],
  ['Limpeza', 'Remove o que a escova não alcança e previne problemas maiores.', '50 min'],
  ['Clareamento', 'Dentes mais claros com acompanhamento, sem sensibilidade exagerada.', '3 sessões'],
  ['Aparelho', 'Fixo ou transparente, com o plano explicado do começo ao fim.', 'Plano individual'],
  ['Implantes', 'Repõe um dente perdido com algo que parece — e funciona — como natural.', 'Plano individual'],
  ['Crianças', 'Primeiras consultas leves, para criar uma boa relação com o dentista.', '30 min'],
]

export function Lumen() {
  return (
    <TourConceito
      nome="Clínica Lumen"
      proximo={proximoDe('clinica-lumen')}
      detalhes={caminhoDetalhes('clinica-lumen')}
      intro={{
        titulo: 'Este é um conceito para uma clínica odontológica.',
        texto:
          'Em 6 paradas rápidas, mostro por que cada parte foi pensada assim. Os botões do site são de demonstração — nada é enviado.',
      }}
      passos={PASSOS}
    >
      <div className="lu">
        <header className="lu-nav" data-tour="menu">
          <div className="lu-wrap lu-nav-in">
            <span className="lu-logo">
              <i aria-hidden="true" />
              Lumen
            </span>
            <nav className="lu-links" aria-label="Clínica">
              <a href="#tratamentos">Tratamentos</a>
              <a href="#agendar">Agendar</a>
              <a href="#equipe">Equipe</a>
              <a href="#visite">Como chegar</a>
            </nav>
            <a className="lu-btn" href="#agendar">
              Agendar avaliação
            </a>
          </div>
        </header>

        <main>
          <section className="lu-hero-sec" aria-labelledby="lu-titulo">
            <div className="lu-wrap lu-hero" data-tour="hero">
              <div>
                <p className="lu-eyebrow">Odontologia · atendimento sem pressa</p>
                <h1 className="lu-h1" id="lu-titulo">
                  Seu sorriso, <em>no seu tempo.</em>
                </h1>
                <p className="lu-lead">
                  Consultas calmas, explicadas com clareza, em um espaço pensado para quem tem receio de dentista.
                </p>
                <div className="lu-ctas">
                  <a className="lu-btn" href="#agendar">
                    Agendar avaliação
                  </a>
                  <a className="lu-btn ghost" href="#tratamentos">
                    Ver tratamentos
                  </a>
                </div>
                <div className="lu-facts">
                  <span>
                    <b>Seg a sáb</b>8h às 19h
                  </span>
                  <span>
                    <b>Avaliação</b>sem compromisso
                  </span>
                  <span>
                    <b>Atendimento</b>infantil e adulto
                  </span>
                </div>
              </div>
              <div className="lu-arch" role="img" aria-label="Espaço para a foto do consultório">
                <span>[foto do consultório]</span>
              </div>
            </div>
          </section>

          <section className="lu-sec white" id="tratamentos" data-tour="tratamentos" aria-labelledby="lu-trat">
            <div className="lu-wrap">
              <h2 className="lu-h2" id="lu-trat">
                Tratamentos
              </h2>
              <p className="lu-sub">Explicados como você explicaria para um amigo.</p>
              <div className="lu-cards">
                {TRATAMENTOS.map(([t, d, tempo]) => (
                  <article className="lu-card" key={t}>
                    <i aria-hidden="true" />
                    <h3>{t}</h3>
                    <p>{d}</p>
                    <small>{tempo}</small>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="lu-sec" id="agendar" aria-labelledby="lu-agenda">
            <div className="lu-wrap lu-book" data-tour="agenda">
              <div>
                <h2 className="lu-h2" id="lu-agenda">
                  Agende em três toques
                </h2>
                <p className="lu-sub">Sem ligação, sem esperar resposta.</p>
                <ol className="lu-steps">
                  <li>
                    <b>1</b>Escolha o tratamento
                  </li>
                  <li>
                    <b>2</b>Escolha o dia
                  </li>
                  <li>
                    <b>3</b>Escolha o horário
                  </li>
                </ol>
              </div>
              <AgendaDemo />
            </div>
          </section>

          <section className="lu-sec white" id="equipe" data-tour="equipe" aria-labelledby="lu-equipe">
            <div className="lu-wrap">
              <h2 className="lu-h2" id="lu-equipe">
                Quem vai cuidar de você
              </h2>
              <div className="lu-team">
                {['Clínica geral', 'Ortodontia', 'Odontopediatria'].map((esp) => (
                  <div className="lu-person" key={esp}>
                    <div role="img" aria-label="Espaço para a foto do profissional" />
                    <p>
                      <b>[Nome]</b>
                      {esp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lu-sec" id="visite" aria-labelledby="lu-visite">
            <div className="lu-wrap" data-tour="visite">
              <h2 className="lu-h2" id="lu-visite">
                Como chegar
              </h2>
              <div className="lu-visit">
                <div className="lu-map" role="img" aria-label="Mapa ilustrativo" />
                <dl className="lu-info">
                  <div>
                    <dt>Endereço</dt>
                    <dd>[Rua, número — Bairro, Cidade]</dd>
                  </div>
                  <div>
                    <dt>Horários</dt>
                    <dd>Segunda a sexta, 8h às 19h · Sábado, 8h às 13h</dd>
                  </div>
                  <div>
                    <dt>Contato</dt>
                    <dd>[telefone] · WhatsApp</dd>
                  </div>
                  <div>
                    <a className="lu-btn ghost" href="#visite">
                      Abrir no mapa
                    </a>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <div className="lu-float">
            <a className="lu-btn" href="#agendar">
              Agendar avaliação
            </a>
          </div>
        </main>
        <footer className="lu-foot">
          <div className="lu-wrap">
            Clínica Lumen é um conceito criado por Gustavo Araújo para demonstrar um site de clínica. Nomes, horários e
            endereço são ilustrativos.
          </div>
        </footer>
      </div>
    </TourConceito>
  )
}
