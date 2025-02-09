import React from "react";
import { Message } from "../types";
import ReactMarkdown from "react-markdown";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-end gap-2 ${
            message.role === "assistant" ? "justify-start" : "justify-end"
          }`}
        >
          {message.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-neon-blue flex items-center justify-center flex-shrink-0 mb-2">
              <span className="text-sm">🍳</span>
            </div>
          )}

          <div
            className={`group relative max-w-[80%] ${
              message.role === "assistant" ? "ml-2" : "mr-2"
            }`}
          >
            <div
              className={`p-4 rounded-2xl whitespace-pre-wrap break-words ${
                message.role === "assistant"
                  ? "bg-dark-secondary text-light-gray shadow-lg border border-neon-blue/20"
                  : "bg-gradient-to-br from-neon-blue to-neon-green text-black shadow-lg"
              }`}
            >
              {message.role === "assistant" && message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Health Tip Visualization"
                  className="w-full rounded-lg mb-3 shadow-md"
                />
              )}
              <ReactMarkdown
                className={`prose prose-sm max-w-none break-words ${
                  message.role === "assistant"
                    ? "prose-invert text-left prose-a:text-neon-blue hover:prose-a:text-neon-blue/80"
                    : "prose-p:text-white prose-white"
                }`}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Chat bubble pointer */}
            <div
              className={`absolute bottom-[6px] ${
                message.role === "assistant"
                  ? "left-[-6px] border-l-dark-secondary"
                  : "right-[-6px] border-r-neon-blue"
              } border-8 border-transparent`}
            />

            {/* Timestamp */}
            <div
              className={`text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                message.role === "assistant" ? "text-left" : "text-right"
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {message.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-neon-green/80 flex items-center justify-center flex-shrink-0 mb-2">
              <span className="text-sm">👤</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
