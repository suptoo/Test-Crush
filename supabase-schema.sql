-- QuizFlow Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Quizzes Table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  secret_key TEXT NOT NULL UNIQUE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quiz_id, order_number)
);

-- 4. Choices Table
CREATE TABLE choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Attempts Table
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed'))
);

-- 6. Answers Table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice_id UUID NOT NULL REFERENCES choices(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- Indexes for better performance
CREATE INDEX idx_quizzes_teacher ON quizzes(teacher_id);
CREATE INDEX idx_quizzes_secret_key ON quizzes(secret_key);
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_choices_question ON choices(question_id);
CREATE INDEX idx_attempts_quiz ON attempts(quiz_id);
CREATE INDEX idx_attempts_student ON attempts(student_id);
CREATE INDEX idx_answers_attempt ON answers(attempt_id);

-- Row Level Security (RLS) Policies

-- Profiles: Users can read their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Quizzes: Teachers can CRUD their quizzes, Students can view published quizzes
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create quizzes" ON quizzes
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "Teachers can view own quizzes" ON quizzes
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Students can view published quizzes" ON quizzes
  FOR SELECT USING (
    is_published = TRUE AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Teachers can update own quizzes" ON quizzes
  FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own quizzes" ON quizzes
  FOR DELETE USING (teacher_id = auth.uid());

-- Questions: Accessible based on quiz access
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions accessible if quiz is accessible" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND (quizzes.teacher_id = auth.uid() OR quizzes.is_published = TRUE)
    )
  );

CREATE POLICY "Teachers can manage questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

-- Choices: Accessible based on question access
ALTER TABLE choices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Choices accessible if question is accessible" ON choices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM questions 
      JOIN quizzes ON quizzes.id = questions.quiz_id
      WHERE questions.id = choices.question_id 
      AND (quizzes.teacher_id = auth.uid() OR quizzes.is_published = TRUE)
    )
  );

CREATE POLICY "Teachers can manage choices" ON choices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM questions 
      JOIN quizzes ON quizzes.id = questions.quiz_id
      WHERE questions.id = choices.question_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

-- Attempts: Students can create/view own attempts, Teachers can view attempts for their quizzes
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create attempts" ON attempts
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Students can view own attempts" ON attempts
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view quiz attempts" ON attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = attempts.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own attempts" ON attempts
  FOR UPDATE USING (student_id = auth.uid());

-- Answers: Students can create/view own answers, Teachers can view answers for their quizzes
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create answers" ON answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM attempts 
      WHERE attempts.id = answers.attempt_id 
      AND attempts.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own answers" ON answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM attempts 
      WHERE attempts.id = answers.attempt_id 
      AND attempts.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view quiz answers" ON answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM attempts
      JOIN quizzes ON quizzes.id = attempts.quiz_id
      WHERE attempts.id = answers.attempt_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
