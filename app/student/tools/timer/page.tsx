'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Play, Pause, RotateCcw, Clock } from 'lucide-react'

export default function TimerPage() {
  const router = useRouter()
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(minutes * 60 + seconds)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            playSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const playSound = () => {
    // Play a beep sound when timer ends
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const startStop = () => {
    setIsRunning(!isRunning)
  }

  const reset = () => {
    setIsRunning(false)
    setTimeLeft(minutes * 60 + seconds)
  }

  const setPreset = (mins: number) => {
    setMinutes(mins)
    setSeconds(0)
    setTimeLeft(mins * 60)
    setIsRunning(false)
  }

  const displayMinutes = Math.floor(timeLeft / 60)
  const displaySeconds = timeLeft % 60
  const progress = ((minutes * 60 + seconds - timeLeft) / (minutes * 60 + seconds)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Clock className="w-6 h-6 text-amber-600" />
              Class Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-8xl sm:text-9xl font-bold text-amber-600 mb-4">
                {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
                <div
                  className="bg-amber-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={startStop}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={reset}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Time Input */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Minutes</label>
                <Input
                  type="number"
                  value={minutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    setMinutes(val)
                    if (!isRunning) setTimeLeft(val * 60 + seconds)
                  }}
                  min="0"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seconds</label>
                <Input
                  type="number"
                  value={seconds}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    setSeconds(val)
                    if (!isRunning) setTimeLeft(minutes * 60 + val)
                  }}
                  min="0"
                  max="59"
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-sm font-semibold mb-3 text-center">Quick Presets</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPreset(5)}
                  disabled={isRunning}
                >
                  5 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreset(10)}
                  disabled={isRunning}
                >
                  10 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreset(15)}
                  disabled={isRunning}
                >
                  15 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreset(25)}
                  disabled={isRunning}
                >
                  25 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreset(30)}
                  disabled={isRunning}
                >
                  30 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreset(45)}
                  disabled={isRunning}
                >
                  45 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreset(60)}
                  disabled={isRunning}
                >
                  1 hour
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreset(90)}
                  disabled={isRunning}
                >
                  1.5 hour
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 <strong>Tip:</strong> Use this timer for class activities, breaks, exam time limits, or Pomodoro technique sessions. 
                A sound will play when the timer reaches zero.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
