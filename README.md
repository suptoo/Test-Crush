# 🧠 QuizFlow — Smart Online Quiz Builder

QuizFlow is a modern, full-stack quiz platform built with **Next.js 14**, **TypeScript**, **Supabase**, and **TailwindCSS**. It enables teachers to create and manage quizzes with secret key access, while students can take quizzes and view instant results with powerful analytics.

---

## ✨ Features

### 🎯 Core Features
- ✅ **Secure Authentication** - Email/password login with role-based access (Teacher/Student)
- ✅ **Quiz Creation** - Dynamic quiz builder with multiple-choice questions
- ✅ **Secret Key System** - Students join quizzes using unique secret keys (e.g., `QZ-ABC123`)
- ✅ **Real-time Auto-save** - Answers automatically saved during quiz attempts
- ✅ **Timer Support** - Optional countdown timer for timed quizzes
- ✅ **Instant Scoring** - Automatic evaluation with detailed answer review
- ✅ **Analytics Dashboard** - Track quiz attempts, scores, and student performance
- ✅ **CSV Export** - Download quiz results for offline analysis
- ✅ **Dark Mode** - Full dark/light theme support
- ✅ **Responsive Design** - Mobile-friendly interface with TailwindCSS

### 🤖 NEW: AI-Powered Features
- ✨ **AI Quiz Assistant** - Generate quiz questions automatically using Vertex AI (Gemini)
  - Natural language interface: "Create 5 math questions about trigonometry"
  - Automatic question and answer generation
  - Smart topic-based suggestions
- ⌨️ **Virtual Math Keyboard** - Easy input of mathematical symbols and equations
  - 100+ math symbols organized by category
  - One-click LaTeX insertion
  - Categories: Basic, Calculus, Trigonometry, Greek letters, and more
- 📐 **LaTeX Math Rendering** - Beautiful mathematical equation display using KaTeX
  - Inline math: `$x^2$`
  - Display math: `$$\int x^2 dx$$`
  - Full LaTeX support for complex equations

### 👨‍🏫 Teacher Features
- Create unlimited quizzes with custom questions
- **NEW: Generate questions with AI assistant**
- **NEW: Use virtual math keyboard for equations**
- Add multiple-choice options and mark correct answers
- Generate unique secret keys for each quiz
- Publish/unpublish quizzes
- View live participant count and completion status
- Export quiz results as CSV
- View detailed analytics (average scores, attempts, etc.)

### 👨‍🎓 Student Features
- Join quizzes using secret keys
- Take quizzes with optional timer
- **NEW: View quizzes with properly rendered math equations**
- Auto-save progress (resume incomplete quizzes)
- View instant results with answer explanations
- Track quiz history and performance trends
- View detailed score breakdowns

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: Google Vertex AI (Gemini Pro) for quiz generation
- **Math Rendering**: KaTeX for LaTeX equation display
- **Icons**: Lucide React
- **Deployment**: Vercel (frontend), Supabase (backend)

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- A **Supabase account** ([Sign up here](https://supabase.com/))

### Step 1: Install Node.js (if not installed)

**Windows:**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the prompts
3. Open PowerShell and verify: `node --version`

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Clone & Setup Project

```bash
# Navigate to the project directory
cd c:\Users\Hp\testcrush

# Install dependencies
npm install

# Copy environment variables
# Edit .env.local with your Supabase credentials
```

### Step 3: Setup Supabase

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Once your project is ready, go to **Settings > API**
3. Copy your **Project URL** and **anon/public key**

### Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Vertex AI for Quiz Generation (AI Assistant feature)
NEXT_PUBLIC_VERTEX_AI_API_KEY=AIzaSyBb8RN6IWjC-SzpwHG_35IWbSjWJhdYtYE6trYtPy1WJE9JKXGA
```

**⚠️ IMPORTANT:** Replace the Supabase values with your actual credentials!

**Note:** The Vertex AI key is already provided. For more details, see `ENV-SETUP.md`.

### Step 5: Setup Database

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and run the SQL script

**For existing databases:** If you get an error about `access_type` column, run the `migration-add-quiz-columns.sql` file instead.

This will create:
- All database tables (profiles, quizzes, questions, choices, attempts, answers)
- Row Level Security (RLS) policies
- Triggers for auto-creating user profiles
- Indexes for optimized queries

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

### 🤖 Step 7: Test AI Features (Optional)

1. Create a teacher account and login
2. Go to "Create Quiz"
3. Click the "AI Assistant" button
4. Try: "Create 3 math questions about algebra"
5. Click the "Math Keyboard" button to test symbol insertion

For detailed AI features guide, see `AI-FEATURES.md` and `QUICK-SETUP-AI.md`.

---

## 🚀 Usage Guide

### For Teachers

1. **Sign Up** - Create an account and select "Teacher" role
2. **Create Quiz**:
   - Click "Create New Quiz"
   - Add title, description, and duration (optional)
   - Add questions with multiple-choice options
   - Mark the correct answer for each question
   - Save (a secret key will be auto-generated)
3. **Publish Quiz** - Click "Publish" to make it available to students
4. **Share Secret Key** - Share the secret key (e.g., `QZ-ABC123`) with students
5. **Monitor** - View live attempts, scores, and export results

### For Students

1. **Sign Up** - Create an account and select "Student" role
2. **Join Quiz**:
   - Enter the secret key provided by your teacher
   - Click "Join Quiz"
3. **Take Quiz**:
   - Answer all questions
   - Answers auto-save as you go
   - Submit when complete
4. **View Results** - See your score and review correct/incorrect answers

---

## 📁 Project Structure

```
quizflow/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── teacher/
│   │   ├── dashboard/page.tsx      # Teacher dashboard
│   │   ├── create-quiz/page.tsx    # Quiz creation
│   │   ├── edit-quiz/[id]/         # Quiz editing
│   │   └── quiz/[id]/              # Quiz details
│   ├── student/
│   │   ├── dashboard/page.tsx      # Student dashboard
│   │   ├── quiz/[id]/page.tsx      # Take quiz
│   │   └── results/[id]/page.tsx   # View results
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── theme-provider.tsx          # Theme context
│   └── theme-toggle.tsx            # Dark mode toggle
├── lib/
│   ├── supabase.ts                 # Supabase client & types
│   └── utils.ts                    # Utility functions
├── supabase-schema.sql             # Database schema
├── .env.local                      # Environment variables
├── .env.example                    # Example environment file
├── package.json                    # Dependencies
├── tailwind.config.ts              # Tailwind configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## 🗄️ Database Schema

### Tables

1. **profiles** - User information and roles
2. **quizzes** - Quiz metadata and settings
3. **questions** - Quiz questions
4. **choices** - Multiple-choice options
5. **attempts** - Student quiz attempts
6. **answers** - Individual question responses

### Key Features
- Row Level Security (RLS) for data protection
- Auto-generated secret keys for quizzes
- Cascade delete for data integrity
- Optimized indexes for performance

---

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
        // Customize primary color
      },
    },
  },
}
```

### Modify Secret Key Format

Edit `lib/utils.ts`:

```typescript
export function generateSecretKey(): string {
  // Customize format (e.g., change prefix or length)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'QZ-'
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

Your Supabase database is already hosted and will work automatically.

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### TypeScript errors
```bash
npm run build
```

### Supabase connection issues
- Check your `.env.local` file
- Verify Supabase project is active
- Ensure database schema is deployed

### Authentication not working
- Check RLS policies in Supabase
- Verify email confirmation settings
- Check browser console for errors

---

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

---

## 👨‍💻 Author

**QuizFlow** - Built with ❤️ using Next.js, Supabase, and modern web technologies.

---

## 🎯 Roadmap

Future enhancements:
- [ ] Image support in questions
- [ ] Multiple correct answers
- [ ] Quiz categories and tags
- [ ] Email notifications
- [ ] Leaderboards
- [ ] Quiz templates
- [ ] Bulk question import (CSV)
- [ ] Advanced analytics charts

---

## 📞 Support

For issues or questions:
- Check the documentation above
- Review the code comments
- Open an issue on GitHub

---

**Happy Quizzing! 🎉**
