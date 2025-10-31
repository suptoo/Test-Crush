import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'teacher' | 'student'
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  secret_key: string
  teacher_id: string
  duration_minutes: number | null
  is_published: boolean
  // New optional fields for market visibility
  access_type?: 'private' | 'market_free' | 'market_paid'
  price_cents?: number | null
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  order_number: number
  created_at: string
}

export interface Choice {
  id: string
  question_id: string
  choice_text: string
  is_correct: boolean
  created_at: string
}

export interface Attempt {
  id: string
  quiz_id: string
  student_id: string
  score: number
  total_questions: number
  started_at: string
  completed_at: string | null
  status: 'in_progress' | 'completed'
}

export interface Answer {
  id: string
  attempt_id: string
  question_id: string
  choice_id: string
  created_at: string
}
