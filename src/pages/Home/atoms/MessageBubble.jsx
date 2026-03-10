// MessageBubble.tsx
import React from 'react';

// Simple time formatter (you can replace with date-fns / dayjs)
const shortTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};



export const MessageBubble = ({ message, isOwnMessage }) => {
  const senderName = typeof message.sender === 'string' 
    ? message.sender 
    : message.sender?.name || 'Unknown';

  return (
    <div
      className={`
        flex flex-col max-w-[76%] mx-2 my-1.5
        ${isOwnMessage ? 'self-end items-end' : 'self-start items-start'}
      `}
    >
      {/* Sender name - usually shown only for others in group chats */}
      {!isOwnMessage && senderName !== 'me' && (
        <span className="text-xs text-gray-500 mb-1 pl-3">
          {senderName}
        </span>
      )}

      {/* Bubble */}
      <div
        className={`
          px-3.5 py-2.5 rounded-2xl text-[15px] leading-relaxed
          shadow-sm break-words
          ${isOwnMessage 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'}
        `}
      >
        {message.content}
      </div>

      {/* Time + seen status */}
      <div
        className={`
          flex items-center gap-1.5 mt-1 px-1
          text-xs text-gray-500
          ${isOwnMessage ? 'justify-end' : 'justify-start'}
        `}
      >
        <span>{shortTime(message.timestamp)}</span>
        
        {isOwnMessage && message.seen && (
          <span className="text-blue-400">✓✓</span>
        )}
      </div>
    </div>
  );
};
