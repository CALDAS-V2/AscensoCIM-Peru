import { useState } from 'react'
import { mockQuestions } from './data/questions'
import { BookOpen, Play, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'

export default function AppSimulador() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [isPracticing, setIsPracticing] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [score, setScore] = useState(0)

  const topics = Array.from(new Set(mockQuestions.map(q => q.topic))).sort()
  const topicQuestions = selectedTopic ? mockQuestions.filter(q => q.topic === selectedTopic) : []
  const currentQuestion = topicQuestions[currentQuestionIndex]

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic)
    setIsPracticing(true)
    setCurrentQuestionIndex(0)
    setSelectedOptions({})
    setIsFinished(false)
    setScore(0)
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

  const handleFinishPractice = () => {
    let correct = 0
    topicQuestions.forEach(q => {
      if (selectedOptions[q.id] === q.correctOption && q.correctOption) {
        correct++
      }
    })
    const percentage = topicQuestions.length > 0
      ? Math.round((correct / topicQuestions.length) * 100)
      : 0
    setScore(percentage)
    setIsFinished(true)
  }

  const handleBackToTopics = () => {
    setSelectedTopic(null)
    setIsPracticing(false)
    setCurrentQuestionIndex(0)
    setSelectedOptions({})
    setIsFinished(false)
  }

  // Resultados
  if (isPracticing && isFinished && selectedTopic) {
    const correct = Object.entries(selectedOptions).filter(
      ([qId, selected]) => {
        const question = topicQuestions.find(q => q.id === qId)
        return question && selected === question.correctOption
      }
    ).length

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Resultados de Práctica</h1>
          <p style={styles.subtitle}>Tema: {selectedTopic}</p>
        </div>
        <div style={styles.content}>
          <div style={styles.resultCard}>
            <div style={styles.scoreCircle}>
              <div style={styles.scoreText}>{score}%</div>
              <div style={styles.scoreSubtext}>
                <strong>{correct}</strong> de <strong>{topicQuestions.length}</strong> correctas
              </div>
            </div>
            {score >= 80 && <div style={{...styles.badge, backgroundColor: '#4ade80'}}>¡Excelente!</div>}
            {score >= 60 && score < 80 && <div style={{...styles.badge, backgroundColor: '#3b82f6'}}>¡Muy bien!</div>}
            {score >= 40 && score < 60 && <div style={{...styles.badge, backgroundColor: '#fbbf24'}}>Bien, sigue practicando</div>}
            {score < 40 && <div style={{...styles.badge, backgroundColor: '#ef4444'}}>Necesitas más práctica</div>}
          </div>

          <div style={styles.questionsGrid}>
            {topicQuestions.map((q, idx) => {
              const userAnswer = selectedOptions[q.id]
              const isCorrect = userAnswer === q.correctOption && q.correctOption
              return (
                <div key={q.id} style={{...styles.questionCard, borderColor: isCorrect ? '#bbf7d0' : '#fecaca', backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2'}}>
                  <div style={styles.questionContent}>
                    <div style={styles.questionHeader}>
                      <div>
                        <p style={styles.questionText}>Pregunta {idx + 1}: {q.text}</p>
                        <p style={styles.answerText}>
                          <span style={{fontWeight: 'bold'}}>Tu respuesta:</span> {userAnswer ? userAnswer.toUpperCase() : 'No respondida'}
                        </p>
                        {q.correctOption && (
                          <p style={styles.answerText}>
                            <span style={{fontWeight: 'bold'}}>Correcta:</span> {q.correctOption.toUpperCase()}
                          </p>
                        )}
                      </div>
                      {isCorrect ? (
                        <CheckCircle2 style={{width: 24, height: 24, color: '#16a34a', flexShrink: 0}} />
                      ) : (
                        <XCircle style={{width: 24, height: 24, color: '#dc2626', flexShrink: 0}} />
                      )}
                    </div>
                    {q.explanation && (
                      <p style={styles.explanation}>
                        <span style={{fontWeight: 'bold'}}>Explicación:</span> {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <button onClick={handleBackToTopics} style={styles.buttonFull}>
            Volver a Temas
          </button>
        </div>
      </div>
    )
  }

  // Práctica
  if (isPracticing && currentQuestion && selectedTopic) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>{selectedTopic}</h1>
          <p style={styles.subtitle}>Pregunta {currentQuestionIndex + 1} de {topicQuestions.length}</p>
        </div>
        <div style={styles.content}>
          <div style={styles.questionCardPractice}>
            <h2 style={styles.questionTitle}>{currentQuestion.text}</h2>
            <div style={styles.optionsGrid}>
              {currentQuestion.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  style={{
                    ...styles.option,
                    borderColor: selectedOptions[currentQuestion.id] === option.id ? '#4f46e5' : '#e5e7eb',
                    backgroundColor: selectedOptions[currentQuestion.id] === option.id ? '#e0e7ff' : '#ffffff'
                  }}
                >
                  <div style={styles.optionContent}>
                    <div style={{
                      ...styles.radioButton,
                      borderColor: selectedOptions[currentQuestion.id] === option.id ? '#4f46e5' : '#d1d5db',
                      backgroundColor: selectedOptions[currentQuestion.id] === option.id ? '#4f46e5' : '#ffffff'
                    }}>
                      {selectedOptions[currentQuestion.id] === option.id && (
                        <span style={styles.checkmark}>✓</span>
                      )}
                    </div>
                    <span>{option.id.toUpperCase()}. {option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{...styles.button, opacity: currentQuestionIndex === 0 ? 0.5 : 1}}
            >
              ← Anterior
            </button>
            <div style={{flex: 1}} />
            {currentQuestionIndex === topicQuestions.length - 1 ? (
              <button onClick={handleFinishPractice} style={{...styles.button, backgroundColor: '#22c55e'}}>
                Terminar Práctica
              </button>
            ) : (
              <button onClick={handleNext} style={styles.button}>
                Siguiente →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Temas
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Práctica por Temas</h1>
        <p style={styles.subtitle}>
          Selecciona un tema para practicar. Total: {mockQuestions.length} preguntas
        </p>
      </div>
      <div style={styles.content}>
        <div style={styles.topicsGrid}>
          {topics.map(topic => {
            const count = mockQuestions.filter(q => q.topic === topic).length
            return (
              <div
                key={topic}
                onClick={() => handleSelectTopic(topic)}
                style={styles.topicCard}
              >
                <div style={styles.topicContent}>
                  <div style={styles.topicHeader}>
                    <BookOpen style={{width: 32, height: 32, color: '#4f46e5'}} />
                    <div style={styles.badge}>{count} preguntas</div>
                  </div>
                  <h3 style={styles.topicName}>{topic}</h3>
                  <button onClick={() => handleSelectTopic(topic)} style={styles.practiceButton}>
                    <Play style={{width: 16, height: 16}} />
                    Practicar
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {topics.length === 0 && (
          <div style={styles.emptyState}>
            <BookOpen style={{width: 64, height: 64, color: '#d1d5db', marginBottom: 16}} />
            <p style={{color: '#6b7280', fontSize: 18}}>No hay temas disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '32px 24px',
    textAlign: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    margin: 0
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px'
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24
  },
  topicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    padding: 24,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  topicContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16
  },
  topicHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  topicName: {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    color: '#1f2937'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '6px 12px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500
  },
  practiceButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    padding: '12px 16px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background-color 0.2s ease'
  },
  questionCardPractice: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    padding: 24,
    marginBottom: 24
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 24,
    margin: '0 0 24px 0',
    color: '#1f2937'
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12
  },
  option: {
    width: '100%',
    padding: 16,
    textAlign: 'left' as const,
    borderRadius: 8,
    border: '2px solid',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    fontSize: 16
  },
  optionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonContainer: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  button: {
    padding: '12px 24px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    padding: 32,
    marginBottom: 24,
    textAlign: 'center'
  },
  scoreCircle: {
    marginBottom: 24
  },
  scoreText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4f46e5',
    margin: 0
  },
  scoreSubtext: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 8
  },
  questionsGrid: {
    display: 'grid',
    gap: 16,
    marginBottom: 24
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '1px solid',
    padding: 16
  },
  questionContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12
  },
  questionText: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 8,
    margin: '0 0 8px 0',
    color: '#1f2937'
  },
  answerText: {
    fontSize: 14,
    margin: '4px 0',
    color: '#374151'
  },
  explanation: {
    fontSize: 12,
    color: '#4b5563',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    margin: 0
  },
  buttonFull: {
    width: '100%',
    padding: '12px 24px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  emptyState: {
    textAlign: 'center',
    paddingTop: 48,
    paddingBottom: 48
  }
}
