import React, { useState, useRef } from 'react';
import { X, Upload, Video } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';

interface CreateVideoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}

const CreateVideoRequestModal: React.FC<CreateVideoRequestModalProps> = ({ isOpen, onClose, chatId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { addVideoRequest } = useChatStore();
  const { user } = useChatStore();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !videoFile || !user) return;

    const videoRequest = {
      id: `vr_${Date.now()}`,
      title,
      description,
      videoUrl: URL.createObjectURL(videoFile),
      thumbnailUrl: thumbnailFile ? URL.createObjectURL(thumbnailFile) : '',
      status: 'pending' as const,
      createdAt: new Date(),
      createdBy: user.userId
    };

    addVideoRequest(chatId, videoRequest);

    // Reset form
    setTitle('');
    setDescription('');
    setVideoFile(null);
    setThumbnailFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create Video Request
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Important Note</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Videos in the chat will be auto-deleted after 7 days of uploading.
              The data you provide here will be used directly for YouTube video upload.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video File *
            </label>
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
            >
              {videoFile ? (
                <div className="space-y-2">
                  <Video className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{videoFile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload video</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">MP4, MOV, AVI up to 500MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={videoInputRef}
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              accept="video/*"
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail (Optional)
            </label>
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
            >
              {thumbnailFile ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Thumbnail preview"
                    className="w-24 h-16 object-cover mx-auto rounded"
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{thumbnailFile.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload thumbnail</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={thumbnailInputRef}
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim() || !videoFile}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Create Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVideoRequestModal;