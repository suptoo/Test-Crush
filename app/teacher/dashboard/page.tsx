"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, type Quiz, type Attempt } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  BookOpen, 
  Plus, 
  Users, 
  BarChart3, 
  LogOut,
  Eye,
  Trash2,
  Edit,
  Download
} from "lucide-react";
import { exportToCSV, formatDate } from "@/lib/utils";

interface QuizWithStats extends Quiz {
  attempts_count?: number;
  average_score?: number;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error loading profile:", profileError.message);
      router.push("/auth/login");
      return;
    }

    if (!profile || profile.role !== "teacher") {
      router.push("/student/dashboard");
      return;
    }

    setUserName(profile.full_name);
  }, [router]);

  const fetchQuizzes = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: quizzesData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (quizzesData) {
      // Fetch stats for each quiz
      const quizzesWithStats = await Promise.all(
        quizzesData.map(async (quiz) => {
          const { data: attempts } = await supabase
            .from("attempts")
            .select("score, total_questions")
            .eq("quiz_id", quiz.id)
            .eq("status", "completed");

          const attemptsCount = attempts?.length || 0;
          const averageScore =
            attemptsCount > 0
              ? Math.round(
                  attempts!.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) /
                    attemptsCount
                )
              : 0;

          return {
            ...quiz,
            attempts_count: attemptsCount,
            average_score: averageScore,
          };
        })
      );

      setQuizzes(quizzesWithStats);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void checkAuth();
    void fetchQuizzes();
  }, [checkAuth, fetchQuizzes]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    const { error } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", quizId);

    if (!error) {
      fetchQuizzes();
    }
  };

  const handleTogglePublish = async (quizId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("quizzes")
      .update({ is_published: !currentStatus })
      .eq("id", quizId);

    if (!error) {
      fetchQuizzes();
    }
  };

  const handleExportQuizData = async (quizId: string, quizTitle: string) => {
    const { data: attempts } = await supabase
      .from("attempts")
      .select(`
        *,
        profiles:student_id (full_name, email)
      `)
      .eq("quiz_id", quizId)
      .eq("status", "completed");

    if (attempts && attempts.length > 0) {
      const csvData = attempts.map((attempt: any) => ({
        Student: attempt.profiles.full_name,
        Email: attempt.profiles.email,
        Score: attempt.score,
        Total: attempt.total_questions,
        Percentage: `${Math.round((attempt.score / attempt.total_questions) * 100)}%`,
        Date: formatDate(attempt.completed_at),
      }));

      exportToCSV(csvData, `${quizTitle}_results.csv`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">Teacher Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {userName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes.reduce((sum, q) => sum + (q.attempts_count || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
              <BarChart3 className="w-4 h-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes.length > 0
                  ? Math.round(
                      quizzes.reduce((sum, q) => sum + (q.average_score || 0), 0) / quizzes.length
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Quiz Button */}
        <div className="mb-6">
          <Link href="/teacher/create-quiz">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create New Quiz
            </Button>
          </Link>
        </div>

        {/* Quizzes List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Quizzes</h2>
          
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : quizzes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No quizzes yet. Create your first quiz!</p>
              </CardContent>
            </Card>
          ) : (
            quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{quiz.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            quiz.is_published
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {quiz.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {quiz.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="px-2 py-1 rounded text-xs border">
                          {quiz.access_type ? (quiz.access_type === 'private' ? 'Private' : quiz.access_type === 'market_free' ? 'Market: Free' : `Market: Paid${quiz.price_cents ? ` $${(quiz.price_cents/100).toFixed(2)}`: ''}`) : 'Private'}
                        </span>
                        <span>{quiz.attempts_count || 0} attempts</span>
                        <span>
                          Avg: {quiz.average_score || 0}%
                        </span>
                        {quiz.duration_minutes && (
                          <span>{quiz.duration_minutes} min</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/teacher/quiz/${quiz.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/teacher/edit-quiz/${quiz.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePublish(quiz.id, quiz.is_published)}
                      >
                        {quiz.is_published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportQuizData(quiz.id, quiz.title)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
