"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase, type Attempt } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle, XCircle, Home } from "lucide-react";
import { calculatePercentage, formatDate } from "@/lib/utils";

interface AnswerDetail {
  question_text: string;
  selected_choice: string;
  is_correct: boolean;
  correct_choice: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [answerDetails, setAnswerDetails] = useState<AnswerDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResults = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Load attempt
      const { data: attemptData } = await supabase
        .from("attempts")
        .select(`
          *,
          quizzes (title)
        `)
        .eq("id", attemptId)
        .single();

      if (!attemptData) {
        router.push("/student/dashboard");
        return;
      }

      setAttempt(attemptData);
      setQuizTitle((attemptData.quizzes as any).title);

      // Load detailed answers
      const { data: answers } = await supabase
        .from("answers")
        .select("id, question_id, choice_id")
        .eq("attempt_id", attemptId);

      if (answers && answers.length > 0) {
        const questionIds = answers.map((a: any) => a.question_id);
        const choiceIds = answers.map((a: any) => a.choice_id);

        const [{ data: questionsMapData }, { data: selectedChoices }, { data: correctChoices }] = await Promise.all([
          supabase
            .from("questions")
            .select("id, question_text")
            .in("id", questionIds),
          supabase
            .from("choices")
            .select("id, choice_text, is_correct")
            .in("id", choiceIds),
          supabase
            .from("choices")
            .select("question_id, choice_text")
            .in("question_id", questionIds)
            .eq("is_correct", true),
        ]);

        const qText = new Map<string, string>();
        (questionsMapData || []).forEach((q: any) => qText.set(q.id, q.question_text));
        const selectedMap = new Map<string, { choice_text: string; is_correct: boolean }>();
        (selectedChoices || []).forEach((c: any) => selectedMap.set(c.id, { choice_text: c.choice_text, is_correct: !!c.is_correct }));
        const correctByQuestion = new Map<string, string>();
        (correctChoices || []).forEach((c: any) => correctByQuestion.set(c.question_id, c.choice_text));

        const details: AnswerDetail[] = answers.map((a: any) => {
          const selected = selectedMap.get(a.choice_id);
          return {
            question_text: qText.get(a.question_id) || "",
            selected_choice: selected?.choice_text || "",
            is_correct: !!selected?.is_correct,
            correct_choice: correctByQuestion.get(a.question_id) || "",
          };
        });

        setAnswerDetails(details);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading results:", error);
      setLoading(false);
      router.push("/student/dashboard");
    }
  }, [attemptId, router]);

  useEffect(() => {
    void loadResults();
  }, [loadResults]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading results...</div>
      </div>
    );
  }

  if (!attempt) {
    return null;
  }

  const percentage = calculatePercentage(attempt.score, attempt.total_questions);
  const isPassing = percentage >= 60;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Score Card */}
        <Card className="mb-8 border-t-4 border-t-purple-600">
          <CardContent className="p-8 text-center">
            <Trophy
              className={`w-20 h-20 mx-auto mb-4 ${
                isPassing ? "text-yellow-500" : "text-gray-400"
              }`}
            />
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{quizTitle}</p>

            <div className="flex justify-center items-center gap-8 mb-6">
              <div>
                <div className="text-5xl font-bold text-purple-600">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold">
                  {attempt.score} / {attempt.total_questions}
                </div>
                <div className="text-sm text-gray-500">Correct Answers</div>
              </div>
            </div>

            <div
              className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                isPassing
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
              }`}
            >
              {isPassing ? "Passed!" : "Keep Practicing"}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Completed on {formatDate(attempt.completed_at || attempt.started_at)}
            </p>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold">Answer Review</h2>

          {answerDetails.map((detail, index) => (
            <Card
              key={index}
              className={`border-l-4 ${
                detail.is_correct
                  ? "border-l-green-500"
                  : "border-l-red-500"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                  {detail.is_correct ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-4">{detail.question_text}</p>

                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-lg ${
                      detail.is_correct
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">Your Answer:</div>
                    <div>{detail.selected_choice}</div>
                  </div>

                  {!detail.is_correct && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="text-sm font-medium mb-1">
                        Correct Answer:
                      </div>
                      <div>{detail.correct_choice}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link href="/student/dashboard">
            <Button size="lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
