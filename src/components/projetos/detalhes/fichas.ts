/**
 * Fichas dos conceitos: o que aparece em /projetos/<slug>/detalhes
 * (ideia, decisões de design, cores, fontes e estilo). Só texto e valores — o layout fica em Detalhes.tsx.
 */

export type Amostra = 'formas' | 'botoes' | 'alvos' | 'movimento' | 'linhas' | 'imagem' | 'selo' | 'barra'

export type Ficha = {
  slug: 'clinica-lumen' | 'atelie-norte' | 'casa-alba'
  numero: string
  /** Frase curta do topo. */
  lead: string
  meta: { rotulo: string; valor: string }[]
  ideia: { frase: string; destaque: string; texto: string }
  decisoes: { titulo: string; texto: string }[]
  cores: { titulo: string; destaque: string; texto: string; lista: { nome: string; hex: string; uso: string }[] }
  fontes: { nome: string; papel: string; familia: 'serif' | 'sans'; exemplo: string; italico?: boolean; porque: string }[]
  estilo: { amostra: Amostra; titulo: string; texto: string }[]
  cuidados: { icone: 'contraste' | 'celular' | 'teclado' | 'movimento' | 'busca' | 'velocidade'; titulo: string; texto: string }[]
  /** Variáveis de cor usadas nas amostras (prefixo --fd-). */
  tema: { fundo: string; tinta: string; acao: string; acaoTinta: string; suave: string; linha: string; raio: string; raioBotao: string }
}

export const FICHAS: Record<Ficha['slug'], Ficha> = {
  'clinica-lumen': {
    slug: 'clinica-lumen',
    numero: '02',
    lead: 'Uma clínica que acolhe antes da primeira consulta: tons de água, formas arredondadas e uma linguagem que tira o medo do dentista.',
    meta: [
      { rotulo: 'Tipo', valor: 'Conceito — proposta visual' },
      { rotulo: 'Segmento', valor: 'Clínica odontológica' },
      { rotulo: 'Foco', valor: 'Confiança e agendamento' },
      { rotulo: 'Pensado para', valor: 'Celular primeiro' },
    ],
    ideia: {
      frase: 'Muita gente adia o dentista por medo. O site precisava',
      destaque: 'acalmar antes de convencer.',
      texto:
        'Em vez do branco frio de consultório, uma paleta de água e menta. Em vez de termos técnicos, frases curtas que explicam o que vai acontecer. E o agendamento a um toque, para quem decidiu marcar não desistir no caminho.',
    },
    decisoes: [
      { titulo: 'Em 3 segundos, o paciente entende tudo', texto: 'O que é, para quem e o próximo passo — com o arco suavizando o visual, longe da cara de hospital.' },
      { titulo: 'Agendar está sempre à vista', texto: 'O botão acompanha a rolagem. Quem decidiu marcar não precisa procurar como.' },
      { titulo: 'Linguagem simples', texto: 'Cada tratamento diz o que é e quanto tempo leva. Quem entende chega mais tranquilo.' },
      { titulo: 'Agendar sem ligar', texto: 'Dia e horário em botões grandes, fáceis de tocar no celular.' },
      { titulo: 'Rostos antes da cadeira', texto: 'Ver quem vai atender reduz a ansiedade antes da primeira consulta.' },
      { titulo: 'Tudo para chegar', texto: 'Endereço, horários e mapa juntos, para quem já está a caminho.' },
    ],
    cores: {
      titulo: 'Tons de água:',
      destaque: 'limpos, mas nunca frios.',
      texto: 'Um fundo levemente esverdeado no lugar do branco puro, um azul-petróleo para as ações e a menta para destacar sem gritar.',
      lista: [
        { nome: 'Névoa', hex: '#F4F7F7', uso: 'Fundo da página' },
        { nome: 'Profundo', hex: '#15303A', uso: 'Títulos e textos' },
        { nome: 'Petróleo', hex: '#2F6F86', uso: 'Botões e links' },
        { nome: 'Menta', hex: '#DCEBEE', uso: 'Destaques e cartões' },
        { nome: 'Ardósia', hex: '#4F6670', uso: 'Textos de apoio' },
      ],
    },
    fontes: [
      { nome: 'Instrument Serif', papel: 'Títulos', familia: 'serif', exemplo: 'Seu sorriso, no seu tempo.', porque: 'Serifa delicada, com cara de cuidado pessoal — o oposto da letra fria de exame médico.' },
      { nome: 'Hanken Grotesk', papel: 'Textos e botões', familia: 'sans', exemplo: 'Uma conversa e um exame para entender o que você precisa. Sem compromisso.', porque: 'Clara e arredondada, boa de ler no celular, mesmo em tamanhos pequenos.' },
    ],
    estilo: [
      { amostra: 'formas', titulo: 'Formas arredondadas', texto: 'Cantos de 14 a 24px, botões em pílula e o arco como assinatura.' },
      { amostra: 'botoes', titulo: 'Botões em pílula', texto: 'Um principal cheio, um secundário com contorno. Nunca dois chamando atenção.' },
      { amostra: 'alvos', titulo: 'Alvos grandes', texto: 'Horários e opções com pelo menos 44px, fáceis de tocar com o polegar.' },
      { amostra: 'movimento', titulo: 'Movimento calmo', texto: 'Entradas suaves e curtas; quem prefere menos animação vê tudo parado.' },
    ],
    cuidados: [
      { icone: 'contraste', titulo: 'Contraste confortável', texto: 'Texto escuro sobre fundo claro, com contraste acima do recomendado para leitura fácil.' },
      { icone: 'celular', titulo: 'Celular primeiro', texto: 'Agendar, ver o endereço e ligar funcionam com uma mão, sem zoom.' },
      { icone: 'teclado', titulo: 'Teclado e leitor de tela', texto: 'Tudo pode ser usado pelo teclado, com rótulos claros para quem usa leitor de tela.' },
    ],
    tema: { fundo: '#F4F7F7', tinta: '#15303A', acao: '#2F6F86', acaoTinta: '#FFFFFF', suave: '#DCEBEE', linha: '#D5E1E4', raio: '20px', raioBotao: '999px' },
  },

  'atelie-norte': {
    slug: 'atelie-norte',
    numero: '03',
    lead: 'Um ateliê de arquitetura que deixa a obra falar: muito espaço em branco, linhas finas e imagens grandes, como numa galeria.',
    meta: [
      { rotulo: 'Tipo', valor: 'Conceito — proposta visual' },
      { rotulo: 'Segmento', valor: 'Arquitetura e interiores' },
      { rotulo: 'Foco', valor: 'Portfólio e pedidos qualificados' },
      { rotulo: 'Pensado para', valor: 'Telas grandes e celular' },
    ],
    ideia: {
      frase: 'Quem procura um arquiteto quer ver antes de ler. O site precisava',
      destaque: 'sair da frente da obra.',
      texto:
        'Cores de materiais — cal, concreto e carvalho — para não competir com as fotos. Texto pequeno, como legenda de galeria. E um contato que já pergunta o essencial, para o ateliê responder com precisão.',
    },
    decisoes: [
      { titulo: 'A obra é a protagonista', texto: 'A primeira tela é quase só imagem; o texto entra como a legenda de uma galeria.' },
      { titulo: 'Filtrar pelo tipo de obra', texto: 'Residencial, comercial ou interiores: o visitante acha rápido algo parecido com o próprio projeto.' },
      { titulo: 'Antes e depois', texto: 'Uma barra para arrastar e comparar. A transformação convence mais que qualquer descrição.' },
      { titulo: 'Etapas e prazos às claras', texto: 'Mostrar o caminho, com prazos de referência, diminui o medo do desconhecido.' },
      { titulo: 'Contato que chega qualificado', texto: 'Tipo de espaço e metragem em poucos toques: o pedido chega organizado.' },
    ],
    cores: {
      titulo: 'Cores de materiais:',
      destaque: 'neutras para a obra brilhar.',
      texto: 'Nada de cor chamativa. A paleta vem do canteiro de obras — cal, concreto e madeira — e deixa as fotos serem o ponto de cor da página.',
      lista: [
        { nome: 'Cal', hex: '#EDEDEA', uso: 'Fundo da página' },
        { nome: 'Grafite', hex: '#1B1C20', uso: 'Títulos e textos' },
        { nome: 'Carvão', hex: '#232428', uso: 'Faixas escuras e botões' },
        { nome: 'Carvalho', hex: '#B9A58C', uso: 'Detalhes e destaques' },
        { nome: 'Concreto', hex: '#55595F', uso: 'Textos de apoio' },
      ],
    },
    fontes: [
      { nome: 'Instrument Serif', papel: 'Títulos', familia: 'serif', exemplo: 'Espaços que respiram.', porque: 'Alta e elegante, lembra a tipografia de revistas de arquitetura — e fica linda em tamanho grande.' },
      { nome: 'Hanken Grotesk', papel: 'Textos, legendas e logo', familia: 'sans', exemplo: 'NORTE · Arquitetura residencial e interiores.', porque: 'Neutra e técnica na medida certa; com letras espaçadas vira a marca do ateliê.' },
    ],
    estilo: [
      { amostra: 'linhas', titulo: 'Linhas finas, cantos retos', texto: 'Bordas de 1px e quase nenhum arredondamento, como um desenho técnico.' },
      { amostra: 'imagem', titulo: 'Imagens grandes', texto: 'Grade assimétrica: obras em destaque ocupam mais espaço que as outras.' },
      { amostra: 'botoes', titulo: 'Botões discretos', texto: 'Escuro e reto para a ação principal; filtros em pílula para escolher.' },
      { amostra: 'movimento', titulo: 'Respiro', texto: 'Muito espaço entre as seções. A página não tem pressa, como uma visita ao ateliê.' },
    ],
    cuidados: [
      { icone: 'teclado', titulo: 'Comparar pelo teclado', texto: 'O antes e depois funciona com as setas do teclado e é anunciado pelo leitor de tela.' },
      { icone: 'velocidade', titulo: 'Imagens leves', texto: 'No site real, as fotos grandes carregam só quando chegam perto da tela — a página abre rápido.' },
      { icone: 'contraste', titulo: 'Legível sobre a cal', texto: 'Textos em grafite sobre o fundo claro, com contraste confortável.' },
    ],
    tema: { fundo: '#EDEDEA', tinta: '#1B1C20', acao: '#232428', acaoTinta: '#FFFFFF', suave: '#DCD6CB', linha: '#C9CAC6', raio: '0px', raioBotao: '0px' },
  },

  'casa-alba': {
    slug: 'casa-alba',
    numero: '04',
    lead: 'Um restaurante para decidir pelo celular: aberto agora, cardápio em texto e reserva em poucos toques, num verde-noite aconchegante.',
    meta: [
      { rotulo: 'Tipo', valor: 'Conceito — proposta visual' },
      { rotulo: 'Segmento', valor: 'Restaurante' },
      { rotulo: 'Foco', valor: 'Reservas e cardápio' },
      { rotulo: 'Pensado para', valor: 'Celular, com uma mão' },
    ],
    ideia: {
      frase: 'Quem procura um restaurante quase sempre está com fome e com pressa. O site precisava',
      destaque: 'responder antes da pergunta.',
      texto:
        'Está aberto? O que tem no cardápio? Dá para reservar? Tudo isso na primeira tela e numa barra fixa ao alcance do polegar. O fundo escuro, com verde de sálvia e cor de linho, lembra um salão à luz baixa.',
    },
    decisoes: [
      { titulo: 'Está aberto? A resposta vem primeiro', texto: 'Um selo usa o relógio de quem visita e mostra se a casa está aberta agora.' },
      { titulo: 'As três ações sempre à mão', texto: 'Reservar, cardápio e como chegar ficam fixos embaixo, no alcance do polegar.' },
      { titulo: 'Cardápio em texto, não em PDF', texto: 'Abre rápido, filtra por vegetariano e sem glúten, e o Google consegue ler os pratos.' },
      { titulo: 'Reserva em poucos toques', texto: 'Pessoas, dia e horário em botões grandes; o pedido chegaria no WhatsApp da casa.' },
      { titulo: 'O clima ajuda a decidir', texto: 'Fotos do salão e informações de visita juntas, para escolher a ocasião certa.' },
    ],
    cores: {
      titulo: 'Verde-noite e linho:',
      destaque: 'aconchego de salão à luz baixa.',
      texto: 'Um escuro quente, puxado para o verde, deixa a comida e os textos em linho brilharem. A sálvia marca as ações sem quebrar o clima.',
      lista: [
        { nome: 'Verde-noite', hex: '#141A18', uso: 'Fundo da página' },
        { nome: 'Folha', hex: '#1B2320', uso: 'Cartões e faixas' },
        { nome: 'Linho', hex: '#EEEBE3', uso: 'Títulos e textos' },
        { nome: 'Sálvia', hex: '#A9BBA7', uso: 'Botões e selos' },
        { nome: 'Musgo', hex: '#AEB6AF', uso: 'Textos de apoio' },
      ],
    },
    fontes: [
      { nome: 'Instrument Serif', papel: 'Títulos e logo', familia: 'serif', italico: true, exemplo: 'Sabores da estação.', porque: 'Em itálico, tem o charme de um cardápio escrito à mão — sem ficar difícil de ler.' },
      { nome: 'Hanken Grotesk', papel: 'Cardápio, preços e botões', familia: 'sans', exemplo: 'Risoto de abóbora assada · R$ 58', porque: 'Números claros e boa leitura em fundo escuro, mesmo com a tela do celular no mínimo.' },
    ],
    estilo: [
      { amostra: 'selo', titulo: 'Selo de horário', texto: 'Um ponto de cor e uma frase curta: aberto agora, ou a que horas abre.' },
      { amostra: 'barra', titulo: 'Barra de ações', texto: 'Três botões fixos embaixo no celular, sempre no mesmo lugar.' },
      { amostra: 'botoes', titulo: 'Cantos suaves', texto: 'Botões e cartões com 8 a 12px: acolhedor, sem parecer infantil.' },
      { amostra: 'formas', titulo: 'O prato como forma', texto: 'Círculos aparecem no prato do topo e nos detalhes, repetindo a mesa vista de cima.' },
    ],
    cuidados: [
      { icone: 'busca', titulo: 'O Google lê o cardápio', texto: 'Pratos em texto aparecem nas buscas e abrem rápido, sem baixar arquivo.' },
      { icone: 'celular', titulo: 'Uma mão só', texto: 'As ações principais ficam no alcance do polegar, sem precisar rolar até o fim.' },
      { icone: 'contraste', titulo: 'Escuro, mas legível', texto: 'Texto claro sobre o verde-noite, com contraste confortável para ler à noite.' },
    ],
    tema: { fundo: '#141A18', tinta: '#EEEBE3', acao: '#A9BBA7', acaoTinta: '#141A18', suave: '#1B2320', linha: 'rgba(238,235,227,.18)', raio: '12px', raioBotao: '8px' },
  },
}
