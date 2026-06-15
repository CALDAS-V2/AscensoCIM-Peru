/**
 * AudioService - Gestiona la reproducción de audio de preguntas
 * Controla la cola de preguntas, transiciones automáticas y configuración de audio
 */

export interface AudioQuestion {
  id: string
  topic: string
  text: string
  options: {
    id: string
    text: string
  }[]
  correctOption: string
  explanation?: string
}

export interface AudioConfig {
  autoAdvance: boolean
  autoPlay: boolean
  loop: boolean
  repeatQuestion: boolean
  speed: number
  language: string
}

export class AudioService {
  private questions: AudioQuestion[] = []
  private currentQuestionIndex: number = 0
  private config: AudioConfig
  private callbacks: {
    onQuestionChange?: (question: AudioQuestion, index: number) => void
    onPlaylistEnd?: () => void
    onConfigChange?: (config: AudioConfig) => void
  } = {}

  constructor(
    questions: AudioQuestion[] = [],
    config: Partial<AudioConfig> = {}
  ) {
    this.questions = questions
    this.config = {
      autoAdvance: true,
      autoPlay: false,
      loop: true,
      repeatQuestion: false,
      speed: 0.9,
      language: 'es-ES',
      ...config
    }
  }

  setQuestions(questions: AudioQuestion[]): void {
    this.questions = questions
    this.currentQuestionIndex = 0
  }

  addQuestions(questions: AudioQuestion[]): void {
    this.questions = [...this.questions, ...questions]
  }

  getCurrentQuestion(): AudioQuestion | null {
    return this.questions[this.currentQuestionIndex] || null
  }

  getCurrentIndex(): number {
    return this.currentQuestionIndex
  }

  getProgress(): { current: number; total: number } {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questions.length
    }
  }

  nextQuestion(): AudioQuestion | null {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++
      this.callbacks.onQuestionChange?.(this.getCurrentQuestion()!, this.currentQuestionIndex)
      return this.getCurrentQuestion()
    } else if (this.config.loop) {
      this.currentQuestionIndex = 0
      this.callbacks.onQuestionChange?.(this.getCurrentQuestion()!, this.currentQuestionIndex)
      return this.getCurrentQuestion()
    } else {
      this.callbacks.onPlaylistEnd?.()
      return null
    }
  }

  previousQuestion(): AudioQuestion | null {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--
      this.callbacks.onQuestionChange?.(this.getCurrentQuestion()!, this.currentQuestionIndex)
      return this.getCurrentQuestion()
    }
    return null
  }

  goToQuestion(index: number): AudioQuestion | null {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index
      this.callbacks.onQuestionChange?.(this.getCurrentQuestion()!, this.currentQuestionIndex)
      return this.getCurrentQuestion()
    }
    return null
  }

  buildQuestionAudio(question: AudioQuestion): string[] {
    const parts: string[] = []
    
    // Add question number and topic
    const progress = this.getProgress()
    parts.push(`Pregunta ${progress.current} de ${progress.total}. ${question.topic}.`)
    
    // Add question text
    parts.push(question.text)
    
    // Add options
    parts.push('Las alternativas son:')
    question.options.forEach((option) => {
      parts.push(`${option.id.toUpperCase()}. ${option.text}`)
    })
    
    return parts
  }

  buildQuestionAudioWithAnswer(question: AudioQuestion): string[] {
    const parts = this.buildQuestionAudio(question)
    
    // Add correct answer
    const correctOption = question.options.find((opt) => opt.id === question.correctOption)
    if (correctOption) {
      parts.push(`La respuesta correcta es ${question.correctOption.toUpperCase()}. ${correctOption.text}`)
    }
    
    // Add explanation if available
    if (question.explanation) {
      parts.push(`Explicación: ${question.explanation}`)
    }
    
    return parts
  }

  setConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.callbacks.onConfigChange?.(this.config)
  }

  getConfig(): AudioConfig {
    return { ...this.config }
  }

  setAutoAdvance(value: boolean): void {
    this.setConfig({ autoAdvance: value })
  }

  setAutoPlay(value: boolean): void {
    this.setConfig({ autoPlay: value })
  }

  setLoop(value: boolean): void {
    this.setConfig({ loop: value })
  }

  setRepeatQuestion(value: boolean): void {
    this.setConfig({ repeatQuestion: value })
  }

  setSpeed(speed: number): void {
    const clampedSpeed = Math.max(0.5, Math.min(2, speed))
    this.setConfig({ speed: clampedSpeed })
  }

  setLanguage(language: string): void {
    this.setConfig({ language })
  }

  onQuestionChange(callback: (question: AudioQuestion, index: number) => void): void {
    this.callbacks.onQuestionChange = callback
  }

  onPlaylistEnd(callback: () => void): void {
    this.callbacks.onPlaylistEnd = callback
  }

  onConfigChange(callback: (config: AudioConfig) => void): void {
    this.callbacks.onConfigChange = callback
  }

  reset(): void {
    this.currentQuestionIndex = 0
  }

  getTotalQuestions(): number {
    return this.questions.length
  }
}
