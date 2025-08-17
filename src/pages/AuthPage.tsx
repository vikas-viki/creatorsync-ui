import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chrome, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { UserType } from '../lib/types';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuthStore();

  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'signin';

  const [selectedRole, setSelectedRole] = useState<UserType>(UserType.CREATOR);

  const HandleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userData = {
        accessToken: tokenResponse.access_token,
        type: selectedRole
      };

      let success = false;

      if (mode == 'signin') {
        success = await login(userData);
      } else {
        success = await signup(userData);
      }

      if (success)
        navigate('/dashboard');
    },
    onError: (errorResponse) => {
      console.log("error: ", errorResponse);
      toast.error(`Error ${mode}, try again!`);
    }
  });

  return (
    <div className="min-h-screen font-poppins flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        {/* Auth Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === 'signup' ? 'Join CreatorSync' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {mode === 'signup'
                ? 'Create your account to start collaborating'
                : 'Sign in to continue your collaboration'
              }
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedRole(UserType.CREATOR)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${selectedRole === UserType.CREATOR
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Creator</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  I create YouTube content
                </div>
              </button>
              <button
                onClick={() => setSelectedRole(UserType.EDITOR)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${selectedRole === UserType.EDITOR
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Editor</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  I edit videos for creators
                </div>
              </button>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={() => HandleGoogleAuth()}
            className="w-full flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200 font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Chrome className="w-5 h-5 mr-3 text-blue-600" />
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'signup' ? 'Already have an account?' : 'New to CreatorSync?'}
              <button
                onClick={() => navigate(mode === 'signup' ? '/auth?mode=signin' : '/auth?mode=signup')}
                className="ml-1 text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;