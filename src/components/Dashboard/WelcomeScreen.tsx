import React from 'react';
import { MessageCircle, Users, Video } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const WelcomeScreen: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to CreatorSync, {user?.name}!
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {user?.role === 'creator' 
            ? 'Select a chat from the sidebar to start collaborating with your editors, or add a new editor to get started.'
            : 'Select a chat from the sidebar to start collaborating with creators on their video projects.'
          }
        </p>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Users className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Collaborate Seamlessly</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Chat and share files with your team</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Video className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Video Requests</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user?.role === 'creator' 
                  ? 'Review and approve video submissions'
                  : 'Create and submit video requests'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;