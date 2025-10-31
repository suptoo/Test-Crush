// Google Gemini API Configuration (Free tier available)
const API_KEY = process.env.NEXT_PUBLIC_VERTEX_AI_API_KEY || "AIzaSyD1YS9UgObuEWI87Hzdugc4J0X-Yh3oGSc";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export interface GeneratedQuestion {
  question_text: string;
  choices: {
    choice_text: string;
    is_correct: boolean;
  }[];
}

export interface QuizGenerationRequest {
  topic: string;
  numberOfQuestions: number;
  difficulty?: "easy" | "medium" | "hard";
  subject?: string;
}

/**
 * Call Google Gemini API
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Generate quiz questions using Google Gemini API
 */
export async function generateQuizWithAI(
  request: QuizGenerationRequest
): Promise<GeneratedQuestion[]> {
  try {

    const prompt = `Generate ${request.numberOfQuestions} multiple-choice quiz questions about ${request.topic}${
      request.subject ? ` in the subject of ${request.subject}` : ""
    }${request.difficulty ? ` with ${request.difficulty} difficulty level` : ""}.

For each question:
1. Create a clear, concise question
2. Provide exactly 4 answer choices
3. Mark which choice is correct
4. Ensure questions test understanding, not just memorization

Return the response as a valid JSON array with this exact structure:
[
  {
    "question_text": "The actual question text here?",
    "choices": [
      {"choice_text": "First option", "is_correct": false},
      {"choice_text": "Second option", "is_correct": true},
      {"choice_text": "Third option", "is_correct": false},
      {"choice_text": "Fourth option", "is_correct": false}
    ]
  }
]

IMPORTANT: 
- Return ONLY the JSON array, no additional text or markdown formatting
- Each question must have exactly ONE correct answer
- Make the questions educational and engaging
- For math questions, use proper mathematical notation`;

    const text = await callGeminiAPI(prompt);

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    // Parse the JSON response
    const questions: GeneratedQuestion[] = JSON.parse(cleanedText);

    // Validate the structure
    if (!Array.isArray(questions)) {
      throw new Error("Invalid response format: expected an array");
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question_text || !Array.isArray(q.choices)) {
        throw new Error(`Invalid question format at index ${index}`);
      }
      if (q.choices.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 choices`);
      }
      const correctCount = q.choices.filter((c) => c.is_correct).length;
      if (correctCount !== 1) {
        throw new Error(`Question ${index + 1} must have exactly 1 correct answer`);
      }
    });

    return questions;
  } catch (error: any) {
    console.error("Error generating quiz with AI:", error);
    throw new Error(
      `Failed to generate quiz: ${error.message || "Unknown error"}`
    );
  }
}

/**
 * Generate a single question with AI assistance
 */
export async function generateSingleQuestion(
  topic: string,
  context?: string
): Promise<GeneratedQuestion> {
  try {
    const prompt = `Generate ONE multiple-choice question about: ${topic}
${context ? `Additional context: ${context}` : ""}

Create a question with exactly 4 answer choices, where only ONE is correct.

Return the response as a valid JSON object with this exact structure:
{
  "question_text": "The actual question text here?",
  "choices": [
    {"choice_text": "First option", "is_correct": false},
    {"choice_text": "Second option", "is_correct": true},
    {"choice_text": "Third option", "is_correct": false},
    {"choice_text": "Fourth option", "is_correct": false}
  ]
}

IMPORTANT: Return ONLY the JSON object, no additional text or markdown formatting.`;

    const text = await callGeminiAPI(prompt);

    // Clean up the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const question: GeneratedQuestion = JSON.parse(cleanedText);

    // Validate
    if (!question.question_text || !Array.isArray(question.choices)) {
      throw new Error("Invalid question format");
    }
    if (question.choices.length !== 4) {
      throw new Error("Question must have exactly 4 choices");
    }
    const correctCount = question.choices.filter((c) => c.is_correct).length;
    if (correctCount !== 1) {
      throw new Error("Question must have exactly 1 correct answer");
    }

    return question;
  } catch (error: any) {
    console.error("Error generating single question:", error);
    throw new Error(
      `Failed to generate question: ${error.message || "Unknown error"}`
    );
  }
}

/**
 * Improve or rephrase a question using AI
 */
export async function improveQuestion(
  questionText: string,
  instruction?: string
): Promise<string> {
  try {
    const prompt = `Improve this quiz question: "${questionText}"
${instruction ? `Specific instruction: ${instruction}` : "Make it clearer and more engaging"}

Return ONLY the improved question text, nothing else.`;

    const text = await callGeminiAPI(prompt);
    return text.trim();
  } catch (error: any) {
    console.error("Error improving question:", error);
    throw new Error(
      `Failed to improve question: ${error.message || "Unknown error"}`
    );
  }
}
