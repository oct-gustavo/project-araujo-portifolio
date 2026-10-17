import { Carregando } from '@/components/marca/Carregando'
import p from './painel.module.css'

export function EmConstrucao({ item, texto }: { item: number; texto: string }) {
  return (
    <section className={p.construcao}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Carregando tamanho={26} tema="claro" rotulo="Em construção" />
        <strong style={{ fontWeight: 600 }}>Em construção · item {item}</strong>
      </span>
      <p>{texto}</p>
    </section>
  )
}
