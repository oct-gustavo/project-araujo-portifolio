import p from './painel.module.css'

export function Cabecalho({ sobretitulo, titulo, children }: { sobretitulo: string; titulo: string; children?: React.ReactNode }) {
  return (
    <header className={p.cabecalho}>
      <div className={p.cabecalhoTexto}>
        <span className={p.sobretitulo}>{sobretitulo}</span>
        <h1 className={p.titulo}>{titulo}</h1>
      </div>
      {children}
    </header>
  )
}
