# 🤖 AI Features Guide

This guide explains the new AI-powered features added to QuizFlow for teachers.

## ✨ Features Overview

### 1. AI Quiz Assistant
An intelligent assistant that generates quiz questions automatically using Google's Vertex AI (Gemini).

### 2. Virtual Math Keyboard
A comprehensive math symbol keyboard for easy input of mathematical equations and expressions.

### 3. LaTeX Math Rendering
Full support for rendering mathematical equations using KaTeX in questions and answers.

---

## 🎯 AI Quiz Assistant

### What It Does
The AI Assistant can automatically generate complete quiz questions based on your instructions in natural language.

### How to Use

1. **Open Create Quiz Page**
   - Navigate to Teacher Dashboard
   - Click "Create New Quiz"

2. **Enable AI Assistant**
   - Click the "AI Assistant" button in the top right
   - A chat interface will appear in the sidebar

3. **Request Questions**
   Simply tell the AI what you want:
   
   ```
   "Create 5 math questions about trigonometry"
   "Generate 10 easy history questions about World War 2"
   "Make 8 medium difficulty science questions about photosynthesis"
   ```

4. **Review Generated Questions**
   - The AI will generate questions with 4 answer choices each
   - One answer is automatically marked as correct
   - Questions are added to your quiz

5. **Edit as Needed**
   - You can modify any AI-generated question
   - Add or remove answer choices
   - Change the correct answer

### Quick Prompts
The assistant provides quick-start buttons:
- **5 Math Questions** - Generates algebra questions
- **10 Science Questions** - Creates physics questions
- **8 History Questions** - Makes ancient Rome questions

### Tips for Best Results

✅ **Be specific about:**
- Number of questions (e.g., "5 questions")
- Subject/topic (e.g., "about trigonometry")
- Difficulty level (easy, medium, hard)

✅ **Good examples:**
```
"Create 7 hard math questions about calculus derivatives"
"Generate 5 easy biology questions about cell structure"
"Make 10 medium chemistry questions about periodic table"
```

❌ **Avoid vague requests:**
```
"Make some questions"
"Give me a quiz"
```

---

## ⌨️ Virtual Math Keyboard

### What It Does
Provides an easy way to insert mathematical symbols, equations, and expressions without needing to remember LaTeX syntax.

### How to Use

1. **Enable Math Keyboard**
   - Click the "Math Keyboard" button in the top right
   - The keyboard panel appears in the sidebar

2. **Select Your Input Field**
   - Click on any question or answer choice field
   - The field becomes active for math input

3. **Click Symbols**
   - Browse the tabs (Basic, Fractions, Calculus, etc.)
   - Click any symbol to insert it at the cursor position
   - Symbols are wrapped in $ signs automatically

### Available Symbol Categories

#### 📐 Basic
- Powers: x², xⁿ
- Roots: √, ⁿ√
- Operations: ÷, ×, ±

#### 🔢 Fractions
- ½, a/b
- Parentheses: (), [], {}
- Absolute value: |x|

#### 📊 Calculus
- Integrals: ∫, ∫ᵇₐ
- Summation: ∑
- Product: ∏
- Limits: lim
- Derivatives: d/dx, ∂/∂x

#### 📐 Trigonometry
- Functions: sin, cos, tan
- Reciprocal: csc, sec, cot
- Inverse: sin⁻¹, cos⁻¹

#### 🇬🇷 Greek Letters
- α (alpha), β (beta), γ (gamma)
- δ (delta), θ (theta), π (pi)
- Σ (Sigma), Ω (Omega)

#### 🔍 Comparison
- Equals: =, ≠
- Inequalities: <, >, ≤, ≥
- Approximately: ≈
- Infinity: ∞

#### 🧮 Logic & Sets
- Quantifiers: ∀, ∃
- Set membership: ∈, ∉
- Set operations: ⊂, ∪, ∩
- Empty set: ∅

### Quick Examples
The keyboard includes one-click templates:
- **Integral**: ∫₀^∞ x² dx
- **Quadratic Formula**: (-b ± √(b²-4ac)) / 2a
- **Pythagorean Identity**: sin²θ + cos²θ = 1
- **Euler's Identity**: e^(iπ) + 1 = 0

---

## 📝 Math Equation Syntax

### LaTeX Basics

Math expressions are written using LaTeX syntax and wrapped in dollar signs:

**Inline Math** (in text): `$expression$`
```
The formula $E = mc^2$ is famous.
```

**Display Math** (centered): `$$expression$$`
```
$$\int_0^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
```

### Common Examples

#### Basic Operations
```
$x + y$           → x + y
$x - y$           → x - y
$x \times y$      → x × y
$x \div y$        → x ÷ y
```

#### Exponents and Subscripts
```
$x^2$             → x²
$x^{10}$          → x¹⁰
$x_1$             → x₁
$x_{10}$          → x₁₀
```

#### Fractions
```
$\frac{1}{2}$           → ½
$\frac{a}{b}$           → a/b
$\frac{x^2 + 1}{x - 1}$ → (x² + 1)/(x - 1)
```

#### Roots
```
$\sqrt{2}$        → √2
$\sqrt{x^2 + 1}$  → √(x² + 1)
$\sqrt[3]{8}$     → ³√8
```

#### Greek Letters
```
$\alpha$          → α
$\beta$           → β
$\theta$          → θ
$\pi$             → π
$\Sigma$          → Σ
```

#### Trigonometry
```
$\sin(x)$         → sin(x)
$\cos^2(x)$       → cos²(x)
$\tan(\theta)$    → tan(θ)
```

#### Calculus
```
$\int x dx$                    → ∫ x dx
$\int_0^1 x^2 dx$             → ∫₀¹ x² dx
$\sum_{i=1}^{n} i$            → ∑ᵢ₌₁ⁿ i
$\lim_{x \to 0} \frac{1}{x}$  → lim(x→0) 1/x
$\frac{d}{dx} x^2$            → d/dx x²
```

#### Matrices
```
$$\begin{matrix}
a & b \\
c & d
\end{matrix}$$
```

---

## 🎨 Practical Examples

### Example 1: Trigonometry Quiz

**Question:** What is the value of $\sin(\frac{\pi}{2})$?

**Choices:**
- $0$
- $1$ ✓
- $-1$
- $\frac{1}{2}$

### Example 2: Calculus Quiz

**Question:** Calculate $\int_0^1 x^2 dx$

**Choices:**
- $\frac{1}{2}$
- $\frac{1}{3}$ ✓
- $1$
- $0$

### Example 3: Algebra Quiz

**Question:** Solve for x: $x^2 - 5x + 6 = 0$

**Choices:**
- $x = 1, 6$
- $x = 2, 3$ ✓
- $x = -2, -3$
- $x = 0, 5$

### Example 4: Physics Quiz

**Question:** Einstein's mass-energy equivalence is expressed as $E = mc^2$. If m = 2kg and c = 3 × 10⁸ m/s, what is E?

**Choices:**
- $1.8 \times 10^{17}$ J ✓
- $6 \times 10^8$ J
- $9 \times 10^{16}$ J
- $3 \times 10^8$ J

---

## 🔧 Technical Details

### API Integration

The AI features use Google's Vertex AI (Gemini Pro model) via the `@google/generative-ai` package.

**Configuration:**
- Model: `gemini-pro`
- API Key: Set in environment variables
- Rate Limits: 60 requests/minute (free tier)

### Math Rendering

Mathematical expressions are rendered using KaTeX, a fast math typesetting library.

**Packages:**
- `katex` - Core rendering engine
- `react-katex` - React components
- `@types/react-katex` - TypeScript types

### Components Created

1. **AIAssistant** (`components/ai-assistant.tsx`)
   - Chat interface
   - Natural language processing
   - Question generation

2. **MathKeyboard** (`components/math-keyboard.tsx`)
   - Symbol categories
   - LaTeX insertion
   - Preview display

3. **MathText** (`components/math-text.tsx`)
   - LaTeX parsing
   - Inline/block math rendering
   - Error handling

4. **Vertex AI Service** (`lib/vertex-ai.ts`)
   - Quiz generation
   - Single question generation
   - Question improvement

---

## 🐛 Troubleshooting

### AI Assistant Issues

**Problem:** "Failed to generate quiz"
- Check API key is set in `.env.local`
- Verify internet connection
- Check API quota hasn't been exceeded

**Problem:** Generated questions are off-topic
- Be more specific in your prompt
- Include subject, difficulty, and topic
- Try rephrasing your request

### Math Keyboard Issues

**Problem:** Symbols not inserting
- Click on the input field first
- Make sure Math Keyboard is open
- Try clicking the symbol again

**Problem:** Math not rendering
- Check that expressions are wrapped in $ signs
- Verify LaTeX syntax is correct
- Look for matching braces {}

### Math Display Issues

**Problem:** Math showing as text
- Ensure $ delimiters are used: `$x^2$`
- Check for typos in LaTeX syntax
- Refresh the page

**Problem:** Complex equations not displaying
- Break into smaller parts
- Check for special character escaping
- Use the Quick Examples as templates

---

## 💡 Best Practices

### For AI-Generated Questions
1. ✅ Always review AI-generated content
2. ✅ Test questions yourself before publishing
3. ✅ Modify questions to match your teaching style
4. ✅ Verify that correct answers are accurate
5. ✅ Add context or hints if needed

### For Math Equations
1. ✅ Use the Math Keyboard for complex expressions
2. ✅ Preview questions before saving
3. ✅ Keep expressions readable (not too complex)
4. ✅ Use display math ($$) for main equations
5. ✅ Use inline math ($) for variables in text

### For Quiz Quality
1. ✅ Mix AI-generated and manual questions
2. ✅ Include diverse difficulty levels
3. ✅ Test math rendering on different devices
4. ✅ Provide clear, unambiguous questions
5. ✅ Make sure all choices are plausible

---

## 📚 Additional Resources

- [KaTeX Documentation](https://katex.org/docs/supported.html)
- [LaTeX Math Symbols](https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Math Formatting Guide](https://en.wikibooks.org/wiki/LaTeX/Mathematics)

---

## 🎉 Quick Start Checklist

- [ ] Set up `NEXT_PUBLIC_VERTEX_AI_API_KEY` in `.env.local`
- [ ] Navigate to Create Quiz page
- [ ] Click "AI Assistant" button
- [ ] Try a quick prompt: "Create 5 math questions"
- [ ] Click "Math Keyboard" button
- [ ] Test inserting a symbol like $x^2$
- [ ] Preview your quiz with math rendering
- [ ] Save and publish!

**You're ready to create amazing AI-powered quizzes! 🚀**
