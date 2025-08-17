import React from 'react';
import { X, Youtube, Check } from 'lucide-react';
import { useChatStore, VideoRequest } from '../../stores/chatStore';

interface ApproveVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoRequest: VideoRequest | null;
  chatId: string;
}

const ApproveVideoModal: React.FC<ApproveVideoModalProps> = ({ isOpen, onClose, videoRequest, chatId }) => {
  const { updateVideoRequestStatus } = useChatStore();

  const handleApprove = () => {
    if (videoRequest) {
      updateVideoRequestStatus(chatId, videoRequest.id, 'approved');
      
      // Log video upload data (you'll handle this later)
      console.log('Video approved for YouTube upload:', {
        title: videoRequest.title,
        description: videoRequest.description,
        videoUrl: videoRequest.videoUrl,
        thumbnailUrl: videoRequest.thumbnailUrl,
        chatId,
        requestId: videoRequest.id
      });
      
      onClose();
    }
  };

  if (!isOpen || !videoRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Approve Video
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
              Upload to YouTube
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This video will be directly uploaded to your YouTube channel with the following details:
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Title:</span>
              <p className="text-gray-900 dark:text-white">{videoRequest.title}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</span>
              <p className="text-gray-900 dark:text-white line-clamp-3">{videoRequest.description}</p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Are you sure you want to proceed?
              </p>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              This action cannot be undone once the upload begins.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveVideoModal;