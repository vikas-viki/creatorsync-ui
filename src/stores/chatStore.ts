import { create } from 'zustand';
import { axiosErrorHandler } from '../lib/helpers';
import { api } from '../lib/clients';
import { ActiveChat, AddChatResponse, Chat, GetAllChatsResponse, Message, User, UserType, VideoRequest } from '../lib/chatStoreTypes';

export interface ChatStore {
  user: User | null;
  chats: Chat[];
  messages: Record<string, Message[]>,
  activeChat: ActiveChat | null;
  setUserData: (username: string, userId: string, type: UserType) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chatId: string) => Promise<void>;
  getAllChats: () => Promise<void>;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chatId: ActiveChat | null) => void;
  addMessage: (chat: ActiveChat, message: Message) => void;
  addVideoRequest: (chatId: string, request: VideoRequest) => void;
  updateVideoRequestStatus: (chatId: string, requestId: string, status: VideoRequest['status']) => void;
  updateVideoRequest: (chatId: string, requestId: string, updates: Partial<VideoRequest>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  user: null,
  setChats: (chats) => {
    set({ chats });
  },
  setUserData: (username, userId, type) => {
    set({
      user: {
        userId, username, type
      }
    })
  },
  activeChat: null,
  getAllChats: axiosErrorHandler(async () => {
    const chats = await api.get("/chat/all");
    const data = chats.data as GetAllChatsResponse;
    set(
      {
        chats: [
          ...data.map(d => ({
            id: d.id,
            creatorId: d.creator.id,
            editorId: d.editor.id,
            creatorName: d.creator.username,
            editorName: d.editor.username
          }))
        ]
      }
    )
  }, "Error getting chats", "") as () => Promise<void>,

  addChat: axiosErrorHandler(async (editorId: string) => {
    const response = await api.post("/chat", { editorId });
    const data = response.data as AddChatResponse;
    set((state) => ({
      chats: [...state.chats, {
        id: data.chatId,
        editorId,
        editorName: data.editorName,
        creatorId: state.user!.userId,
        creatorName: state.user!.username,
        messages: []
      }]
    }))
  }, "Error adding new chat.", "Chat created successfully!") as (editorId: string) => Promise<void>,

  deleteChat: axiosErrorHandler(async (chatId) => {
    await api.delete(`/chat?id=${chatId}`);
    set((state) => ({
      chats: state.chats.filter(chat => chat.id !== chatId),
      activeChat: state.activeChat === chatId ? null : state.activeChat
    }))
  }),
  setActiveChat: (chat) => {
    if (chat) {
      const state = get();
      const newMessages = state.messages;
      newMessages[chat.id] = [];
      set({ messages: newMessages })
    }
    set({ activeChat: chat })
  },
  addMessage: (chatId, message) => {
    console.log("New message added", chatId, message)
  },
  addVideoRequest: (chatId, request) => {
    const message: Message = {
      id: Date.now().toString(),
      content: `Video Request: ${request.title}`,
      senderId: request.createdBy,
      senderName: '',
      timestamp: new Date(),
      type: 'video-request',
      videoRequest: request
    };
    console.log(message, chatId)
  },
  updateVideoRequestStatus: (chatId, requestId, status) => {
    console.log(chatId, requestId, status);
  },
  updateVideoRequest: (chatId, requestId, updates) => {
    console.log(chatId, requestId, updates);
  }
}));