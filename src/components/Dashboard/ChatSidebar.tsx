import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore, Chat } from '../../stores/chatStore';
import DeleteChatModal from '../Modals/DeleteChatModal';

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { chats, activeChat, setActiveChat } = useChatStore();
  const { user } = useChatStore();
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  const handleChatClick = (chat: Chat) => {
    setActiveChat(chat);
    navigate(`/dashboard?chat=${chat.id}`);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <div className="h-full bg-white dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {user?.type.toLowerCase() === 'creator'
                  ? 'No editors connected yet. Click + to add an editor.'
                  : 'No chats available. Wait for creators to add you.'
                }
              </p>
            </div>
          ) : (
            chats.map((chat) => {
              const otherUserName = user?.type.toLowerCase() === 'creator' ? chat.editorName : chat.creatorName;
              return (
                <div
                  key={chat.id}
                  className={`flex items-center p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : ''
                    }`}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {otherUserName}
                      </p>
                      <div className="flex items-center space-x-2">
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(chat.lastMessage.timestamp)}
                          </span>
                        )}
                        <div className="relative group">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatToDelete(chat);
                            }}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                        {chat.lastMessage.type === 'video-request'
                          ? '📹 Video Request'
                          : chat.lastMessage.content
                        }
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <DeleteChatModal
        isOpen={!!chatToDelete}
        chat={chatToDelete}
        onClose={() => setChatToDelete(null)}
      />
    </>
  );
};

export default ChatSidebar;