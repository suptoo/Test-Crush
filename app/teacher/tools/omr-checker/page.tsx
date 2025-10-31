'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload, CheckSquare, Download, Loader2, Camera, AlertCircle } from 'lucide-react'

interface OMRResult {
  studentId: string
  answers: string[]
  score: number
  totalQuestions: number
  percentage: number
}

export default function OMRCheckerPage() {
  const router = useRouter()
  const [answerKey, setAnswerKey] = useState<string>('')
  const [omrImage, setOmrImage] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<OMRResult[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAnswerKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerKey(e.target.value.toUpperCase())
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setOmrImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResults([])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setOmrImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResults([])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const processOMR = async () => {
    if (!omrImage || !answerKey) return

    setProcessing(true)

    try {
      const formData = new FormData()
      formData.append('image', omrImage)
      formData.append('answerKey', answerKey)

      const response = await fetch('/api/process-omr', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process OMR sheet')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Error processing OMR:', error)
      alert('Error processing OMR sheet. This is a demo - OMR processing requires computer vision libraries.')
    } finally {
      setProcessing(false)
    }
  }

  const downloadResults = () => {
    const csv = [
      ['Student ID', 'Score', 'Total', 'Percentage', 'Answers'].join(','),
      ...results.map(r => [
        r.studentId,
        r.score,
        r.totalQuestions,
        `${r.percentage}%`,
        r.answers.join('')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `omr-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Answer Key Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-orange-600" />
                  OMR Answer Sheet Checker
                </CardTitle>
                <CardDescription>
                  Upload OMR answer sheets and automatically grade them
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Answer Key (e.g., ABCDABCD...)
                  </label>
                  <Input
                    value={answerKey}
                    onChange={handleAnswerKeyChange}
                    placeholder="Enter correct answers: ABCDABCD..."
                    className="uppercase font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {answerKey.length > 0 ? `${answerKey.length} questions` : 'Enter the correct answer key'}
                  </p>
                </div>

                {/* OMR Upload Area */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload OMR Answer Sheet
                  </label>
                  {!omrImage ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-orange-400 dark:hover:border-orange-600 transition-colors cursor-pointer"
                    >
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm font-semibold mb-2">
                        Drop OMR sheet image here or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports JPG, PNG (Max 10MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{omrImage.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setOmrImage(null)
                              setPreviewUrl(null)
                              setResults([])
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                        {previewUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewUrl}
                            alt="OMR Preview"
                            className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 rounded"
                          />
                        )}
                      </div>

                      <Button
                        onClick={processOMR}
                        disabled={!answerKey || processing}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing OMR Sheet...
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-4 h-4 mr-2" />
                            Check Answers
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Enter the correct answer key (e.g., ABCDABCD)</li>
                  <li>Upload a clear photo of the filled OMR sheet</li>
                  <li>Click &quot;Check Answers&quot; to process</li>
                  <li>View results and download as CSV</li>
                </ol>
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-orange-800 dark:text-orange-400">Demo Mode</p>
                      <p className="text-orange-700 dark:text-orange-300 mt-1">
                        Production OMR checking requires computer vision libraries like OpenCV. 
                        This feature needs integration with OMR processing services or custom ML models.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Results</CardTitle>
                  {results.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResults}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No results yet</p>
                    <p className="text-sm mt-2">Process an OMR sheet to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <Card key={index} className="border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Student ID</p>
                              <p className="text-lg font-bold">{result.studentId}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Score</p>
                              <p className="text-2xl font-bold text-orange-600">
                                {result.score}/{result.totalQuestions}
                              </p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Percentage</span>
                              <span className="font-semibold">{result.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full transition-all"
                                style={{ width: `${result.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Marked Answers</p>
                            <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                              {result.answers.join('')}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Automatic Grading</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Instantly grade multiple choice answers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Batch Processing</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Process multiple sheets at once
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Export Results</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Download results as CSV files
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
