'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calculator, Plus, Trash2, Download } from 'lucide-react'

interface Grade {
  id: string
  name: string
  score: number
  maxScore: number
  weight: number
}

export default function GradeCalculatorPage() {
  const router = useRouter()
  const [grades, setGrades] = useState<Grade[]>([
    { id: '1', name: 'Midterm', score: 0, maxScore: 100, weight: 30 },
    { id: '2', name: 'Final Exam', score: 0, maxScore: 100, weight: 40 },
    { id: '3', name: 'Assignments', score: 0, maxScore: 100, weight: 30 }
  ])

  const addGrade = () => {
    const newGrade: Grade = {
      id: Date.now().toString(),
      name: `Item ${grades.length + 1}`,
      score: 0,
      maxScore: 100,
      weight: 0
    }
    setGrades([...grades, newGrade])
  }

  const removeGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id))
  }

  const updateGrade = (id: string, field: keyof Grade, value: string | number) => {
    setGrades(grades.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  const calculateWeightedAverage = () => {
    const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0)
    if (totalWeight === 0) return 0

    const weightedSum = grades.reduce((sum, g) => {
      const percentage = g.maxScore > 0 ? (g.score / g.maxScore) * 100 : 0
      return sum + (percentage * g.weight)
    }, 0)

    return weightedSum / totalWeight
  }

  const calculateUnweightedAverage = () => {
    if (grades.length === 0) return 0
    const sum = grades.reduce((sum, g) => {
      return sum + (g.maxScore > 0 ? (g.score / g.maxScore) * 100 : 0)
    }, 0)
    return sum / grades.length
  }

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const getGPA = (percentage: number) => {
    if (percentage >= 90) return 4.0
    if (percentage >= 80) return 3.0
    if (percentage >= 70) return 2.0
    if (percentage >= 60) return 1.0
    return 0.0
  }

  const weightedAvg = calculateWeightedAverage()
  const unweightedAvg = calculateUnweightedAverage()
  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0)

  const exportResults = () => {
    const csv = [
      ['Name', 'Score', 'Max Score', 'Percentage', 'Weight'].join(','),
      ...grades.map(g => [
        g.name,
        g.score,
        g.maxScore,
        `${((g.score / g.maxScore) * 100).toFixed(2)}%`,
        `${g.weight}%`
      ].join(',')),
      [],
      ['Weighted Average', `${weightedAvg.toFixed(2)}%`],
      ['Unweighted Average', `${unweightedAvg.toFixed(2)}%`],
      ['Letter Grade', getLetterGrade(weightedAvg)],
      ['GPA', getGPA(weightedAvg).toFixed(2)]
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grade-calculation-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Grades Input */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-pink-600" />
                  Grade Calculator
                </CardTitle>
                <CardDescription>
                  Calculate weighted and unweighted grade averages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Score</div>
                  <div className="col-span-2">Max</div>
                  <div className="col-span-2">%</div>
                  <div className="col-span-2">Weight</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Grade Rows */}
                {grades.map((grade) => {
                  const percentage = grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0
                  return (
                    <div key={grade.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <Input
                          value={grade.name}
                          onChange={(e) => updateGrade(grade.id, 'name', e.target.value)}
                          placeholder="Grade name"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={grade.score}
                          onChange={(e) => updateGrade(grade.id, 'score', parseFloat(e.target.value) || 0)}
                          min="0"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={grade.maxScore}
                          onChange={(e) => updateGrade(grade.id, 'maxScore', parseFloat(e.target.value) || 0)}
                          min="0"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm font-semibold text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={grade.weight}
                          onChange={(e) => updateGrade(grade.id, 'weight', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          placeholder="0"
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGrade(grade.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={addGrade}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Grade Item
                </Button>

                {totalWeight !== 100 && totalWeight > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
                    ⚠️ Total weight is {totalWeight}%. For accurate weighted average, total should be 100%.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Weighted Average */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Weighted Average</p>
                  <div className="text-4xl font-bold text-pink-600">
                    {weightedAvg.toFixed(2)}%
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold">{getLetterGrade(weightedAvg)}</span>
                    <span className="text-sm text-gray-500">
                      (GPA: {getGPA(weightedAvg).toFixed(2)})
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

                {/* Unweighted Average */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Unweighted Average</p>
                  <div className="text-2xl font-bold">
                    {unweightedAvg.toFixed(2)}%
                  </div>
                  <div className="mt-1">
                    <span className="text-xl font-bold">{getLetterGrade(unweightedAvg)}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      (GPA: {getGPA(unweightedAvg).toFixed(2)})
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

                {/* Stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Items:</span>
                    <span className="font-semibold">{grades.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Weight:</span>
                    <span className="font-semibold">{totalWeight}%</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={exportResults}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              </CardContent>
            </Card>

            {/* Grading Scale */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grading Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>A (4.0)</span>
                    <span className="text-gray-500">90-100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>B (3.0)</span>
                    <span className="text-gray-500">80-89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>C (2.0)</span>
                    <span className="text-gray-500">70-79%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>D (1.0)</span>
                    <span className="text-gray-500">60-69%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F (0.0)</span>
                    <span className="text-gray-500">0-59%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">📊 Weighted Average</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Each grade is multiplied by its weight percentage. Total weights should equal 100%.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">📈 Unweighted Average</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Simple average of all grade percentages without considering weights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
