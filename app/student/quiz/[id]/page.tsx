"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase, type Quiz, type Question, type Choice } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface QuestionWithChoices extends Question {
  choices: Choice[];
}

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionWithChoices[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);

    try {
      // Fetch all answers for this attempt
      const { data: answers } = await supabase
        .from("answers")
        .select("question_id, choice_id")
        .eq("attempt_id", attemptId);

      let score = 0;
      if (answers && answers.length > 0) {
        const choiceIds = answers.map((a: any) => a.choice_id);
        const { data: selectedChoices } = await supabase
          .from("choices")
          .select("id, is_correct")
          .in("id", choiceIds);

        const correctness = new Map<string, boolean>();
        (selectedChoices || []).forEach((c: any) => correctness.set(c.id, !!c.is_correct));
        answers.forEach((a: any) => {
          if (correctness.get(a.choice_id)) score++;
        });
      }

      await supabase
        .from("attempts")
        .update({
          score,
          completed_at: new Date().toISOString(),
          status: "completed",
        })
        .eq("id", attemptId);

      router.push(`/student/results/${attemptId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSubmitting(false);
    }
  }, [attemptId, router, submitting]);

  const loadQuiz = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Load quiz
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      if (!quizData || !quizData.is_published) {
        alert("Quiz not found or not published");
        router.push("/student/dashboard");
        return;
      }

      setQuiz(quizData);

      // Load questions with choices
      const { data: questionsData } = await supabase
        .from("questions")
        .select(`
          *,
          choices (*)
        `)
        .eq("quiz_id", quizId)
        .order("order_number");

      if (questionsData) {
        setQuestions(questionsData as QuestionWithChoices[]);

        // Check for existing in-progress attempt
        const { data: existingAttempt } = await supabase
          .from("attempts")
          .select("id, started_at")
          .eq("quiz_id", quizId)
          .eq("student_id", user.id)
          .eq("status", "in_progress")
          .single();

        if (existingAttempt) {
          setAttemptId(existingAttempt.id);

          // Load existing answers
          const { data: answers } = await supabase
            .from("answers")
            .select("question_id, choice_id")
            .eq("attempt_id", existingAttempt.id);

          if (answers) {
            const answersMap: Record<string, string> = {};
            answers.forEach((a) => {
              answersMap[a.question_id] = a.choice_id;
            });
            setSelectedAnswers(answersMap);
          }

          // Calculate time left if there's a duration
          if (quizData.duration_minutes) {
            const startTime = new Date(existingAttempt.started_at).getTime();
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const totalSeconds = quizData.duration_minutes * 60;
            const remaining = Math.max(0, totalSeconds - elapsed);
            setTimeLeft(remaining);

            if (remaining === 0) {
              void handleSubmit();
              return;
            }
          }
        } else {
          // Create new attempt
          const { data: newAttempt } = await supabase
            .from("attempts")
            .insert({
              quiz_id: quizId,
              student_id: user.id,
              total_questions: questionsData.length,
              status: "in_progress",
            })
            .select()
            .single();

          if (newAttempt) {
            setAttemptId(newAttempt.id);

            // Set timer if quiz has duration
            if (quizData.duration_minutes) {
              setTimeLeft(quizData.duration_minutes * 60);
            }
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading quiz:", error);
      setLoading(false);
      router.push("/student/dashboard");
    }
  }, [handleSubmit, quizId, router]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          void handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit, timeLeft]);

  const handleSelectAnswer = async (questionId: string, choiceId: string) => {
    if (!attemptId) return;

    // Update local state
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));

    // Save to database (upsert)
    const { data: existing } = await supabase
      .from("answers")
      .select("id")
      .eq("attempt_id", attemptId)
      .eq("question_id", questionId)
      .single();

    if (existing) {
      // Update existing answer
      await supabase
        .from("answers")
        .update({ choice_id: choiceId })
        .eq("id", existing.id);
    } else {
      // Insert new answer
      await supabase.from("answers").insert({
        attempt_id: attemptId,
        question_id: questionId,
        choice_id: choiceId,
      });
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-4 sm:mb-6 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{quiz?.title}</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {quiz?.description}
                </p>
              </div>
              {timeLeft !== null && (
                <div
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg w-fit ${
                    timeLeft < 60
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  }`}
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-mono text-base sm:text-lg font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                {answeredCount} / {totalQuestions} answered
              </span>
              {answeredCount < totalQuestions && (
                <span className="flex items-center gap-1 text-orange-600">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {totalQuestions - answeredCount} remaining
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">
                  Question {index + 1} of {totalQuestions}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-base sm:text-lg mb-3 sm:mb-4">{question.question_text}</p>

                <div className="space-y-2 sm:space-y-3">
                  {question.choices.map((choice) => (
                    <label
                      key={choice.id}
                      className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAnswers[question.id] === choice.id
                          ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={selectedAnswers[question.id] === choice.id}
                        onChange={() =>
                          handleSelectAnswer(question.id, choice.id)
                        }
                        className="w-4 h-4 text-purple-600 mr-3 flex-shrink-0"
                      />
                      <span className="flex-1 text-sm sm:text-base">{choice.choice_text}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <p className="font-medium text-sm sm:text-base">Ready to submit?</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Make sure you&apos;ve answered all questions before submitting.
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                size="lg"
                className="w-full sm:w-auto sm:min-w-[150px]"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
