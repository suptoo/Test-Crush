'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Users, Plus, Download, Calendar, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Student {
  id: string
  name: string
  rollNumber: string
}

interface AttendanceRecord {
  date: string
  records: {
    [studentId: string]: 'present' | 'absent' | 'late'
  }
}

export default function AttendanceTrackerPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentRoll, setNewStudentRoll] = useState('')
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddStudent, setShowAddStudent] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load from localStorage
      const savedStudents = localStorage.getItem('attendance-students')
      const savedAttendance = localStorage.getItem('attendance-records')
      if (savedStudents) {
        try {
          setStudents(JSON.parse(savedStudents))
        } catch (e) {
          console.error('Error loading students:', e)
        }
      }
      if (savedAttendance) {
        try {
          setAttendance(JSON.parse(savedAttendance))
        } catch (e) {
          console.error('Error loading attendance:', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('attendance-students', JSON.stringify(students))
      localStorage.setItem('attendance-records', JSON.stringify(attendance))
    }
  }, [students, attendance])

  const addStudent = () => {
    if (!newStudentName.trim()) return
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      rollNumber: newStudentRoll.trim() || `S${students.length + 1}`
    }
    setStudents([...students, newStudent])
    setNewStudentName('')
    setNewStudentRoll('')
    setShowAddStudent(false)
  }

  const removeStudent = (id: string) => {
    if (confirm('Remove this student?')) {
      setStudents(students.filter(s => s.id !== id))
    }
  }

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const dateRecord = attendance.find(a => a.date === selectedDate)
    if (dateRecord) {
      dateRecord.records[studentId] = status
      setAttendance([...attendance])
    } else {
      setAttendance([...attendance, {
        date: selectedDate,
        records: { [studentId]: status }
      }])
    }
  }

  const getAttendanceStatus = (studentId: string) => {
    const dateRecord = attendance.find(a => a.date === selectedDate)
    return dateRecord?.records[studentId] || null
  }

  const getStudentStats = (studentId: string) => {
    let present = 0, absent = 0, late = 0
    attendance.forEach(record => {
      const status = record.records[studentId]
      if (status === 'present') present++
      else if (status === 'absent') absent++
      else if (status === 'late') late++
    })
    const total = present + absent + late
    return { present, absent, late, total, percentage: total > 0 ? (present / total * 100).toFixed(1) : '0' }
  }

  const getTodayStats = () => {
    const dateRecord = attendance.find(a => a.date === selectedDate)
    if (!dateRecord) return { present: 0, absent: 0, late: 0, total: students.length }
    
    let present = 0, absent = 0, late = 0
    Object.values(dateRecord.records).forEach(status => {
      if (status === 'present') present++
      else if (status === 'absent') absent++
      else if (status === 'late') late++
    })
    
    return { present, absent, late, total: students.length }
  }

  const exportCSV = () => {
    const csv = [
      ['Date', 'Roll Number', 'Name', ...students.map(s => s.name)].join(','),
      ...attendance.map(record => [
        record.date,
        '',
        '',
        ...students.map(s => {
          const status = record.records[s.id]
          return status === 'present' ? 'P' : status === 'absent' ? 'A' : status === 'late' ? 'L' : '-'
        })
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${selectedDate}.csv`
    a.click()
  }

  const todayStats = getTodayStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
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
          {/* Main Attendance Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-teal-600" />
                      Attendance Tracker
                    </CardTitle>
                    <CardDescription>Mark daily attendance for your class</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-40"
                    />
                    <Button variant="outline" size="sm" onClick={exportCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats for selected date */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold">{todayStats.total}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                    <p className="text-2xl font-bold text-green-600">{todayStats.present}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{todayStats.absent}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
                    <p className="text-2xl font-bold text-orange-600">{todayStats.late}</p>
                  </div>
                </div>

                {/* Student List */}
                {students.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No students added yet</p>
                    <Button onClick={() => setShowAddStudent(true)} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Student
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {students.map((student) => {
                      const status = getAttendanceStatus(student.id)
                      return (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-gray-500">Roll: {student.rollNumber}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={status === 'present' ? 'default' : 'outline'}
                              onClick={() => markAttendance(student.id, 'present')}
                              className={status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={status === 'late' ? 'default' : 'outline'}
                              onClick={() => markAttendance(student.id, 'late')}
                              className={status === 'late' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                            >
                              <Clock className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={status === 'absent' ? 'default' : 'outline'}
                              onClick={() => markAttendance(student.id, 'absent')}
                              className={status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Student */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manage Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddStudent ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Student Name"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                    />
                    <Input
                      placeholder="Roll Number (optional)"
                      value={newStudentRoll}
                      onChange={(e) => setNewStudentRoll(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                    />
                    <div className="flex gap-2">
                      <Button onClick={addStudent} className="flex-1">Add</Button>
                      <Button variant="outline" onClick={() => setShowAddStudent(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowAddStudent(true)} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                )}

                {students.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {students.map(student => (
                      <div key={student.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>{student.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStudent(student.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overall Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Student Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {students.map(student => {
                    const stats = getStudentStats(student.id)
                    return (
                      <div key={student.id} className="border-b pb-3 last:border-0">
                        <p className="font-semibold text-sm mb-1">{student.name}</p>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Attendance: {stats.percentage}%</span>
                          <span>{stats.present}/{stats.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-teal-600 h-1.5 rounded-full"
                            style={{ width: `${stats.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
