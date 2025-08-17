import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';

interface AddEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEditorModal: React.FC<AddEditorModalProps> = ({ isOpen, onClose }) => {
  const [editorId, setEditorId] = useState('');
  const { addChat } = useChatStore();
  const { user } = useAuthStore();

  const handleAddEditor = () => {
    if (!editorId.trim() || !user) return;

    // Simulate adding an editor
    const newChat = {
      id: `chat_${Date.now()}`,
      creatorId: user.id,
      editorId: editorId,
      creatorName: user.name,
      editorName: `Editor_${editorId}`, // In real app, fetch from server
      messages: []
    };

    addChat(newChat);
    setEditorId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Editor
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Editor ID
            </label>
            <input
              type="text"
              value={editorId}
              onChange={(e) => setEditorId(e.target.value)}
              placeholder="Enter the editor's ID"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Ask your editor for their unique Editor ID to connect with them.
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
              onClick={handleAddEditor}
              disabled={!editorId.trim()}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditorModal;