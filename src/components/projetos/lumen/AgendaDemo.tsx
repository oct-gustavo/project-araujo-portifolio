'use client'

import { useState } from 'react'

const DIAS = [
  ['seg', 12],
  ['ter', 13],
  ['qua', 14],
  ['qui', 15],
  ['sex', 16],
] as const
const HORAS = ['8:00', '9:30', '11:00', '14:00', '16:30']

/** Agenda de demonstração: escolhe dia e horário, mas não envia nada. */
export function AgendaDemo() {
  const [dia, setDia] = useState(1)
  const [hora, setHora] = useState<string | null>(null)
  const [confirmado, setConfirmado] = useState(false)
  const [sem, num] = DIAS[dia]

  return (
    <div className="lu-cal">
      <div className="lu-cal-h">
        <span>Avaliação · 40 min</span>
        <span style={{ color: 'var(--muted)', fontWeight: 400 }}>semana de exemplo</span>
      </div>
      <div className="lu-days" role="group" aria-label="Dia">
        {DIAS.map(([s, n], i) => (
          <button
            key={n}
            type="button"
            className={i === dia ? 'lu-day on' : 'lu-day'}
            aria-pressed={i === dia}
            onClick={() => {
              setDia(i)
              setConfirmado(false)
            }}
          >
            <span>{s}</span>
            <b>{n}</b>
          </button>
        ))}
      </div>
      <div className="lu-times" role="group" aria-label="Horário">
        {HORAS.map((h) => (
          <button
            key={h}
            type="button"
            className={h === hora ? 'lu-time on' : 'lu-time'}
            aria-pressed={h === hora}
            onClick={() => {
              setHora(h)
              setConfirmado(false)
            }}
          >
            {h}
          </button>
        ))}
      </div>
      <div className="lu-cal-foot">
        <span aria-live="polite">
          {confirmado
            ? `Demonstração: no site real, ${sem}, dia ${num} às ${hora} iria para a agenda da clínica.`
            : hora
              ? `${sem}, dia ${num} às ${hora}`
              : 'Escolha um horário'}
        </span>
        <button className="lu-btn" type="button" disabled={!hora} onClick={() => setConfirmado(true)}>
          Confirmar
        </button>
      </div>
    </div>
  )
}
