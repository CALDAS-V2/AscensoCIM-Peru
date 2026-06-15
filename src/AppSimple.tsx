export default function App() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#1f2937', marginTop: 0 }}>🎓 AscensoCIM Perú</h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Plataforma de Estudio PNP
        </p>
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#eff6ff',
          borderRadius: '6px',
          border: '1px solid #bfdbfe'
        }}>
          <h2 style={{ color: '#1e40af', fontSize: '18px', marginTop: 0 }}>
            ✅ ¡La aplicación está en línea!
          </h2>
          <p style={{ color: '#1e40af', marginBottom: 0 }}>
            Acceso desde cualquier dispositivo con internet
          </p>
        </div>
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '6px',
          border: '1px solid #bbf7d0'
        }}>
          <p style={{ color: '#15803d', marginBottom: '0.5rem' }}>
            📚 Características:
          </p>
          <ul style={{
            textAlign: 'left',
            color: '#15803d',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            <li>Preguntas de práctica por temas</li>
            <li>Sistema de calificación</li>
            <li>Interfaz responsiva</li>
            <li>Acceso desde cualquier dispositivo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
