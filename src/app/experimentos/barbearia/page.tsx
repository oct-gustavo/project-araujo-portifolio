import '@/components/experimentos/experimentos.css'
import { fontesBarbearia } from '@/components/experimentos/fontes'
import { metadadosExperimento, viewportExperimento } from '@/components/experimentos/metadados'
import { Barbearia } from '@/components/experimentos/Barbearia'

export const metadata = metadadosExperimento('barbearia')
export const viewport = viewportExperimento('#1A1714')

/** Site experimental (conceito com nomes e dados fictícios). Nada é enviado: tudo acontece no navegador. */
export default function Pagina() {
  return (
    <div className={`ex ex-barb ${fontesBarbearia}`}>
      <Barbearia />
    </div>
  )
}
