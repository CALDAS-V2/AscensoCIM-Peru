# 🎧 Sistema de Audio Inteligente para Preguntas

## Descripción General

El sistema de audio automático inteligente permite a los usuarios escuchar las preguntas del simulador con reproducción automática, transición fluida entre preguntas y múltiples modos de reproducción.

## ✨ Características Principales

### 1. **Reproducción Automática de Preguntas**
- Lee la pregunta automáticamente
- Lee todas las alternativas (A, B, C, D, E)
- Puede leer la respuesta correcta y explicación (configurable)
- Soporte para idioma español (es-ES)

### 2. **Modos de Reproducción**
- **Modo Manual**: Control total del usuario sobre reproducción
- **Modo Automático**: Avance automático entre preguntas
- **Loop Continuo**: Reinicia desde la primera pregunta al terminar
- **Repetición**: Opción para repetir preguntas

### 3. **Controles de Audio**
- ▶️ **Play/Reproducir**: Inicia la lectura de la pregunta
- ⏸ **Pause/Pausar**: Pausa la reproducción
- ⏹ **Stop/Detener**: Detiene y reinicia
- ⏩ **Siguiente/Anterior**: Navega entre preguntas
- 🔊 **Velocidad**: Ajustable de 0.5x a 2x

### 4. **Características Avanzadas**
- ✅ Lectura de respuesta correcta y explicación
- ✅ Velocidad de reproducción configurable
- ✅ Bucle continuo activable
- ✅ Mostrar texto actual en reproducción
- ✅ Compatible con tema oscuro/claro
- ✅ Totalmente responsive (móvil + desktop)
- ✅ Interfaz de pestañas para organizar modos

## 📁 Estructura de Archivos

```
src/
├── lib/
│   ├── useAudioManager.ts        # Custom hook principal
│   ├── AudioService.ts           # Servicio de gestión de audio
│   └── index.ts                  # Exports centralizados
├── components/
│   └── AudioControls.tsx         # Componente reutilizable de controles
└── pages/
    └── AudioPage.tsx             # Página principal con todas las características
```

## 🔧 Cómo Usar

### En AudioPage
El componente está completamente listo para usar. Simplemente navega a `/audio` en la aplicación.

#### Interfaz con Pestañas:
1. **Manual**: Control manual de reproducción pregunta por pregunta
2. **Automático**: Reproducción automática con avance automático
3. **Configuración**: Ajustes globales de velocidad y comportamiento

### Integrar en Otras Páginas

#### 1. Usar el Hook `useAudioManager`
```tsx
import { useAudioManager } from '../lib/useAudioManager'

export function MyComponent() {
  const audio = useAudioManager({
    language: 'es-ES',
    rate: 0.9,
    onUtteranceComplete: () => console.log('Listo!'),
    onUtteranceStart: (id) => console.log('Iniciando:', id)
  })

  return (
    <button onClick={() => audio.speak('Hola mundo')}>
      {audio.isPlaying ? 'Pausar' : 'Reproducir'}
    </button>
  )
}
```

#### 2. Usar el Componente `AudioControls`
```tsx
import { AudioControls } from '../components/AudioControls'

export function MyComponent() {
  const audio = useAudioManager()

  return (
    <AudioControls
      isPlaying={audio.isPlaying}
      isPaused={audio.isPaused}
      onPlay={() => audio.speak('Tu texto aquí')}
      onPause={audio.pause}
      onResume={audio.resume}
      onStop={audio.stop}
      speed={0.9}
      onSpeedChange={(speed) => { /* actualizar velocidad */ }}
    />
  )
}
```

#### 3. Usar `AudioService` para Gestionar Cola de Preguntas
```tsx
import { AudioService } from '../lib/AudioService'

const questions = [
  { id: '1', topic: 'Tema 1', text: 'Pregunta 1?', options: [...], correctOption: 'a' },
  // ... más preguntas
]

const audioService = new AudioService(questions)

// Obtener pregunta actual
const current = audioService.getCurrentQuestion()

// Siguiente pregunta
audioService.nextQuestion()

// Configurar comportamiento
audioService.setAutoAdvance(true)
audioService.setLoop(true)
audioService.setSpeed(1.5)
```

## 🎯 API del Hook `useAudioManager`

### Métodos
- `speak(text, id?)` - Reproduce un texto
- `pause()` - Pausa la reproducción
- `resume()` - Reanuda desde la pausa
- `stop()` - Detiene y cancela
- `speakQueue(utterances)` - Reproduce una cola de textos secuencialmente
- `setSpeed(rate)` - Cambia velocidad (0.1 - 2)
- `getVoices()` - Obtiene voces disponibles en español

### Properties
- `isPlaying` - Boolean indicando si está reproduciéndose
- `isPaused` - Boolean indicando si está pausado
- `currentUtteranceId` - ID de la oración actual
- `currentText` - Texto siendo reproducido

## 🎯 API de `AudioService`

### Métodos Principales
- `getCurrentQuestion()` - Obtiene pregunta actual
- `nextQuestion()` - Avanza a siguiente
- `previousQuestion()` - Retrocede
- `goToQuestion(index)` - Va a pregunta específica
- `buildQuestionAudio(question)` - Construye array de textos para la pregunta
- `buildQuestionAudioWithAnswer(question)` - Incluye respuesta y explicación

### Configuración
- `setConfig(config)` - Establece configuración global
- `setAutoAdvance(bool)` - Auto avance
- `setAutoPlay(bool)` - Auto reproducción
- `setLoop(bool)` - Bucle continuo
- `setSpeed(number)` - Velocidad (0.5 - 2)

### Callbacks
- `onQuestionChange(callback)` - Cuando cambia de pregunta
- `onPlaylistEnd(callback)` - Cuando termina la lista
- `onConfigChange(callback)` - Cuando cambia la configuración

## 📱 Responsive Design

El sistema funciona perfectamente en:
- ✅ Dispositivos móviles (teléfono, tablet)
- ✅ Computadoras de escritorio
- ✅ Tablets en orientación horizontal y vertical
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)

### Optimizaciones para Móvil
- Botones grandes para fácil toque
- Diseño adaptable con Tailwind CSS
- Sin scroll horizontal innecesario
- Selector de velocidad compacto

## 🌙 Temas Soportados

- ✅ Tema claro (Light mode)
- ✅ Tema oscuro (Dark mode)
- ✅ Modo automático según preferencia del sistema

## 🔊 Requisitos del Navegador

- **Navegador moderno** con soporte para Web Speech API
- **Navegadores soportados**:
  - ✅ Chrome/Edge 25+
  - ✅ Firefox 49+
  - ✅ Safari 14.1+
  - ✅ Opera 27+

### Nota sobre Compatibilidad
Si el navegador no soporta Web Speech API:
- Los botones de audio estarán disponibles pero sin funcionalidad
- El texto seguirá siendo visible
- Se recomienda usar navegadores modernos

## 🎨 Personalización

### Cambiar Velocidad por Defecto
En `AudioPage.tsx`, línea ~45:
```tsx
const [currentSpeed, setCurrentSpeed] = useState(0.9) // Cambiar este valor
```

### Cambiar Idioma
En `useAudioManager()`, línea ~75:
```tsx
const audio = useAudioManager({
  language: 'es-ES' // Cambiar por otro idioma (ej: 'en-US')
})
```

### Añadir Más Preguntas
En `AudioPage.tsx`, en el array `audioQuestions`:
```tsx
const audioQuestions: AudioQuestion[] = [
  // ... preguntas existentes
  {
    id: 'audio-4',
    topic: 'Nuevo Tema',
    text: '¿Nueva pregunta?',
    options: [...],
    correctOption: 'a',
    explanation: 'Explicación...'
  }
]
```

## 🐛 Solución de Problemas

### El audio no funciona
1. Verifica que el volumen del dispositivo esté activado
2. Comprueba que usas un navegador moderno
3. En Chrome, verifica que no tengas silenciadas las notificaciones
4. Recarga la página (Ctrl+R o Cmd+R)

### El audio suena muy rápido/lento
1. Ve a la pestaña "Configuración"
2. Ajusta el selector de velocidad
3. Las opciones van de 0.5x (muy lento) a 2x (muy rápido)

### Las palabras no se pronuncian bien
1. Esto es una limitación del sintetizador de voz del navegador
2. Intenta con velocidad más lenta (0.5x - 0.75x)
3. En algunos navegadores la pronunciación varía

## 📊 Estadísticas de Características

- **Líneas de código**: ~500
- **Componentes**: 1 (AudioControls)
- **Hooks**: 1 (useAudioManager)
- **Servicios**: 1 (AudioService)
- **Dependencias externas**: 0 (usa Web Speech API nativa)
- **Compatibilidad**: 95%+ de navegadores modernos

## 🚀 Mejoras Futuras

Características que podrían agregarse:
- [ ] Grabación de respuestas de audio del usuario
- [ ] Calificación automática basada en análisis de audio
- [ ] Voces personalizables (Google Cloud TTS)
- [ ] Descarga de audio en MP3
- [ ] Historial de reproducción
- [ ] Sincronización con servidor

## 📝 Licencia

Parte del proyecto principal. Sin restricciones internas.
