"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

interface QuestionData {
  id?: string;
  question_text: string;
  order_number: number;
  choices: { id?: string; choice_text: string; is_correct: boolean }[];
}

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [accessType, setAccessType] = useState<"private" | "market_free" | "market_paid">("private");
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return false; }
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!profile || profile.role !== "teacher") { router.push("/student/dashboard"); return false; }
    return true;
  }, [router]);

  const load = useCallback(async () => {
    const ok = await checkAuth(); if (!ok) return;
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", quizId).single();
    if (!quiz) { router.push("/teacher/dashboard"); return; }
    setTitle(quiz.title);
    setDescription(quiz.description || "");
    setDurationMinutes(quiz.duration_minutes);
  setAccessType(quiz.access_type ?? "private");
  setPrice(quiz.price_cents ? (quiz.price_cents/100).toFixed(2) : "");

    const { data: qData } = await supabase
      .from("questions")
      .select(`id, question_text, order_number, choices (id, choice_text, is_correct)`) 
      .eq("quiz_id", quizId)
      .order("order_number");

    const mapped: QuestionData[] = (qData || []).map((q: any) => ({
      id: q.id,
      question_text: q.question_text,
      order_number: q.order_number,
      choices: q.choices || [],
    }));
    setQuestions(mapped);
    setLoading(false);
  }, [checkAuth, quizId, router]);

  useEffect(() => { void load(); }, [load]);

  const addQuestion = () => {
    setQuestions(qs => ([...qs, {
      question_text: "",
      order_number: qs.length + 1,
      choices: [ { choice_text: "", is_correct: false }, { choice_text: "", is_correct: false } ],
    }]));
  };

  const removeQuestion = (index: number) => {
    setQuestions(qs => qs.filter((_, i) => i !== index).map((q, i) => ({...q, order_number: i+1})));
  };

  const updateQuestion = (index: number, text: string) => {
    setQuestions(qs => qs.map((q,i)=> i===index?{...q, question_text: text}:q));
  };

  const addChoice = (qIndex: number) => {
    setQuestions(qs => qs.map((q,i)=> i===qIndex?{...q, choices:[...q.choices, { choice_text:"", is_correct:false }]}:q));
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    setQuestions(qs => qs.map((q,i)=> i===qIndex?{...q, choices: q.choices.filter((_,j)=>j!==cIndex)}:q));
  };

  const updateChoice = (qIndex: number, cIndex: number, text: string) => {
    setQuestions(qs => qs.map((q,i)=> i===qIndex?{...q, choices: q.choices.map((c,j)=> j===cIndex?{...c, choice_text:text}:c)}:q));
  };

  const setCorrectAnswer = (qIndex: number, cIndex: number) => {
    setQuestions(qs => qs.map((q,i)=> i===qIndex?{...q, choices: q.choices.map((c,j)=> ({...c, is_correct: j===cIndex}))}:q));
  };

  const save = async () => {
    setSaving(true); setError("");
    try {
      if (!title.trim()) throw new Error("Title is required");

      // Update quiz metadata
      const { error: qErr } = await supabase
        .from("quizzes")
        .update({ 
          title, 
          description, 
          duration_minutes: durationMinutes,
          access_type: accessType,
          price_cents: accessType === "market_paid" ? Math.round((parseFloat(price || "0") || 0) * 100) : 0,
        })
        .eq("id", quizId);
      if (qErr) throw qErr;

      // Replace questions/choices for simplicity
      const { error: delErr } = await supabase.from("questions").delete().eq("quiz_id", quizId);
      if (delErr) throw delErr;

      for (const [i, q] of questions.entries()) {
        const { data: newQ, error: insQErr } = await supabase
          .from("questions")
          .insert({ quiz_id: quizId, question_text: q.question_text, order_number: i+1 })
          .select()
          .single();
        if (insQErr) throw insQErr;
        const choicesToInsert = q.choices.map(c => ({ question_id: newQ.id, choice_text: c.choice_text, is_correct: c.is_correct }));
        const { error: insCErr } = await supabase.from("choices").insert(choicesToInsert);
        if (insCErr) throw insCErr;
      }

      router.push(`/teacher/quiz/${quizId}`);
    } catch (e:any) {
      setError(e.message || "Failed to save quiz");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href={`/teacher/quiz/${quizId}`}>
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/>Back</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 rounded border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input value={title} onChange={(e)=>setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input value={description} onChange={(e)=>setDescription(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <Input type="number" value={durationMinutes ?? ""} onChange={(e)=>setDurationMinutes(e.target.value ? parseInt(e.target.value) : null)} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Visibility</label>
                <select
                  className="w-full border rounded p-2 bg-white dark:bg-gray-800"
                  value={accessType}
                  onChange={(e)=> setAccessType(e.target.value as any)}
                >
                  <option value="private">Private (only with key)</option>
                  <option value="market_free">Quiz Market - Free</option>
                  <option value="market_paid">Quiz Market - Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (USD)</label>
                <Input type="number" min={0} step="0.01" value={price} onChange={(e)=> setPrice(e.target.value)} disabled={accessType !== "market_paid"} />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Button size="sm" onClick={addQuestion}><Plus className="w-4 h-4 mr-2"/>Add Question</Button>
            </div>
            {questions.map((q, qi) => (
              <Card key={qi} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <label className="text-sm font-medium">Question {qi+1}</label>
                    {questions.length>1 && (
                      <Button variant="destructive" size="sm" onClick={()=>removeQuestion(qi)}><Trash2 className="w-4 h-4"/></Button>
                    )}
                  </div>
                  <Input value={q.question_text} onChange={(e)=>updateQuestion(qi, e.target.value)} placeholder="Enter question"/>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Choices (mark correct)</span>
                      <Button variant="outline" size="sm" onClick={()=>addChoice(qi)}><Plus className="w-3 h-3 mr-1"/>Add Choice</Button>
                    </div>
                    {q.choices.map((c, ci) => (
                      <div key={ci} className="flex items-center gap-2">
                        <input type="radio" name={`correct-${qi}`} checked={c.is_correct} onChange={()=>setCorrectAnswer(qi, ci)} className="w-4 h-4"/>
                        <Input value={c.choice_text} onChange={(e)=>updateChoice(qi, ci, e.target.value)} placeholder={`Choice ${ci+1}`} className="flex-1"/>
                        {q.choices.length>2 && (
                          <Button variant="ghost" size="sm" onClick={()=>removeChoice(qi, ci)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end gap-2">
              <Link href={`/teacher/quiz/${quizId}`}><Button variant="outline">Cancel</Button></Link>
              <Button onClick={save} disabled={saving}>{saving?"Saving...":(<><Save className="w-4 h-4 mr-2"/>Save</>)}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
