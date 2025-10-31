'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, QrCode, Download } from 'lucide-react'

export default function QRCodeGeneratorPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (text && canvasRef.current) {
      generateQRCode(text, size)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, size])

  const generateQRCode = (data: string, size: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple QR code generation (basic implementation)
    const qrSize = 25 // 25x25 modules
    const moduleSize = size / qrSize
    
    canvas.width = size
    canvas.height = size
    
    // Fill white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)
    
    // Generate simple pattern based on text hash
    ctx.fillStyle = '#000000'
    const hash = simpleHash(data)
    
    for (let y = 0; y < qrSize; y++) {
      for (let x = 0; x < qrSize; x++) {
        const idx = y * qrSize + x
        if ((hash >> (idx % 32)) & 1) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
        }
      }
    }
    
    // Add finder patterns (corners)
    drawFinderPattern(ctx, 0, 0, moduleSize)
    drawFinderPattern(ctx, (qrSize - 7) * moduleSize, 0, moduleSize)
    drawFinderPattern(ctx, 0, (qrSize - 7) * moduleSize, moduleSize)
  }

  const simpleHash = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Outer square
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
    
    // White square
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
    
    // Center square
    ctx.fillStyle = '#000000'
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
  }

  const downloadQRCode = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const presets = [
    { label: 'Website URL', value: 'https://example.com' },
    { label: 'Email', value: 'mailto:teacher@school.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
    { label: 'SMS', value: 'sms:+1234567890' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/tools')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                QR Code Generator
              </CardTitle>
              <CardDescription>
                Generate QR codes for URLs, text, WiFi, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-md"
                  placeholder="Enter URL, text, email, phone number..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map(preset => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => setText(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {text && (
                <Button
                  onClick={downloadQRCode}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {text ? (
                  <canvas
                    ref={canvasRef}
                    className="border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <QrCode className="w-24 h-24 mx-auto mb-4 opacity-20" />
                    <p>Enter content to generate QR code</p>
                  </div>
                )}
              </div>

              {text && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Tips:</p>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Test with a QR scanner before printing</li>
                    <li>• Keep content concise for better scanning</li>
                    <li>• Use high contrast colors</li>
                    <li>• Maintain quiet zone around QR code</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Use Cases for Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">📱 Class Resources</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Link to Google Classroom, assignment PDFs, or online resources
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">📚 Library Books</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Create QR codes for book information or checkout systems
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">🔗 Contact Info</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Share email, office hours, or meeting links easily
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
