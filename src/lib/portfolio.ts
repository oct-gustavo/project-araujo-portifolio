/**
 * Dados do portfólio público (rota "/").
 * Troque os valores entre colchetes pelos reais — o site inteiro lê daqui.
 */
export const PORTFOLIO = {
  nome: 'Gustavo Araújo',
  marca: 'Araújo',
  assinatura: 'Estúdio digital',
  /** Domínio final, ex.: 'https://araujo.com.br' (SEO e compartilhamento). Vazio até ter. */
  url: '',

  contato: {
    /** Só números, com DDI + DDD. Ex.: '5511987654321'. Vazio = o formulário avisa que falta configurar. */
    whatsapp: '5585992170148',
    /** Como o número aparece escrito no site. */
    whatsappTexto: '(85) 99217-0148',
    email: 'dearaujoluisgustavo95@gmail.com',
    instagramTexto: '@wba_araujo',
    instagramUrl: 'https://www.instagram.com/wba_araujo/',
  },

  /** Links das redes. A coluna "Redes" do rodapé só aparece quando há pelo menos um. */
  redes: {
    instagram: 'https://www.instagram.com/wba_araujo/',
    linkedin: '',
    behance: '',
  },
} as const

/** Link do WhatsApp com mensagem pronta (null enquanto o número não estiver configurado). */
export function linkWhatsapp(mensagem?: string): string | null {
  const numero = PORTFOLIO.contato.whatsapp.replace(/\D/g, '')
  if (!numero) return null
  return `https://wa.me/${numero}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ''}`
}

/** Valores ainda não preenchidos começam com "[". */
export const ehPlaceholder = (valor: string) => valor.startsWith('[')
