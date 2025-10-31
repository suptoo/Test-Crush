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
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuizFlow
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/auth/login"
              className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-3 py-1 sm:px-6 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-10 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
            Smart Online Quiz Builder
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4 animate-slide-in">
            Create engaging quizzes, track student progress in real-time, and
            analyze performance with powerful analytics. Perfect for teachers
            and students.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 animate-bounce-in">
            <Link
              href="/auth/signup?role=teacher"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm sm:text-base"
            >
              I&apos;m a Teacher
            </Link>
            <Link
              href="/auth/signup?role=student"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm sm:text-base"
            >
              I&apos;m a Student
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 px-4">
          <FeatureCard
            icon={<BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />}
            title="Easy Quiz Creation"
            description="Build quizzes with multiple-choice questions in minutes"
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />}
            title="Secret Key Access"
            description="Students join using secure secret keys, not links"
          />
          <FeatureCard
            icon={<Clock className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600" />}
            title="Real-time Tracking"
            description="Monitor quiz participation and progress live"
          />
          <FeatureCard
            icon={<BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />}
            title="Powerful Analytics"
            description="Detailed insights and performance reports"
          />
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center px-4">
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">10,000+</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Quizzes Created</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">50,000+</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Active Students</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600">98%</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
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
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
      <div className="mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
