'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react'

interface FileConverterProps {
  title: string
  description: string
  acceptedFormats: string
  conversionType: 'pdf-to-pptx' | 'pptx-to-pdf' | 'word-to-pptx'
  iconColor: string
}

export function FileConverter({
  title,
  description,
  acceptedFormats,
  conversionType,
  iconColor
}: FileConverterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setConverted(false)
      setDownloadUrl(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError(null)
      setConverted(false)
      setDownloadUrl(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
    setConverted(false)
    setDownloadUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const convertFile = async () => {
    if (!file) return

    setConverting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('conversionType', conversionType)

      const response = await fetch('/api/convert-file', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Conversion failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setConverted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion')
    } finally {
      setConverting(false)
    }
  }

  const getOutputFilename = () => {
    if (!file) return 'converted-file'
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'))
    
    switch (conversionType) {
      case 'pdf-to-pptx':
        return `${nameWithoutExt}.pptx`
      case 'pptx-to-pdf':
        return `${nameWithoutExt}.pdf`
      case 'word-to-pptx':
        return `${nameWithoutExt}.pptx`
      default:
        return 'converted-file'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Upload className="w-5 h-5" />
          </div>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2">Drop your file here or click to browse</p>
            <p className="text-sm text-gray-500">{acceptedFormats}</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedFormats}
              onChange={handleFileSelect}
            />
          </div>
        )}

        {/* File Preview */}
        {file && (
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${iconColor}`}>
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!converting && !converted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Convert Button */}
            {!converted && !converting && (
              <Button
                onClick={convertFile}
                className="w-full mt-4"
                disabled={converting}
              >
                Convert File
              </Button>
            )}

            {/* Converting State */}
            {converting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Converting your file...</span>
              </div>
            )}

            {/* Success State */}
            {converted && downloadUrl && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Conversion completed successfully!</span>
                </div>
                <div className="flex gap-2">
                  <a href={downloadUrl} download={getOutputFilename()} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download {getOutputFilename()}
                    </Button>
                  </a>
                  <Button variant="outline" onClick={removeFile}>
                    Convert Another
                  </Button>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Conversion Failed</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={removeFile} className="w-full mt-3">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>Select or drag & drop your file</li>
            <li>Maximum file size: 50MB</li>
            <li>Click &quot;Convert File&quot; to start the conversion</li>
            <li>Download your converted file when ready</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
