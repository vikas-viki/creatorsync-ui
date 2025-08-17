import { create } from 'zustand';

export interface VideoRequest {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: 'pending' | 'approved' | 'changes-requested';
  createdAt: Date;
  createdBy: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'video-request';
  videoRequest?: VideoRequest;
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  creatorId: string;
  editorId: string;
  creatorName: string;
  editorName: string;
  messages: Message[];
  lastMessage?: Message;
}

interface ChatStore {
  chats: Chat[];
  activeChat: Chat | null;
  addChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  addVideoRequest: (chatId: string, request: VideoRequest) => void;
  updateVideoRequestStatus: (chatId: string, requestId: string, status: VideoRequest['status']) => void;
  updateVideoRequest: (chatId: string, requestId: string, updates: Partial<VideoRequest>) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  activeChat: null,
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  deleteChat: (chatId) => set((state) => ({
    chats: state.chats.filter(chat => chat.id !== chatId),
    activeChat: state.activeChat?.id === chatId ? null : state.activeChat
  })),
  setActiveChat: (chat) => set({ activeChat: chat }),
  addMessage: (chatId, message) => set((state) => ({
    chats: state.chats.map(chat =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, message], lastMessage: message }
        : chat
    ),
    activeChat: state.activeChat?.id === chatId
      ? { ...state.activeChat, messages: [...state.activeChat.messages, message], lastMessage: message }
      : state.activeChat
  })),
  addVideoRequest: (chatId, request) => set((state) => {
    const message: Message = {
      id: Date.now().toString(),
      content: `Video Request: ${request.title}`,
      senderId: request.createdBy,
      senderName: '',
      timestamp: new Date(),
      type: 'video-request',
      videoRequest: request
    };
    return {
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message], lastMessage: message }
          : chat
      ),
      activeChat: state.activeChat?.id === chatId
        ? { ...state.activeChat, messages: [...state.activeChat.messages, message], lastMessage: message }
        : state.activeChat
    };
  }),
  updateVideoRequestStatus: (chatId, requestId, status) => set((state) => ({
    chats: state.chats.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            messages: chat.messages.map(message =>
              message.videoRequest?.id === requestId
                ? { ...message, videoRequest: { ...message.videoRequest, status } }
                : message
            )
          }
        : chat
    ),
    activeChat: state.activeChat?.id === chatId
      ? {
          ...state.activeChat,
          messages: state.activeChat.messages.map(message =>
            message.videoRequest?.id === requestId
              ? { ...message, videoRequest: { ...message.videoRequest, status } }
              : message
          )
        }
      : state.activeChat
  })),
  updateVideoRequest: (chatId, requestId, updates) => set((state) => ({
    chats: state.chats.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            messages: chat.messages.map(message =>
              message.videoRequest?.id === requestId
                ? { ...message, videoRequest: { ...message.videoRequest, ...updates } }
                : message
            )
          }
        : chat
    ),
    activeChat: state.activeChat?.id === chatId
      ? {
          ...state.activeChat,
          messages: state.activeChat.messages.map(message =>
            message.videoRequest?.id === requestId
              ? { ...message, videoRequest: { ...message.videoRequest, ...updates } }
              : message
          )
        }
      : state.activeChat
  }))
}));