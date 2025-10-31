'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Volume2, Play, Pause, Download, Upload } from 'lucide-react'

export default function TextToSpeechPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<number>(0)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      speechSynthesis.cancel()
    }
  }, [])

  const speak = () => {
    if (!text.trim()) return

    if (speaking) {
      speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    if (voices[selectedVoice]) {
      utterance.voice = voices[selectedVoice]
    }
    utterance.rate = rate
    utterance.pitch = pitch

    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  const exportAudio = async () => {
    // Note: Direct audio export requires Web Audio API or external services
    alert('Audio export requires external service. For now, you can use system audio recording while playing the speech.')
  }

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('text/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setText(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const presets = [
    {
      name: 'Classroom Instructions',
      text: 'Good morning, class. Please take out your notebooks and turn to page 42. We will be reviewing today\'s lesson.'
    },
    {
      name: 'Homework Reminder',
      text: 'Don\'t forget to complete your homework assignment by Friday. Remember to show your work and check your answers.'
    },
    {
      name: 'Encouragement',
      text: 'You are all doing a great job! Keep up the excellent work. Remember, practice makes progress.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/tools')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  Text to Speech
                </CardTitle>
                <CardDescription>
                  Convert text to natural speech for lessons and announcements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      Text to Speak
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Load File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="text/*"
                      onChange={loadFile}
                    />
                  </div>
                  <textarea
                    className="w-full min-h-[200px] p-3 border rounded-md"
                    placeholder="Enter text to convert to speech..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {text.length} characters, ~{Math.ceil(text.split(/\s+/).length / 150)} minutes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {presets.map(preset => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setText(preset.text)}
                        className="justify-start"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={speak}
                    disabled={!text.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {speaking ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Speak
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setText('')}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voice Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Voice
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(parseInt(e.target.value))}
                  >
                    {voices.map((voice, idx) => (
                      <option key={idx} value={idx}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speed: {rate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pitch: {pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setRate(1)
                    setPitch(1)
                  }}
                >
                  Reset to Default
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <p className="font-semibold">📢 Announcements</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Create audio announcements for online classes
                  </p>
                </div>
                <div>
                  <p className="font-semibold">📖 Reading Support</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Help students with reading difficulties
                  </p>
                </div>
                <div>
                  <p className="font-semibold">🌍 Language Learning</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Practice pronunciation in different languages
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">📝 Punctuation</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Use proper punctuation for natural pauses and intonation
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">⏱️ Speed Control</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Adjust speed for different age groups and comprehension levels
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">🗣️ Voice Selection</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Try different voices to find the most suitable for your content
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
