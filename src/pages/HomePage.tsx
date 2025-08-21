import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Shield, Zap, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen font-poppins">
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">CreatorSync</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mt-5 text-gray-900 dark:text-white mb-6 leading-tight">
            Bridge the Trust Gap Between
            <span className="text-primary-600 dark:text-primary-400 block mt-2">
              Creators & Editors
            </span>
          </h2>
          <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Seamlessly collaborate on YouTube videos with built-in approval workflows,
            direct YouTube uploads, and transparent communication tools.
          </p>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-bounce-gentle"
          >
            Get Started
            <Play className="ml-2 w-5 h-5" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-20 h-20 text-white mb-4 mx-auto opacity-80" />
                <p className="text-white text-lg font-medium">Demo Video Coming Soon</p>
                <p className="text-gray-300 text-sm mt-2">See how CreatorSync transforms collaboration</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="mt-32">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Why Choose CreatorSync?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Trust & Security</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Built-in approval workflows ensure creators maintain full control over their content before publication.
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Direct YouTube Upload</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Approved videos are automatically uploaded to YouTube, streamlining your publishing workflow.
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Seamless Collaboration</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                WhatsApp-like interface makes communication between creators and editors effortless and intuitive.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;