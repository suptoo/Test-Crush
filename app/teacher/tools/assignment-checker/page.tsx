'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileCheck, Upload, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface CheckResult {
  wordCount: number
  charCount: number
  sentenceCount: number
  paragraphCount: number
  readingLevel: string
  readingTime: number
  commonWords: { word: string; count: number }[]
  suggestions: string[]
  qualityScore: number
}

export default function AssignmentCheckerPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [compareText, setCompareText] = useState('')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [similarity, setSimilarity] = useState<number | null>(null)

  const analyzeText = () => {
    if (!text.trim()) return

    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || []
    const sentences = text.match(/[.!?]+/g) || []
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim())

    // Word frequency
    const wordFreq: { [key: string]: number } = {}
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })

    const commonWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    // Calculate readability (simplified Flesch-Kincaid)
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
    const avgSyllablesPerWord = words.reduce((sum, word) => sum + countSyllables(word), 0) / words.length
    const readabilityScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
    
    let readingLevel = 'College'
    if (readabilityScore > 90) readingLevel = 'Elementary'
    else if (readabilityScore > 80) readingLevel = 'Middle School'
    else if (readabilityScore > 70) readingLevel = 'High School'
    else if (readabilityScore > 60) readingLevel = 'College'
    else readingLevel = 'Graduate'

    // Quality suggestions
    const suggestions: string[] = []
    if (words.length < 100) suggestions.push('Assignment seems too short. Consider adding more detail.')
    if (sentences.length < 5) suggestions.push('Try to use more varied sentence structures.')
    if (avgWordsPerSentence > 25) suggestions.push('Some sentences are too long. Break them into shorter ones.')
    if (avgWordsPerSentence < 10) suggestions.push('Some sentences might be too short. Try combining related ideas.')
    if (paragraphs.length < 3) suggestions.push('Consider organizing content into more paragraphs.')

    // Calculate quality score
    let qualityScore = 70
    if (words.length > 200) qualityScore += 10
    if (sentences.length > 10) qualityScore += 5
    if (paragraphs.length > 3) qualityScore += 5
    if (avgWordsPerSentence > 12 && avgWordsPerSentence < 20) qualityScore += 5
    if (suggestions.length === 0) qualityScore += 5

    setResult({
      wordCount: words.length,
      charCount: text.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      readingLevel,
      readingTime: Math.ceil(words.length / 200), // avg reading speed
      commonWords,
      suggestions,
      qualityScore: Math.min(qualityScore, 100)
    })
  }

  const countSyllables = (word: string): number => {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '')
    const syllables = word.match(/[aeiouy]{1,2}/g)
    return syllables ? syllables.length : 1
  }

  const checkSimilarity = () => {
    if (!text.trim() || !compareText.trim()) return

    const text1Words = text.toLowerCase().match(/\b[a-z]+\b/g) || []
    const text2Words = compareText.toLowerCase().match(/\b[a-z]+\b/g) || []

    // Create word sets
    const set1 = new Set(text1Words)
    const set2 = new Set(text2Words)

    // Calculate Jaccard similarity
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    const similarityScore = (intersection.size / union.size) * 100

    // Also check for consecutive word matches (potential plagiarism)
    let consecutiveMatches = 0
    const windowSize = 5
    for (let i = 0; i <= text1Words.length - windowSize; i++) {
      const phrase = text1Words.slice(i, i + windowSize).join(' ')
      const comparePhrase = text2Words.join(' ')
      if (comparePhrase.includes(phrase)) {
        consecutiveMatches++
      }
    }

    const finalScore = Math.min(similarityScore + (consecutiveMatches * 2), 100)
    setSimilarity(finalScore)
  }

  const exportReport = () => {
    if (!result) return

    const report = `
ASSIGNMENT QUALITY REPORT
${'='.repeat(50)}

STATISTICS:
- Word Count: ${result.wordCount}
- Character Count: ${result.charCount}
- Sentences: ${result.sentenceCount}
- Paragraphs: ${result.paragraphCount}
- Reading Level: ${result.readingLevel}
- Estimated Reading Time: ${result.readingTime} minutes

QUALITY SCORE: ${result.qualityScore}/100

MOST COMMON WORDS:
${result.commonWords.map(w => `- ${w.word}: ${w.count} times`).join('\n')}

SUGGESTIONS:
${result.suggestions.map(s => `- ${s}`).join('\n')}

${similarity !== null ? `\nSIMILARITY SCORE: ${similarity.toFixed(1)}%` : ''}
    `

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assignment-report-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
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
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-red-600" />
                  Assignment Checker
                </CardTitle>
                <CardDescription>
                  Analyze text quality and check for similarity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Student Assignment
                  </label>
                  <textarea
                    className="w-full min-h-[200px] p-3 border rounded-md"
                    placeholder="Paste student assignment here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button onClick={analyzeText} className="bg-red-600 hover:bg-red-700">
                      <FileCheck className="w-4 h-4 mr-2" />
                      Analyze Quality
                    </Button>
                    <Button variant="outline" onClick={() => setText('')}>
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Similarity Check */}
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium mb-2">
                    Compare with Another Text (Optional)
                  </label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md"
                    placeholder="Paste text to compare for similarity..."
                    value={compareText}
                    onChange={(e) => setCompareText(e.target.value)}
                  />
                  <Button
                    onClick={checkSimilarity}
                    variant="outline"
                    className="mt-2"
                    disabled={!text.trim() || !compareText.trim()}
                  >
                    Check Similarity
                  </Button>
                </div>

                {/* Similarity Result */}
                {similarity !== null && (
                  <div className={`p-4 rounded-lg border-2 ${
                    similarity > 70 ? 'bg-red-50 border-red-300' :
                    similarity > 40 ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {similarity > 70 ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : similarity > 40 ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <span className="font-semibold">
                        Similarity: {similarity.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm">
                      {similarity > 70 ? 'High similarity detected. Possible plagiarism.' :
                       similarity > 40 ? 'Moderate similarity. Review carefully.' :
                       'Low similarity. Content appears original.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            {result ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Analysis Results</CardTitle>
                    <Button size="sm" variant="outline" onClick={exportReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quality Score */}
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quality Score</p>
                    <p className="text-4xl font-bold text-red-600">{result.qualityScore}</p>
                    <p className="text-xs text-gray-500 mt-1">out of 100</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${result.qualityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                      <p className="text-xs text-gray-500">Words</p>
                      <p className="text-xl font-bold">{result.wordCount}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                      <p className="text-xs text-gray-500">Sentences</p>
                      <p className="text-xl font-bold">{result.sentenceCount}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                      <p className="text-xs text-gray-500">Paragraphs</p>
                      <p className="text-xl font-bold">{result.paragraphCount}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                      <p className="text-xs text-gray-500">Read Time</p>
                      <p className="text-xl font-bold">{result.readingTime}m</p>
                    </div>
                  </div>

                  {/* Reading Level */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                    <p className="text-xs text-gray-500">Reading Level</p>
                    <p className="text-lg font-semibold text-blue-600">{result.readingLevel}</p>
                  </div>

                  {/* Common Words */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Most Used Words</p>
                    <div className="space-y-1">
                      {result.commonWords.slice(0, 5).map(({ word, count }) => (
                        <div key={word} className="flex justify-between text-sm">
                          <span className="text-gray-600">{word}</span>
                          <span className="font-semibold">{count}×</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Suggestions
                      </p>
                      <ul className="space-y-1 text-xs">
                        {result.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-yellow-600">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>This tool helps you:</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Analyze text quality and readability</li>
                      <li>Check word count and statistics</li>
                      <li>Identify most used words</li>
                      <li>Get improvement suggestions</li>
                      <li>Compare similarity between texts</li>
                    </ul>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mt-4">
                      <p className="font-semibold text-sm mb-1">Note:</p>
                      <p className="text-xs">
                        This is a basic analysis tool. For comprehensive plagiarism detection, 
                        consider using dedicated services like Turnitin or Grammarly.
                      </p>
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
