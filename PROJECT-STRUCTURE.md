# 📁 QuizFlow - Complete Project Structure

```
quizflow/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 auth/                     # Authentication pages
│   │   ├── 📁 login/
│   │   │   └── page.tsx            # Login page
│   │   └── 📁 signup/
│   │       └── page.tsx            # Signup page with role selection
│   │
│   ├── 📁 teacher/                 # Teacher-specific pages
│   │   ├── 📁 dashboard/
│   │   │   └── page.tsx           # Teacher dashboard with analytics
│   │   ├── 📁 create-quiz/
│   │   │   └── page.tsx           # Quiz creation interface
│   │   ├── 📁 edit-quiz/
│   │   │   └── 📁 [id]/
│   │   │       └── page.tsx       # Edit existing quiz
│   │   └── 📁 quiz/
│   │       └── 📁 [id]/
│   │           └── page.tsx       # View quiz details & stats
│   │
│   ├── 📁 student/                 # Student-specific pages
│   │   ├── 📁 dashboard/
│   │   │   └── page.tsx           # Student dashboard with history
│   │   ├── 📁 quiz/
│   │   │   └── 📁 [id]/
│   │   │       └── page.tsx       # Take quiz interface
│   │   └── 📁 results/
│   │       └── 📁 [id]/
│   │           └── page.tsx       # View quiz results
│   │
│   ├── globals.css                 # Global styles & Tailwind
│   ├── layout.tsx                  # Root layout with ThemeProvider
│   └── page.tsx                    # Landing page
│
├── 📁 components/                   # Reusable components
│   ├── 📁 ui/                      # shadcn/ui components
│   │   ├── button.tsx             # Button component
│   │   ├── card.tsx               # Card components
│   │   ├── input.tsx              # Input field
│   │   └── ...                    # Other UI components
│   │
│   ├── theme-provider.tsx          # Next-themes context provider
│   └── theme-toggle.tsx            # Dark/light mode toggle
│
├── 📁 lib/                         # Utility libraries
│   ├── supabase.ts                # Supabase client & TypeScript types
│   └── utils.ts                   # Helper functions (secret key gen, etc.)
│
├── 📄 Configuration Files
│   ├── .env.local                 # Environment variables (SECRET - not in git)
│   ├── .env.example               # Example env file for reference
│   ├── .gitignore                 # Git ignore rules
│   ├── next.config.js             # Next.js configuration
│   ├── package.json               # Dependencies & scripts
│   ├── postcss.config.js          # PostCSS for Tailwind
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   └── tsconfig.json              # TypeScript configuration
│
├── 📄 Database
│   └── supabase-schema.sql        # Complete database schema & RLS
│
├── 📄 Documentation
│   ├── README.md                  # Main documentation
│   ├── SETUP.md                   # Quick setup guide
│   ├── FEATURES.md                # Feature checklist
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── PROJECT-STRUCTURE.md       # This file
│
└── 📁 node_modules/                # Dependencies (not in git)
```

---

## 📝 File Descriptions

### Core Application Files

#### `app/page.tsx`
- Landing page with hero section
- Feature showcase
- Call-to-action buttons for teachers/students
- Stats display

#### `app/layout.tsx`
- Root layout component
- Wraps entire app
- Includes ThemeProvider for dark mode
- Sets up fonts and metadata

#### `app/globals.css`
- Global CSS styles
- Tailwind directives
- CSS variables for theming
- Custom animations

### Authentication Pages

#### `app/auth/login/page.tsx`
- Email/password login form
- Error handling
- Redirects based on user role
- Integration with Supabase Auth

#### `app/auth/signup/page.tsx`
- Registration form
- Role selection (Teacher/Student)
- Creates user profile in database
- Automatic login after signup

### Teacher Pages

#### `app/teacher/dashboard/page.tsx`
- List of all quizzes created
- Statistics cards (total quizzes, attempts, avg score)
- Quick actions (view, edit, delete, publish)
- CSV export functionality
- Secret key display

#### `app/teacher/create-quiz/page.tsx`
- Dynamic form for quiz creation
- Add/remove questions
- Add/remove answer choices
- Mark correct answers
- Form validation
- Auto-generate secret key

#### `app/teacher/edit-quiz/[id]/page.tsx`
- Load existing quiz data
- Modify quiz details
- Update questions and answers
- Save changes

#### `app/teacher/quiz/[id]/page.tsx`
- Detailed quiz view
- List of all attempts
- Student performance breakdown
- Real-time participant count

### Student Pages

#### `app/student/dashboard/page.tsx`
- Secret key input to join quiz
- Quiz history with scores
- Performance statistics
- Best score, average score

#### `app/student/quiz/[id]/page.tsx`
- Quiz-taking interface
- Multiple-choice questions
- Timer countdown (if enabled)
- Auto-save answers
- Progress indicator
- Submit button

#### `app/student/results/[id]/page.tsx`
- Final score display
- Percentage calculation
- Pass/fail status
- Detailed answer review
- Correct/incorrect highlighting

### Components

#### `components/ui/button.tsx`
- Reusable button component
- Multiple variants (default, outline, ghost, etc.)
- Different sizes
- Consistent styling

#### `components/ui/card.tsx`
- Card container components
- CardHeader, CardTitle, CardDescription
- CardContent, CardFooter
- Consistent spacing

#### `components/ui/input.tsx`
- Form input field
- Consistent styling
- Accessible
- Error states

#### `components/theme-provider.tsx`
- Wraps app with next-themes
- Enables theme switching
- Persists theme preference

#### `components/theme-toggle.tsx`
- Sun/moon icon button
- Toggles between light/dark
- Shows in navigation

### Library Files

#### `lib/supabase.ts`
```typescript
- Supabase client configuration
- Database type definitions:
  - Profile
  - Quiz
  - Question
  - Choice
  - Attempt
  - Answer
```

#### `lib/utils.ts`
```typescript
Helper functions:
- cn() - className merging
- generateSecretKey() - Random key generation
- formatDate() - Date formatting
- formatTime() - Timer display
- calculatePercentage() - Score calculation
- exportToCSV() - Data export
```

### Configuration Files

#### `package.json`
```json
Scripts:
- dev: Run development server
- build: Build for production
- start: Run production server
- lint: Check for errors

Dependencies:
- Next.js 14
- React 18
- Supabase client
- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide icons
```

#### `tailwind.config.ts`
- Custom color scheme
- Dark mode configuration
- Custom animations
- Spacing utilities

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases (@/* → ./)
- Strict mode enabled

#### `next.config.js`
- Next.js settings
- Image optimization
- Environment variables

### Database

#### `supabase-schema.sql`
```sql
Tables:
1. profiles - User accounts & roles
2. quizzes - Quiz metadata
3. questions - Question content
4. choices - Answer options
5. attempts - Quiz submissions
6. answers - Individual responses

Security:
- Row Level Security (RLS) policies
- Role-based access control
- Cascade delete rules

Performance:
- Indexed foreign keys
- Optimized queries
```

---

## 🔄 Data Flow

### Quiz Creation Flow
```
Teacher → Create Quiz Page
  ↓
Enter quiz details
  ↓
Add questions & answers
  ↓
Generate secret key
  ↓
Save to Supabase
  ↓
Display in dashboard
```

### Quiz Taking Flow
```
Student → Enter Secret Key
  ↓
Validate key (Supabase)
  ↓
Load quiz & questions
  ↓
Start attempt (create record)
  ↓
Answer questions (auto-save)
  ↓
Submit quiz
  ↓
Calculate score
  ↓
Display results
```

---

## 📊 Component Hierarchy

```
App
├── ThemeProvider
│   ├── Landing Page
│   │   ├── Header (Nav)
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   └── Footer
│   │
│   ├── Auth Pages
│   │   ├── Login Form
│   │   └── Signup Form
│   │
│   ├── Teacher Dashboard
│   │   ├── Header (with ThemeToggle)
│   │   ├── Stats Cards
│   │   └── Quiz List
│   │
│   ├── Student Dashboard
│   │   ├── Header (with ThemeToggle)
│   │   ├── Stats Cards
│   │   ├── Join Quiz Form
│   │   └── Quiz History
│   │
│   └── Quiz Pages
│       ├── Question Cards
│       ├── Timer
│       └── Submit Button
```

---

## 🎨 Styling Structure

```
Globals.css
├── Tailwind Base
├── Tailwind Components
├── Tailwind Utilities
├── CSS Variables (colors)
│   ├── Light theme
│   └── Dark theme
└── Custom Animations
    ├── fade-in
    ├── slide-in
    └── bounce-in
```

---

## 🔐 Security Layers

```
1. Authentication (Supabase Auth)
   ↓
2. Route Protection (useEffect checks)
   ↓
3. Role Validation (profile.role)
   ↓
4. RLS Policies (database level)
   ↓
5. API Security (Supabase handles)
```

---

## 📦 Dependencies Overview

### Production Dependencies
- **@supabase/supabase-js**: Database & auth
- **next**: Framework
- **react**: UI library
- **framer-motion**: Animations
- **next-themes**: Dark mode
- **lucide-react**: Icons
- **tailwind-merge**: Style merging
- **clsx**: Conditional classes
- **recharts**: Charts (for future analytics)

### Dev Dependencies
- **typescript**: Type safety
- **@types/***: Type definitions
- **tailwindcss**: Styling
- **autoprefixer**: CSS processing
- **eslint**: Code quality

---

## 🚀 Build Output

After `npm run build`:
```
.next/
├── static/         # Static assets
├── server/         # Server-side code
└── cache/          # Build cache
```

---

## 📱 Responsive Breakpoints

```css
/* TailwindCSS default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 🎯 Key Features by File

| Feature | File Location |
|---------|---------------|
| Login/Signup | `app/auth/*/page.tsx` |
| Quiz Creation | `app/teacher/create-quiz/page.tsx` |
| Secret Keys | `lib/utils.ts` (generateSecretKey) |
| Quiz Taking | `app/student/quiz/[id]/page.tsx` |
| Auto-save | `app/student/quiz/[id]/page.tsx` (handleSelectAnswer) |
| Scoring | `app/student/quiz/[id]/page.tsx` (handleSubmit) |
| Analytics | `app/teacher/dashboard/page.tsx` |
| Dark Mode | `components/theme-toggle.tsx` |
| Database | `supabase-schema.sql` |

---

**📚 This structure provides a complete, production-ready quiz platform!**
