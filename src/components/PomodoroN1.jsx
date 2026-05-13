import { useState, useEffect, useRef } from 'react'

function PomodoroN1() {
  const [timeLeft, setTimeLeft] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)

  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }

    if (timeLeft === 0) {
      setIsRunning(false)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

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
    setTimeLeft(1500)
  }

  return (
    <div style={estilos.tarjeta}>

      <div style={estilos.tiempo}>
        {formatTime(timeLeft)}
      </div>

      <div style={estilos.botones}>
        <button style={estilos.btnPrimario} onClick={toggleTimer}>
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button style={estilos.btnSecundario} onClick={resetTimer}>
          Reiniciar
        </button>
      </div>

      <p style={estilos.ayuda}>
        {timeLeft === 1500 && !isRunning && 'Presiona Iniciar para comenzar.'}
        {isRunning && 'El timer está corriendo...'}
        {!isRunning && timeLeft < 1500 && timeLeft > 0 && 'Timer pausado.'}
        {timeLeft === 0 && '¡Sesión completada!'}
      </p>
    </div>
  )
}

const estilos = {
  tarjeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '48px 32px',
    background: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(158,59,59,0.12)',
    maxWidth: '380px',
    margin: '0 auto',
  },
  tiempo: {
    fontSize: '80px',
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#9E3B3B',
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
  ayuda: {
    fontSize: '13px',
    color: '#9E3B3B99',
    margin: 0,
    minHeight: '24px',
  },
}

export default PomodoroN1
