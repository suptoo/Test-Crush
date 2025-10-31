'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Sparkles,
  Upload,
  Mic,
  Video,
  FileText,
  Image as ImageIcon,
  Send,
  Loader2,
  Download,
  Volume2,
  X,
  Settings,
  Brain,
  Search,
  Zap,
  MessageSquare,
  Eye,
  PlayCircle,
  Headphones,
  FileImage,
  ChevronDown,
  Info,
  Check
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  inputType?: 'text' | 'pdf' | 'image' | 'video' | 'audio'
  aiModel?: string
  outputType?: 'text' | 'audio' | 'video' | 'image'
  timestamp: Date
  attachments?: {
    name: string
    type: string
    url?: string
  }[]
}

interface AIModel {
  id: string
  name: string
  icon: any
  color: string
  specialization: string
  bestFor: string[]
}

const AI_MODELS: AIModel[] = [
  {
    id: 'qwen',
    name: 'Qwen AI',
    icon: Video,
    color: 'purple',
    specialization: 'Video & Audio Processing',
    bestFor: ['video', 'audio', 'multimedia']
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: Search,
    color: 'blue',
    specialization: 'PDF Analysis & Deep Search',
    bestFor: ['pdf', 'research', 'deep-analysis']
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: Zap,
    color: 'orange',
    specialization: 'Text Processing',
    bestFor: ['text', 'writing', 'summarization']
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: Brain,
    color: 'green',
    specialization: 'Complex Reasoning',
    bestFor: ['reasoning', 'problem-solving', 'coding']
  }
]

export default function TestCrushAIPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('auto')
  const [outputFormat, setOutputFormat] = useState<'text' | 'audio' | 'video' | 'image'>('text')
  const [isRecording, setIsRecording] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const detectInputType = (file: File): 'pdf' | 'image' | 'video' | 'audio' => {
    const type = file.type
    if (type.includes('pdf')) return 'pdf'
    if (type.includes('image')) return 'image'
    if (type.includes('video')) return 'video'
    if (type.includes('audio')) return 'audio'
    return 'pdf'
  }

  const selectAIModel = (inputType: 'text' | 'pdf' | 'image' | 'video' | 'audio', taskType?: string): string => {
    if (selectedModel !== 'auto') return selectedModel

    // Intelligent routing based on input type and task
    switch (inputType) {
      case 'video':
        return 'qwen' // Qwen AI for video processing
      case 'audio':
        return 'qwen' // Qwen AI for audio processing
      case 'pdf':
        return 'gemini' // Gemini for PDF analysis
      case 'text':
        if (taskType === 'deep-search' || taskType === 'research') {
          return 'gemini' // Gemini for deep search
        } else if (taskType === 'complex' || taskType === 'reasoning') {
          return 'chatgpt' // ChatGPT for complex thinking
        }
        return 'mistral' // Mistral for general text
      case 'image':
        return 'gemini' // Gemini has vision capabilities
      default:
        return 'mistral'
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
        setSelectedFile(file)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const analyzeTask = (text: string): string => {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('search') || lowerText.includes('research') || lowerText.includes('find')) {
      return 'deep-search'
    }
    if (lowerText.includes('solve') || lowerText.includes('calculate') || lowerText.includes('complex') || lowerText.includes('analyze')) {
      return 'complex'
    }
    return 'general'
  }

  const processWithAI = async (
    inputType: 'text' | 'pdf' | 'image' | 'video' | 'audio',
    content: string,
    file?: File
  ): Promise<{ response: string; model: string }> => {
    // Determine task type for intelligent routing
    const taskType = analyzeTask(content)
    const model = selectAIModel(inputType, taskType)
    
    try {
      // Call the API route
      const response = await fetch('/api/ai-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          inputType,
          content,
          options: {
            outputFormat: outputFormat,
            temperature: 0.7,
            maxTokens: 2000
          }
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Processing failed')
      }

      return {
        response: data.content,
        model: data.model
      }
    } catch (error) {
      console.error('AI Processing error:', error)
      
      // Fallback to simulated response if API fails
      return {
        response: `⚠️ Error connecting to AI service. Please check your connection and try again.\n\nYour query: ${content}`,
        model
      }
    }
  }

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return

    const inputType = selectedFile 
      ? detectInputType(selectedFile) 
      : 'text'

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || `Uploaded ${selectedFile?.name}`,
      inputType,
      timestamp: new Date(),
      attachments: selectedFile ? [{
        name: selectedFile.name,
        type: selectedFile.type,
        url: filePreview || undefined
      }] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const { response, model } = await processWithAI(inputType, input, selectedFile || undefined)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        aiModel: model,
        outputType: outputFormat,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error processing:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setSelectedFile(null)
      setFilePreview(null)
    }
  }

  const getModelInfo = (modelId: string) => {
    return AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0]
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    const modelInfo = message.aiModel ? getModelInfo(message.aiModel) : null
    const ModelIcon = modelInfo?.icon || Sparkles

    return (
      <div
        key={message.id}
        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && modelInfo && (
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${modelInfo.color}-500 to-${modelInfo.color}-600 flex items-center justify-center flex-shrink-0`}>
            <ModelIcon className="w-5 h-5 text-white" />
          </div>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
          {!isUser && modelInfo && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <span className="font-semibold">{modelInfo.name}</span>
              <span>•</span>
              <span>{modelInfo.specialization}</span>
            </div>
          )}
          
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }`}
          >
            {message.attachments && (
              <div className="mb-2 space-y-2">
                {message.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm opacity-90">
                    <FileImage className="w-4 h-4" />
                    <span>{att.name}</span>
                  </div>
                ))}
                {message.attachments[0]?.url && (
                  <img 
                    src={message.attachments[0].url} 
                    alt="preview" 
                    className="max-w-full h-auto rounded-lg mt-2"
                  />
                )}
              </div>
            )}
            
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        {isUser && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">U</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TestCrush AI
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Multimodal AI Assistant
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/student/dashboard')}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">AI Model Selection</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="auto">Auto-Select (Intelligent Routing)</option>
                {AI_MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.specialization}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Output Format</label>
              <div className="flex gap-2">
                {(['text', 'audio', 'video', 'image'] as const).map(format => (
                  <Button
                    key={format}
                    variant={outputFormat === format ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOutputFormat(format)}
                  >
                    {format === 'text' && <MessageSquare className="w-4 h-4 mr-1" />}
                    {format === 'audio' && <Volume2 className="w-4 h-4 mr-1" />}
                    {format === 'video' && <Video className="w-4 h-4 mr-1" />}
                    {format === 'image' && <ImageIcon className="w-4 h-4 mr-1" />}
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Models Info */}
      <div className="container mx-auto px-4 py-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-2">Intelligent AI Routing</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {AI_MODELS.map(model => {
                    const Icon = model.icon
                    return (
                      <div key={model.id} className="flex items-start gap-2">
                        <div className={`w-6 h-6 rounded bg-${model.color}-100 dark:bg-${model.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-3 h-3 text-${model.color}-600`} />
                        </div>
                        <div>
                          <div className="font-semibold">{model.name}</div>
                          <div className="text-gray-600 dark:text-gray-400">{model.specialization}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Area */}
      <div className="container mx-auto px-4 pb-32">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to TestCrush AI</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Upload PDFs, images, videos, or audio. Ask questions. Get intelligent responses from specialized AI models.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardContent className="pt-6 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-semibold">PDF Analysis</div>
                  <div className="text-xs text-gray-500 mt-1">Gemini AI</div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardContent className="pt-6 text-center">
                  <Video className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-semibold">Video Process</div>
                  <div className="text-xs text-gray-500 mt-1">Qwen AI</div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardContent className="pt-6 text-center">
                  <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-semibold">Audio Analysis</div>
                  <div className="text-xs text-gray-500 mt-1">Qwen AI</div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardContent className="pt-6 text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-sm font-semibold">Complex Thinking</div>
                  <div className="text-xs text-gray-500 mt-1">ChatGPT</div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          {selectedFile && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FileImage className="w-4 h-4 text-blue-600" />
              <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  setFilePreview(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={isRecording ? 'bg-red-100 dark:bg-red-900/20' : ''}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-red-600' : ''}`} />
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything... (text, PDF, image, video, audio)"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isLoading}
            />
            
            <Button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedFile)}
              size="icon"
              className="bg-gradient-to-br from-blue-500 to-indigo-600"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-center text-gray-500">
            {selectedModel === 'auto' ? (
              <span>✨ Auto-routing to specialized AI models</span>
            ) : (
              <span>Using {getModelInfo(selectedModel).name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
