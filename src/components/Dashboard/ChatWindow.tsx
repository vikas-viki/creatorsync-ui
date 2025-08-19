import React, { useState, useRef } from 'react';
import { Send, Paperclip, Play } from 'lucide-react';
import { useChatStore, Message } from '../../stores/chatStore';
import CreateVideoRequestModal from '../Modals/CreateVideoRequestModal';
import VideoPreviewModal from '../Modals/VideoPreviewModal';
import ApproveVideoModal from '../Modals/ApproveVideoModal';

const ChatWindow: React.FC = () => {
  const { activeChat, addMessage } = useChatStore();
  const { user } = useChatStore();
  const [messageText, setMessageText] = useState('');
  const [showCreateVideoRequest, setShowCreateVideoRequest] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedVideoRequest, setSelectedVideoRequest] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeChat || !user) return null;

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      senderId: user.userId,
      senderName: user.username,
      timestamp: new Date(),
      type: 'text'
    };

    addMessage(activeChat.id, newMessage);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (isVideo || isImage) {
      const mediaUrl = URL.createObjectURL(file);
      const newMessage: Message = {
        id: Date.now().toString(),
        content: `${isVideo ? 'Video' : 'Image'}: ${file.name}`,
        senderId: user.userId,
        senderName: user.username,
        timestamp: new Date(),
        type: isVideo ? 'video' : 'image',
        mediaUrl
      };

      addMessage(activeChat.id, newMessage);
    }
  };

  const handleVideoRequestAction = (action: 'approve' | 'changes', request: any) => {
    setSelectedVideoRequest(request);
    if (action === 'approve') {
      setShowApproveModal(true);
    } else {
      // Handle request changes
      console.log('Request changes for:', request);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Video Request
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
          {activeChat.messages.length === 0 ? (
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
            activeChat.messages.map((message) => {
              const isOwnMessage = message.senderId === user.userId;

              return (
                <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}>
                    {message.type === 'video-request' && message.videoRequest ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Play className="w-5 h-5" />
                          <span className="font-medium">Video Request</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{message.videoRequest.title}</h4>
                          <p className="text-sm opacity-90 mt-1">{message.videoRequest.description}</p>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => {
                              setSelectedVideoRequest(message.videoRequest);
                              setShowVideoPreview(true);
                            }}
                            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
                          >
                            Preview
                          </button>

                          {user.type.toLowerCase() === 'creator' && message.videoRequest.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVideoRequestAction('approve', message.videoRequest)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleVideoRequestAction('changes', message.videoRequest)}
                                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition-colors"
                              >
                                Request Changes
                              </button>
                            </>
                          )}
                        </div>

                        {message.videoRequest.status !== 'pending' && (
                          <div className={`text-sm font-medium ${message.videoRequest.status === 'approved' ? 'text-green-200' : 'text-yellow-200'
                            }`}>
                            {message.videoRequest.status === 'approved' ? '✅ Approved' : '⏳ Changes Requested'}
                          </div>
                        )}
                      </div>
                    ) : message.type === 'image' || message.type === 'video' ? (
                      <div>
                        {message.type === 'image' ? (
                          <img
                            src={message.mediaUrl}
                            alt="Uploaded"
                            className="max-w-full h-auto rounded"
                          />
                        ) : (
                          <video
                            src={message.mediaUrl}
                            controls
                            className="max-w-full h-auto rounded"
                          />
                        )}
                        <p className="text-sm mt-2 opacity-90">{message.content}</p>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}

                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>

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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
    </>
  );
};

export default ChatWindow;