export enum VideoRequestStatus {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    ERROR = "ERROR"
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

export enum VideoUploadStatus {
    NOT_APPROVED = "NOT_APPROVED",
    UPLOAD_STARTED = "UPLOAD_STARTED",
    VIDEO_UPLOADED = "VIDEO_UPLOADED",
    THUMBNAIL_UPDATED = "THUMBNAIL_UPDATED",
}

export type VideoRequestData = {
    id: string
    title: string,
    description: string,
    thumbnail: string,
    video: string,
    versions: number
    status: VideoRequestStatus;
    createdAt: Date;
    uploadStatus: VideoUploadStatus,
    errorReason: string
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