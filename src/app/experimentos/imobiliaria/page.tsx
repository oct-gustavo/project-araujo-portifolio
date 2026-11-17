import '@/components/experimentos/experimentos.css'
import { fontesImobiliaria } from '@/components/experimentos/fontes'
import { metadadosExperimento, viewportExperimento } from '@/components/experimentos/metadados'
import { Imobiliaria } from '@/components/experimentos/Imobiliaria'

export const metadata = metadadosExperimento('imobiliaria')
export const viewport = viewportExperimento('#1F3A5F')

/** Site experimental (conceito com nomes e dados fictícios). Nada é enviado: tudo acontece no navegador. */
export default function Pagina() {
  return (
    <div className={`ex ex-imob ${fontesImobiliaria}`}>
      <Imobiliaria />
    </div>
  )
}
