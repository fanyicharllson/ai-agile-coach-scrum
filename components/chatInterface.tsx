"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import type { Message } from "@/types";
import { ChatInput } from "./chatinput";
import { EmptyState } from "./emptyState";
import { Header } from "./header";
import { LoadingIndicator } from "./loadingIndicator";
import { MessageBubble } from "./messagebubble";
import { Sidebar } from "./sidebar";
import {
  useSendMessage,
  useCreateSession,
  useSessionMessages,
} from "@/hooks/useChat";

interface ChatInterfaceProps {
  sessionId?: string;
}

export function ChatInterface({ sessionId }: ChatInterfaceProps = {}) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useSendMessage();
  const createSessionMutation = useCreateSession();

  // Fetch messages for the current session
  const { data: sessionMessages, isLoading: isLoadingMessages } =
    useSessionMessages(currentSessionId);

  // Mock current session data
  const currentSession = {
    id: currentSessionId || "1",
    title: "Agile Coaching Session",
    category: "Sprint Planning" as const,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Sync URL param with state
  useEffect(() => {
    if (sessionId && sessionId !== currentSessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId]);

  // Load messages when session is selected
  useEffect(() => {
    if (sessionMessages) {
      setMessages(sessionMessages);
    }
  }, [sessionMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessageMutation.isPending]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="flex flex-col space-y-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <h1 className="text-3xl text-zinc-800 dark:text-zinc-200">
            AgileMentor AI!
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Just a sec please...
          </p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isSignedIn || !user) {
    toast.error("Authentication required", {
      description: "Please sign in to continue",
    });
    return null;
  }

  const handleSendMessage = async (content: string) => {
    // Validate content
    if (!content.trim()) {
      toast.error("Empty message", {
        description: "Please enter a message",
      });
      return;
    }

    // Check authentication
    if (!user?.id) {
      toast.error("Authentication required", {
        description: "Please sign in to send messages",
      });
      return;
    }

    // Add user message to UI immediately for instant feedback
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      // Create session if it doesn't exist (lazy creation)
      let sessionId = currentSessionId;
      if (!sessionId) {
        const newSession = await createSessionMutation.mutateAsync({});
        sessionId = newSession.id;
        setCurrentSessionId(sessionId);
        // Navigate to the new session URL
        router.push(`/ai-chat/${sessionId}`);
      }

      // Send to API
      const response = await sendMessageMutation.mutateAsync({
        sessionId: sessionId,
        message: content,
      });

      // Add assistant message from API response
      const assistantMessage: Message = {
        id: response.messageId,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove the optimistic user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

      // Show error toast with details
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to send message", {
        description: errorMessage.includes("fetch")
          ? "Network error. Please check your connection."
          : errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      setMessages((prev) => prev.slice(0, messageIndex));
      // Resend with new content
      handleSendMessage(newContent);
    }
  };

  const handleResendMessage = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      handleSendMessage(message.content);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    // Navigate to base /ai-chat route
    router.push("/ai-chat");
    // Session will be created lazily when user sends first message
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#050505] overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentSessionId={currentSessionId}
        onSessionSelect={(sessionId) => router.push(`/ai-chat/${sessionId}`)}
        onNewChat={startNewChat}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header
          sessionTitle={currentSession.title}
          sessionCategory={currentSession.category}
          onNewChat={startNewChat}
          isOpen={sidebarOpen}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Loading messages...
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <EmptyState onSuggestionClick={handleSuggestionClick} />
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onEdit={handleEditMessage}
                    onResend={handleResendMessage}
                  />
                ))}

                {sendMessageMutation.isPending && <LoadingIndicator />}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={isSending}
          placeholder="Ask your Agile Coach..."
        />
      </div>
    </div>
  );
}
