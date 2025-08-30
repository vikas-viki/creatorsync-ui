/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import CreateVideoRequestModal from '../Modals/CreateVideoRequestModal';
import VideoPreviewModal from '../Modals/VideoPreviewModal';
import ApproveVideoModal from '../Modals/ApproveVideoModal';
import toast from 'react-hot-toast';
import axios, { isAxiosError } from 'axios';
import VideoUploadProgressModal from '../Modals/VideoUploadProgressModal';
import VideoRequestCard from './VideoRequestCard';
import { VideoRequestData } from '../../lib/chatStoreTypes';
import MessageCard from './MessageCard';

const ChatWindow: React.FC = () => {
  const { activeChat, addTextMessage, messages, mediaMessage } = useChatStore();
  const { user } = useChatStore();
  const [messageText, setMessageText] = useState('');
  const [showCreateVideoRequest, setShowCreateVideoRequest] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedVideoRequest, setSelectedVideoRequest] = useState<VideoRequestData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeChat || !user) return null;

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    await addTextMessage(activeChat.id, messageText.trim());
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isVideo || isImage) {
        if (file.size > 10000000) { // 10Mil
          toast.error("Max file size is 10MB, create feature request for more!");
          return;
        }

        const formData = new FormData();
        const url = URL.createObjectURL(file);
        const data = await mediaMessage(file.type, activeChat.id, url);

        if (!data) return;

        Object.entries(data.fields).forEach(([k, v]) => formData.append(k, v));
        formData.append('file', file);
        formData.append("Content-Type", file.type);

        await axios.post(data.url, formData);
      }
    } catch (e) {
      if (isAxiosError(e)) {
        toast.error(e.message);
      } else {
        toast.error("Error uploading media");
      }
      console.log(e);
    }
    e.target.value = "";
  };

  const otherUserName = user.type.toLowerCase() === 'creator' ? activeChat.editorName : activeChat.creatorName;

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{otherUserName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.type.toLowerCase() === 'creator' ? 'Video Editor' : 'Content Creator'}
            </p>
          </div>

          {user.type.toLowerCase() === 'editor' && (
            <button
              onClick={() => setShowCreateVideoRequest(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Video Request
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages[activeChat.id].length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  Start your conversation with {otherUserName}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {user.type.toLowerCase() === 'creator'
                    ? 'Share your video requirements and approve submissions'
                    : 'Create video requests and collaborate on content'
                  }
                </p>
              </div>
            </div>
          ) : (
            messages[activeChat.id].map((message) => {
              const isOwnMessage = message.senderId === user.userId;

              return (
                <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'video_request' && message.videoRequest ? (
                    <VideoRequestCard
                      message={message}
                      setSelectedVideoRequest={setSelectedVideoRequest}
                      setShowApproveModal={setShowApproveModal}
                      setShowVideoPreview={setShowVideoPreview}
                      setShowProgressModal={setShowProgressModal}
                    />
                  ) : (
                    <MessageCard message={message} />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative inline-block group">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="absolute bottom-full w-[190px] left-1/2 text-center -translate-x-1/2 mb-2 px-3 py-1 group-hover:opacity-100 opacity-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200
                        bg-gray-600 text-white text-sm rounded-md shadow-lg 
                        animate-fade-in">
                uploads will be auto sent, pick with caution.
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="hidden"
            />

            <div className="flex-1">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border outline-none border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={1}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <CreateVideoRequestModal
        isOpen={showCreateVideoRequest}
        onClose={() => setShowCreateVideoRequest(false)}
        chatId={activeChat.id}
      />

      <VideoPreviewModal
        isOpen={showVideoPreview}
        onClose={() => setShowVideoPreview(false)}
        videoRequest={selectedVideoRequest}
      />

      <ApproveVideoModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        videoRequest={selectedVideoRequest}
        chatId={activeChat.id}
      />



      <VideoUploadProgressModal
        chatId={activeChat.id}
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        videoRequest={selectedVideoRequest!}
        videoTitle={selectedVideoRequest?.title || ''}
      />
    </>
  );
};

export default ChatWindow;