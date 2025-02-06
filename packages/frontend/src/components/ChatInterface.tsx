import { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { getOrCreateThread } from "../utils/threadManager";
import { createAndManageRun } from "../utils/runManager";
import { createAssistant } from "../openai_folder/createAssistant";
import { ThreadManager } from "../utils/threadManager";

// Add this type for message storage
interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: number;
  imageUrl?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing thread messages on mount
  useEffect(() => {
    async function loadExistingThread() {
      const threadId = ThreadManager.getCurrentThreadId();
      if (threadId) {
        setIsTyping(true);
        try {
          const thread = await client.beta.threads.retrieve(threadId);
          const messages = await client.beta.threads.messages.list(thread.id);

          setMessages(
            messages.data
              .slice()
              .reverse()
              .map((msg) => ({
                role: msg.role,
                content:
                  msg.content[0].type === "text"
                    ? msg.content[0].text.value
                    : "Image message",
                id: msg.id,
                timestamp: new Date(msg.created_at * 1000).getTime(),
                imageUrl:
                  msg.content[0].type === "image_file"
                    ? msg.content[0].image_file.file_id
                    : undefined,
              }))
          );
        } catch (error) {
          console.error("Error loading thread:", error);
          ThreadManager.clearCurrentThread();
        }
        setIsTyping(false);
      } else {
        setMessages([
          {
            role: "assistant",
            content:
              "Hello! I'm your personal food assistant. How can I help you today?",
            id: "welcome",
            timestamp: Date.now(),
          },
        ]);
      }
    }

    loadExistingThread();
  }, []);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
        id: Date.now().toString(),
        timestamp: Date.now(),
      },
    ]);

    setIsLoading(true);
    setIsTyping(true);

    try {
      // If message contains image generation request
      if (
        message.toLowerCase().includes("generate image") ||
        message.toLowerCase().includes("create image")
      ) {
        const response = await client.images.generate({
          model: "dall-e-3",
          prompt: message,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        // Store the image URL from DALL-E
        const imageUrl = response.data[0].url;

        // Add assistant response with image
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Here's your generated image:",
            id: (Date.now() + 1).toString(),
            timestamp: Date.now(),
            imageUrl: imageUrl,
          },
        ]);
      } else {
        const assistant = await createAssistant(client);
        const thread = await getOrCreateThread(client, message);
        const aiResponse = await createAndManageRun(
          client,
          thread,
          assistant.id
        );

        let content = "";
        let imageUrl = undefined;

        if (typeof aiResponse === "object" && "tip" in aiResponse) {
          content = aiResponse.tip;
          imageUrl = aiResponse.imageUrl;
        } else {
          content = aiResponse;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content,
            id: Date.now().toString(),
            imageUrl,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Messages area with padding for header and input */}
      <div className="absolute inset-x-0 top-0 bottom-[76px] overflow-y-auto overscroll-none z-[50]">
        <div className="px-4 py-6 min-h-full">
          {/* Add extra padding at top to prevent content hiding under header */}
          <div className="pt-2">
            <ChatMessages messages={messages} />
            {isTyping && (
              <div className="flex items-center space-x-2 p-4">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed input area */}
      <div className="fixed bottom-0 left-0 right-0 lg:absolute border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 p-4 z-[50]">
        <MessageInput onSend={handleSend} isLoading={isLoading || isTyping} />
      </div>
    </div>
  );
};

export default ChatInterface;
