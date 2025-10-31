# 🚀 QuizFlow - Quick Setup Guide

## ⚡ Quick Start (5 Minutes)

### 1. Install Node.js (First Time Only)
**Download & Install Node.js from:** https://nodejs.org/
- Choose the LTS version
- Run the installer
- Accept all defaults

Verify installation in PowerShell:
```powershell
node --version
npm --version
```

---

### 2. Install Project Dependencies
Open PowerShell in the project folder and run:

```powershell
cd c:\Users\Hp\testcrush
npm install
```

This will install all required packages (takes 2-3 minutes).

---

### 3. Setup Supabase Database

#### A. Get Your Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Create a new project (or use existing)
3. Wait for project to finish setting up
4. Go to: **Settings → API**
5. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string)

#### B. Update Environment File
Open `.env.local` and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bqgsuexdjiihtysyaysr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here_paste_the_long_key
```

#### C. Create Database Tables
1. In Supabase Dashboard, go to: **SQL Editor**
2. Click "New Query"
3. Open the `supabase-schema.sql` file in this project
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click "Run" button

✅ Your database is now ready!

---

### 4. Run the Application

```powershell
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## 🎯 First Steps

### Test the Application:

1. **Create Teacher Account**
   - Go to http://localhost:3000
   - Click "Get Started" → "I'm a Teacher"
   - Fill in details and sign up

2. **Create Your First Quiz**
   - Click "Create New Quiz"
   - Add title: "Sample Quiz"
   - Add questions with multiple choices
   - Mark correct answers
   - Save

3. **Copy the Secret Key**
   - You'll see something like: `QZ-ABC123`
   - This is how students join

4. **Publish the Quiz**
   - Click "Publish" button

5. **Test as Student**
   - Open a new incognito/private window
   - Sign up as Student
   - Enter the secret key
   - Take the quiz!

---

## 📝 Common Commands

```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

---

## ❌ Troubleshooting

### "npx is not recognized"
→ Node.js not installed. Download from nodejs.org

### "Cannot find module"
→ Run: `npm install`

### "Supabase connection failed"
→ Check your .env.local file has correct URL and Key

### Page shows errors
→ Make sure you ran the SQL schema in Supabase

### Port 3000 already in use
→ Stop other apps or use: `npm run dev -- -p 3001`

---

## 🆘 Need Help?

1. Check the full README.md
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify all setup steps completed

---

## 🎉 You're Ready!

QuizFlow is now running! Start creating amazing quizzes.

**Next Steps:**
- Customize the theme in `tailwind.config.ts`
- Add more features to suit your needs
- Deploy to Vercel for production use

---

**Happy Coding! 💻✨**
