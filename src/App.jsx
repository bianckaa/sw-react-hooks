import { useState } from 'react'
import PomodoroN1 from './components/PomodoroN1'
import PomodoroN2 from './components/PomodoroN2'
import PomodoroN3 from './components/PomodoroN3'

const TABS = [
  { id: 'n1', label: 'Nivel 1'},
  { id: 'n2', label: 'Nivel 2'},
  { id: 'n3', label: 'Nivel 3'},
]

function App() {
  const [tabActiva, setTabActiva] = useState('n1')

  return (
    <div style={estilos.pagina}>

      {/* Encabezado */}
      <header style={estilos.header}>
        <p style={estilos.curso}>Sistemas y Tecnologías Web</p>
        <h1 style={estilos.titulo}>Pomodoro Timer</h1>
      </header>

      {/* Tabs como botones individuales */}
      <div style={estilos.tabBar}>
        {TABS.map(tab => {
          const activa = tabActiva === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              style={{
                ...estilos.tab,
                ...(activa ? estilos.tabActiva : estilos.tabInactiva),
              }}
            >
              {tab.label}
              <span style={{ ...estilos.tabSub, color: activa ? '#FFEAD3cc' : '#aaa' }}>
                {tab.sub}
              </span>
            </button>
          )
        })}
      </div>

      {/* Panel de contenido */}
      <main style={estilos.main}>
        {tabActiva === 'n1' && <PomodoroN1 />}
        {tabActiva === 'n2' && <PomodoroN2 />}
        {tabActiva === 'n3' && <PomodoroN3 />}
      </main>

      <footer style={estilos.footer}>
        Biancka Raxón – Universidad del Valle de Guatemala
      </footer>
    </div>
  )
}

const estilos = {
  pagina: {
    minHeight: '100vh',
    background: 'white',
    fontFamily: "'Segoe UI', sans-serif",
    color: 'white',
  },
  header: {
    background: '#9E3B3B',
    padding: '32px 24px 28px',
    textAlign: 'center',
  },
  curso: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '2.5px',
    color: '#FFEAD3aa',
    margin: '0 0 10px',
  },
  titulo: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#FFEAD3',
    margin: '0 0 14px',
  },
  chips: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  chip: {
    fontFamily: 'monospace',
    fontSize: '13px',
    background: '#FFEAD322',
    color: '#FFEAD3',
    padding: '3px 12px',
    borderRadius: '4px',
    border: '1px solid #FFEAD344',
  },
  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    padding: '24px 20px',
    background: 'white',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '10px 32px',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s, transform 0.1s',
    minWidth: '110px',
  },
  tabActiva: {
    background: '#9E3B3B',
    color: 'white',
    boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
    transform: 'translateY(-1px)',
  },
  tabInactiva: {
    background: 'white',
    color: '#EA7B7B',
    border: '2px solid #EA7B7B',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'transparent',
  },
  tabSub: {
    fontSize: '11px',
    fontWeight: '400',
  },
  main: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 20px 60px',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '12px',
    color: '#9E3B3B99',
    borderTop: '1px solid #D2535344',
    background: 'white',
  },
}

export default App
