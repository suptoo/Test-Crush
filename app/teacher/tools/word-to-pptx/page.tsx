'use client'

import { useRouter } from 'next/navigation'
import { FileConverter } from '@/components/file-converter'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function WordToPptxPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <FileConverter
          title="Word to PowerPoint Converter"
          description="Convert your Word documents to PowerPoint presentations"
          acceptedFormats=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          conversionType="word-to-pptx"
          iconColor="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        />

        {/* Features Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Smart Conversion</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Automatically creates slides from content
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Preserve Structure</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Maintains headings and formatting
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Time Saver</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Quick way to create presentations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Editable Output</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Fully editable PowerPoint files
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
