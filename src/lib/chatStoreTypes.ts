export enum VideoRequestStatus {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    CHANGES_REQUESTED = "CHANGES_REQUESTED"
}

export interface VideoRequest {
    id: string;
    title: string;
    description: string;
    chatId: string;
    thumbnailType: string;
    videoType: string;
    thumbnailUrl: string;
    videoUrl: string;
    status: VideoRequestStatus,
    createdAt: Date
}

export enum UserType {
    CREATOR = "CREATOR",
    EDITOR = "EDITOR"
}

export type User = {
    userId: string,
    username: string,
    type: UserType,
    isYoutubeConnected: boolean
}

export type VideoRequestData = {
    id: string
    title: string,
    description: string,
    thumbnail: string,
    video: string,
    versions: number
    status: VideoRequestStatus;
    createdAt: Date
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    type: 'text' | 'image' | 'video' | 'video_request';
    videoRequest?: VideoRequestData;
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

export type VideoRequestResponse = { thumbnailSignedUrl: SignedUrlResponse, videoSignedUrl: SignedUrlResponse }