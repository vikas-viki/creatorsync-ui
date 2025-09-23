import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Upload, Video, Image, Check } from 'lucide-react';
import { SERVER_URL } from '../../lib/constants';
import { VideoRequestData, VideoUploadStatus } from '../../lib/chatStoreTypes';
import { useChatStore } from '../../stores/chatStore';

interface UploadProgress {
    video: number;
    thumbnail: number;
    status: 'idle' | 'uploading' | 'completed' | 'error';
}

interface VideoUploadProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoRequest: VideoRequestData;
    videoTitle: string;
    chatId: string
}

const VideoUploadProgressModal: React.FC<VideoUploadProgressModalProps> = ({
    isOpen,
    onClose,
    videoRequest,
    chatId,
    videoTitle
}) => {
    const [progress, setProgress] = useState<UploadProgress>({
        video: 0,
        thumbnail: 0,
        status: 'idle'
    });
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const { retryVideoRequestUpload } = useChatStore();


    useEffect(() => {
        if (!isOpen || !videoRequest) return;

        if (videoRequest.status == "ERROR") {
            setProgress({
                video: 0,
                thumbnail: 0,
                status: "idle"
            });
            return;
        }

        if (videoRequest.uploadStatus == VideoUploadStatus.THUMBNAIL_UPDATED) {
            setProgress({
                video: 100,
                thumbnail: 100,
                status: "completed"
            });
            return;
        } else if (videoRequest.uploadStatus == VideoUploadStatus.VIDEO_UPLOADED) {
            setProgress({
                video: 100,
                thumbnail: 0,
                status: "uploading"
            });
        }

        // Initialize SSE connection
        const sse = new EventSource(`${SERVER_URL}/chat/message/video-request/${videoRequest.id}/progress`, { withCredentials: true });
        setEventSource(sse);

        sse.onopen = () => {
            setProgress(prev => ({ ...prev, status: 'uploading' }));
        };

        sse.onmessage = (event) => {
            try {
                const data = event.data;

                let videoProgress = 0;
                let thumbnailProgress = 0;

                // JSON format: {"video": 75, "thumbnail": 30}
                try {
                    const parsed = JSON.parse(data);
                    videoProgress = parsed.video || 0;
                    thumbnailProgress = parsed.thumbnail || 0;
                } catch {
                    console.warn('Unable to parse SSE data:', data);
                }


                setProgress({
                    video: Math.min(100, Math.max(0, videoProgress)),
                    thumbnail: Math.min(100, Math.max(0, thumbnailProgress)),
                    status: (videoProgress === 100 && thumbnailProgress === 100) ? 'completed' : 'uploading'
                });
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        sse.onerror = (error) => {
            console.error('SSE error:', error);
            setProgress(prev => ({ ...prev, status: 'error' }));
        };

        return () => {
            sse.close();
            setEventSource(null);
        };
    }, [isOpen, videoRequest]);

    const handleClose = () => {
        if (eventSource) {
            eventSource.close();
            setEventSource(null);
        }
        setProgress({ video: 0, thumbnail: 0, status: 'idle' });
        onClose();
    };

    const handleRetry = () => {
        retryVideoRequestUpload(chatId, videoRequest.id);
        if (eventSource) {
            eventSource.close();
            setEventSource(null);
        }
        setProgress({ video: 0, thumbnail: 0, status: 'idle' });
        onClose();
    }

    if (!isOpen) return null;

    // Calculate checkpoint states
    const checkpoints = [
        {
            id: 'upload_start',
            label: 'Upload Started',
            icon: Upload,
            completed: progress.status !== 'idle'
        },
        {
            id: 'video_uploading',
            label: 'Video Uploading',
            icon: Video,
            completed: progress.video === 100,
            progress: progress.video
        },
        {
            id: 'thumbnail_uploading',
            label: 'Thumbnail Uploading',
            icon: Image,
            completed: progress.thumbnail === 100,
            progress: progress.thumbnail
        },
        {
            id: 'upload_complete',
            label: 'Upload Complete',
            icon: Check,
            completed: progress.status === 'completed'
        }
    ];

    const getProgressBetweenCheckpoints = (fromIndex: number, toIndex: number) => {
        if (fromIndex >= checkpoints.length - 1) return 0;

        const fromCheckpoint = checkpoints[fromIndex];

        if (fromCheckpoint.completed) return 100;
        if (fromIndex === 1 && toIndex === 2) return progress.video; // Video to thumbnail
        if (fromIndex === 2 && toIndex === 3) return progress.thumbnail; // Thumbnail to complete
        if (fromIndex === 0 && toIndex === 1) return progress.video > 0 ? 100 : 0; // Start to video

        return 0;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upload Progress
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {videoTitle.slice(0, 30)} {videoTitle.length > 30 && "..."}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            {progress.status === 'completed'
                                ? 'Successfully uploaded to YouTube!'
                                : progress.status === 'error'
                                    ? 'Upload encountered an error'
                                    : 'Uploading to YouTube...'}
                        </p>
                    </div>

                    <div className="relative">
                        <div className="flex justify-between items-center pb-5">
                            {checkpoints.map((checkpoint, index) => {
                                const IconComponent = checkpoint.icon;
                                const isCompleted = checkpoint.completed;
                                const isActive = !isCompleted && (
                                    (index === 1 && progress.video > 0) ||
                                    (index === 2 && progress.video === 100 && progress.thumbnail > 0)
                                );

                                return (
                                    <div key={checkpoint.id} className="flex flex-col items-center relative z-10">
                                        <div className={`w-12 ${index == 0 && "left-[-10px]"} ${index == 3 && "left-[15px]"} relative h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : isActive
                                                ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                                                : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                            }`}>
                                            {isCompleted ? (
                                                <CheckCircle className={`w-6 h-6`} />
                                            ) : (
                                                <IconComponent className={`w-6 h-6 `} />
                                            )}
                                        </div>

                                        <span className={`text-sm font-medium mt-2 text-center transition-colors duration-300 ${isCompleted
                                            ? 'text-green-600 dark:text-green-400'
                                            : isActive
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {checkpoint.label}
                                        </span>

                                        <span className={`text-xs mt-1 font-mono transition-colors duration-300 ${isCompleted
                                            ? 'text-green-600 dark:text-green-400'
                                            : isActive
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-400 dark:text-gray-500'
                                            }`}>
                                            {checkpoint.progress != undefined ? `${checkpoint.progress}%` : "."}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="absolute top-6 left-6 right-6 h-1 -z-0">
                            <div className="relative h-full">
                                {checkpoints.slice(0, -1).map((_, index) => {
                                    const progressPercent = getProgressBetweenCheckpoints(index, index + 1);

                                    return (
                                        <div
                                            key={index}
                                            className="absolute h-full bg-gray-200 dark:bg-gray-700"
                                            style={{
                                                left: `${(index / (checkpoints.length - 1)) * 100}%`,
                                                width: `${100 / (checkpoints.length - 1)}%`
                                            }}
                                        >
                                            <div
                                                className="h-full bg-green-500 transition-all duration-500 ease-out"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium text-gray-900 dark:text-white">Video Upload</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${progress.video}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-12">
                                    {progress.video}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Image className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="font-medium text-gray-900 dark:text-white">Thumbnail Upload</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                    <div
                                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${progress.thumbnail}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-12">
                                    {progress.thumbnail}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {progress.status === 'completed' && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <p className="text-green-800 dark:text-green-200 font-medium">
                                    Video successfully uploaded to YouTube!
                                </p>
                            </div>
                        </div>
                    )}

                    {progress.status === 'error' || videoRequest.status === "ERROR" && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <p className="text-red-800 dark:text-red-200 font-medium">
                                    {videoRequest.errorReason ?? "Upload failed. Please try again or contact support."}
                                </p>
                            </div>
                        </div>
                    )}
                    {progress.status === 'error' || videoRequest.status === "ERROR" ? (
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleRetry}
                                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                            >
                                {progress.status === 'completed' ? 'Done' : 'Close'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoUploadProgressModal;