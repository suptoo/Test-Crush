'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  PenTool, 
  Eraser, 
  Download, 
  Trash2, 
  Undo, 
  Redo,
  Circle,
  Square,
  Type,
  Minus,
  MousePointer
} from 'lucide-react'

type Tool = 'pen' | 'eraser' | 'line' | 'circle' | 'rectangle' | 'text' | 'select'
type DrawAction = {
  tool: Tool
  color: string
  lineWidth: number
  points?: { x: number; y: number }[]
  startPoint?: { x: number; y: number }
  endPoint?: { x: number; y: number }
  text?: string
}

export default function WhiteboardPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<Tool>('pen')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(3)
  const [history, setHistory] = useState<DrawAction[]>([])
  const [historyStep, setHistoryStep] = useState(0)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setStartPoint({ x, y })

    if (currentTool === 'pen' || currentTool === 'eraser') {
      const newAction: DrawAction = {
        tool: currentTool,
        color: currentTool === 'eraser' ? '#ffffff' : currentColor,
        lineWidth,
        points: [{ x, y }]
      }
      setHistory([...history.slice(0, historyStep), newAction])
      setHistoryStep(historyStep + 1)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentTool === 'pen' || currentTool === 'eraser') {
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const lastAction = history[historyStep - 1]
      if (lastAction && lastAction.points) {
        const lastPoint = lastAction.points[lastAction.points.length - 1]
        ctx.beginPath()
        ctx.moveTo(lastPoint.x, lastPoint.y)
        ctx.lineTo(x, y)
        ctx.stroke()

        lastAction.points.push({ x, y })
      }
    } else {
      // Preview for shapes
      redrawCanvas()
      
      ctx.strokeStyle = currentColor
      ctx.lineWidth = lineWidth
      ctx.beginPath()

      if (startPoint) {
        if (currentTool === 'line') {
          ctx.moveTo(startPoint.x, startPoint.y)
          ctx.lineTo(x, y)
        } else if (currentTool === 'circle') {
          const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
          ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
        } else if (currentTool === 'rectangle') {
          ctx.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y)
        }
        ctx.stroke()
      }
    }
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentTool === 'line' || currentTool === 'circle' || currentTool === 'rectangle') {
      const newAction: DrawAction = {
        tool: currentTool,
        color: currentColor,
        lineWidth,
        startPoint,
        endPoint: { x, y }
      }
      setHistory([...history.slice(0, historyStep), newAction])
      setHistoryStep(historyStep + 1)
      redrawCanvas()
    }

    setIsDrawing(false)
    setStartPoint(null)
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and fill with white
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Redraw all actions up to current step
    history.slice(0, historyStep).forEach(action => {
      ctx.strokeStyle = action.color
      ctx.lineWidth = action.lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (action.tool === 'pen' || action.tool === 'eraser') {
        if (action.points && action.points.length > 1) {
          ctx.beginPath()
          ctx.moveTo(action.points[0].x, action.points[0].y)
          action.points.forEach(point => {
            ctx.lineTo(point.x, point.y)
          })
          ctx.stroke()
        }
      } else if (action.startPoint && action.endPoint) {
        ctx.beginPath()
        if (action.tool === 'line') {
          ctx.moveTo(action.startPoint.x, action.startPoint.y)
          ctx.lineTo(action.endPoint.x, action.endPoint.y)
        } else if (action.tool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(action.endPoint.x - action.startPoint.x, 2) + 
            Math.pow(action.endPoint.y - action.startPoint.y, 2)
          )
          ctx.arc(action.startPoint.x, action.startPoint.y, radius, 0, 2 * Math.PI)
        } else if (action.tool === 'rectangle') {
          ctx.rect(
            action.startPoint.x, 
            action.startPoint.y, 
            action.endPoint.x - action.startPoint.x, 
            action.endPoint.y - action.startPoint.y
          )
        }
        ctx.stroke()
      }
    })
  }

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1)
      setTimeout(redrawCanvas, 0)
    }
  }

  const redo = () => {
    if (historyStep < history.length) {
      setHistoryStep(historyStep + 1)
      setTimeout(redrawCanvas, 0)
    }
  }

  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear the whiteboard?')) {
      setHistory([])
      setHistoryStep(0)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `whiteboard-${new Date().toISOString().split('T')[0]}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/teacher/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Online Whiteboard</h1>
          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4">
          {/* Toolbar */}
          <Card className="lg:w-64">
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drawing Tools */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Drawing</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={currentTool === 'pen' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('pen')}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Pen
                  </Button>
                  <Button
                    variant={currentTool === 'eraser' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('eraser')}
                  >
                    <Eraser className="w-4 h-4 mr-2" />
                    Eraser
                  </Button>
                </div>
              </div>

              {/* Shapes */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Shapes</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={currentTool === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('line')}
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Line
                  </Button>
                  <Button
                    variant={currentTool === 'circle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('circle')}
                  >
                    <Circle className="w-4 h-4 mr-2" />
                    Circle
                  </Button>
                  <Button
                    variant={currentTool === 'rectangle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('rectangle')}
                    className="col-span-2"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Rectangle
                  </Button>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Color</p>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        currentColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'
                      } transition-transform`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              {/* Line Width */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Line Width: {lineWidth}px</p>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyStep === 0}
                  className="w-full"
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyStep === history.length}
                  className="w-full"
                >
                  <Redo className="w-4 h-4 mr-2" />
                  Redo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadImage}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save Image
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearCanvas}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="flex-1">
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                className="w-full h-[600px] cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Tips & Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">✏️ Drawing</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Click and drag to draw with the pen tool
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">🔵 Shapes</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Click start point, drag to size, release to complete
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">💾 Save</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Export your whiteboard as a PNG image
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
