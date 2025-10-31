# 🚀 QuizFlow - Deployment Guide

## Deploy to Vercel (Recommended - FREE)

Vercel is the easiest way to deploy Next.js applications. It's free for personal projects!

---

## 📋 Prerequisites

Before deploying:
- ✅ Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Supabase project is set up and running
- ✅ You've tested the app locally

---

## 🔥 Step-by-Step Deployment

### Step 1: Push Code to GitHub

If you haven't already:

```powershell
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - QuizFlow"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/quizflow.git
git branch -M main
git push -u origin main
```

**⚠️ Important:** Make sure `.env.local` is in `.gitignore` (it already is!)

---

### Step 2: Create Vercel Account

1. Go to **https://vercel.com/**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

---

### Step 3: Import Your Project

1. In Vercel Dashboard, click **"Add New..." → "Project"**
2. Find your **quizflow** repository
3. Click **"Import"**

---

### Step 4: Configure Project

#### A. Framework Preset
- **Framework**: Next.js (should be auto-detected)
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

#### B. Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bqgsuexdjiihtysyaysr.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_actual_supabase_anon_key` |

**⚠️ CRITICAL:** Use your actual Supabase credentials!

To get them:
1. Go to your Supabase Dashboard
2. Settings → API
3. Copy Project URL and anon public key

---

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes while Vercel builds your app
3. ✅ Done! You'll get a live URL like: `https://quizflow-xyz.vercel.app`

---

## 🔄 Automatic Deployments

Every time you push to GitHub:
- Vercel automatically deploys the new version
- Production URL updates automatically
- Preview deployments for pull requests

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. In Vercel Dashboard, go to your project
2. Click **"Settings" → "Domains"**
3. Add your domain (e.g., `quizflow.com`)
4. Follow DNS configuration instructions
5. Vercel automatically handles HTTPS

---

## 🔒 Security Checklist

Before going live:

- [x] Environment variables set in Vercel (not in code)
- [x] `.env.local` is in `.gitignore`
- [x] Supabase RLS policies enabled
- [x] Test authentication flows
- [x] Test quiz creation/taking
- [x] Check all pages are accessible

---

## 📊 Post-Deployment Testing

Test these on your live URL:

1. **Landing Page**
   - Visit your Vercel URL
   - Check all links work

2. **Teacher Flow**
   - Sign up as teacher
   - Create a quiz
   - Publish it
   - Copy secret key

3. **Student Flow**
   - Sign up as student (use different email)
   - Enter secret key
   - Take quiz
   - Check results

4. **Mobile Testing**
   - Open on phone
   - Test all features
   - Check responsive design

---

## 🐛 Troubleshooting

### Build Failed
**Check:**
- TypeScript errors: `npm run build` locally
- Missing dependencies: `npm install`
- Review build logs in Vercel

### Environment Variables Not Working
**Fix:**
- Ensure they're prefixed with `NEXT_PUBLIC_`
- Re-deploy after adding variables
- Check spelling/spaces

### Database Connection Failed
**Fix:**
- Verify Supabase URL is correct
- Check anon key is valid
- Ensure Supabase project is active

### 404 Errors
**Fix:**
- Check file structure matches routes
- Ensure all pages are in `app/` directory
- Clear Vercel cache and redeploy

### Dark Mode Not Working
**Fix:**
- Check `next-themes` is installed
- Verify ThemeProvider in layout

---

## 📈 Performance Optimization

### Already Optimized:
- ✅ Static generation where possible
- ✅ Image optimization (Next.js built-in)
- ✅ Code splitting
- ✅ Automatic caching

### Optional Improvements:
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['bqgsuexdjiihtysyaysr.supabase.co'],
  },
  // Enable if you add images
}
```

---

## 📱 Alternative Deployment Options

### Netlify
1. Import from GitHub
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

### Self-Hosted (VPS/Cloud)
```bash
# Build locally
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "quizflow" -- start

# Use Nginx as reverse proxy
# Point to localhost:3000
```

---

## 🔄 Update Workflow

### Making Changes:

```bash
# Make your code changes
# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# Vercel auto-deploys! ✨
```

---

## 📊 Monitoring

### Vercel Analytics (Free)
1. Go to project settings
2. Enable Analytics
3. Track page views, performance

### Supabase Monitoring
1. Dashboard → Database
2. Monitor query performance
3. Check RLS policy usage

---

## 🆘 Support

### Getting Help:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

### Common Issues:
- Discord: Vercel Community
- GitHub: Create issues
- Stack Overflow: Tag with `nextjs`, `supabase`, `vercel`

---

## ✅ Post-Deployment Checklist

- [ ] App deployed successfully
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Quiz creation works
- [ ] Quiz taking works
- [ ] Results display correctly
- [ ] Dark mode toggles
- [ ] Mobile responsive
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

---

## 🎉 You're Live!

Your QuizFlow app is now live and accessible worldwide!

**Share your URL:**
- Send to teachers and students
- Add to your portfolio
- Share on social media

**Next Steps:**
- Monitor usage in Vercel Analytics
- Collect user feedback
- Iterate and improve

---

**Congratulations on deploying QuizFlow! 🚀✨**

Need help? Check the docs or reach out to the community.
