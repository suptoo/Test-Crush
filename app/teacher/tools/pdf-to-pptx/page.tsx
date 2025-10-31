'use client'

import { useRouter } from 'next/navigation'
import { FileConverter } from '@/components/file-converter'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PdfToPptxPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
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
          title="PDF to PowerPoint Converter"
          description="Convert your PDF files to editable PowerPoint presentations"
          acceptedFormats=".pdf,application/pdf"
          conversionType="pdf-to-pptx"
          iconColor="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        />

        {/* Features Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Preserve Formatting</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Maintains original layout and styling
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">High Quality</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Professional-grade conversion results
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Fast Processing</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Quick conversion for your documents
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Secure & Private</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your files are processed securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
