'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileConverter } from '@/components/file-converter'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">PDF to PowerPoint Converter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Browser Limitation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Converting PDF to editable PowerPoint requires OCR and complex document parsing that cannot be done reliably in the browser alone.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm mb-2">✅ What You Can Do:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Use the <strong>Batch Converter</strong> to convert images from PDF pages to a format you can insert into PowerPoint</li>
                        <li>Extract text from PDF and paste into PowerPoint manually</li>
                        <li>Take screenshots of PDF pages and insert as images</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-sm mb-2">🔧 Recommended Tools:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li><strong>Adobe Acrobat</strong> - Export PDF to PPTX</li>
                        <li><strong>Microsoft PowerPoint</strong> - Insert → Object → Create from File</li>
                        <li><strong>Google Slides</strong> - Import PDF as slides</li>
                        <li><strong>Smallpdf.com</strong> - Online PDF to PPTX converter</li>
                      </ul>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={() => router.push('/teacher/tools/batch-converter')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Try Batch Converter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/teacher/tools')}
                      >
                        Browse Other Tools
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Alternative Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Step 1: Extract Images</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Use online tools to extract images from PDF
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Step 2: Create Presentation</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Import images into PowerPoint manually
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Step 3: Add Content</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Copy text and format in PowerPoint
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Google Slides Method</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Upload PDF to Google Slides for automatic conversion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
