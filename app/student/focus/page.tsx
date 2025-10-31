'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  RefreshCw,
  Clock,
  Brain,
  Zap,
  Moon,
  Coffee,
  BookOpen,
  Music,
  Wind,
  Waves,
  Droplets,
  Flame,
  TreePine,
  CloudRain,
  Bird,
  Volume1
} from 'lucide-react'

interface FocusMode {
  id: string
  name: string
  description: string
  icon: any
  color: string
  frequency: string
  duration: number
  benefits: string[]
}

interface Sound {
  id: string
  name: string
  icon: any
  description: string
}

export default function FocusMusicPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedMode, setSelectedMode] = useState<string>('deep-focus')
  const [selectedSound, setSelectedSound] = useState<string>('none')
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [sessionTime, setSessionTime] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null)

  const focusModes: FocusMode[] = [
    {
      id: 'deep-focus',
      name: 'Deep Focus',
      description: 'Maximum concentration for complex tasks',
      icon: Brain,
      color: 'blue',
      frequency: '40 Hz',
      duration: 45,
      benefits: ['Enhanced concentration', 'Reduced distractions', 'Flow state']
    },
    {
      id: 'study',
      name: 'Study Session',
      description: 'Optimal for learning and memorization',
      icon: BookOpen,
      color: 'green',
      frequency: '12 Hz',
      duration: 50,
      benefits: ['Better retention', 'Active learning', 'Memory consolidation']
    },
    {
      id: 'creative',
      name: 'Creative Boost',
      description: 'Stimulate creativity and problem-solving',
      icon: Zap,
      color: 'purple',
      frequency: '8 Hz',
      duration: 30,
      benefits: ['Creative thinking', 'Idea generation', 'Innovation']
    },
    {
      id: 'relax',
      name: 'Relaxed Focus',
      description: 'Light concentration with stress relief',
      icon: Coffee,
      color: 'amber',
      frequency: '10 Hz',
      duration: 25,
      benefits: ['Stress reduction', 'Calm awareness', 'Sustained attention']
    },
    {
      id: 'power-nap',
      name: 'Power Nap',
      description: 'Quick rest for mental refresh',
      icon: Moon,
      color: 'indigo',
      frequency: '4 Hz',
      duration: 20,
      benefits: ['Mental refresh', 'Energy boost', 'Clarity']
    }
  ]

  const backgroundSounds: Sound[] = [
    { id: 'none', name: 'None', icon: VolumeX, description: 'Pure focus tones only' },
    { id: 'rain', name: 'Rain', icon: CloudRain, description: 'Gentle rainfall' },
    { id: 'ocean', name: 'Ocean Waves', icon: Waves, description: 'Calming ocean sounds' },
    { id: 'forest', name: 'Forest', icon: TreePine, description: 'Nature ambience' },
    { id: 'wind', name: 'Wind Chimes', icon: Wind, description: 'Peaceful chimes' },
    { id: 'fire', name: 'Fireplace', icon: Flame, description: 'Crackling fire' },
    { id: 'water', name: 'Stream', icon: Droplets, description: 'Flowing water' },
    { id: 'birds', name: 'Birds', icon: Bird, description: 'Bird songs' }
  ]

  useEffect(() => {
    return () => {
      stopAudio()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopSession()
            playCompletionSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, timeLeft])

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const generateBinauralBeat = (frequency: number) => {
    const ctx = initAudioContext()
    
    // Stop existing audio
    if (oscillatorRef.current) oscillatorRef.current.stop()
    if (noiseNodeRef.current) noiseNodeRef.current.stop()
    
    // Create gain node
    const gainNode = ctx.createGain()
    gainNode.gain.value = isMuted ? 0 : volume / 100
    gainNode.connect(ctx.destination)
    gainNodeRef.current = gainNode

    // Base frequency
    const baseFreq = 200
    
    // Left channel
    const leftOsc = ctx.createOscillator()
    leftOsc.frequency.value = baseFreq
    leftOsc.type = 'sine'
    
    // Right channel (with binaural difference)
    const rightOsc = ctx.createOscillator()
    rightOsc.frequency.value = baseFreq + frequency
    rightOsc.type = 'sine'
    
    // Create stereo panner for each channel
    const leftPanner = ctx.createStereoPanner()
    leftPanner.pan.value = -1
    const rightPanner = ctx.createStereoPanner()
    rightPanner.pan.value = 1
    
    leftOsc.connect(leftPanner)
    rightOsc.connect(rightPanner)
    leftPanner.connect(gainNode)
    rightPanner.connect(gainNode)
    
    leftOsc.start()
    rightOsc.start()
    
    oscillatorRef.current = leftOsc

    // Add background sound if selected
    if (selectedSound !== 'none') {
      addBackgroundSound(ctx, gainNode)
    }
  }

  const addBackgroundSound = (ctx: AudioContext, gainNode: GainNode) => {
    // Generate different types of noise based on selected sound
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      switch (selectedSound) {
        case 'rain':
        case 'ocean':
          data[i] = (Math.random() * 2 - 1) * 0.15 // White noise
          break
        case 'wind':
          data[i] = (Math.random() * 2 - 1) * 0.1 // Soft noise
          break
        case 'forest':
        case 'birds':
          data[i] = Math.random() < 0.01 ? (Math.random() * 2 - 1) * 0.2 : 0 // Sparse noise
          break
        case 'fire':
          data[i] = (Math.random() * 2 - 1) * 0.12 // Crackle noise
          break
        case 'water':
          data[i] = (Math.random() * 2 - 1) * 0.08 // Gentle noise
          break
        default:
          data[i] = 0
      }
    }

    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = buffer
    noiseSource.loop = true
    
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.3
    
    noiseSource.connect(noiseGain)
    noiseGain.connect(gainNode)
    noiseSource.start()
    
    noiseNodeRef.current = noiseSource
  }

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null
    }
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop()
      } catch (e) {
        // Already stopped
      }
      noiseNodeRef.current = null
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio()
      setIsTimerRunning(false)
    } else {
      const mode = focusModes.find(m => m.id === selectedMode)
      if (mode) {
        const freq = parseInt(mode.frequency)
        generateBinauralBeat(freq)
        setIsTimerRunning(true)
      }
    }
    setIsPlaying(!isPlaying)
  }

  const stopSession = () => {
    stopAudio()
    setIsPlaying(false)
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setTimeLeft(sessionTime * 60)
    setIsTimerRunning(false)
  }

  const playCompletionSound = () => {
    const ctx = initAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.value = 800
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  }

  const changeMode = (modeId: string) => {
    const wasPlaying = isPlaying
    if (wasPlaying) {
      stopAudio()
    }
    
    setSelectedMode(modeId)
    const mode = focusModes.find(m => m.id === modeId)
    if (mode) {
      setSessionTime(mode.duration)
      setTimeLeft(mode.duration * 60)
    }
    
    if (wasPlaying) {
      setTimeout(() => {
        const freq = parseInt(mode?.frequency || '40')
        generateBinauralBeat(freq)
        setIsPlaying(true)
      }, 100)
    }
  }

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume)
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = newVolume / 100
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newMuted ? 0 : volume / 100
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentMode = focusModes.find(m => m.id === selectedMode)
  const progress = ((sessionTime * 60 - timeLeft) / (sessionTime * 60)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Focus Studio
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Science-backed focus music for peak performance
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.push('/student/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player Card */}
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20">
              <CardContent className="pt-6">
                {/* Timer Display */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                        className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {currentMode?.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    size="lg"
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetTimer}
                    className="rounded-full"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-4 max-w-md mx-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : volume > 50 ? (
                      <Volume2 className="w-5 h-5" />
                    ) : (
                      <Volume1 className="w-5 h-5" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => changeVolume(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm w-12 text-right">{volume}%</span>
                </div>

                {/* Session Info */}
                {currentMode && (
                  <div className="mt-6 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <currentMode.icon className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold">{currentMode.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        • {currentMode.frequency} Frequency
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentMode.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Background Sounds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Background Sounds
                </CardTitle>
                <CardDescription>Add ambient sounds to enhance focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {backgroundSounds.map((sound) => {
                    const Icon = sound.icon
                    return (
                      <button
                        key={sound.id}
                        onClick={() => {
                          setSelectedSound(sound.id)
                          if (isPlaying) {
                            stopAudio()
                            setTimeout(() => {
                              const freq = parseInt(currentMode?.frequency || '40')
                              generateBinauralBeat(freq)
                            }, 100)
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedSound === sound.id
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">{sound.name}</div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Focus Modes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Focus Modes
                </CardTitle>
                <CardDescription>Choose your optimal brain state</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {focusModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <button
                      key={mode.id}
                      onClick={() => changeMode(mode.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedMode === mode.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-${mode.color}-100 dark:bg-${mode.color}-900/30`}>
                          <Icon className={`w-5 h-5 text-${mode.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{mode.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {mode.description}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{mode.duration} min</span>
                            <span className="text-gray-400">•</span>
                            <span>{mode.frequency}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Benefits */}
            {currentMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentMode.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardContent className="pt-6">
                <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    💡 Pro Tips:
                  </p>
                  <p>• Use headphones for best binaural beat effect</p>
                  <p>• Start with 25-minute sessions</p>
                  <p>• Keep volume at comfortable level</p>
                  <p>• Take breaks between sessions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
