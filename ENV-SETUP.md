# Environment Variables Setup

This document describes all environment variables required for the QuizFlow application.

## Required Variables

### Supabase Configuration

These variables are required for database connectivity and authentication:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get these:**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### Vertex AI (Gemini) API Key

Required for AI-powered quiz generation features:

```env
NEXT_PUBLIC_VERTEX_AI_API_KEY=your_vertex_ai_api_key
```

**Current API Key (provided):**
```
AIzaSyBb8RN6IWjC-SzpwHG_35IWbSjWJhdYtYE6trYtPy1WJE9JKXGA
```

**How to get a new key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

**Note:** The API key is hardcoded as a fallback in `lib/vertex-ai.ts`, but it's recommended to set it in your `.env.local` file for security.

## Setup Instructions

1. Create a `.env.local` file in the root directory of the project:

```bash
# In the project root directory
touch .env.local
```

2. Add all the required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Vertex AI / Gemini
NEXT_PUBLIC_VERTEX_AI_API_KEY=AIzaSyBb8RN6IWjC-SzpwHG_35IWbSjWJhdYtYE6trYtPy1WJE9JKXGA
```

3. Restart your development server:

```bash
npm run dev
```

## Environment File Example

Here's a complete `.env.local` example:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vertex AI API Key for Quiz Generation
NEXT_PUBLIC_VERTEX_AI_API_KEY=AIzaSyBb8RN6IWjC-SzpwHG_35IWbSjWJhdYtYE6trYtPy1WJE9JKXGA
```

## Security Notes

- **Never commit `.env.local` to version control**
- The `.env.local` file is already listed in `.gitignore`
- For production deployments, set these variables in your hosting platform:
  - Vercel: Project Settings > Environment Variables
  - Netlify: Site Settings > Build & Deploy > Environment
  - Other platforms: Check their documentation

## Features Enabled by Environment Variables

### Vertex AI API Key
- ✨ AI-powered quiz generation
- 🤖 Natural language quiz creation
- 📝 Automatic question and answer generation
- 🎯 Smart topic-based quiz suggestions

### Supabase Keys
- 🔐 User authentication (login/signup)
- 💾 Database operations (CRUD)
- 🔒 Row-level security policies
- 👥 User profile management

## Troubleshooting

### "Failed to generate quiz" Error
- Check that `NEXT_PUBLIC_VERTEX_AI_API_KEY` is set correctly
- Verify the API key is valid and has not exceeded quota
- Check browser console for detailed error messages

### Database Connection Errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches your project
- Check that your Supabase project is active

### Environment Variables Not Loading
- Make sure the file is named exactly `.env.local`
- Restart the development server after making changes
- Verify the file is in the root directory (same level as `package.json`)

## API Usage Limits

### Google Vertex AI (Gemini)
- Free tier: 60 requests per minute
- Rate limits may apply based on your account type
- Monitor usage in [Google Cloud Console](https://console.cloud.google.com)

### Supabase
- Free tier limits vary by plan
- Monitor usage in your Supabase dashboard
- Consider upgrading for production use

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Google AI Studio](https://makersuite.google.com)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
