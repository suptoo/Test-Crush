'use client'

import { useRouter } from 'next/navigation'
import { FileConverter } from '@/components/file-converter'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PptxToPdfPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
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
          title="PowerPoint to PDF Converter"
          description="Convert your PowerPoint presentations to PDF format"
          acceptedFormats=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
          conversionType="pptx-to-pdf"
          iconColor="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
        />

        {/* Features Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Universal Format</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  PDF works on all devices and platforms
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Easy Sharing</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Share presentations without compatibility issues
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Print Ready</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Perfect for printing handouts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Preserve Quality</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Maintains high-quality graphics and text
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
