import React, { useState } from "react";
import { PaperAirplaneIcon, MicrophoneIcon } from "@heroicons/react/24/solid";

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about food, recipes, or nutrition..."
        className="flex-1 p-3 rounded-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        disabled={isLoading}
      />
      <button
        type="button"
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors border border-gray-600"
      >
        <MicrophoneIcon className="w-6 h-6 text-gray-300" />
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="p-3 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:hover:bg-orange-600"
      >
        <PaperAirplaneIcon className="w-6 h-6 text-white" />
      </button>
    </form>
  );
};

export default MessageInput;
