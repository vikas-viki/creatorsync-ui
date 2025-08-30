import { Message } from '../../lib/chatStoreTypes';
import { useChatStore } from '../../stores/chatStore';

const MessageCard = ({ message }: { message: Message }) => {
    const { user } = useChatStore();

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const isOwnMessage = message.senderId === user!.userId;

    return (
        <div
            className={`
                max-w-sm lg:max-w-md rounded-xl shadow-sm 
                ${message.type === 'video_request' ? 'bg-sky-300 text-black' : ''} 
                ${isOwnMessage
                    ? 'bg-sky-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }
                p-3 pb-0
            `}
        >
            <div className="block ">
                {message.type === 'image' || message.type === 'video' ? (
                    <div className="rounded-lg overflow-hidden">
                        {message.type === 'image' ? (
                            <img
                                src={message.content}
                                alt="Uploaded"
                                className="w-full h-auto object-cover"
                            />
                        ) : (
                            <video
                                src={message.content}
                                controls
                                className="w-full h-auto"
                            />
                        )}
                    </div>
                ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                )}

                <p
                    className={`text-xs pb-2 pt-1 text-right ${isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    {formatTime(message.createdAt)}
                </p>
            </div>
        </div>
    );
};

export default MessageCard;
