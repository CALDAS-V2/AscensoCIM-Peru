import { useState } from 'react'
import { mockQuestions } from './data/questions'

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [isFinished, setIsFinished] = useState(false)

  const topics = Array.from(new Set(mockQuestions.map(q => q.topic))).sort()
  const topicQuestions = selectedTopic 
    ? mockQuestions.filter(q => q.topic === selectedTopic)
    : []
  const currentQuestion = topicQuestions[currentQuestionIndex]

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic)
    setCurrentQuestionIndex(0)
    setSelectedOptions({})
    setIsFinished(false)
  }

  const handleSelectOption = (optionId: string) => {
    if (currentQuestion) {
      setSelectedOptions(prev => ({
        ...prev,
        [currentQuestion.id]: optionId
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleFinish = () => {
    setIsFinished(true)
  }

  const handleBackToTopics = () => {
    setSelectedTopic(null)
    setCurrentQuestionIndex(0)
    setSelectedOptions({})
    setIsFinished(false)
  }

  // Resultados
  if (isFinished && selectedTopic) {
    const correct = Object.entries(selectedOptions).filter(
      ([qId, selected]) => {
        const question = topicQuestions.find(q => q.id === qId)
        return question && selected === question.correctOption
      }
    ).length
    const percentage = topicQuestions.length > 0 
      ? Math.round((correct / topicQuestions.length) * 100) 
      : 0

    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ color: '#1f2937', marginTop: 0 }}>📊 Resultados</h1>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: percentage >= 60 ? '#16a34a' : '#dc2626',
              margin: '1rem 0'
            }}>
              {percentage}%
            </div>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>
              Respondiste correctamente <strong>{correct}</strong> de <strong>{topicQuestions.length}</strong> preguntas
            </p>
            <button
              onClick={handleBackToTopics}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '1.5rem'
              }}
            >
              Volver a Temas
            </button>
          </div>

          {topicQuestions.map((q, idx) => {
            const userAnswer = selectedOptions[q.id]
            const isCorrect = userAnswer === q.correctOption
            return (
              <div key={q.id} style={{
                backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                border: `2px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '6px'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1f2937' }}>
                  {idx + 1}. {q.text}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563' }}>
                  <strong>Tu respuesta:</strong> {userAnswer ? userAnswer.toUpperCase() : 'No respondida'}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563' }}>
                  <strong>Correcta:</strong> {q.correctOption?.toUpperCase()}
                </p>
                {q.explanation && (
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Pregunta
  if (selectedTopic && currentQuestion) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <h1 style={{ color: '#1f2937', margin: '0 0 1rem 0' }}>{selectedTopic}</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Pregunta {currentQuestionIndex + 1} de {topicQuestions.length}
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#1f2937', marginTop: 0 }}>{currentQuestion.text}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentQuestion.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  style={{
                    padding: '1rem',
                    border: selectedOptions[currentQuestion.id] === option.id 
                      ? '2px solid #3b82f6'
                      : '2px solid #e5e7eb',
                    backgroundColor: selectedOptions[currentQuestion.id] === option.id
                      ? '#dbeafe'
                      : '#f9fafb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
                    {option.id.toUpperCase()}.
                  </span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: currentQuestionIndex === 0 ? 0.5 : 1
              }}
            >
              ← Anterior
            </button>

            <button
              onClick={handleBackToTopics}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cambiar tema
            </button>

            {currentQuestionIndex === topicQuestions.length - 1 ? (
              <button
                onClick={handleFinish}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Terminar
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Siguiente →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Lista de temas
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#1f2937', marginTop: 0 }}>📚 Práctica por Temas</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Selecciona un tema para practicar. Total: {mockQuestions.length} preguntas
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {topics.map(topic => {
            const count = mockQuestions.filter(q => q.topic === topic).length
            return (
              <button
                key={topic}
                onClick={() => handleSelectTopic(topic)}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '24px' }}>📖</span>
                  <span style={{
                    backgroundColor: '#e0e7ff',
                    color: '#4f46e5',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {count}
                  </span>
                </div>
                <h3 style={{ color: '#1f2937', marginTop: 0, marginBottom: '1rem' }}>
                  {topic}
                </h3>
                <button
                  onClick={() => handleSelectTopic(topic)}
                  style={{
                    width: '100%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Practicar
                </button>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
