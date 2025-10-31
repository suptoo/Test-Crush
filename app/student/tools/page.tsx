'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Palette, 
  Calculator, 
  Clock, 
  CheckSquare, 
  Users, 
  Calendar,
  FileText,
  Download,
  Image as ImageIcon,
  QrCode,
  Volume2,
  FileImage,
  Presentation,
  FileType,
  Brain,
  Wrench,
  Sparkles,
  GraduationCap
} from 'lucide-react'

interface Tool {
  id: string
  name: string
  description: string
  icon: any
  color: string
  path: string
  category: 'productivity' | 'converter' | 'creative' | 'focus'
}

export default function StudentToolsPage() {
  const router = useRouter()

  const tools: Tool[] = [
    // Focus Tools
    {
      id: 'focus-music',
      name: 'Focus Studio',
      description: 'Brain.fm-style concentration music with binaural beats',
      icon: Brain,
      color: 'indigo',
      path: '/student/focus',
      category: 'focus'
    },
    {
      id: 'ai-assistant',
      name: 'TestCrush AI',
      description: 'Multimodal AI assistant with intelligent model routing',
      icon: Sparkles,
      color: 'purple',
      path: '/student/ai-assistant',
      category: 'focus'
    },
    
    // Productivity Tools
    {
      id: 'whiteboard',
      name: 'Whiteboard',
      description: 'Digital canvas for drawing, diagrams, and brainstorming',
      icon: Palette,
      color: 'blue',
      path: '/student/tools/whiteboard',
      category: 'productivity'
    },
    {
      id: 'grade-calculator',
      name: 'Grade Calculator',
      description: 'Calculate your GPA and track academic performance',
      icon: Calculator,
      color: 'green',
      path: '/student/tools/grade-calculator',
      category: 'productivity'
    },
    {
      id: 'timer',
      name: 'Study Timer',
      description: 'Pomodoro timer with presets for focused study sessions',
      icon: Clock,
      color: 'orange',
      path: '/student/tools/timer',
      category: 'productivity'
    },
    {
      id: 'assignment-checker',
      name: 'Assignment Checker',
      description: 'Check readability, grammar, and quality of your work',
      icon: FileText,
      color: 'purple',
      path: '/student/tools/assignment-checker',
      category: 'productivity'
    },
    {
      id: 'lesson-planner',
      name: 'Study Planner',
      description: 'Plan your study schedule and track progress',
      icon: Calendar,
      color: 'pink',
      path: '/student/tools/lesson-planner',
      category: 'productivity'
    },
    
    // Converter Tools
    {
      id: 'batch-converter',
      name: 'Image Converter',
      description: 'Convert and compress images (PNG, JPG, WebP)',
      icon: ImageIcon,
      color: 'cyan',
      path: '/student/tools/batch-converter',
      category: 'converter'
    },
    {
      id: 'pdf-to-pptx',
      name: 'PDF to PPTX',
      description: 'Convert PDF documents to PowerPoint presentations',
      icon: Presentation,
      color: 'red',
      path: '/student/tools/pdf-to-pptx',
      category: 'converter'
    },
    {
      id: 'pptx-to-pdf',
      name: 'PPTX to PDF',
      description: 'Convert PowerPoint presentations to PDF',
      icon: FileImage,
      color: 'amber',
      path: '/student/tools/pptx-to-pdf',
      category: 'converter'
    },
    {
      id: 'word-to-pptx',
      name: 'Word to PPTX',
      description: 'Convert Word documents to presentations',
      icon: FileType,
      color: 'blue',
      path: '/student/tools/word-to-pptx',
      category: 'converter'
    },
    
    // Creative Tools
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Create QR codes for links, text, and more',
      icon: QrCode,
      color: 'gray',
      path: '/student/tools/qr-generator',
      category: 'creative'
    },
    {
      id: 'text-to-speech',
      name: 'Text to Speech',
      description: 'Convert text to natural-sounding speech',
      icon: Volume2,
      color: 'teal',
      path: '/student/tools/text-to-speech',
      category: 'creative'
    }
  ]

  const categories = [
    { id: 'focus', name: 'Focus & Concentration', icon: Brain, color: 'indigo' },
    { id: 'productivity', name: 'Productivity Tools', icon: Wrench, color: 'blue' },
    { id: 'converter', name: 'File Converters', icon: FileType, color: 'purple' },
    { id: 'creative', name: 'Creative Tools', icon: Sparkles, color: 'pink' }
  ]

  const getToolsByCategory = (category: string) => {
    return tools.filter(tool => tool.category === category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Student Toolkit
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All-in-one productivity suite for students
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.push('/student/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.id)
            if (categoryTools.length === 0) return null
            
            const CategoryIcon = category.icon
            
            return (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-lg`}>
                    <CategoryIcon className={`w-5 h-5 text-${category.color}-600`} />
                  </div>
                  <h2 className="text-xl font-bold">{category.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Card
                        key={tool.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => router.push(tool.path)}
                      >
                        <CardHeader>
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${tool.color}-500 to-${tool.color}-600 flex items-center justify-center mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">✨ All Tools Available</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  You have access to all productivity tools including Focus Studio with brain-enhancing music, 
                  study timers, grade calculators, file converters, and more. All tools are free and work 
                  directly in your browser!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div>✓ No sign-up required</div>
                  <div>✓ Privacy-focused</div>
                  <div>✓ Works offline</div>
                  <div>✓ Mobile-friendly</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
