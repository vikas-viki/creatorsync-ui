import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Shield, Zap, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [videoPlayed, setVideoPlayed] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description:
        'Built-in approval workflows ensure creators maintain full control over their content before publication.',
    },
    {
      icon: Zap,
      title: 'Direct YouTube Upload',
      description:
        'Approved videos are automatically uploaded to YouTube, streamlining your publishing workflow.',
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description:
        'WhatsApp-like interface makes communication between creators and editors effortless and intuitive.',
    },
  ];

  return (
    <div className="min-h-screen font-poppins bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              CreatorSync
            </h1>
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

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-24">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-6">
            The Workspace for YouTube
            <span className="text-primary-600 dark:text-primary-400 block mt-2 sm:mt-3">
              Creators & Editors
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Seamlessly collaborate on YouTube videos with built-in approval workflows, direct YouTube uploads, and transparent communication tools.
          </p>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary-600/90 hover:bg-primary-700/90 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-bounce-gentle"
          >
            Get Started
            <Play className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>

        {/* Demo Video */}
        <div className="max-w-4xl mx-auto animate-slide-up mb-32 sm:mb-40">
          <div className="relative rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 w-[900px] h-auto min-h-[500px] flex items-center justify-center overflow-hidden shadow-2xl bg-gray-900">
            {
              videoPlayed ? (
                <video autoPlay muted controls loop className=''>
                  <source src="https://d2lj6kahabpkaf.cloudfront.net/creatorsync/creator-sync.mp4" type="video/mp4" />
                </video>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoPlayed(true);
                  }}
                  className=" flex items-center cursor-pointer justify-center">
                  <div className="text-center">
                    <Play className="w-16 sm:w-20 h-16 sm:h-20 text-white mb-4 mx-auto opacity-80" />
                    <p className="text-gray-300 text-xs sm:text-sm mt-1 sm:mt-2">
                      See how CreatorSync transforms collaboration
                    </p>
                  </div>
                </div>
              )
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div >

        {/* Features */}
        < div >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 sm:mb-16">
            Why Choose CreatorSync?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200/40 dark:border-gray-700/40 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center mb-4 sm:mb-5 transition-transform">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div >
      </main >
    </div >
  );
};

export default HomePage;
