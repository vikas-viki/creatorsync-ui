import { Play, BarChart3 } from 'lucide-react';
import React from 'react';
import { Message, VideoRequestData, VideoRequestStatus } from '../../lib/chatStoreTypes';
import { useChatStore } from '../../stores/chatStore';
import { formatTime } from '../../lib/helpers';

interface VideoRequestProps {
    message: Message;
    setSelectedVideoRequest: React.Dispatch<React.SetStateAction<VideoRequestData | null>>;
    setShowApproveModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
    setShowProgressModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoRequestCard = ({
    message,
    setSelectedVideoRequest,
    setShowApproveModal,
    setShowVideoPreview,
    setShowProgressModal
}: VideoRequestProps) => {
    const { user } = useChatStore();

    if (!message.videoRequest || !user) return null;


    const handleVideoRequestAction = (action: 'approve' | 'changes', request: VideoRequestData) => {
        setSelectedVideoRequest(request);
        if (action === 'approve') {
            setShowApproveModal(true);
        } else {
            console.log('Request changes for:', request);
        }
    };

    return (
        <div
            className={`
                w-full max-w-sm overflow-hidden rounded-2xl dark:shadow-lg
                bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700
                flex flex-col
            `}
        >
            <div className="relative h-28 bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex items-center space-x-2 text-white">
                    <Play className="w-6 h-6" />
                    <span className="font-semibold text-lg">Video Request</span>
                </div>
            </div>

            <div className="p-4 pb-0 flex flex-col space-y-3">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {message.videoRequest.title.slice(0, 30)}{message.videoRequest.title.length > 30 && "..."}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                        {message.videoRequest.description.slice(0, 30)}{message.videoRequest.description.length > 30 && "..."}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    <button
                        onClick={() => {
                            setSelectedVideoRequest(message.videoRequest!);
                            setShowVideoPreview(true);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-300 dark:hover:bg-gray-400 rounded-lg text-sm font-medium transition-colors"
                    >
                        Preview
                    </button>

                    {message.videoRequest.status === "APPROVED" && (
                        <button
                            onClick={() => {
                                setSelectedVideoRequest(message.videoRequest!);
                                setShowProgressModal(true);
                            }}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Progress</span>
                        </button>
                    )}

                    {user.type.toLowerCase() === 'creator' &&
                        message.videoRequest.status === VideoRequestStatus.PENDING && (
                            <button
                                onClick={() => handleVideoRequestAction('approve', message.videoRequest!)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Approve
                            </button>
                        )}
                </div>
            </div>

            <div className="px-4 pb-2 text-xs text-right text-gray-500 dark:text-gray-400">
                {formatTime(message.createdAt)}
            </div>
        </div>
    );
};

export default VideoRequestCard;
