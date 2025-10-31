# 🚀 Quick Setup Guide - AI Features

This guide will help you set up the new AI features in QuizFlow.

## Prerequisites

- Node.js installed
- Supabase project set up
- Project cloned and dependencies installed

## Step-by-Step Setup

### 1️⃣ Update Database Schema

You need to add the new columns to your existing database.

**Option A: For New Installations**

If you haven't created your database yet:

1. Open Supabase SQL Editor
2. Run the entire `supabase-schema.sql` file

**Option B: For Existing Installations**

If you already have a database with quizzes:

1. Open Supabase SQL Editor
2. Run the `migration-add-quiz-columns.sql` file
3. This will safely add the missing columns

```sql
-- Quick check to see if migration is needed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'quizzes' 
AND column_name IN ('access_type', 'price_cents');
```

If you don't see both columns, run the migration.

### 2️⃣ Install Dependencies

The new packages should already be installed, but if not:

```bash
npm install @google/generative-ai katex react-katex @types/react-katex
```

### 3️⃣ Set Up Environment Variables

1. **Create `.env.local` file** in the project root:

```bash
# Copy the example file
cp .env.local.example .env.local
```

2. **Edit `.env.local`** with your values:

```env
# Supabase (get from: https://app.supabase.com/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# AI API Key (already provided)
NEXT_PUBLIC_VERTEX_AI_API_KEY=AIzaSyBb8RN6IWjC-SzpwHG_35IWbSjWJhdYtYE6trYtPy1WJE9JKXGA
```

**Important:** The Vertex AI API key is already set as a fallback in the code, but it's better to configure it properly in `.env.local`.

### 4️⃣ Restart Development Server

```bash
npm run dev
```

### 5️⃣ Test the Features

1. **Login as a teacher** (or create a teacher account)
2. **Navigate to "Create Quiz"**
3. **Click "AI Assistant"** button
4. **Try generating questions:**
   - Type: "Create 3 math questions about algebra"
   - Click Send or press Enter
5. **Click "Math Keyboard"** button
6. **Test inserting math symbols:**
   - Click on a question field
   - Click any symbol from the keyboard
   - Verify it inserts correctly

## Verification Checklist

- [ ] Database has `access_type` and `price_cents` columns
- [ ] `.env.local` file exists with all variables
- [ ] Development server starts without errors
- [ ] Can open Create Quiz page
- [ ] AI Assistant button appears
- [ ] Math Keyboard button appears
- [ ] Can generate questions with AI
- [ ] Can insert math symbols
- [ ] Math equations render properly (show as formatted math, not plain text)

## Troubleshooting

### "Could not find the 'access_type' column" Error

**Solution:** Run the migration SQL:

1. Go to Supabase Dashboard
2. Open SQL Editor
3. Create a new query
4. Paste contents of `migration-add-quiz-columns.sql`
5. Run it
6. Refresh your app

### "Failed to generate quiz" Error

**Possible causes:**
- API key not set or invalid
- No internet connection
- API rate limit exceeded

**Solutions:**
1. Check `.env.local` has the API key
2. Restart dev server: `npm run dev`
3. Check browser console for detailed error
4. Wait a few minutes if rate limited

### Math symbols not showing

**Solutions:**
1. Make sure katex CSS is loaded
2. Check browser console for errors
3. Clear browser cache
4. Verify expressions use $ delimiters: `$x^2$`

### AI Assistant not responding

**Solutions:**
1. Check internet connection
2. Verify API key in `.env.local`
3. Look for errors in browser console
4. Try simpler prompts first

## Features at a Glance

### 🤖 AI Quiz Assistant
- **What:** Automatically generates quiz questions
- **How:** Natural language requests like "Create 5 math questions"
- **Where:** Create Quiz page, click "AI Assistant" button

### ⌨️ Math Keyboard
- **What:** Virtual keyboard with math symbols
- **How:** Click symbols to insert LaTeX code
- **Where:** Create Quiz page, click "Math Keyboard" button

### 📐 Math Rendering
- **What:** Beautiful math equation display
- **How:** Use $ for inline: `$x^2$`, $$ for display: `$$\int x dx$$`
- **Where:** Automatically renders in questions and answers

## Quick Test Commands

```bash
# Check if dependencies are installed
npm list @google/generative-ai
npm list katex

# Verify environment file exists
cat .env.local

# Check database columns (run in Supabase SQL Editor)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quizzes';

# Start dev server
npm run dev
```

## Next Steps

Once everything is working:

1. 📖 Read `AI-FEATURES.md` for detailed usage guide
2. 🎨 Explore the Math Keyboard categories
3. 🤖 Try different AI prompts
4. 📝 Create your first AI-powered quiz!
5. ✨ Customize and extend the features as needed

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error messages in browser console
3. Verify all setup steps were completed
4. Check the documentation files:
   - `ENV-SETUP.md` - Environment variables
   - `AI-FEATURES.md` - Feature usage guide
   - `PROJECT-STRUCTURE.md` - Code organization

## File Reference

**New Files Created:**
- `lib/vertex-ai.ts` - AI service
- `components/ai-assistant.tsx` - AI chat interface
- `components/math-keyboard.tsx` - Virtual math keyboard
- `components/math-text.tsx` - Math rendering component
- `migration-add-quiz-columns.sql` - Database migration
- `ENV-SETUP.md` - Environment setup guide
- `AI-FEATURES.md` - Features documentation

**Modified Files:**
- `app/teacher/create-quiz/page.tsx` - Added AI features
- `supabase-schema.sql` - Updated schema
- `package.json` - Added new dependencies

**Configuration Files:**
- `.env.local.example` - Example environment file
- `.env.local` - Your actual config (create this)

---

**Ready to go! 🎉 Happy quiz creating!**
