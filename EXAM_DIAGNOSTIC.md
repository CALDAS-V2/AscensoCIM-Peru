# 🔍 Diagnóstico: Calificación de Examen No Funciona

## PROBLEMA IDENTIFICADO ✅

**Las 550 preguntas que subiste NO tienen las respuestas correctas configuradas.**

Todas las preguntas tienen:
```typescript
correctOption: '',  // ← VACÍO
explanation: ''      // ← VACÍO
```

Ejemplo:
```typescript
{
  id: '4',
  topic: 'Pruebas de Control y Confianza',
  text: '¿Es aquella prueba mediante...',
  options: [
    { id: 'a', text: 'Evaluación de confiabilidad.' },
    { id: 'b', text: 'Prueba de entorno social...' },
    // ...
  ],
  correctOption: '',  // ❌ PROBLEMA: Debería ser 'a', 'b', 'c', 'd' o 'e'
  explanation: ''     // ❌ PROBLEMA: Vacío
}
```

## ¿Por Qué No Funciona la Calificación?

El código en `ExamPage.tsx` tiene esta lógica de calificación:

```typescript
const calculateScore = () => {
  let correct = 0
  mockQuestions.forEach(q => {
    if (selectedOptions[q.id] === q.correctOption) {  // ← Compara con ''
      correct++
    }
  })
  // ...calcula porcentaje
}
```

**Problema**: Como TODAS las `correctOption` son `''` (vacío), la comparación `selectedOptions[q.id] === ''` casi nunca es verdadera, así que:

- ✗ Ninguna respuesta se cuenta como correcta
- ✗ El porcentaje es 0%
- ✗ Solo 2-3 preguntas "avanzan" porque probablemente el usuario no seleccionó respuesta (undefined === '')

## ✅ SOLUCIÓN

Necesitas **llenar el campo `correctOption`** en las 550 preguntas. Hay dos opciones:

### Opción 1: Editar Manualmente (NO recomendado - demasiado trabajo)
```typescript
{
  id: '4',
  correctOption: 'd',  // ← Agregar la respuesta correcta
  explanation: 'Prueba de entorno sicosocial y situación patrimonial.'
}
```

### Opción 2: Crear un Script para Generar (RECOMENDADO)

Crea un archivo `fix-questions.js` en la raíz del proyecto:

```javascript
// fix-questions.js - Genera correctOption automáticamente
const questions = require('./src/pages/ExamPage.tsx');

// Mapeo manual de respuestas correctas
const answerMap = {
  '1': 'c',   // Pregunta 1 → Respuesta C
  '2': 'a',   // Pregunta 2 → Respuesta A
  '3': 'b',   // Pregunta 3 → Respuesta B
  '4': 'd',   // Pregunta 4 → Respuesta D
  '5': 'e',   // Pregunta 5 → Respuesta E
  // ... etc
};

// Ejecutar para llenar los datos
questions.forEach(q => {
  if (answerMap[q.id]) {
    q.correctOption = answerMap[q.id];
    q.explanation = `Ver artículo correspondiente.`;
  }
});

console.log('Preguntas actualizadas:', questions.length);
```

### Opción 3: Usar la API del Banco de Preguntas (SI existe)

Si tu sistema tiene un banco de preguntas en base de datos:
1. Accede a la administración del banco
2. Completa el campo "Respuesta Correcta" para cada pregunta
3. Exporta/Importa de nuevo

### Opción 4: Cargar desde CSV

Si tienes un archivo CSV con las preguntas y respuestas:

```csv
id,topic,text,optionA,optionB,optionC,optionD,optionE,correctOption,explanation
1,Tema1,¿Pregunta?,Opción A,Opción B,Opción C,Opción D,Opción E,b,Explicación
2,Tema2,¿Pregunta?,Opción A,Opción B,Opción C,Opción D,Opción E,d,Explicación
...
```

## 🔧 CAMBIOS NECESARIOS EN `ExamPage.tsx`

1. **Llenar correctOption** para cada pregunta
2. **Llenar explanation** para cada pregunta
3. Listo - la calificación funcionará automáticamente

## 📊 Ejemplo de Cómo Debe Verse

**ANTES (No funciona):**
```typescript
{
  id: '4',
  topic: 'Pruebas de Control y Confianza',
  text: 'Es aquella prueba mediante...',
  options: [
    { id: 'a', text: 'Evaluación de confiabilidad.' },
    { id: 'b', text: 'Prueba de entorno social...' },
    { id: 'c', text: 'Evaluación mediante el uso de polígrafo.' },
    { id: 'd', text: 'Prueba de entorno sicosocial...' },  // ← CORRECTA
    { id: 'e', text: 'Prueba de entorno social...' }
  ],
  correctOption: '',  // ❌ VACÍO
  explanation: ''      // ❌ VACÍO
}
```

**DESPUÉS (Funciona):**
```typescript
{
  id: '4',
  topic: 'Pruebas de Control y Confianza',
  text: 'Es aquella prueba mediante...',
  options: [
    { id: 'a', text: 'Evaluación de confiabilidad.' },
    { id: 'b', text: 'Prueba de entorno social...' },
    { id: 'c', text: 'Evaluación mediante el uso de polígrafo.' },
    { id: 'd', text: 'Prueba de entorno sicosocial...' },
    { id: 'e', text: 'Prueba de entorno social...' }
  ],
  correctOption: 'd',  // ✅ CORRECTO
  explanation: 'La prueba de entorno sicosocial es la que verifica congruencia patrimonial.'
}
```

## 🎯 Próximos Pasos

1. **Opción A**: Edita manualmente las 550 preguntas (tedioso pero viable)
2. **Opción B**: Crea un script para automatizar
3. **Opción C**: Si tienen un banco de datos, actualiza desde allí
4. **Opción D**: Importa desde CSV

Una vez que TODAS las preguntas tengan `correctOption` rellenado, la calificación funcionará perfectamente:
- ✅ Se mostrarán correctas/incorrectas
- ✅ Se calculará el porcentaje
- ✅ Se mostrará el puntaje

## ⚠️ Problema Secundario: "Solo avanza 2-3 preguntas"

Esto ocurre porque:
- El usuario marca respuesta en pregunta 1
- Sistema intenta calificar
- No sabe si es correcta (correctOption=''), continúa
- Marca en pregunta 2-3
- Se queda atascado

**Se resuelve automáticamente al llenar correctOption.**

---

**Siguiente paso**: ¿Tienes la información de qué respuesta es correcta para cada pregunta? Entonces podemos automatizar el proceso.
