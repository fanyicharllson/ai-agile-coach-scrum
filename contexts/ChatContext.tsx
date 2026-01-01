"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Message } from "@/types";

interface ChatContextType {
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  isSending: boolean;
  setIsSending: (sending: boolean) => void;
  hasOptimisticMessages: boolean;
  setHasOptimisticMessages: (has: boolean) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [hasOptimisticMessages, setHasOptimisticMessages] = useState(false);

  // Clear chat helper function
  const clearChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setHasOptimisticMessages(false);
    setIsSending(false);
  };

  // Debug: Log when session changes (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("ChatContext - Session changed:", currentSessionId);
    }
  }, [currentSessionId]);

  return (
    <ChatContext.Provider
      value={{
        currentSessionId,
        setCurrentSessionId,
        messages,
        setMessages,
        isSending,
        setIsSending,
        hasOptimisticMessages,
        setHasOptimisticMessages,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
