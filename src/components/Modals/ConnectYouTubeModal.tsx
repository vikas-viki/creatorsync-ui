import React from 'react';
import { X, Youtube } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useGoogleLogin } from '@react-oauth/google';

interface ConnectYouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectYouTubeModal: React.FC<ConnectYouTubeModalProps> = ({ isOpen, onClose }) => {
  // const { connectYouTube } = useAuthStore();

  const HandleGoogleYouTubeAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

      console.log("YouTube access token:", tokenResponse.access_token);
    },
    onError: (errorResponse) => {
      console.log("error: ", errorResponse);
    },
    scope: "https://www.googleapis.com/auth/youtube.upload",
    prompt: "consent"
  });


  const handleConnect = async () => {
    // await connectYouTube();
    HandleGoogleYouTubeAuth()
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connect YouTube
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <Youtube className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Connect Your YouTube Channel
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your YouTube account to enable direct video uploads when you approve video requests.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What happens when you connect?</h5>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Approved videos will be uploaded automatically</li>
              <li>• You maintain full control over your content</li>
              <li>• Secure OAuth 2.0 authentication</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Youtube className="w-4 h-4" />
              <span>Connect YouTube</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectYouTubeModal;