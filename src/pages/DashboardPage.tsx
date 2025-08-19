import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import ChatSidebar from '../components/Dashboard/ChatSidebar';
import ChatWindow from '../components/Dashboard/ChatWindow';
import WelcomeScreen from '../components/Dashboard/WelcomeScreen';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { activeChat, setActiveChat, chats, getAllChats } = useChatStore();

  const searchParams = new URLSearchParams(location.search);
  const chatId = searchParams.get('chat');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (chatId) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setActiveChat({ id: chat.id, editorName: chat.editorName, creatorName: chat.creatorName });
      }
    } else {
      setActiveChat(null);
    }
  }, [isAuthenticated, navigate, chatId, chats, setActiveChat]);

  useEffect(() => {
    if (isAuthenticated)
      getAllChats();
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null;
  }


  return (
    <div className="h-screen flex flex-col font-poppins bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          <ChatSidebar />
        </div>

        <div className="flex-1 flex flex-col">
          {activeChat ? <ChatWindow /> : <WelcomeScreen />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;