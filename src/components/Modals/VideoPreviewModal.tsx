import React from 'react';
import { X, Calendar, User } from 'lucide-react';
import { VideoRequestData } from '../../lib/chatStoreTypes';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoRequest: VideoRequestData | null;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ isOpen, onClose, videoRequest }) => {
  if (!isOpen || !videoRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Video Preview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="aspect-video bg-black rounded-lg mb-6 overflow-hidden">
            <video
              src={videoRequest.video}
              controls
              className="w-full h-full"
              poster={videoRequest.thumbnail}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {videoRequest.title}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(videoRequest.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Created by Editor</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Description
              </h5>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {videoRequest.description}
              </p>
            </div>

            {videoRequest.thumbnail && (
              <div>
                <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Thumbnail
                </h5>
                <img
                  src={videoRequest.thumbnail}
                  alt="Video thumbnail"
                  className="max-w-xs h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;