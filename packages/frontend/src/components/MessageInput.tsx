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
        className="flex-1 p-3 rounded-full bg-dark-secondary border border-neon-blue/20 text-light-gray placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
        disabled={isLoading}
      />
      <button
        type="button"
        className="p-3 rounded-full bg-dark-secondary hover:bg-dark-secondary/80 transition-colors border border-neon-blue/20"
      >
        <MicrophoneIcon className="w-6 h-6 text-neon-blue" />
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="p-3 rounded-full bg-neon-blue hover:bg-neon-blue/80 transition-colors disabled:opacity-50 disabled:hover:bg-neon-blue text-black"
      >
        <PaperAirplaneIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default MessageInput;
