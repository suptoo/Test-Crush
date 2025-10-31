# ⚡ QuizFlow - Quick Reference Card

## 🚀 Essential Commands

```powershell
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Check for errors

# Git (if using version control)
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to remote
```

---

## 🔑 Environment Variables (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://bqgsuexdjiihtysyaysr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_key_here
```

**⚠️ Remember to replace with YOUR actual Supabase credentials!**

---

## 🗄️ Database Tables

```
1. profiles      → User accounts (id, email, full_name, role)
2. quizzes       → Quiz data (title, secret_key, teacher_id)
3. questions     → Question text (quiz_id, question_text, order)
4. choices       → Answer options (question_id, text, is_correct)
5. attempts      → Quiz submissions (quiz_id, student_id, score)
6. answers       → Individual responses (attempt_id, choice_id)
```

---

## 🌐 Routes

### Public
- `/` - Landing page
- `/auth/login` - Login
- `/auth/signup` - Signup

### Teacher
- `/teacher/dashboard` - Main dashboard
- `/teacher/create-quiz` - Create new quiz
- `/teacher/edit-quiz/[id]` - Edit quiz
- `/teacher/quiz/[id]` - View quiz details

### Student
- `/student/dashboard` - Main dashboard
- `/student/quiz/[id]` - Take quiz
- `/student/results/[id]` - View results

---

## 🎨 Key Components

```typescript
// UI Components
<Button variant="default|outline|ghost" size="sm|lg" />
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
<Input type="text|email|password" />

// Theme
<ThemeToggle /> // Dark/light mode toggle

// Icons (lucide-react)
<BookOpen />
<Users />
<Clock />
<Trophy />
```

---

## 🔧 Utility Functions

```typescript
// lib/utils.ts
generateSecretKey()              // Create QZ-XXXXXX key
formatDate(dateString)           // Format date nicely
formatTime(seconds)              // Format timer (MM:SS)
calculatePercentage(score, total) // Get percentage
exportToCSV(data, filename)      // Export to CSV
cn(...classes)                   // Merge class names
```

---

## 📊 Supabase Queries (Examples)

```typescript
// Get user profile
const { data } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single();

// Create quiz
await supabase
  .from("quizzes")
  .insert({ title, secret_key, teacher_id });

// Get quiz by secret key
const { data } = await supabase
  .from("quizzes")
  .select("*")
  .eq("secret_key", key)
  .single();

// Get student attempts
const { data } = await supabase
  .from("attempts")
  .select("*, quizzes(title)")
  .eq("student_id", studentId);
```

---

## 🎯 Common Tasks

### Add New Page
1. Create file in `app/your-route/page.tsx`
2. Export default function component
3. Add "use client" if using state/effects

### Add New Component
1. Create file in `components/your-component.tsx`
2. Export function component
3. Import where needed

### Update Styles
- Global: Edit `app/globals.css`
- Component: Use Tailwind classes
- Theme: Edit `tailwind.config.ts`

### Database Changes
1. Update `supabase-schema.sql`
2. Run in Supabase SQL Editor
3. Update TypeScript types in `lib/supabase.ts`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Use different port: `npm run dev -- -p 3001` |
| Module not found | Run `npm install` |
| Build fails | Check TypeScript errors: `npm run build` |
| Auth not working | Check .env.local and Supabase RLS |
| Database error | Verify schema is deployed |
| Styles not working | Restart dev server |

---

## 🔒 Security Checklist

- [ ] .env.local in .gitignore
- [ ] Supabase RLS policies enabled
- [ ] Environment variables in Vercel
- [ ] Test auth flows
- [ ] Verify role-based access

---

## 📱 Testing Checklist

### Teacher Flow
- [ ] Signup as teacher
- [ ] Create quiz
- [ ] Add questions
- [ ] Publish quiz
- [ ] View dashboard
- [ ] Export results

### Student Flow
- [ ] Signup as student
- [ ] Enter secret key
- [ ] Take quiz
- [ ] Submit quiz
- [ ] View results
- [ ] Check history

### UI
- [ ] Dark mode toggle works
- [ ] Mobile responsive
- [ ] Forms validate
- [ ] Errors show properly

---

## 🚀 Deployment Quick Steps

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# Go to vercel.com → Import Project

# 3. Add Environment Variables
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Deploy!
# Vercel auto-builds and deploys
```

---

## 📞 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## 💡 Pro Tips

1. **Use TypeScript autocomplete** - Press `Ctrl+Space` for suggestions
2. **Hot reload** - Dev server auto-refreshes on save
3. **Check console** - Browser DevTools (F12) for errors
4. **Test incrementally** - Test features as you build
5. **Read error messages** - They usually tell you what's wrong!

---

## 🎨 Color Palette (Quick Reference)

```css
Blue (Primary):   #2563eb  → text-blue-600, bg-blue-600
Purple (Student): #9333ea  → text-purple-600, bg-purple-600
Green (Success):  #16a34a  → text-green-600, bg-green-600
Red (Error):      #dc2626  → text-red-600, bg-red-600
Yellow (Warning): #ca8a04  → text-yellow-600, bg-yellow-600
Gray (Neutral):   #6b7280  → text-gray-500, bg-gray-500
```

---

## 📏 Tailwind Spacing

```css
p-4  = 1rem (16px)
p-6  = 1.5rem (24px)
p-8  = 2rem (32px)
gap-4 = 1rem between items
space-y-4 = vertical spacing
```

---

## 🎯 Secret Key Format

```
Format: QZ-XXXXXX
Example: QZ-ABC123
Length: 9 characters
Characters: A-Z, 0-9
```

---

## ⏱️ Timer Format

```typescript
15 minutes = 900 seconds
Display as: 15:00, 14:59, 14:58...
Auto-submit at 00:00
```

---

## 📊 Score Calculation

```typescript
Score = Correct Answers / Total Questions
Percentage = (Score / Total) × 100
Passing = 60% or higher
```

---

## 🔄 Development Workflow

```
1. Make changes
2. Save file (auto-reloads)
3. Check browser
4. Fix errors if any
5. Test feature
6. Commit changes
7. Push to GitHub
8. Auto-deploys (if Vercel connected)
```

---

## 📝 File Organization

```
app/          → Pages
components/   → Reusable UI
lib/          → Utilities
public/       → Static files (images, etc.)
```

---

## 🎓 Learning Path

1. ✅ Setup project
2. ✅ Understand routing (app/)
3. ✅ Learn components
4. ✅ Study database queries
5. ✅ Explore auth flow
6. ✅ Customize UI
7. ✅ Deploy to production

---

## ⚙️ Configuration Files

```
next.config.js     → Next.js settings
tailwind.config.ts → Tailwind customization
tsconfig.json      → TypeScript rules
.env.local         → Environment secrets
package.json       → Dependencies
```

---

## 🎉 You're All Set!

**Print this card or keep it handy for quick reference!**

Most common need? Check the:
- 🚀 Commands section
- 🐛 Troubleshooting table
- 📊 Supabase queries

---

**Happy Coding! 💻✨**
