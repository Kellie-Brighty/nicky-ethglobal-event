import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { VoiceInput } from "./VoiceInput";

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(transcript);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type your message..."}
          className="w-full px-4 py-2 rounded-lg bg-dark-secondary/50 border border-neon-blue/20 focus:border-neon-blue/50 text-light-gray placeholder-gray-500 transition-colors"
          disabled={isLoading || isListening}
        />
      </div>

      <VoiceInput
        onTranscript={handleVoiceTranscript}
        isListening={isListening}
        setIsListening={setIsListening}
      />

      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="p-2 rounded-full bg-dark-secondary hover:bg-neon-blue/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PaperAirplaneIcon className="w-6 h-6 text-neon-blue" />
      </button>
    </form>
  );
};

export default MessageInput;
