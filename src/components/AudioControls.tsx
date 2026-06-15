import React from 'react'
import { Button } from '@blinkdotnew/ui'
import { Play, Pause, RotateCcw, Volume2, Zap } from 'lucide-react'

interface AudioControlsProps {
  isPlaying: boolean
  isPaused: boolean
  onPlay: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  currentText?: string
  showText?: boolean
  speed?: number
  onSpeedChange?: (speed: number) => void
  compact?: boolean
}

export function AudioControls({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  currentText,
  showText = true,
  speed = 0.9,
  onSpeedChange,
  compact = false
}: AudioControlsProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
          onClick={isPlaying && !isPaused ? onPause : onPlay}
          title={isPlaying && !isPaused ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying && !isPaused ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
          onClick={onStop}
          disabled={!isPlaying}
          title="Detener"
        >
          <RotateCcw size={16} />
        </Button>

        {onSpeedChange && (
          <select
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="text-xs px-2 py-1 rounded border border-input bg-background"
            title="Velocidad"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Display current audio text */}
      {showText && currentText && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {currentText}
          </p>
        </div>
      )}

      {/* Main controls */}
      <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-xl border border-primary/20">
        {/* Play/Pause button */}
        <Button
          size="lg"
          className="rounded-full h-14 w-14 flex-shrink-0 flex items-center justify-center"
          onClick={isPlaying && !isPaused ? onPause : isPaused ? onResume : onPlay}
          title={
            isPlaying && !isPaused ? 'Pausar' : isPaused ? 'Reanudar' : 'Reproducir'
          }
        >
          {isPlaying && !isPaused ? (
            <Pause size={24} />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </Button>

        {/* Status text */}
        <div className="flex-1">
          <p className="font-semibold text-primary">
            {isPlaying && !isPaused
              ? '🔊 Reproduciendo...'
              : isPaused
              ? '⏸ Pausado'
              : '🎧 Haz clic para escuchar'}
          </p>
          <p className="text-sm text-muted-foreground">
            Sintetización de audio en español
          </p>
        </div>

        {/* Stop button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onStop}
          disabled={!isPlaying && !isPaused}
          title="Detener"
          className="flex-shrink-0"
        >
          <RotateCcw size={18} />
        </Button>
      </div>

      {/* Speed control */}
      {onSpeedChange && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-input">
          <Zap size={18} className="text-amber-500 flex-shrink-0" />
          <span className="text-sm font-medium flex-shrink-0">Velocidad:</span>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="flex-1 px-3 py-2 rounded border border-input bg-background text-sm"
          >
            <option value={0.5}>0.5x - Muy lento</option>
            <option value={0.75}>0.75x - Lento</option>
            <option value={1}>1x - Normal</option>
            <option value={1.25}>1.25x - Rápido</option>
            <option value={1.5}>1.5x - Muy rápido</option>
            <option value={2}>2x - Máximo</option>
          </select>
        </div>
      )}
    </div>
  )
}
