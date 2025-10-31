"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, type Quiz } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ArrowLeft, Check, EyeOff } from "lucide-react";

interface QuestionWithChoices {
  id: string;
  question_text: string;
  order_number: number;
  choices: {
    id: string;
    choice_text: string;
    is_correct: boolean;
  }[];
}

export default function ViewQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionWithChoices[]>([]);
  const [copyOk, setCopyOk] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return false;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile || profile.role !== "teacher") {
      router.push("/student/dashboard");
      return false;
    }
    return true;
  }, [router]);

  const loadQuiz = useCallback(async () => {
    const ok = await checkAuth();
    if (!ok) return;

    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (!quizData) {
      router.push("/teacher/dashboard");
      return;
    }
    setQuiz(quizData);

    const { data: qData } = await supabase
      .from("questions")
      .select(
        `id, question_text, order_number, choices (id, choice_text, is_correct)`
      )
      .eq("quiz_id", quizId)
      .order("order_number");

    setQuestions((qData || []) as any);
    setLoading(false);
  }, [checkAuth, quizId, router]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const copyKey = async () => {
    if (!quiz) return;
    await navigator.clipboard.writeText(quiz.secret_key);
    setCopyOk(true);
    setTimeout(() => setCopyOk(false), 1200);
  };

  const togglePublish = async () => {
    if (!quiz) return;
    const next = !quiz.is_published;
    const { error } = await supabase
      .from("quizzes")
      .update({ is_published: next })
      .eq("id", quiz.id);
    if (!error) setQuiz({ ...quiz, is_published: next });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading quiz...
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex justify-between">
          <Link href="/teacher/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/teacher/edit-quiz/${quiz.id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button variant="outline" onClick={togglePublish}>
              {quiz.is_published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <Badge variant={quiz.is_published ? "default" : "secondary"}>
                {quiz.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.description && (
              <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>
            )}

            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Secret Key:</span>
                <code className="font-mono px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20">
                  {quiz.secret_key}
                </code>
                <Button size="sm" variant="outline" onClick={copyKey}>
                  {copyOk ? (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                Visibility: {quiz.access_type ? (quiz.access_type === 'private' ? 'Private' : quiz.access_type === 'market_free' ? 'Market: Free' : `Market: Paid${quiz.price_cents ? ` $${(quiz.price_cents/100).toFixed(2)}` : ''}`) : 'Private'}
              </div>
              {quiz.duration_minutes ? (
                <span className="text-sm text-gray-500">
                  Duration: {quiz.duration_minutes} min
                </span>
              ) : (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <EyeOff className="w-4 h-4" /> No time limit
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">Questions</h2>
          {questions.map((q, idx) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-lg">Question {idx + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">{q.question_text}</p>
                <ul className="space-y-1">
                  {q.choices.map((c) => (
                    <li
                      key={c.id}
                      className={
                        c.is_correct
                          ? "p-2 rounded bg-green-50 dark:bg-green-900/20"
                          : "p-2 rounded bg-gray-50 dark:bg-gray-800"
                      }
                    >
                      {c.choice_text} {c.is_correct && <span className="ml-2 text-green-700">(correct)</span>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
