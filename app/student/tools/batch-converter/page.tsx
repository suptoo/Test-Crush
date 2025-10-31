'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw, Upload, Download, Trash2, FileImage, File } from 'lucide-react'

interface FileItem {
  id: string
  file: File
  name: string
  size: number
  status: 'pending' | 'converting' | 'done' | 'error'
  result?: Blob
}

export default function BatchConverterPage() {
  const router = useRouter()
  const [files, setFiles] = useState<FileItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [convertTo, setConvertTo] = useState<'jpeg' | 'png' | 'webp' | 'pdf'>('jpeg')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles: FileItem[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending'
    }))
    setFiles([...files, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const convertImage = async (fileItem: FileItem): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context error'))
            return
          }
          ctx.drawImage(img, 0, 0)
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Conversion failed'))
            },
            `image/${convertTo}`,
            0.9
          )
        }
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('File read failed'))
      reader.readAsDataURL(fileItem.file)
    })
  }

  const convertTextToPDF = async (fileItem: FileItem): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        // Simple PDF generation (basic text to PDF)
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length ${text.length + 100}
>>
stream
BT
/F1 12 Tf
50 700 Td
(${text.replace(/[()\\]/g, '\\$&').substring(0, 1000)}) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000260 00000 n
0000000${(400 + text.length).toString().padStart(3, '0')} 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${500 + text.length}
%%EOF`
        const blob = new Blob([pdfContent], { type: 'application/pdf' })
        resolve(blob)
      }
      reader.onerror = () => reject(new Error('File read failed'))
      reader.readAsText(fileItem.file)
    })
  }

  const convertAll = async () => {
    for (const fileItem of files) {
      if (fileItem.status !== 'pending') continue
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'converting' } : f
      ))

      try {
        let result: Blob
        
        if (fileItem.file.type.startsWith('image/')) {
          result = await convertImage(fileItem)
        } else if (fileItem.file.type.startsWith('text/')) {
          result = await convertTextToPDF(fileItem)
        } else {
          throw new Error('Unsupported file type')
        }

        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'done', result } : f
        ))
      } catch (error) {
        console.error('Conversion error:', error)
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error' } : f
        ))
      }

      // Small delay between conversions
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  const downloadFile = (fileItem: FileItem) => {
    if (!fileItem.result) return
    const url = URL.createObjectURL(fileItem.result)
    const a = document.createElement('a')
    a.href = url
    const ext = convertTo === 'pdf' ? 'pdf' : convertTo
    a.download = `${fileItem.name.split('.')[0]}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    files.forEach(fileItem => {
      if (fileItem.status === 'done' && fileItem.result) {
        setTimeout(() => downloadFile(fileItem), 100)
      }
    })
  }

  const clearAll = () => {
    setFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const doneCount = files.filter(f => f.status === 'done').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/tools')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-violet-600" />
                      Batch File Converter
                    </CardTitle>
                    <CardDescription>Convert multiple files at once</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {files.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAll}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                        {doneCount > 0 && (
                          <Button
                            size="sm"
                            onClick={downloadAll}
                            className="bg-violet-600 hover:bg-violet-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download All
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                {files.length === 0 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center hover:border-violet-400 dark:hover:border-violet-600 transition-colors cursor-pointer"
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold mb-2">Click to select files</p>
                    <p className="text-sm text-gray-500">
                      Supports images (JPG, PNG, WebP) and text files
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,text/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add More Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,text/*"
                      onChange={handleFileSelect}
                    />
                  </>
                )}

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map(fileItem => (
                      <div
                        key={fileItem.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {fileItem.file.type.startsWith('image/') ? (
                            <FileImage className="w-5 h-5 text-violet-600" />
                          ) : (
                            <File className="w-5 h-5 text-violet-600" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{fileItem.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(fileItem.size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {fileItem.status === 'pending' && (
                              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                Pending
                              </span>
                            )}
                            {fileItem.status === 'converting' && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded animate-pulse">
                                Converting...
                              </span>
                            )}
                            {fileItem.status === 'done' && (
                              <>
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                  Done
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => downloadFile(fileItem)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {fileItem.status === 'error' && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                Error
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(fileItem.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Convert Button */}
                {pendingCount > 0 && (
                  <Button
                    onClick={convertAll}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Convert {pendingCount} File{pendingCount > 1 ? 's' : ''}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Convert To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={convertTo === 'jpeg' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setConvertTo('jpeg')}
                  >
                    JPEG (.jpg)
                  </Button>
                  <Button
                    variant={convertTo === 'png' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setConvertTo('png')}
                  >
                    PNG (.png)
                  </Button>
                  <Button
                    variant={convertTo === 'webp' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setConvertTo('webp')}
                  >
                    WebP (.webp)
                  </Button>
                  <Button
                    variant={convertTo === 'pdf' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setConvertTo('pdf')}
                  >
                    PDF (.pdf)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Files</span>
                    <span className="font-semibold">{files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pending</span>
                    <span className="font-semibold text-gray-600">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="font-semibold text-green-600">{doneCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Files</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="font-semibold">Images:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  JPG, PNG, WebP, GIF, BMP
                </p>
                <p className="font-semibold mt-3">Text:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  TXT to PDF conversion
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
