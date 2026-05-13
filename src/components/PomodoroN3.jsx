import { useState, useEffect, useRef } from 'react'
import { Brain, Coffee } from '@phosphor-icons/react'

function PomodoroN3() {
  const [workMins, setWorkMins] = useState(0.5)
  const [breakMins, setBreakMins] = useState(0.3)

  const [timeLeft, setTimeLeft] = useState(workMins * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [sessions, setSessions] = useState([])

  const intervalRef = useRef(null)
  const modeRef = useRef(mode)
  const workMinsRef = useRef(workMins)
  const breakMinsRef = useRef(breakMins)
  modeRef.current = mode
  workMinsRef.current = workMins
  breakMinsRef.current = breakMins

  const totalTime = mode === 'work' ? workMins * 60 : breakMins * 60
  const progreso = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  const sesionesCompletadas = sessions.filter(s => s.type === 'work').length
  const tiempoAcumulado = sessions.reduce((acc, s) => acc + s.duration, 0)

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
    const wMins      = workMinsRef.current
    const bMins      = breakMinsRef.current

    if (modoActual === 'work') {
      setSessions(prev => [...prev, {
        id: Date.now(),
        type: 'work',
        duration: wMins * 60,
        completedAt: new Date(),
      }])
    }

    const nuevoModo = modoActual === 'work' ? 'break' : 'work'
    setMode(nuevoModo)
    setTimeLeft(nuevoModo === 'work' ? wMins * 60 : bMins * 60)
    setIsRunning(true)
  }, [timeLeft])

  useEffect(() => {
    if (timeLeft !== 0) return

    try {
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play()
    } catch (e) {
      console.log('No se pudo reproducir el sonido:', e.message)
    }
  }, [timeLeft])

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(mode === 'work' ? workMins * 60 : breakMins * 60)
    }
  }, [workMins, breakMins])   // eslint-disable-line react-hooks/exhaustive-deps

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
    setMode('work')
    setTimeLeft(workMins * 60)
    setSessions([])
  }

  function guardarParcial() {
    const tiempoTranscurrido = totalTime - timeLeft
    if (tiempoTranscurrido === 0) return

    setSessions(prev => [...prev, {
      id: Date.now(),
      type: 'work (parcial)',
      duration: tiempoTranscurrido,
      completedAt: new Date(),
    }])
  }

  const esTrabajo = mode === 'work'

  return (
    <div style={estilos.contenedor}>

      {/* Tarjeta principal */}
      <div style={estilos.tarjeta}>

        {/* Configuración */}
        <div style={estilos.config}>
          <label style={estilos.label}>
            Trabajo (min)
            <input
              type="number"
              min="1"
              max="60"
              value={workMins}
              disabled={isRunning}
              onChange={e => {
                const val = Math.max(1, Math.min(60, Number(e.target.value)))
                setWorkMins(val)
              }}
              style={{ ...estilos.input, opacity: isRunning ? 0.45 : 1 }}
            />
          </label>
          <label style={estilos.label}>
            Descanso (min)
            <input
              type="number"
              min="1"
              max="60"
              value={breakMins}
              disabled={isRunning}
              onChange={e => {
                const val = Math.max(1, Math.min(60, Number(e.target.value)))
                setBreakMins(val)
              }}
              style={{ ...estilos.input, opacity: isRunning ? 0.45 : 1 }}
            />
          </label>
        </div>

        {/* Badge de modo */}
        <div style={{ ...estilos.badge, ...(esTrabajo ? estilos.badgeTrabajo : estilos.badgeDescanso), marginTop: '35px' }}>
          {esTrabajo
            ? <><Brain size={16} weight="bold" /> Trabajo</>
            : <><Coffee size={16} weight="bold" /> Descanso</>
          }
        </div>

        {/* Tiempo */}
        <div style={{ ...estilos.tiempo, color: esTrabajo ? '#9E3B3B' : '#4a7a4a' }}>
          {formatTime(timeLeft)}
        </div>

        {/* Barra de progreso */}
        <div style={estilos.progresoBg}>
          <div
            style={{
              ...estilos.progresoFill,
              width: `${progreso}%`,
              background: esTrabajo ? '#D25353' : '#6a9d6a',
            }}
          />
        </div>
        <p style={estilos.progresoTexto}>{Math.round(progreso)}% completado</p>

        {/* Botones */}
        <div style={{ ...estilos.botones, marginTop: '20px' }}>
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
          {esTrabajo && timeLeft < totalTime && (
            <button style={estilos.btnGuardar} onClick={guardarParcial}>
              Guardar parcial
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div style={estilos.stats}>
        <div style={estilos.statItem}>
          <span style={estilos.statNumero}>{sesionesCompletadas}</span>
          <span style={estilos.statLabel}>Sesiones completadas</span>
        </div>
        <div style={estilos.statDivisor} />
        <div style={estilos.statItem}>
          <span style={estilos.statNumero}>{formatTime(tiempoAcumulado)}</span>
          <span style={estilos.statLabel}>Tiempo total trabajado</span>
        </div>
      </div>

      {/* Historial */}
      {sessions.length > 0 && (
        <div style={estilos.historial}>
          <h3 style={estilos.historialTitulo}>Historial de sesiones</h3>
          <table style={estilos.tabla}>
            <thead>
              <tr style={estilos.trImpar}>
                <th style={estilos.th}>#</th>
                <th style={estilos.th}>Tipo</th>
                <th style={estilos.th}>Duración</th>
                <th style={estilos.th}>Hora de fin</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => {
                const esParcial = s.type.includes('parcial')
                return (
                  <tr key={s.id} style={i % 2 === 0 ? estilos.trPar : estilos.trImpar}>
                    <td style={estilos.tdNum}>{i + 1}</td>
                    <td style={estilos.td}>
                      <span style={{ color: esParcial ? '#b08a20' : '#9E3B3B', fontWeight: 700 }}>
                        {esParcial ? 'Parcial' : 'Completa'}
                      </span>
                    </td>
                    <td style={estilos.tdDuracion}>{formatTime(s.duration)}</td>
                    <td style={estilos.tdHora}>{s.completedAt.toLocaleTimeString()}</td>
                  </tr>
                )
              })}
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
    gap: '16px',
    padding: '32px 40px',
    background: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(158,59,59,0.12)',
    width: '100%',
    maxWidth: '420px',
  },
  config: {
    display: 'flex',
    gap: '24px',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '12px',
    color: '#EA7B7B',
    letterSpacing: '1px',
    alignItems: 'center',
  },
  input: {
    width: '72px',
    padding: '6px 8px',
    fontSize: '16px',
    fontFamily: 'monospace',
    border: 'none',
    borderBottom: '2px solid #9E3B3B',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#9E3B3B',
    outline: 'none',
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
    fontSize: '76px',
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: '4px',
    lineHeight: 1,
  },
  progresoBg: {
    width: '100%',
    height: '8px',
    background: '#FFEAD3',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progresoFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  progresoTexto: {
    fontSize: '12px',
    color: '#EA7B7B',
    margin: 0,
  },
  botones: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnPrimario: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#fff',
  },
  btnSecundario: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '700',
    border: '2px solid #EA7B7B',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'transparent',
    color: '#9E3B3B',
  },
  btnGuardar: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: '#fffbf0',
    color: '#b08a20',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px 32px',
    boxShadow: '0 4px 20px rgba(158,59,59,0.10)',
    width: '100%',
    maxWidth: '420px',
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statNumero: {
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#9E3B3B',
  },
  statLabel: {
    fontSize: '12px',
    color: '#EA7B7B',
    letterSpacing: '1px',
  },
  statDivisor: {
    width: '1px',
    height: '40px',
    background: '#FFEAD3',
    margin: '0 16px',
  },
  historial: {
    width: '100%',
    maxWidth: '420px',
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: '0 4px 20px rgba(158,59,59,0.10)',
  },
  historialTitulo: {
    fontSize: '12px',
    fontWeight: '700',
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

export default PomodoroN3
