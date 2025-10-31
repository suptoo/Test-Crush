'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function PptxToPdfPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push('/teacher/dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>PPTX to PDF Converter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-purple-600 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Under Development</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Full PPTX to PDF conversion requires server-side processing with LibreOffice or similar tools.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
