'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, BookOpen, Plus, Trash2, Download, Calendar, Clock, Target, FileText } from 'lucide-react'

interface Lesson {
  id: string
  date: string
  subject: string
  topic: string
  objectives: string[]
  duration: string
  materials: string
  homework: string
  notes: string
}

export default function LessonPlannerPage() {
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
    return firstDay.toISOString().split('T')[0]
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lesson-plans')
      if (saved) {
        try {
          setLessons(JSON.parse(saved))
        } catch (e) {
          console.error('Error loading lessons:', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lesson-plans', JSON.stringify(lessons))
    }
  }, [lessons])

  const getWeekDates = (startDate: string) => {
    const dates = []
    const start = new Date(startDate)
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const newLesson = (): Lesson => ({
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    subject: '',
    topic: '',
    objectives: [''],
    duration: '60',
    materials: '',
    homework: '',
    notes: ''
  })

  const saveLesson = () => {
    if (!editingLesson) return
    if (lessons.find(l => l.id === editingLesson.id)) {
      setLessons(lessons.map(l => l.id === editingLesson.id ? editingLesson : l))
    } else {
      setLessons([...lessons, editingLesson])
    }
    setEditingLesson(null)
    setShowForm(false)
  }

  const deleteLesson = (id: string) => {
    if (confirm('Delete this lesson plan?')) {
      setLessons(lessons.filter(l => l.id !== id))
    }
  }

  const exportPlan = () => {
    const weekDates = getWeekDates(selectedWeek)
    const weekLessons = lessons.filter(l => weekDates.includes(l.date))
    
    const text = weekLessons.map(l => `
DATE: ${l.date}
SUBJECT: ${l.subject}
TOPIC: ${l.topic}
DURATION: ${l.duration} minutes

OBJECTIVES:
${l.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

MATERIALS: ${l.materials}
HOMEWORK: ${l.homework}
NOTES: ${l.notes}
${'='.repeat(60)}
    `).join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lesson-plan-week-${selectedWeek}.txt`
    a.click()
  }

  const weekDates = getWeekDates(selectedWeek)
  const weekLessons = lessons.filter(l => weekDates.includes(l.date))

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
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
                      <BookOpen className="w-5 h-5 text-cyan-600" />
                      Lesson Planner
                    </CardTitle>
                    <CardDescription>Plan and organize your weekly lessons</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                      className="w-40"
                    />
                    <Button variant="outline" size="sm" onClick={exportPlan}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Week View */}
                <div className="space-y-4">
                  {weekDates.map((date, idx) => {
                    const dayLessons = lessons.filter(l => l.date === date)
                    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][idx]
                    
                    return (
                      <div key={date} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{dayName}</h3>
                            <p className="text-sm text-gray-500">{date}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              const lesson = newLesson()
                              lesson.date = date
                              setEditingLesson(lesson)
                              setShowForm(true)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>

                        {dayLessons.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">No lessons planned</p>
                        ) : (
                          <div className="space-y-2">
                            {dayLessons.map(lesson => (
                              <div key={lesson.id} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-semibold text-cyan-600">{lesson.subject}</p>
                                    <p className="text-sm mt-1">{lesson.topic}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                      <span><Clock className="w-3 h-3 inline mr-1" />{lesson.duration} min</span>
                                      <span><Target className="w-3 h-3 inline mr-1" />{lesson.objectives.length} objectives</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingLesson(lesson)
                                        setShowForm(true)
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteLesson(lesson.id)}
                                      className="text-red-500"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Form */}
          <div>
            {showForm && editingLesson ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {lessons.find(l => l.id === editingLesson.id) ? 'Edit Lesson' : 'New Lesson'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={editingLesson.date}
                      onChange={(e) => setEditingLesson({...editingLesson, date: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="Math, Science, English..."
                      value={editingLesson.subject}
                      onChange={(e) => setEditingLesson({...editingLesson, subject: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Topic</label>
                    <Input
                      placeholder="Lesson topic"
                      value={editingLesson.topic}
                      onChange={(e) => setEditingLesson({...editingLesson, topic: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={editingLesson.duration}
                      onChange={(e) => setEditingLesson({...editingLesson, duration: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Learning Objectives</label>
                    {editingLesson.objectives.map((obj, idx) => (
                      <div key={idx} className="flex gap-2 mt-2">
                        <Input
                          placeholder={`Objective ${idx + 1}`}
                          value={obj}
                          onChange={(e) => {
                            const newObjs = [...editingLesson.objectives]
                            newObjs[idx] = e.target.value
                            setEditingLesson({...editingLesson, objectives: newObjs})
                          }}
                        />
                        {idx > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newObjs = editingLesson.objectives.filter((_, i) => i !== idx)
                              setEditingLesson({...editingLesson, objectives: newObjs})
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => setEditingLesson({
                        ...editingLesson,
                        objectives: [...editingLesson.objectives, '']
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Objective
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Materials</label>
                    <Input
                      placeholder="Required materials..."
                      value={editingLesson.materials}
                      onChange={(e) => setEditingLesson({...editingLesson, materials: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Homework</label>
                    <Input
                      placeholder="Homework assignment..."
                      value={editingLesson.homework}
                      onChange={(e) => setEditingLesson({...editingLesson, homework: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <textarea
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      placeholder="Additional notes..."
                      value={editingLesson.notes}
                      onChange={(e) => setEditingLesson({...editingLesson, notes: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveLesson} className="flex-1">Save</Button>
                    <Button variant="outline" onClick={() => {
                      setEditingLesson(null)
                      setShowForm(false)
                    }}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                      <p className="text-3xl font-bold text-cyan-600">{weekLessons.length}</p>
                      <p className="text-xs text-gray-500">lessons planned</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Plans</p>
                      <p className="text-3xl font-bold text-blue-600">{lessons.length}</p>
                      <p className="text-xs text-gray-500">all time</p>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <p className="font-semibold">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Plan lessons in advance</li>
                        <li>Set clear objectives</li>
                        <li>Include varied activities</li>
                        <li>Allow time for questions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
