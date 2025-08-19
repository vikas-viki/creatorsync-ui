import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { Chat } from '../../lib/chatStoreTypes';

interface DeleteChatModalProps {
  isOpen: boolean;
  chat: Chat | null;
  onClose: () => void;
}

const DeleteChatModal: React.FC<DeleteChatModalProps> = ({ isOpen, chat, onClose }) => {
  const { deleteChat } = useChatStore();

  const handleDelete = () => {
    if (chat) {
      deleteChat(chat.id);
      onClose();
    }
  };

  if (!isOpen || !chat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete Chat
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                This action is irreversible
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Deleting this chat will permanently remove all messages, photos, videos and cannot be recovered.
                However, any youtube video uploads that have been made will remain as they are.
              </p>
              {/* <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Please inform the other user before making this change 
                  to prevent any unintended video conflicts in uploads to YouTube 
                  (e.g., creator clicks approve while editor is still changing the title).
                </p>
              </div> */}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;