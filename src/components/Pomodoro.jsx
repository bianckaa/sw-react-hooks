import { useState, useEffect, useRef } from 'react'

function Pomodoro() {
  // TODO 1: estados timeLeft e isRunning
  const [timeLeft, setTimeLeft] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)

  // TODO 2: referencia para el ID del intervalo (no dispara re-renders)
  const intervalRef = useRef(null)

  // TODO 3: efecto que controla la cuenta regresiva
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

  // TODO 4: convierte segundos a "MM:SS"
  function formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  // TODO 5: funciones de control
  function toggleTimer() {
    setIsRunning(prev => !prev)
  }

  function resetTimer() {
    setIsRunning(false)
    setTimeLeft(1500)
  }

  // TODO 6: render
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Pomodoro Timer</h1>

      <div style={styles.display}>
        {formatTime(timeLeft)}
      </div>

      <div style={styles.controls}>
        <button style={styles.btn} onClick={toggleTimer}>
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={resetTimer}>
          Reiniciar
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    background: '#fdfdfd',
    gap: '24px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
  },
  display: {
    fontSize: '72px',
    fontWeight: '600',
    fontFamily: 'monospace',
    color: '#b44c33',
    letterSpacing: '4px',
  },
  controls: {
    display: 'flex',
    gap: '12px',
  },
  btn: {
    padding: '10px 28px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    background: '#b44c33',
    color: '#fff',
  },
  btnSecondary: {
    background: '#e2e2e2',
    color: '#1a1a1a',
  },
}

export default Pomodoro
