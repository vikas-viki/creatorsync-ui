import { create } from 'zustand';
import { axiosErrorHandler } from '../lib/helpers';
import { api } from '../lib/clients';
import { ActiveChat, AddChatResponse, Chat, GetAllChatsResponse, Message, SignedUrlResponse, User, UserType, VideoRequest } from '../lib/chatStoreTypes';

export interface ChatStore {
  user: User | null;
  chats: Chat[];
  messages: Record<string, Message[]>,
  activeChat: ActiveChat | null;
  setUserData: (username: string, userId: string, type: UserType) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chatId: string) => Promise<void>;
  getAllChats: () => Promise<void>;
  mediaMessage: (contentType: string, chatId: string, url: string) => Promise<SignedUrlResponse | undefined>;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chatId: ActiveChat | null) => void;
  addTextMessage: (chatId: string, message: string) => Promise<void>;
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
  mediaMessage: axiosErrorHandler(
    async (contentType: string, chatId: string, url: string) => {
      const res = await api.post("/chat/message/media", { contentType, chatId });
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...state.messages[chatId], {
            createdAt: new Date(),
            id: "",
            content: url,
            senderId: state.user!.userId,
            type: contentType.startsWith("image") ? "image" : "video"
          }]
        }
      }))
      return res.data as SignedUrlResponse;
    },
    "Error uploading media",
    ""
  ),

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

  setActiveChat: axiosErrorHandler(async (chat) => {
    const state = get();
    if (chat && !state.messages[chat.id]) {
      const state = get();
      const newMessages = state.messages;
      const res = await api.get(`/chat?id=${chat.id}`);
      const data = (res.data as Message[]).reverse();
      newMessages[chat.id] = data;
      set({ messages: newMessages });
    }
    set({ activeChat: chat })
  }, "Error getting chats", ""),

  addTextMessage: axiosErrorHandler(async (chatId, message) => {
    await api.post("/chat/message/text", { chatId, data: message });
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...state.messages[chatId], {
          createdAt: new Date(),
          id: "",
          content: message,
          senderId: state.user!.userId,
          type: "text"
        }]
      }
    }))
  }, "Error sending message!", ""),

  addVideoRequest: (chatId, request) => {
    const message: Message = {
      id: Date.now().toString(),
      content: `Video Request: ${request.title}`,
      senderId: request.createdBy,
      createdAt: new Date(),
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