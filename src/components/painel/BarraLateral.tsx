import Link from 'next/link'
import { SimboloA } from '@/components/marca/Logo'
import { LinksMenu } from './LinksMenu'
import { BotaoSair } from './BotaoSair'
import p from './painel.module.css'

type Props = { metaSemanal: number; cadastradosSemana: number }

export function BarraLateral({ metaSemanal, cadastradosSemana }: Props) {
  const feitos = Math.min(cadastradosSemana, metaSemanal)
  const porBloco = metaSemanal / 10
  const blocos = Array.from({ length: 10 }, (_, i) => {
    const limite = (i + 1) * porBloco
    if (feitos >= limite) return p.blocoCheio
    if (feitos > i * porBloco) return p.blocoMeio
    return ''
  })

  return (
    <aside className={p.lateral}>
      <Link href="/leads" className={p.marca} aria-label="araújo · início">
        <SimboloA tamanho={30} />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className={p.marcaNome}>araújo<span>_</span></span>
          <span className={p.marcaSub}>Captação</span>
        </span>
      </Link>

      <LinksMenu />

      <div className={p.meta}>
        <div className={p.metaTopo}>
          <span className={p.rotuloMono}>Meta semanal</span>
          <span className={p.metaNum}>{cadastradosSemana}/{metaSemanal}</span>
        </div>
        <div className={p.blocos} role="img" aria-label={`${cadastradosSemana} de ${metaSemanal} leads cadastrados nesta semana`}>
          {blocos.map((c, i) => (
            <span key={i} className={`${p.bloco} ${c}`} />
          ))}
        </div>
        <span className={p.metaNota}>leads cadastrados · renova segunda</span>
      </div>

      <BotaoSair />
    </aside>
  )
}
