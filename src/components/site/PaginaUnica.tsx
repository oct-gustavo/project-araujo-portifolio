import Image from 'next/image'
import { PORTFOLIO } from '@/lib/portfolio'
import { FundoAnimado } from './FundoAnimado'
import { ListaExperimentos } from './Experimentos'
import { FormularioOrcamento } from './FormularioOrcamento'

/** Logo "araújo_" (A em rede + nome + cursor), PNG com fundo transparente em public/marca/. */
const LOGO = { src: '/marca/logo-araujo.png', largura: 376, altura: 112 }

export function LogoSite({ altura = 44, alt = '' }: { altura?: number; alt?: string }) {
  return (
    <Image
      className="pu-logo"
      src={LOGO.src}
      alt={alt}
      width={LOGO.largura}
      height={LOGO.altura}
      style={{ height: altura, width: 'auto' }}
      loading="eager"
      fetchPriority="high"
      unoptimized
    />
  )
}

export function Cabecalho() {
  return (
    <header className="pu-wrap pu-cab">
      <a className="pu-marca" href="#inicio" aria-label="araújo_, início">
        <LogoSite altura={44} />
      </a>
      <nav className="pu-links" aria-label="Principal">
        <a href="#experimentos">Experimentos</a>
        <a href="#processo">Como funciona</a>
      </nav>
      <a className="pu-btn pu-btn-cheio pu-btn-cab" href="#orcamento">
        Pedir orçamento
      </a>
    </header>
  )
}

export function Inicio() {
  return (
    <section id="inicio" className="pu-inicio-fundo" aria-labelledby="inicio-titulo">
      <FundoAnimado />
      <div className="pu-wrap pu-inicio">
        <h1 id="inicio-titulo" className="pu-h1">
          Um site que <em>trabalha</em> pelo seu negócio.
        </h1>
        <p className="pu-lead">
          Crio sites sob medida para corretores de imóveis e negócios locais. Você conta o que precisa, recebe uma
          proposta e acompanha o site ficar pronto.
        </p>
        <div className="pu-acoes">
          <a className="pu-btn pu-btn-cheio pu-btn-grande" href="#orcamento">
            Pedir orçamento
          </a>
          <a className="pu-btn pu-btn-contorno pu-btn-grande" href="#experimentos">
            Ver experimentos
          </a>
        </div>
        <ul className="pu-publico">
          <li>Corretores e imobiliárias</li>
          <li>Comércios e serviços locais</li>
          <li>Orçamento pelo WhatsApp</li>
        </ul>
      </div>
    </section>
  )
}

export function Experimentos() {
  return (
    <section id="experimentos" className="pu-wrap pu-secao" aria-labelledby="exp-titulo">
      <div className="pu-secao-cab">
        <h2 id="exp-titulo" className="pu-h2">
          Experimentos
        </h2>
        <p className="pu-texto">
          Conceitos que montei para mostrar o que dá para fazer, com nomes e dados fictícios. Os projetos reais ficam
          nos vídeos do TikTok e do Instagram.
        </p>
      </div>
      <ListaExperimentos />
    </section>
  )
}

const PASSOS = [
  { titulo: '1. Conversa', texto: 'Você conta pelo WhatsApp o que o seu negócio precisa.' },
  { titulo: '2. Orçamento', texto: 'Envio a proposta com o que será feito. Os valores são combinados pelo WhatsApp.' },
  { titulo: '3. Criação', texto: 'Desenho e construo o site e mostro o andamento para você aprovar.' },
  { titulo: '4. Publicação', texto: 'O site vai ao ar e eu explico como usar e atualizar.' },
]

export function ComoFunciona() {
  return (
    <section id="processo" className="pu-wrap pu-secao" aria-labelledby="proc-titulo">
      <h2 id="proc-titulo" className="pu-h2">
        Como funciona
      </h2>
      <ol className="pu-passos">
        {PASSOS.map((p) => (
          <li key={p.titulo}>
            <h3>{p.titulo}</h3>
            <p>{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Orcamento() {
  return (
    <section id="orcamento" className="pu-wrap pu-secao pu-orcamento" aria-labelledby="orc-titulo">
      <div className="pu-orc-txt">
        <h2 id="orc-titulo" className="pu-h2">
          Peça seu <em>orçamento</em>
        </h2>
        <p className="pu-texto">
          Preencha os campos e o botão abre o WhatsApp com a mensagem pronta. Nada fica salvo neste formulário.
        </p>
        <p className="pu-whats">WhatsApp: {PORTFOLIO.contato.whatsappTexto}</p>
      </div>
      <FormularioOrcamento />
    </section>
  )
}

export function Rodape() {
  return (
    <footer className="pu-wrap pu-rodape">
      <LogoSite altura={32} alt="araújo_" />
      <a href={PORTFOLIO.contato.instagramUrl}>Instagram {PORTFOLIO.contato.instagramTexto}</a>
    </footer>
  )
}
