"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import type { Message, TrialStatus } from "@/types";
import { ChatInput } from "./chatinput";
import { EmptyState } from "./emptyState";
import { Header } from "./header";
import { LoadingIndicator } from "./loadingIndicator";
import { MessageBubble } from "./messagebubble";
import { Sidebar } from "./sidebar";
import { TrialStatusBanner } from "./TrialStatusBanner";
import {
  useSendMessage,
  useCreateSession,
  useSessionMessages,
} from "@/hooks/useChat";
import { useChatContext } from "@/contexts/ChatContext";
import Image from "next/image";

interface ChatInterfaceProps {
  sessionId?: string;
}

export function ChatInterface({
  sessionId: initialSessionId,
}: ChatInterfaceProps = {}) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  // Use Context instead of local state
  const {
    currentSessionId,
    setCurrentSessionId,
    messages,
    setMessages,
    isSending,
    setIsSending,
    hasOptimisticMessages,
    setHasOptimisticMessages,
    clearChat,
  } = useChatContext();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
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

  // Fetch trial status
  const fetchTrialStatus = async () => {
    try {
      const response = await fetch("/api/user/trial-status");
      if (response.ok) {
        const data = await response.json();
        setTrialStatus(data);
      }
    } catch (error) {
      console.error("Error fetching trial status:", error);
    }
  };

  // Load trial status when user is authenticated
  useEffect(() => {
    if (isSignedIn && user) {
      fetchTrialStatus();
    }
  }, [isSignedIn, user]);

  // Handle sessionId changes from URL (switching sessions)
  useEffect(() => {
    if (initialSessionId && initialSessionId !== currentSessionId) {
      // User navigated to a different session
      setCurrentSessionId(initialSessionId);
      setMessages([]);
      setHasOptimisticMessages(false);
    } else if (!initialSessionId && currentSessionId) {
      // User navigated to /ai-chat (new chat)
      // Don't clear if we just created a session
      // The context will persist, which is what we want
    }
  }, [
    initialSessionId,
    currentSessionId,
    setCurrentSessionId,
    setMessages,
    setHasOptimisticMessages,
  ]);

  // Load messages from server
  useEffect(() => {
    // Skip if we have optimistic messages
    if (hasOptimisticMessages) {
      return;
    }

    // Skip if we're currently sending
    if (isSending) {
      return;
    }

    // Only update from server if we have actual messages
    if (sessionMessages && sessionMessages.length > 0) {
      // Only update if server has MORE messages or we have no local messages
      if (messages.length === 0 || sessionMessages.length > messages.length) {
        setMessages(sessionMessages);
      }
    }
  }, [
    sessionMessages,
    isSending,
    hasOptimisticMessages,
    messages.length,
    setMessages,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="flex flex-col space-y-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <h1 className="text-4xl max-md:text-lg font-bold text-[#0070B8] dark:text-[#00A3FF]">
            AgileMentor AI!
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Just a sec please...
          </p>
        </div>
      </div>
    );
  }

  // Show error if authentication check failed
  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex flex-col space-y-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center max-w-md px-6">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
            Authentication Required
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            You need to be signed in to access AgileMentor AI. Please sign in to
            continue.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Check if user object is available
  if (!user) {
    return (
      <div className="flex flex-col space-y-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center max-w-md px-6">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
            Unable to Load User
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            We're having trouble loading your account. Please try refreshing the
            page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (content: string) => {
    // Check trial limit first
    if (trialStatus?.hasReachedLimit) {
      toast.error("Trial Limit Reached", {
        description:
          "Please contact fanyicharllson@gmail.com to continue using AgileMentor AI",
        duration: 5000,
      });
      return;
    }

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
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setHasOptimisticMessages(true);

    try {
      // Create session if it doesn't exist (lazy creation)
      let sessionId = currentSessionId;
      if (!sessionId) {
        const newSession = await createSessionMutation.mutateAsync({
          userId: user.id,
        });
        sessionId = newSession.id;
        setCurrentSessionId(sessionId);

        // Context persists state across navigation
        router.replace(`/ai-chat/${sessionId}`, { scroll: false });
      }

      // Send to API
      const response = await sendMessageMutation.mutateAsync({
        sessionId: sessionId,
        message: content,
        // userId: user.id,
      });

      // If session was deleted and a new one was created, update URL
      if (response.isNewSession && response.sessionId !== sessionId) {
        console.log(
          `Session was deleted. Redirecting to new session: ${response.sessionId}`
        );
        router.replace(`/ai-chat/${response.sessionId}`, { scroll: false });
        setCurrentSessionId(response.sessionId);
      }

      // Add assistant message from API response
      const assistantMessage: Message = {
        id: response.messageId,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      // Update messages: replace temp user message with real one, add assistant message
      setMessages((prev) => {
        const filtered = prev.filter((msg: any) => msg.id !== userMessage.id);
        return [
          ...filtered,
          {
            id: response.messageId || userMessage.id,
            role: "user" as const,
            content,
            timestamp: new Date(),
          },
          assistantMessage,
        ];
      });

      // Update trial status with remaining messages
      if (response.remainingMessages !== undefined) {
        setTrialStatus((prev) =>
          prev
            ? {
                ...prev,
                messagesSent: prev.messagesSent + 1,
                remainingMessages:
                  response.remainingMessages ?? prev.remainingMessages,
                hasReachedLimit: response.remainingMessages === 0,
              }
            : null
        );
      }

      // Clear optimistic flag after delay
      setTimeout(() => {
        setHasOptimisticMessages(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg: any) => msg.id !== userMessage.id));
      setHasOptimisticMessages(false);

      // Toast is already shown by useSendMessage hook's onError
      // No need to show duplicate toast here
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      setMessages((prev) => prev.slice(0, messageIndex));
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
    clearChat(); // Use context's clearChat method
    router.push("/ai-chat");
  };

  const shouldShowEmptyState =
    messages.length === 0 &&
    !isSending &&
    !isLoadingMessages &&
    !hasOptimisticMessages;

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
        <Header
          sessionTitle={currentSession.title}
          sessionCategory={currentSession.category}
          onNewChat={startNewChat}
          isOpen={sidebarOpen}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {isLoadingMessages && messages.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Loading messages...
                  </p>
                </div>
              </div>
            ) : shouldShowEmptyState ? (
              <EmptyState onSuggestionClick={handleSuggestionClick} />
            ) : (
              <>
                {messages.map((message: any, index: number) => (
                  <MessageBubble
                    key={index}
                    message={message}
                    onEdit={handleEditMessage}
                    onResend={handleResendMessage}
                  />
                ))}

                {isSending && <LoadingIndicator />}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Trial Status Banner - Show above chat input */}
        {trialStatus && <TrialStatusBanner trialStatus={trialStatus} />}

        <ChatInput
          onSend={handleSendMessage}
          disabled={isSending || trialStatus?.hasReachedLimit || false}
          placeholder={
            trialStatus?.hasReachedLimit
              ? "Trial limit reached - Contact us to continue"
              : "Ask your Agile Coach..."
          }
        />
      </div>
    </div>
  );
}
