# ⚡ Guía Rápida de Prueba - Sistema de Audio

## 🎯 Para Probar en 5 Minutos

### Paso 1: Inicia la aplicación
```bash
npm run dev:all
```

### Paso 2: Navega a Audio
1. Abre http://localhost:5173 en tu navegador
2. Busca el menú lateral izquierdo
3. Haz clic en "Audio Preguntas" o navega a `/audio`

### Paso 3: Primera prueba (Modo Manual)
1. ✅ Verifica estar en pestaña "Manual"
2. ✅ Haz clic en botón Play (▶️) grande
3. ✅ Verifica que se pronuncie: "Pregunta 1 de 3. Ley 30714. ¿Cuál es el objeto..."
4. ✅ Espera a que termine de leer
5. ✅ Verifica que se lean todas las alternativas (A, B, C, D)
6. ✅ Al terminar, verifica que se lean: "La respuesta correcta es B" + explicación

### Paso 4: Controles básicos
1. ✅ Haz clic en Pause (⏸) → Se pausa el audio
2. ✅ Haz clic en Play otra vez → Continúa leyendo
3. ✅ Haz clic en Stop (⏹) → Se detiene completamente
4. ✅ Haz clic en Play → Comienza desde el principio

### Paso 5: Navegar preguntas
1. ✅ Haz clic en botón "Siguiente" 
2. ✅ Verifica que muestre "Pregunta 2 de 3"
3. ✅ Haz clic en "Anterior"
4. ✅ Verifica que vuelva a "Pregunta 1 de 3"

### Paso 6: Cambiar velocidad
1. ✅ Ir a pestaña "Configuración"
2. ✅ Encuentra selector "Velocidad de reproducción"
3. ✅ Cambia a "0.5x - Muy lento"
4. ✅ Ve a pestaña "Manual"
5. ✅ Haz Play → Verifica que sea muy lento
6. ✅ Regresa a "Configuración" y cambia a "2x - Máximo"
7. ✅ Haz Play → Verifica que sea muy rápido

### Paso 7: Modo Automático
1. ✅ Haz clic en pestaña "Automático"
2. ✅ Haz clic en Play (▶️)
3. ✅ Observa que:
   - Se lee pregunta 1 completa
   - Después de ~2 segundos, avanza a pregunta 2
   - Se lee pregunta 2 completa
   - Después de ~2 segundos, avanza a pregunta 3
   - Se lee pregunta 3 completa
   - Después de ~2 segundos, si Loop está ON, vuelve a pregunta 1
4. ✅ Puedes pausar/reanudar/detener en cualquier momento

### Paso 8: Configuración adicional
1. ✅ En pestaña "Configuración":
   - Desactiva "Leer respuesta correcta"
   - Ve a "Manual" y reproduces → NO se escucha respuesta
   - Regresa a "Configuración" y activa de nuevo
   - Ve a "Manual" y reproduces → SÍ se escucha respuesta

2. ✅ En pestaña "Configuración":
   - Desactiva "Reproducción en bucle"
   - Ir a "Automático"
   - Espera a que termine pregunta 3
   - Verifica que NO vuelva a pregunta 1 (se detiene)
   - Activa "Loop" de nuevo

---

## 🎧 Casos de Uso

### Uso 1: Estudiante en dispositivo móvil
1. Abre `/audio` en móvil
2. Usa auriculares o altavoz
3. Modo Automático: Solo observa mientras se leen las preguntas
4. Mejora comprensión al escuchar en vez de leer

### Uso 2: Estudiante con dificultad visual
1. Usa tamaño de velocidad 0.75x - 0.9x (más claro)
2. Pestaña Manual: Lee pregunta para revisar alternativas
3. Selecciona respuesta manualmente
4. Útil para personas con baja visión

### Uso 3: Estudiante acelerado
1. Velocidad 1.5x - 2x
2. Modo Automático continuo
3. Verifica respuestas correctas inmediatamente
4. Mayor cantidad de preguntas en menos tiempo

### Uso 4: Práctica de comprensión auditiva
1. Modo Automático a velocidad 1.25x
2. Loop continuo
3. Escucha sin ver el texto
4. Mejora comprensión oral

---

## ✅ Checklist Completo

### Reproducción
- [ ] ▶️ Play funciona
- [ ] ⏸ Pause detiene el audio
- [ ] ▶️ Resume continúa desde pausa
- [ ] ⏹ Stop cancela completamente

### Audio
- [ ] Se escucha la pregunta
- [ ] Se escuchan las alternativas (A, B, C, D)
- [ ] Se escucha la respuesta correcta (en Manual)
- [ ] Se escucha la explicación

### Navegación
- [ ] Botón "Siguiente" avanza
- [ ] Botón "Anterior" retrocede
- [ ] Botones indicadores (P1, P2, P3) funcionan
- [ ] No hay crash en cambios de pregunta

### Configuración
- [ ] Velocidad 0.5x es lenta
- [ ] Velocidad 2x es rápida
- [ ] Loop On/Off funciona
- [ ] Leer respuestas On/Off funciona

### Diseño
- [ ] Interfaz visible en PC (1920x1080)
- [ ] Interfaz visible en tablet (768x1024)
- [ ] Interfaz visible en móvil (375x667)
- [ ] Botones son clickeables en móvil
- [ ] Texto es legible en todos los tamaños

### Tema
- [ ] Funciona en tema claro
- [ ] Funciona en tema oscuro
- [ ] Colores son legibles
- [ ] Sin inconsistencias visuales

---

## 🐛 Si Algo No Funciona

### El audio no se escucha
1. ✅ Verifica volumen del dispositivo (ON)
2. ✅ Verifica que el navegador no esté silenciado
3. ✅ Recarga la página (Ctrl+R o Cmd+R)
4. ✅ Prueba en otro navegador (Chrome, Firefox, Safari)
5. ✅ Verifica que sea un navegador moderno

### El audio suena roto o pixelado
1. ✅ Cambia la velocidad a 0.9x (más estable)
2. ✅ Cambia a otro navegador
3. ✅ Cierra otras pestañas/apps que usen audio

### Los botones no responden
1. ✅ Recarga la página
2. ✅ Limpia caché: Ctrl+Shift+Del (Chrome)
3. ✅ Prueba en incógnito: Ctrl+Shift+N
4. ✅ Verifica consola (F12 → Console) por errores

### La página se ve rota
1. ✅ Verifica zoom (Ctrl+0 = 100%)
2. ✅ Cambia tamaño ventana
3. ✅ Recarga (F5 o Ctrl+R)
4. ✅ Prueba sin extensiones (desactívalas)

---

## 📊 Casos de Éxito Esperados

### ✅ Manual - Todo Funciona
```
Pregunta 1 de 3. Ley 30714. ¿Cuál es...?
A. Establecer las normas...
B. Normar el régimen disciplinario...  ← CORRECT
C. Regular el uso de la fuerza...
D. Establecer las pensiones...

[Audio pronuncia cada línea]
[Luego: "La respuesta correcta es B. Explicación..."]
```

### ✅ Automático - Todo Funciona
```
[Lee pregunta 1 completa]
[Espera 2 segundos]
↓
[Lee pregunta 2 completa]
[Espera 2 segundos]
↓
[Lee pregunta 3 completa]
[Si Loop=ON, vuelve a pregunta 1]
```

### ✅ Configuración - Todo Funciona
```
Velocidad: [0.5x] [0.75x] [0.9x] [1x] [1.25x] [1.5x] [2x]
☑️ Leer respuesta y explicación
☑️ Loop continuo
```

---

## 🚀 Para Ir Más Allá

### Agregar preguntas personalizadas
Abre `src/pages/AudioPage.tsx` y agrega en `audioQuestions`:

```tsx
{
  id: 'audio-4',
  topic: 'Mi Tema',
  text: '¿Mi pregunta?',
  options: [
    { id: 'a', text: 'Opción A' },
    { id: 'b', text: 'Opción B' },
    { id: 'c', text: 'Opción C' },
    { id: 'd', text: 'Opción D' }
  ],
  correctOption: 'c',
  explanation: 'Porque la respuesta C es correcta porque...'
}
```

### Integrar en otra página
Ejemplo en ExamPage:

```tsx
import { useAudioManager } from '../lib/useAudioManager'

export function ExamPage() {
  const audio = useAudioManager()
  
  return (
    <button onClick={() => audio.speak(`${question.text}`)}>
      🔊 Escuchar
    </button>
  )
}
```

---

## 📱 Prueba en Móvil Real

1. Asegúrate que el servidor esté corriendo: `npm run dev:all`
2. Abre DevTools (F12)
3. Abre Device Emulation (Ctrl+Shift+M)
4. Selecciona dispositivo:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Nexus 5X (412x732)
5. Prueba todos los controles con tu mouse/touchpad

---

## ✨ Métricas de Éxito

Cuando todo esté funcionando correctamente deberías ver:

- ✅ 3 preguntas cargadas
- ✅ 3 pestañas (Manual, Automático, Configuración)
- ✅ Audio pronunciado en español claro
- ✅ Botones respondiendo inmediatamente
- ✅ Transiciones suaves entre preguntas
- ✅ Sin errores en consola (F12)
- ✅ Sin lag o pausas innecesarias
- ✅ Interfaz responsive en todos los tamaños

---

## 🎉 ¿Éxito?

Si todo funciona como se describe, el **sistema de audio está 100% operativo** y listo para:

1. ✅ Producción
2. ✅ Pruebas adicionales
3. ✅ Integración en otros módulos
4. ✅ Compartir con usuarios

---

**Tiempo estimado de prueba**: 5-10 minutos  
**Dificultad**: Muy fácil - Solo hacer click  
**Requisitos**: Navegador moderno + Volumen activado  
**Soporte**: Ver AUDIO_SYSTEM.md para más detalles
