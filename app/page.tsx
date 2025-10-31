import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, BarChart3, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuizFlow
            </span>
          </div>
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
            Smart Online Quiz Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-in">
            Create engaging quizzes, track student progress in real-time, and
            analyze performance with powerful analytics. Perfect for teachers
            and students.
          </p>
          <div className="flex justify-center space-x-4 animate-bounce-in">
            <Link
              href="/auth/signup?role=teacher"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              I&apos;m a Teacher
            </Link>
            <Link
              href="/auth/signup?role=student"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              I&apos;m a Student
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-blue-600" />}
            title="Easy Quiz Creation"
            description="Build quizzes with multiple-choice questions in minutes"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-purple-600" />}
            title="Secret Key Access"
            description="Students join using secure secret keys, not links"
          />
          <FeatureCard
            icon={<Clock className="w-12 h-12 text-pink-600" />}
            title="Real-time Tracking"
            description="Monitor quiz participation and progress live"
          />
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12 text-indigo-600" />}
            title="Powerful Analytics"
            description="Detailed insights and performance reports"
          />
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">10,000+</div>
            <div className="text-gray-600 dark:text-gray-400">Quizzes Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">50,000+</div>
            <div className="text-gray-600 dark:text-gray-400">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-600">98%</div>
            <div className="text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 QuizFlow. Built with Next.js, Supabase & ❤️</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
