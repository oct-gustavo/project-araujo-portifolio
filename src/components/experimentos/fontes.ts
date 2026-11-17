import { Fraunces, Hanken_Grotesk, Instrument_Serif, Oswald } from 'next/font/google'

/**
 * Fontes dos sites experimentais: cada "cliente" tem a sua tipografia.
 * O next/font serve os arquivos do próprio domínio (CSP "font-src 'self'").
 */
const corpo = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--ex-corpo', display: 'swap' })

const serifImob = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--ex-titulo',
  display: 'swap',
})

const condensadaBarb = Oswald({ subsets: ['latin'], weight: ['500', '600'], variable: '--ex-titulo', display: 'swap' })

const serifRest = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--ex-titulo',
  display: 'swap',
})

export const fontesImobiliaria = `${corpo.variable} ${serifImob.variable}`
export const fontesBarbearia = `${corpo.variable} ${condensadaBarb.variable}`
export const fontesRestaurante = `${corpo.variable} ${serifRest.variable}`
