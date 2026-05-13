import { useState, useEffect, useRef } from 'react'
import { Brain, Coffee } from '@phosphor-icons/react'

const WORK_TIME = 1500
const BREAK_TIME = 300

function PomodoroN2() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [sessions, setSessions] = useState([])

  const intervalRef = useRef(null)
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft !== 0) return

    const modoActual = modeRef.current

    if (modoActual === 'work') {
      setSessions(prev => [...prev, {
        id: Date.now(),
        type: 'work',
        duration: WORK_TIME,
        completedAt: new Date(),
      }])
    }

    const nuevoModo = modoActual === 'work' ? 'break' : 'work'
    setMode(nuevoModo)
    setTimeLeft(nuevoModo === 'work' ? WORK_TIME : BREAK_TIME)
    setIsRunning(true)
  }, [timeLeft])

  function formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  function toggleTimer() {
    setIsRunning(prev => !prev)
  }

  function resetTimer() {
    setIsRunning(false)
    setTimeLeft(WORK_TIME)
    setMode('work')
    setSessions([])
  }

  const esTrabajo = mode === 'work'

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>

        {/* Indicador de modo */}
        <div style={{ ...estilos.badge, ...(esTrabajo ? estilos.badgeTrabajo : estilos.badgeDescanso) }}>
          {esTrabajo
            ? <><Brain size={16} weight="bold" /> Trabajo</>
            : <><Coffee size={16} weight="bold" /> Descanso</>
          }
        </div>

        {/* Tiempo */}
        <div style={{ ...estilos.tiempo, color: esTrabajo ? '#9E3B3B' : '#6a7d4f' }}>
          {formatTime(timeLeft)}
        </div>

        {/* Botones */}
        <div style={estilos.botones}>
          <button
            style={{ ...estilos.btnPrimario, background: esTrabajo ? '#D25353' : '#6a9d6a' }}
            onClick={toggleTimer}
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          {esTrabajo && (
            <button style={estilos.btnSecundario} onClick={resetTimer}>
              Reiniciar
            </button>
          )}
        </div>

        <p style={estilos.contadorSesiones}>
          Sesiones completadas: <strong style={{ color: '#9E3B3B' }}>{sessions.length}</strong>
        </p>
      </div>

      {/* Historial */}
      {sessions.length > 0 && (
        <div style={estilos.historial}>
          <h3 style={estilos.historialTitulo}>Historial de sesiones</h3>
          <table style={estilos.tabla}>
            <thead>
              <tr style={estilos.trImpar}>
                <th style={estilos.th}>#</th>
                <th style={estilos.th}>Duración</th>
                <th style={estilos.th}>Hora de fin</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={s.id}>
                  <td style={estilos.tdNum}>{i + 1}</td>
                  <td style={estilos.tdDuracion}>{formatTime(s.duration)}</td>
                  <td style={estilos.tdHora}>{s.completedAt.toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const estilos = {
  contenedor: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '12px 0',
  },
  tarjeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '40px 40px 32px',
    background: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(158,59,59,0.12)',
    width: '100%',
    maxWidth: '400px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 18px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700',
  },
  badgeTrabajo: {
    background: '#FFEAD3',
    color: '#9E3B3B',
  },
  badgeDescanso: {
    background: '#eef6ee',
    color: '#4a7a4a',
  },
  tiempo: {
    fontSize: '80px',
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: '4px',
    lineHeight: 1,
  },
  botones: {
    display: 'flex',
    gap: '12px',
  },
  btnPrimario: {
    padding: '10px 28px',
    fontSize: '15px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: '#9E3B3B',
    color: '#fff',
  },
  btnSecundario: {
    padding: '10px 28px',
    fontSize: '15px',
    fontWeight: '700',
    border: '2px solid #EA7B7B',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'transparent',
    color: '#EA7B7B',
  },
  contadorSesiones: {
    fontSize: '16px',
    color: '#9E3B3B99',
    margin: 0,
    minHeight: '24px',
  },
  historial: {
    width: '100%',
    maxWidth: '400px',
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: '0 4px 20px rgba(158,59,59,0.10)',
  },
  historialTitulo: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#9E3B3B',
    margin: '0 0 12px',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    padding: '8px 12px',
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#EA7B7B',
    borderBottom: '2px solid #9e3b3b18',
  },
  trPar: {
    background: '#ffffff',
  },
  trImpar: {
    background: '#9e3b3b18',
  },
  td: {
    padding: '9px 12px',
    color: '#3a1a1a',
    textAlign: 'center',
  },
  tdNum: {
    padding: '9px 12px',
    color: '#EA7B7B',
    width: '40px',
    textAlign: 'center',
  },
  tdDuracion: {
    padding: '9px 12px',
    color: '#EA7B7B',
    textAlign: 'center',
  },
  tdHora: {
    padding: '9px 12px',
    color: '#EA7B7B',
    fontSize: '13px',
    textAlign: 'center',
  },
}

export default PomodoroN2
