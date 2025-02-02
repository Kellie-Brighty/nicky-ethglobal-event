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
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mb-2">
              <span className="text-sm">🍳</span>
            </div>
          )}

          <div
            className={`group relative max-w-[80%] ${
              message.role === "assistant" ? "ml-2" : "mr-2"
            }`}
          >
            <div
              className={`p-4 rounded-2xl ${
                message.role === "assistant"
                  ? "bg-gray-800 dark:bg-gray-700 text-gray-100 shadow-lg border border-gray-700/50"
                  : "bg-gradient-to-br from-orange-500 to-rose-500 text-[#fff] shadow-lg"
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
                className={`prose prose-sm max-w-none ${
                  message.role === "assistant"
                    ? "prose-invert text-left"
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
                  ? "left-[-6px] border-l-gray-800 dark:border-l-gray-700"
                  : "right-[-6px] border-r-orange-500"
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
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mb-2">
              <span className="text-sm">👤</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
