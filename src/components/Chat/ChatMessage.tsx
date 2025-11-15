import React from 'react';
import type { Message } from '../../stores/useChatStore';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`group relative max-w-[85%] sm:max-w-[75%] ${isUser ? 'ml-8' : 'mr-8'}`}>
        {/* Message bubble */}
        <div
          className={`
            relative px-4 py-3 rounded-2xl shadow-lg transition-all duration-200
            ${isUser 
              ? 'bg-primary text-primary-foreground rounded-br-sm' 
              : 'bg-card border border-border text-card-foreground rounded-bl-sm'
            }
          `}
        >
          {/* Message tail */}
          <div
            className={`
              absolute bottom-0 w-4 h-4
              ${isUser 
                ? 'right-0 translate-x-1 bg-primary' 
                : 'left-0 -translate-x-1 bg-card border-l border-b border-border'
              }
            `}
            style={{
              clipPath: isUser 
                ? 'polygon(100% 0, 100% 100%, 0 100%)' 
                : 'polygon(0 0, 0 100%, 100% 100%)'
            }}
          />
          
          {/* Image if present */}
          {message.imageUrl && (
            <img 
              src={message.imageUrl} 
              alt="Uploaded" 
              className="max-w-full rounded-lg mb-2 shadow-md"
              loading="lazy"
            />
          )}
          
          {/* Message text */}
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {/* Timestamp */}
          <span className={`
            text-xs opacity-60 mt-1 block
            ${isUser ? 'text-primary-foreground' : 'text-muted-foreground'}
          `}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
