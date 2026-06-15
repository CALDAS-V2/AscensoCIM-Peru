# 🎨 Preview Visual del Sistema de Audio

## Interfaz Principal - Audio Page

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🎧 Audio Preguntas Inteligente                          ║
║  Escucha las preguntas con reproducción automática       ║
║                                                            ║
║  [Manual]  |  [Automático]  |  [Configuración]          ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  PESTAÑA: MANUAL                                         ║
║  ─────────────────────────────────────────────────────── ║
║                                                            ║
║  [Ley 30714]                          [1/3]              ║
║                                                            ║
║  ¿Cuál es el objeto de la Ley 30714, que regula el      ║
║  Régimen Disciplinario de la PNP?                       ║
║                                                            ║
║  ┌───────────────────────────────────────────────────┐  ║
║  │ [▶️]  🔊 Reproduciendo pregunta...  [⏹] [🔄 Loop] │  ║
║  └───────────────────────────────────────────────────┘  ║
║                                                            ║
║  Selecciona la respuesta correcta:                       ║
║                                                            ║
║  [ A ] Establecer las normas y procedimientos...        ║
║  [✓B] Normar el régimen disciplinario de la PNP.        ║
║  [ C ] Regular el uso de la fuerza...                   ║
║  [ D ] Establecer las pensiones...                       ║
║                                                            ║
║  [◀ Anterior] [Siguiente ▶]  [🔄 Loop]                  ║
║                                                            ║
║  ✓ ¡Correcto!                                            ║
║  Explicación: El Artículo 1 de la Ley 30714...          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Interfaz - Modo Automático

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  [Manual]  |  [🤖 AUTOMÁTICO]  |  [Configuración]      ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  [🤖] MODO AUTOMÁTICO                    [2/3]           ║
║                                                            ║
║  ¿Quién es responsable de garantizar que el personal     ║
║  policial realice el registro de sus declaraciones?      ║
║                                                            ║
║  ┌───────────────────────────────────────────────────┐  ║
║  │ [▶️]  🔊 Leyendo alternativa D...    [⏹]          │  ║
║  │       Sintetización de audio en español           │  ║
║  └───────────────────────────────────────────────────┘  ║
║                                                            ║
║  Preguntas del simulador:                               ║
║  ┌─────┬─────┬─────┐                                    ║
║  │ [P1]│[P2] │ P3  │  ← P2 está en reproducción        ║
║  └─────┴─────┴─────┘                                    ║
║                                                            ║
║  💡 Las preguntas se reproducirán automáticamente...   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Interfaz - Configuración

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  [Manual]  |  [Automático]  |  [⚙️ CONFIGURACIÓN]      ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ⚙️ Configuración de Audio                              ║
║                                                            ║
║  ┌─────────────────────────────────────────────────┐    ║
║  │ ☑ Leer respuesta correcta y explicación         │    ║
║  │ Si está activado, el audio incluirá la respuesta│    ║
║  │ correcta y su explicación.                      │    ║
║  └─────────────────────────────────────────────────┘    ║
║                                                            ║
║  ┌─────────────────────────────────────────────────┐    ║
║  │ ☑ Reproducción en bucle continuo               │    ║
║  │ Si está activado, después de la última pregunta│    ║
║  │ volverá a la primera automáticamente.           │    ║
║  └─────────────────────────────────────────────────┘    ║
║                                                            ║
║  ┌─────────────────────────────────────────────────┐    ║
║  │ ⚡ Velocidad de reproducción                    │    ║
║  │                                                  │    ║
║  │ [0.5x - Muy lento        ▼]                    │    ║
║  │  0.5x | 0.75x | 0.9x | 1x | 1.25x | 1.5x | 2x │    ║
║  └─────────────────────────────────────────────────┘    ║
║                                                            ║
║  ┌─────────────────────────────────────────────────┐    ║
║  │ 💡 Consejo: Para mejor comprensión, usa        │    ║
║  │ velocidad 0.9x.                                │    ║
║  └─────────────────────────────────────────────────┘    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Componentes Individuales

### AudioControls - Modo Completo

```
┌───────────────────────────────────────┐
│ Texto actual: "Pregunta 1. Ley 30714" │
└───────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [▶️]  🔊 Reproduciendo...  [⏹]      │
│       Sintetización de audio        │
└─────────────────────────────────────┘

┌──────────────────────────────────┐
│ ⚡ Velocidad:                     │
│ [0.9x - Normal (Recomendado) ▼]  │
└──────────────────────────────────┘
```

### AudioControls - Modo Compacto

```
[▶️] [⏹] [0.9x ▼]
```

---

## Estado de Reproducción

### Estado 1: Detenido (Inicio)
```
[▶️] 🔊 Haz clic para escuchar
      Sintetización de audio en español
```

### Estado 2: Reproduciendo
```
[⏸] 🔊 Reproduciendo pregunta...
      Sintetización de audio en español
```

### Estado 3: Pausado
```
[▶️] ⏸ Pausado
      Reanuda cuando estés listo
```

---

## Responsive - Tamaños de Pantalla

### Desktop (1920x1080)
```
┌─────────────────────────────────────────┐
│ [Modal Completo - 3 Columnas]          │
│ ┌──────────┬──────────┬──────────────┐ │
│ │ Manual   │ Automático│ Configuración│ │
│ └──────────┴──────────┴──────────────┘ │
│ [Contenido amplio - Lectura fácil]     │
│ [Botones grandes - Fácil click]        │
└─────────────────────────────────────────┘
```

### Tablet (768x1024)
```
┌─────────────────────┐
│ [Responsive - 2Col] │
│ ┌─────────┬────────┐│
│ │ Manual  │ Automático
│ └─────────┴────────┘│
│ [Config debajo]    │
│ [Layout adaptado]  │
└─────────────────────┘
```

### Móvil (375x667)
```
┌──────────────┐
│ [Stack Full] │
│ ┌──────────┐ │
│ │ Manual   │ │
│ ├──────────┤ │
│ │Automático│ │
│ ├──────────┤ │
│ │Config    │ │
│ └──────────┘ │
│ [Botones grandes
│  para tocar] │
└──────────────┘
```

---

## Secuencia de Interacción - Modo Automático

```
Usuario hace click en Play
         ↓
Se inicia reproducción
         ↓
[Lee Pregunta 1 completa]
"Pregunta 1 de 3. Ley 30714. ¿Cuál es el objeto...?
 Las alternativas son:
 A. Establecer las normas...
 B. Normar el régimen disciplinario...
 C. Regular el uso de la fuerza...
 D. Establecer las pensiones...
 La respuesta correcta es B."
         ↓
Espera 2 segundos (transición)
         ↓
Avanza automáticamente
         ↓
[Lee Pregunta 2 completa]
"Pregunta 2 de 3. Declaraciones Juradas...
 ..."
         ↓
Espera 2 segundos
         ↓
Avanza automáticamente
         ↓
[Lee Pregunta 3 completa]
"Pregunta 3 de 3..."
         ↓
Espera 2 segundos
         ↓
Si Loop = ON → Vuelve a Pregunta 1
Si Loop = OFF → Se detiene
```

---

## Tema Oscuro vs Claro

### TEMA CLARO
```
┌─────────────────────────────────────┐
│                                     │
│ 🎧 Audio Preguntas Inteligente      │ (Fondo blanco)
│                                     │
│ Pregunta clara en texto negro       │ (Texto legible)
│                                     │
│ [Botones azules y grises]           │ (Botones visibles)
│ [Bordes grises claros]              │ (Bordes suaves)
│                                     │
└─────────────────────────────────────┘
```

### TEMA OSCURO
```
┌─────────────────────────────────────┐
│                                     │
│ 🎧 Audio Preguntas Inteligente      │ (Fondo gris oscuro)
│                                     │
│ Pregunta clara en texto blanco      │ (Texto legible)
│                                     │
│ [Botones azules y grises claros]    │ (Botones visibles)
│ [Bordes grises oscuros]             │ (Bordes suaves)
│                                     │
└─────────────────────────────────────┘
```

---

## Flujo de Interacción Completo

```
┌─────────────────────────────────────────┐
│   INICIO - Usuario navega a /audio      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Se carga AudioPage                    │
│   - 3 preguntas cargadas                │
│   - Modo Manual por defecto             │
│   - Botones visibles y funcionales      │
└─────────────────────────────────────────┘
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
[Manual]           [Automático]
  ↓                     ↓
Usuario         Usuario
hace click      hace click
en Play         en Play
  ↓                     ↓
Lee pregunta     Lee pregunta
actual           actual
  ↓                     ↓
Usuario selecciona    Espera 2s
respuesta             ↓
  ↓                Avanza pregunta
Retroalimentación siguiente
(Correcto/                ↓
Incorrecto)          Si Loop ON:
  ↓                  Vuelve a P1
Usuario hace         Si Loop OFF:
clic en              Detiene
"Siguiente"
  ↓
Pregunta 2
  ↓
Repite...
```

---

## Indicadores Visuales

### Estado de Reproducción
- 🔊 Reproduciendo
- ⏸ Pausado
- ⏹ Detenido
- 🎧 Listo

### Información
- ✓ Respuesta correcta
- ✗ Respuesta incorrecta
- ℹ️ Información
- 💡 Consejo

### Controles
- ▶️ Play/Reproducir
- ⏸ Pause/Pausar
- ⏹ Stop/Detener
- ◀ Anterior
- ▶ Siguiente
- 🔄 Loop

### Configuración
- ☑️ Habilitado
- ☐ Deshabilitado
- ⚡ Velocidad
- 🎚️ Selector

---

## Tabla de Transiciones

| De | Hacia | Trigger | Acción |
|---|---|---|---|
| Inicio | Manual | Carga | Mostrar pregunta 1 |
| Manual | Automático | Click tab | Cambiar vista |
| Manual | Configuración | Click tab | Mostrar settings |
| Pregunta 1 | Pregunta 2 | Click Siguiente | Actualizar contenido |
| Pregunta 2 | Pregunta 1 | Click Anterior | Actualizar contenido |
| Reproduciendo | Pausado | Click Pause | Pausar síntesis |
| Pausado | Reproduciendo | Click Resume | Reanudar síntesis |
| Reproduciendo | Detenido | Click Stop | Cancelar síntesis |
| P3 + Loop ON | P1 | Fin audio | Auto-avance |
| P3 + Loop OFF | Detenido | Fin audio | Detiene |

---

**Visualización completa del sistema de audio inteligente**
