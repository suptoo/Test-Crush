"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { generateQuizWithAI, type GeneratedQuestion } from "@/lib/vertex-ai";

interface AIAssistantProps {
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export function AIAssistant({ onQuestionsGenerated }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Quiz Assistant. Tell me what kind of quiz you'd like to create!\n\nFor example:\n• \"Create 5 math questions about trigonometry\"\n• \"Generate 10 easy history questions about World War 2\"\n• \"Make 8 medium difficulty science questions about photosynthesis\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const parseUserInput = (
    text: string
  ): { numberOfQuestions: number; topic: string; subject?: string; difficulty?: "easy" | "medium" | "hard" } | null => {
    const lowerText = text.toLowerCase();

    // Extract number of questions
    const numberMatch = text.match(/(\d+)/);
    const numberOfQuestions = numberMatch ? parseInt(numberMatch[1]) : 5;

    // Extract difficulty
    let difficulty: "easy" | "medium" | "hard" | undefined;
    if (lowerText.includes("easy")) difficulty = "easy";
    else if (lowerText.includes("medium")) difficulty = "medium";
    else if (lowerText.includes("hard") || lowerText.includes("difficult"))
      difficulty = "hard";

    // Extract subject (common subjects)
    const subjects = [
      "math",
      "mathematics",
      "science",
      "physics",
      "chemistry",
      "biology",
      "history",
      "geography",
      "english",
      "literature",
      "computer science",
      "programming",
      "art",
      "music",
    ];
    let subject: string | undefined;
    for (const subj of subjects) {
      if (lowerText.includes(subj)) {
        subject = subj;
        break;
      }
    }

    // Extract topic (everything after "about" or the whole text)
    let topic = text;
    const aboutMatch = text.match(/about\s+(.+?)(?:\s+with|\s+at|$)/i);
    if (aboutMatch) {
      topic = aboutMatch[1];
    } else {
      // Remove number and difficulty words to get topic
      topic = text
        .replace(/\d+/g, "")
        .replace(/\b(easy|medium|hard|difficult|questions?|quiz)\b/gi, "")
        .replace(/\b(create|generate|make|write)\b/gi, "")
        .trim();
    }

    if (!topic || topic.length < 3) {
      return null;
    }

    return { numberOfQuestions, topic, subject, difficulty };
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Parse the input
    const parsed = parseUserInput(userMessage);

    if (!parsed) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't understand that request. Please specify:\n• Number of questions (e.g., 5 questions)\n• Topic (e.g., about trigonometry)\n\nExample: 'Create 5 questions about algebra'",
        },
      ]);
      return;
    }

    // Add loading message
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Generating ${parsed.numberOfQuestions} ${
          parsed.difficulty || ""
        } questions about ${parsed.topic}...`,
        isLoading: true,
      },
    ]);

    setIsGenerating(true);

    try {
      const questions = await generateQuizWithAI({
        numberOfQuestions: parsed.numberOfQuestions,
        topic: parsed.topic,
        subject: parsed.subject,
        difficulty: parsed.difficulty,
      });

      // Remove loading message
      setMessages((prev) => prev.filter((m) => !m.isLoading));

      // Add success message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ Successfully generated ${questions.length} questions about ${parsed.topic}! Click the button below to add them to your quiz.`,
        },
      ]);

      // Pass questions to parent
      onQuestionsGenerated(questions);
    } catch (error: any) {
      // Remove loading message
      setMessages((prev) => prev.filter((m) => !m.isLoading));

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${
            error.message || "Failed to generate questions. Please try again."
          }`,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Quiz Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{message.content}</span>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleQuickPrompt("Create 5 math questions about algebra")
            }
            disabled={isGenerating}
          >
            5 Math Questions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleQuickPrompt("Generate 10 easy science questions about physics")
            }
            disabled={isGenerating}
          >
            10 Science Questions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleQuickPrompt("Make 8 hard history questions about ancient Rome")
            }
            disabled={isGenerating}
          >
            8 History Questions
          </Button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="e.g., Create 5 math questions about trigonometry"
            disabled={isGenerating}
          />
          <Button
            onClick={handleSend}
            disabled={isGenerating || !input.trim()}
            size="icon"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          💡 Tip: Be specific about the number of questions, topic, and difficulty
          level for best results!
        </p>
      </CardContent>
    </Card>
  );
}
