import { useState, useRef, useCallback } from 'react'

export interface AudioUtterance {
  text: string
  id?: string
}

export interface UseAudioManagerOptions {
  language?: string
  rate?: number
  pitch?: number
  volume?: number
  onUtteranceComplete?: (id?: string) => void
  onUtteranceStart?: (id?: string) => void
  onError?: (error: SpeechSynthesisErrorEvent) => void
}

export function useAudioManager(options: UseAudioManagerOptions = {}) {
  const {
    language = 'es-ES',
    rate = 0.9,
    pitch = 1,
    volume = 1,
    onUtteranceComplete,
    onUtteranceStart,
    onError
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentUtteranceId, setCurrentUtteranceId] = useState<string | undefined>()
  const [currentText, setCurrentText] = useState('')

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

  const speak = useCallback((text: string, id?: string) => {
    if (!synth) return

    try {
      synth.cancel()
      setIsPlaying(false)
      setIsPaused(false)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      utterance.rate = Math.max(0.1, Math.min(2, rate))
      utterance.pitch = pitch
      utterance.volume = volume

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsPaused(false)
        setCurrentUtteranceId(id)
        setCurrentText(text)
        onUtteranceStart?.(id)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentUtteranceId(undefined)
        onUtteranceComplete?.(id)
      }

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        setIsPlaying(false)
        setIsPaused(false)
        onError?.(event)
      }

      synth.speak(utterance)
    } catch (e) {
      console.error('Error al reproducir audio:', e)
    }
  }, [language, rate, pitch, volume, synth, onUtteranceComplete, onUtteranceStart, onError])

  const pause = useCallback(() => {
    if (!synth) return
    try {
      synth.pause()
      setIsPlaying(false)
      setIsPaused(true)
    } catch (e) {
      console.error('Error al pausar:', e)
    }
  }, [synth])

  const resume = useCallback(() => {
    if (!synth) return
    try {
      synth.resume()
      setIsPlaying(true)
      setIsPaused(false)
    } catch (e) {
      console.error('Error al reanudar:', e)
    }
  }, [synth])

  const stop = useCallback(() => {
    if (!synth) return
    try {
      synth.cancel()
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentUtteranceId(undefined)
      setCurrentText('')
    } catch (e) {
      console.error('Error al detener:', e)
    }
  }, [synth])

  const speakQueue = useCallback(
    (texts: AudioUtterance[]): Promise<void> => {
      if (!synth || texts.length === 0) return Promise.resolve()

      return new Promise<void>((resolve) => {
        let index = 0

        const speakNext = () => {
          if (index >= texts.length) {
            resolve()
            return
          }

          try {
            const item = texts[index]
            const utterance = new SpeechSynthesisUtterance(item.text)
            utterance.lang = language
            utterance.rate = Math.max(0.1, Math.min(2, rate))
            utterance.pitch = pitch
            utterance.volume = volume

            utterance.onstart = () => {
              setIsPlaying(true)
              setCurrentUtteranceId(item.id)
              setCurrentText(item.text)
              onUtteranceStart?.(item.id)
            }

            utterance.onend = () => {
              index++
              if (index < texts.length) {
                setTimeout(speakNext, 500)
              } else {
                setIsPlaying(false)
                resolve()
                onUtteranceComplete?.(item.id)
              }
            }

            utterance.onerror = () => {
              index++
              speakNext()
            }

            synth.speak(utterance)
          } catch (e) {
            console.error('Error en speakQueue:', e)
            index++
            speakNext()
          }
        }

        speakNext()
      })
    },
    [language, rate, pitch, volume, synth, onUtteranceComplete, onUtteranceStart]
  )

  const setSpeed = (newRate: number) => {
    // Nota: La velocidad se aplica en la siguiente reproducción
  }

  const getVoices = useCallback(() => {
    if (!synth) return []
    return synth.getVoices().filter((voice) => voice.lang.startsWith('es'))
  }, [synth])

  return {
    isPlaying,
    isPaused,
    currentUtteranceId,
    currentText,
    speak,
    pause,
    resume,
    stop,
    speakQueue,
    setSpeed,
    getVoices,
    cancel: stop
  }
}
