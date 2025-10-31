"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, type Attempt, type Quiz } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, LogOut, Search, Trophy, TrendingUp } from "lucide-react";
import { formatDate, calculatePercentage } from "@/lib/utils";

interface AttemptWithQuiz extends Attempt {
  quizzes: {
    title: string;
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<AttemptWithQuiz[]>([]);
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [runningQuizzes, setRunningQuizzes] = useState<Quiz[]>([]);

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

    if (!profile || profile.role !== "student") {
      router.push("/teacher/dashboard");
      return;
    }

    setUserName(profile.full_name);
  }, [router]);

  const fetchAttempts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("attempts")
      .select(`
        *,
        quizzes (title)
      `)
      .eq("student_id", user.id)
      .order("started_at", { ascending: false });

    if (data) {
      setAttempts(data as AttemptWithQuiz[]);
    }
    setLoading(false);
  }, []);

  const fetchRunningQuizzes = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .eq("is_published", true)
      .in("access_type", ["market_free", "market_paid"]) 
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setRunningQuizzes(data as Quiz[]);
  }, []);

  useEffect(() => {
    void checkAuth();
    void fetchAttempts();
    void fetchRunningQuizzes();
  }, [checkAuth, fetchAttempts, fetchRunningQuizzes]);

  const handleJoinQuiz = async () => {
    if (!secretKey.trim()) {
      setError("Please enter a secret key");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Find quiz by secret key
      const { data: quiz } = await supabase
        .from("quizzes")
        .select("id, is_published")
        .eq("secret_key", secretKey.toUpperCase())
        .single();

      if (!quiz) {
        setError("Invalid secret key");
        setLoading(false);
        return;
      }

      if (!quiz.is_published) {
        setError("This quiz is not published yet");
        setLoading(false);
        return;
      }

      router.push(`/student/quiz/${quiz.id}`);
    } catch (err: any) {
      setError("Failed to join quiz");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const completedAttempts = attempts.filter((a) => a.status === "completed");
  const avgScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce(
            (sum, a) => sum + calculatePercentage(a.score, a.total_questions),
            0
          ) / completedAttempts.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold">Student Dashboard</h1>
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
              <BookOpen className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAttempts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedAttempts.length > 0
                  ? Math.max(
                      ...completedAttempts.map((a) =>
                        calculatePercentage(a.score, a.total_questions)
                      )
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join Quiz */}
        <Card className="mb-8 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Join a Quiz</CardTitle>
            <CardDescription>
              Enter the secret key provided by your teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <Input
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value.toUpperCase())}
                placeholder="Enter secret key (e.g., QZ-ABC123)"
                className="flex-1 font-mono text-lg"
                maxLength={9}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleJoinQuiz();
                  }
                }}
              />
              <Button
                onClick={handleJoinQuiz}
                disabled={loading}
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Join Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Running Quizzes */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold">Quiz Market</h2>

          {runningQuizzes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No running quizzes right now.
              </CardContent>
            </Card>
          ) : (
            runningQuizzes.map((q) => (
              <Card key={q.id} className="hover:shadow-lg transition">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">{q.title}</div>
                    {q.description && (
                      <div className="text-sm text-gray-500">{q.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {q.access_type === 'market_paid' ? `Price: $${q.price_cents ? (q.price_cents/100).toFixed(2) : '0.00'}` : 'Free'}
                    </div>
                  </div>
                  <Button onClick={() => router.push(`/student/quiz/${q.id}`)}>Join</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quiz History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Quiz History</h2>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : attempts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No quiz history yet. Join your first quiz above!
                </p>
              </CardContent>
            </Card>
          ) : (
            attempts.map((attempt) => (
              <Card
                key={attempt.id}
                className="hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/student/results/${attempt.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">
                        {(attempt.quizzes as any).title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(attempt.started_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      {attempt.status === "completed" ? (
                        <>
                          <div className="text-2xl font-bold text-blue-600">
                            {calculatePercentage(
                              attempt.score,
                              attempt.total_questions
                            )}
                            %
                          </div>
                          <div className="text-sm text-gray-500">
                            {attempt.score} / {attempt.total_questions} correct
                          </div>
                        </>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm">
                          In Progress
                        </span>
                      )}
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
