import React, { useState } from 'react';
import { MessageCircle, Plus, Settings, Sun, Moon, User, Copy, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import FeedbackModal from '../Modals/FeedbackModal';
import AddEditorModal from '../Modals/AddEditorModal';
import ConnectYouTubeModal from '../Modals/ConnectYouTubeModal';
import { useChatStore } from '../../stores/chatStore';
import toast from 'react-hot-toast';

const DashboardHeader: React.FC = () => {
  const { logout, youtubeConnected } = useAuthStore();
  const { user } = useChatStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAddEditorModal, setShowAddEditorModal] = useState(false);
  const [showConnectYouTubeModal, setShowConnectYouTubeModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleCopyEditorId = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId);
      toast.success("Id copied successfully.");
    }
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">CreatorSync</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Feedback & Feature Requests"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {user?.type.toLowerCase() === 'creator' && (
            <button
              onClick={() => setShowAddEditorModal(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Add Editor"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.type}</p>
                </div>

                {user?.type.toLowerCase() === 'editor' && user?.userId && (
                  <button
                    onClick={handleCopyEditorId}
                    className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <Copy className="w-4 h-4 mr-3" />
                    Copy Editor ID
                  </button>
                )}

                {user?.type.toLowerCase() === 'creator' && (
                  <button
                    onClick={() => {
                      if (!youtubeConnected) {
                        setShowConnectYouTubeModal(true);
                        setShowProfileMenu(false);
                      }
                    }}
                    className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {youtubeConnected ? (
                      <Check className="w-4 h-4 mr-3 stroke-green-600" />
                    ) : (
                      <Settings className="w-4 h-4 mr-3" />
                    )}
                    {youtubeConnected ? "Youtube connected" : "Connect YouTube"}
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
      <AddEditorModal isOpen={showAddEditorModal} onClose={() => setShowAddEditorModal(false)} />
      <ConnectYouTubeModal isOpen={showConnectYouTubeModal} onClose={() => setShowConnectYouTubeModal(false)} />
    </>
  );
};

export default DashboardHeader;