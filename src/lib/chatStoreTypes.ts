
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

export enum UserType {
    CREATOR = "CREATOR",
    EDITOR = "EDITOR"
}

export type User = {
    userId: string,
    username: string,
    type: UserType
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
    lastMessage?: Message;
}

export type AddChatResponse = {
    chatId: string,
    editorName: string,
    message: string
}

export type GetAllChatsResponse = {
    updatedAt: Date,
    id: string,
    editor: {
        id: string, username: string
    },
    creator: {
        id: string, username: string
    }
}[]

export type ActiveChat = {
    id: string,
    creatorName: string,
    editorName: string
}

export type SignedUrlResponse = {
    url: string,
    fields: Record<string, string>
}