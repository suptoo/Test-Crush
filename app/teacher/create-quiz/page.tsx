"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Question, type Choice } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, ArrowLeft, Sparkles, Keyboard } from "lucide-react";
import { generateSecretKey } from "@/lib/utils";
import Link from "next/link";
import { AIAssistant } from "@/components/ai-assistant";
import { MathKeyboard } from "@/components/math-keyboard";
import { MathText } from "@/components/math-text";
import { type GeneratedQuestion } from "@/lib/vertex-ai";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface QuestionData {
  question_text: string;
  choices: {
    choice_text: string;
    is_correct: boolean;
  }[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [accessType, setAccessType] = useState<"private" | "market_free" | "market_paid">("private");
  const [price, setPrice] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      question_text: "",
      choices: [
        { choice_text: "", is_correct: false },
        { choice_text: "", is_correct: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // New state for AI and Math Keyboard
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showMathKeyboard, setShowMathKeyboard] = useState(false);
  const [activeInputRef, setActiveInputRef] = useState<{
    type: "question" | "choice";
    questionIndex: number;
    choiceIndex?: number;
  } | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        choices: [
          { choice_text: "", is_correct: false },
          { choice_text: "", is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question_text = text;
    setQuestions(newQuestions);
  };

  const addChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.push({
      choice_text: "",
      is_correct: false,
    });
    setQuestions(newQuestions);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices = newQuestions[
      questionIndex
    ].choices.filter((_, i) => i !== choiceIndex);
    setQuestions(newQuestions);
  };

  const updateChoice = (
    questionIndex: number,
    choiceIndex: number,
    text: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex].choice_text = text;
    setQuestions(newQuestions);
  };

  const setCorrectAnswer = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    // Set all choices to false first
    newQuestions[questionIndex].choices.forEach((c) => (c.is_correct = false));
    // Set selected choice to true
    newQuestions[questionIndex].choices[choiceIndex].is_correct = true;
    setQuestions(newQuestions);
  };

  // AI Assistant Handler
  const handleAIQuestionsGenerated = (generatedQuestions: GeneratedQuestion[]) => {
    // Add the generated questions to existing questions
    const newQuestions = generatedQuestions.map((q) => ({
      question_text: q.question_text,
      choices: q.choices,
    }));
    setQuestions([...questions, ...newQuestions]);
  };

  // Math Keyboard Handler
  const handleMathInsert = (latex: string) => {
    if (!activeInputRef) return;

    const { type, questionIndex, choiceIndex } = activeInputRef;
    const newQuestions = [...questions];

    if (type === "question") {
      // Insert at cursor position or append
      const currentText = newQuestions[questionIndex].question_text;
      newQuestions[questionIndex].question_text = currentText + ` $${latex}$ `;
    } else if (type === "choice" && choiceIndex !== undefined) {
      const currentText =
        newQuestions[questionIndex].choices[choiceIndex].choice_text;
      newQuestions[questionIndex].choices[choiceIndex].choice_text =
        currentText + ` $${latex}$ `;
    }

    setQuestions(newQuestions);
  };

  // Track which input is focused
  const handleInputFocus = (
    type: "question" | "choice",
    questionIndex: number,
    choiceIndex?: number
  ) => {
    setActiveInputRef({ type, questionIndex, choiceIndex });
  };

  const handleSaveQuiz = async () => {
    setLoading(true);
    setError("");

    // Validation
    if (!title.trim()) {
      setError("Quiz title is required");
      setLoading(false);
      return;
    }

    if (questions.length === 0) {
      setError("At least one question is required");
      setLoading(false);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setError(`Question ${i + 1} text is required`);
        setLoading(false);
        return;
      }

      if (q.choices.length < 2) {
        setError(`Question ${i + 1} needs at least 2 choices`);
        setLoading(false);
        return;
      }

      const hasCorrect = q.choices.some((c) => c.is_correct);
      if (!hasCorrect) {
        setError(`Question ${i + 1} must have a correct answer marked`);
        setLoading(false);
        return;
      }

      for (let j = 0; j < q.choices.length; j++) {
        if (!q.choices[j].choice_text.trim()) {
          setError(`Question ${i + 1}, Choice ${j + 1} text is required`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title,
          description,
          secret_key: generateSecretKey(),
          teacher_id: user.id,
          duration_minutes: durationMinutes,
          is_published: false,
          // New fields (require DB migration). If columns don't exist, Supabase will ignore only if provided via RPC; here we assume migrated.
          access_type: accessType,
          price_cents: accessType === "market_paid" ? Math.round((parseFloat(price || "0") || 0) * 100) : 0,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Create questions and choices
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        const { data: question, error: questionError } = await supabase
          .from("questions")
          .insert({
            quiz_id: quiz.id,
            question_text: q.question_text,
            order_number: i + 1,
          })
          .select()
          .single();

        if (questionError) throw questionError;

        // Create choices for this question
        const choicesToInsert = q.choices.map((c) => ({
          question_id: question.id,
          choice_text: c.choice_text,
          is_correct: c.is_correct,
        }));

        const { error: choicesError } = await supabase
          .from("choices")
          .insert(choicesToInsert);

        if (choicesError) throw choicesError;
      }

      router.push("/teacher/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create quiz");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/teacher/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button
              variant={showAIAssistant ? "default" : "outline"}
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <Button
              variant={showMathKeyboard ? "default" : "outline"}
              onClick={() => setShowMathKeyboard(!showMathKeyboard)}
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Math Keyboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create New Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Quiz Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quiz Title *
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Math Quiz - Chapter 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the quiz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (minutes) - Optional
                  </label>
                  <Input
                    type="number"
                    value={durationMinutes || ""}
                    onChange={(e) =>
                      setDurationMinutes(
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    placeholder="Leave empty for no time limit"
                  />
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
                    <p className="text-xs text-gray-500 mt-1">Private quizzes are not listed in the market; students join with the secret key.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (USD)</label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={price}
                      onChange={(e)=> setPrice(e.target.value)}
                      disabled={accessType !== "market_paid"}
                      placeholder={accessType === "market_paid" ? "e.g., 2.99" : "Disabled for Free/Private"}
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6 mt-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Questions</h3>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {questions.map((question, qIndex) => (
                  <Card key={qIndex} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <label className="block text-sm font-medium">
                            Question {qIndex + 1} *
                          </label>
                          {questions.length > 1 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeQuestion(qIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <Input
                            value={question.question_text}
                            onChange={(e) =>
                              updateQuestion(qIndex, e.target.value)
                            }
                            onFocus={() => handleInputFocus("question", qIndex)}
                            placeholder="Enter your question (use $ for math: $x^2$)"
                          />
                          {/* Math Preview */}
                          {question.question_text && question.question_text.includes('$') && (
                            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Preview:</p>
                              <div className="text-base">
                                <MathText text={question.question_text} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Choices */}
                        <div className="space-y-3 mt-4 pl-4">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">
                              Choices (mark the correct answer)
                            </label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addChoice(qIndex)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Choice
                            </Button>
                          </div>

                          {question.choices.map((choice, cIndex) => (
                            <div
                              key={cIndex}
                              className="space-y-2"
                            >
                              <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={choice.is_correct}
                                onChange={() =>
                                  setCorrectAnswer(qIndex, cIndex)
                                }
                                className="w-4 h-4 text-blue-600"
                              />
                              <Input
                                value={choice.choice_text}
                                onChange={(e) =>
                                  updateChoice(qIndex, cIndex, e.target.value)
                                }
                                onFocus={() => handleInputFocus("choice", qIndex, cIndex)}
                                placeholder={`Choice ${cIndex + 1} (use $ for math)`}
                                className="flex-1"
                              />
                              {question.choices.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeChoice(qIndex, cIndex)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                              </div>
                              {/* Math Preview for Choice */}
                              {choice.choice_text && choice.choice_text.includes('$') && (
                                <div className="ml-8 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                                  <div className="text-sm">
                                    <MathText text={choice.choice_text} />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-6">
                <Link href="/teacher/dashboard">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button onClick={handleSaveQuiz} disabled={loading}>
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Sidebar for AI Assistant and Math Keyboard */}
          <div className="space-y-6">
            {showAIAssistant && (
              <AIAssistant onQuestionsGenerated={handleAIQuestionsGenerated} />
            )}
            {showMathKeyboard && (
              <MathKeyboard onInsert={handleMathInsert} />
            )}
            
            {!showAIAssistant && !showMathKeyboard && (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-gray-500">
                  <p className="mb-4">Select a tool from above to get started</p>
                  <div className="space-y-2 text-sm text-left">
                    <p>✨ <strong>AI Assistant:</strong> Generate quiz questions automatically</p>
                    <p>⌨️ <strong>Math Keyboard:</strong> Insert mathematical symbols and equations</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
