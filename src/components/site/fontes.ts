import { Epilogue } from 'next/font/google'

/**
 * Fontes do site público. O next/font baixa os arquivos no build e serve do próprio domínio
 * (nenhuma requisição ao Google no navegador, compatível com a CSP "font-src 'self'").
 */
export const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--fonte-site',
  display: 'swap',
})

export const classesFontes = epilogue.variable
