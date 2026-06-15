# 🔍 DIAGNÓSTICO - Problema de Calificación del Examen

## Problema Reportado

1. ❌ Examen solo avanza 2-3 preguntas (se detiene/congela)
2. ❌ No muestra resultados (correctas/incorrectas/porcentaje)
3. ✅ Se subieron 550 preguntas correctamente

## Investigación Realizada

He encontrado en `ExamPage.tsx`:

- ✅ Estado `isFinished` para tracking de finalización
- ✅ Función `handleFinish()` que debería calcular resultados
- ✅ Estados: `selectedOptions`, `currentQuestionIndex`, `timeLeft`
- ❌ No encontré función de cálculo de score
- ❌ No encontré componente de resultados

## Causas Probables

### Causa 1: Límite de Preguntas
El código original probablemente tenía un array de preguntas hardcoded con solo 2-3 preguntas. Cuando subes 550, el sistema no sabe cómo cargarlas.

**Solución**: Necesita cargar preguntas de:
- [ ] Base de datos
- [ ] API
- [ ] Archivo JSON
- [ ] Estado global

### Causa 2: Sin Función de Cálculo
No hay lógica que calcule:
- Número de respuestas correctas
- Número de respuestas incorrectas
- Porcentaje de puntuación

**Solución**: Necesita agregar función como:
```tsx
const calculateScore = () => {
  let correct = 0;
  let incorrect = 0;
  
  questions.forEach((q) => {
    const userAnswer = selectedOptions[q.id];
    if (userAnswer === q.correctOption) {
      correct++;
    } else {
      incorrect++;
    }
  });
  
  return {
    correct,
    incorrect,
    percentage: (correct / questions.length) * 100
  };
};
```

### Causa 3: Sin Componente de Resultados
El examen finaliza pero no muestra:
- Cantidad de correctas
- Cantidad de incorrectas
- Porcentaje

**Solución**: Necesita UI para mostrar resultados:
```tsx
if (isFinished) {
  const { correct, incorrect, percentage } = calculateScore();
  return (
    <Card>
      <CardContent>
        <h2>Resultados del Examen</h2>
        <p>Correctas: {correct}/{questions.length}</p>
        <p>Incorrectas: {incorrect}/{questions.length}</p>
        <p>Porcentaje: {percentage.toFixed(2)}%</p>
      </CardContent>
    </Card>
  );
}
```

## Pasos para Solucionar

1. **Verificar carga de preguntas**: 
   - ¿Cómo carga las 550 preguntas?
   - ¿De dónde trae los datos?
   - ¿Hay error en consola (F12)?

2. **Verificar que llegue a pregunta 550**:
   - Agrega log: `console.log('Pregunta:', currentQuestionIndex, 'Total:', questions.length)`
   - Intenta ir a pregunta 50, 100, 500

3. **Verificar cálculo de score**:
   - Agrega función de cálculo (ver arriba)
   - Prueba con preguntas pequeño set primero

4. **Verificar UI de resultados**:
   - Agrega pantalla de resultados cuando `isFinished === true`
   - Muestra correctas/incorrectas/porcentaje

## Siguiente

**Necesito ver**:
1. ¿Cómo subes las 550 preguntas? (¿por UI, CSV, API?)
2. ¿Qué dice la consola (F12)? ¿Hay errores?
3. ¿En qué pregunta se detiene exactamente?

Con esa información puedo arreglar el problema específicamente.
