'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  FileText, 
  Presentation, 
  FileSpreadsheet, 
  RefreshCw,
  CheckSquare,
  PenTool,
  Calculator,
  FileCheck,
  BookOpen,
  Video,
  Clock,
  Users,
  ArrowLeft,
  QrCode,
  Volume2
} from 'lucide-react'

export default function TeacherToolsPage() {
  const router = useRouter()

  const tools = [
    {
      id: 'pdf-to-pptx',
      title: 'PDF to PPTX',
      description: 'Convert PDF files to PowerPoint presentations',
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'hover:border-blue-500',
      href: '/teacher/tools/pdf-to-pptx'
    },
    {
      id: 'pptx-to-pdf',
      title: 'PPTX to PDF',
      description: 'Convert PowerPoint presentations to PDF',
      icon: Presentation,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'hover:border-purple-500',
      href: '/teacher/tools/pptx-to-pdf'
    },
    {
      id: 'word-to-pptx',
      title: 'Word to PPTX',
      description: 'Convert Word documents to PowerPoint',
      icon: FileSpreadsheet,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'hover:border-green-500',
      href: '/teacher/tools/word-to-pptx'
    },
    {
      id: 'omr-checker',
      title: 'OMR Answer Checker',
      description: 'Scan and grade OMR answer sheets automatically',
      icon: CheckSquare,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'hover:border-orange-500',
      href: '/teacher/tools/omr-checker'
    },
    {
      id: 'whiteboard',
      title: 'Online Whiteboard',
      description: 'Interactive whiteboard for teaching and collaboration',
      icon: PenTool,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      bgDark: 'bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'hover:border-indigo-500',
      href: '/teacher/tools/whiteboard'
    },
    {
      id: 'grade-calculator',
      title: 'Grade Calculator',
      description: 'Calculate grades, GPA, and weighted averages',
      icon: Calculator,
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      bgLight: 'bg-pink-50',
      bgDark: 'bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      borderColor: 'hover:border-pink-500',
      href: '/teacher/tools/grade-calculator'
    },
    {
      id: 'attendance-tracker',
      title: 'Attendance Tracker',
      description: 'Track and manage student attendance records',
      icon: Users,
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
      bgLight: 'bg-teal-50',
      bgDark: 'bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400',
      borderColor: 'hover:border-teal-500',
      href: '/teacher/tools/attendance-tracker'
    },
    {
      id: 'lesson-planner',
      title: 'Lesson Planner',
      description: 'Plan and organize your lessons efficiently',
      icon: BookOpen,
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600',
      bgLight: 'bg-cyan-50',
      bgDark: 'bg-cyan-900/20',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      borderColor: 'hover:border-cyan-500',
      href: '/teacher/tools/lesson-planner'
    },
    {
      id: 'assignment-checker',
      title: 'Assignment Checker',
      description: 'Check assignments for plagiarism and quality',
      icon: FileCheck,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      bgDark: 'bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'hover:border-red-500',
      href: '/teacher/tools/assignment-checker'
    },
    {
      id: 'timer',
      title: 'Class Timer',
      description: 'Countdown timer for activities and breaks',
      icon: Clock,
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      bgDark: 'bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'hover:border-amber-500',
      href: '/teacher/tools/timer'
    },
    {
      id: 'video-downloader',
      title: 'Video Downloader',
      description: 'Download educational videos for offline use',
      icon: Video,
      color: 'rose',
      gradient: 'from-rose-500 to-rose-600',
      bgLight: 'bg-rose-50',
      bgDark: 'bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      borderColor: 'hover:border-rose-500',
      href: '/teacher/tools/video-downloader'
    },
    {
      id: 'file-converter',
      title: 'Batch File Converter',
      description: 'Convert multiple files at once',
      icon: RefreshCw,
      color: 'violet',
      gradient: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      bgDark: 'bg-violet-900/20',
      textColor: 'text-violet-600 dark:text-violet-400',
      borderColor: 'hover:border-violet-500',
      href: '/teacher/tools/batch-converter'
    },
    {
      id: 'qr-generator',
      title: 'QR Code Generator',
      description: 'Generate QR codes for resources and links',
      icon: QrCode,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      bgDark: 'bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-emerald-500',
      href: '/teacher/tools/qr-generator'
    },
    {
      id: 'text-to-speech',
      title: 'Text to Speech',
      description: 'Convert text to natural speech audio',
      icon: Volume2,
      color: 'purple',
      gradient: 'from-purple-500 to-blue-600',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'hover:border-purple-500',
      href: '/teacher/tools/text-to-speech'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/teacher/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Teacher Tools
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Productivity tools to enhance your teaching experience
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.id} href={tool.href}>
                <Card className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent ${tool.borderColor} group`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className={`w-full ${tool.textColor} border-current hover:bg-current hover:text-white transition-colors`}
                    >
                      Open Tool
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">About Teacher Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">📁 File Conversion Tools</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Convert between PDF, PowerPoint, and Word formats. Batch convert multiple files to save time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">✅ OMR Answer Checker</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatically grade multiple-choice tests by scanning OMR answer sheets. Save hours of manual grading.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-indigo-600 dark:text-indigo-400">🎨 Online Whiteboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate in real-time with an interactive whiteboard. Perfect for remote teaching and brainstorming.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-pink-600 dark:text-pink-400">📊 Grade Calculator</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate final grades, GPA, and weighted averages quickly. Support for different grading scales.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-teal-600 dark:text-teal-400">👥 Attendance Tracker</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep accurate attendance records with easy-to-use tracking. Generate reports and analytics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-cyan-600 dark:text-cyan-400">📚 Lesson Planner</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize your curriculum and daily lessons. Set goals, track progress, and stay organized.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
