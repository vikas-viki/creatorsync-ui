import { create } from 'zustand';
import { axiosErrorHandler } from '../lib/helpers';
import { api } from '../lib/clients';
import { ActiveChat, AddChatResponse, Chat, GetAllChatsResponse, Message, SignedUrlResponse, User, UserType, VideoRequest, VideoRequestResponse, VideoRequestStatus } from '../lib/chatStoreTypes';
import toast from 'react-hot-toast';

export interface ChatStore {
  user: User | null;
  chats: Chat[];
  totalMessages: Record<string, number>, // total messages in each chat (chatId=>Count)
  messages: Record<string, Message[]>,
  activeChat: ActiveChat | null;
  setUserData: (username: string, userId: string, type: UserType, isYoutubeConnected: boolean) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chatId: string) => Promise<void>;
  getAllChats: () => Promise<void>;
  mediaMessage: (contentType: string, chatId: string, url: string) => Promise<SignedUrlResponse | undefined>;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chat: ActiveChat | null) => void;
  addTextMessage: (chatId: string, message: string) => Promise<void>;
  addVideoRequest: (chatId: string, request: VideoRequest) => Promise<VideoRequestResponse | undefined>;
  approveVideoRequest: (chatId: string, videoRequestId: string) => Promise<void>;
  retryVideoRequestUpload: (chatId: string, videoRequestId: string) => Promise<void>;
  getOlderMessages: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  user: null,
  totalMessages: {},
  setChats: (chats) => {
    set({ chats });
  },
  setUserData: (username, userId, type, isYoutubeConnected) => {
    set({
      user: {
        userId, username, type, isYoutubeConnected
      }
    })
  },
  activeChat: null,
  getOlderMessages: axiosErrorHandler(async (chatId) => {
    const state = get();
    const currentMessages = state.messages[chatId]?.length || 0;
    const totalMessages = state.totalMessages[chatId];

    if (totalMessages - currentMessages > 0) {
      const res = await api.get(`/chat/${chatId}?skip=${currentMessages}`);
      const messages = (res.data.messages as Message[]).reverse();
      const fetchedTotalMessages = res.data.totalMessages;

      set({
        messages: {
          ...state.messages,
          [chatId]: [...messages, ...(state.messages[chatId] || [])]
        },
        totalMessages: {
          ...state.totalMessages,
          [chatId]: fetchedTotalMessages
        }
      });
    }
  }, "Error getting messages", ""),
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
    await api.delete(`/chat/${chatId}`);
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
      const res = await api.get(`/chat/${chat.id}?skip=0`);
      const data = (res.data.messages as Message[]).reverse();
      const totalMessages = res.data.totalMessages;

      newMessages[chat.id] = data;
      set({
        messages: newMessages, totalMessages: {
          ...state.totalMessages,
          [chat.id]: totalMessages
        }
      });
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

  addVideoRequest: axiosErrorHandler(async (chatId, request) => {
    const state = get();

    const message: Message = {
      id: Date.now().toString(),
      content: `Video Request: ${request.title}`,
      senderId: state.user!.userId,
      createdAt: new Date(),
      type: 'video_request',
      videoRequest: request
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...state.messages[chatId], message]
      }
    }))

    const resopnse = await api.post("/chat/message/video-request", {
      title: request.title,
      description: request.description,
      chatId,
      thumbnailType: request.thumbnailType,
      videoType: request.videoType
    });

    const data = resopnse.data as VideoRequestResponse;
    toast.loading("Uploading media files, please wait!", { duration: 1000 });
    return data;
  }, "Couldn't create a video request, please try again!", ""),

  approveVideoRequest: axiosErrorHandler(async (chatId: string, videoRequestId: string) => {
    await api.post(`/chat/message/video-request/${videoRequestId}/approve`, {
      chatId, videoRequestId
    });
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].map((m) =>
          m.videoRequest && m.videoRequest.id === videoRequestId
            ? {
              ...m,
              videoRequest: {
                ...m.videoRequest,
                status: VideoRequestStatus.APPROVED,
              },
            }
            : m
        ),
      },
    }));

  }, "Couldn't approve video request, please try again later", "Video upload started, will be live soon!"),

  retryVideoRequestUpload: axiosErrorHandler(async (chatId: string, videoRequestId: string) => {
    await api.post(`/chat/message/video-request/${videoRequestId}/retry`);
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].map((m) =>
          m.videoRequest && m.videoRequest.id === videoRequestId
            ? {
              ...m,
              videoRequest: {
                ...m.videoRequest,
                status: VideoRequestStatus.APPROVED,
              },
            }
            : m
        ),
      },
    }));

  }, "Couldn't retry upload, please try again later", "Video upload started, will be live soon!")
}));