"use client";

import { useState, useRef, useEffect } from "react";
import type { Message } from "@/types";
import { ChatInput } from "./chatinput";
import { EmptyState } from "./emptyState";
import { Header } from "./header";
import { LoadingIndicator } from "./loadingIndicator";
import { MessageBubble } from "./messagebubble";
import { Sidebar } from "./sidebar";
import { useSendMessage } from "@/hooks/useChat";

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useSendMessage();

  // Mock current session data
  const currentSession = {
    id: "1",
    title: "Agile Coaching Session",
    category: "Sprint Planning" as const,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessageMutation.isPending]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Send to API
    try {
      const response = await sendMessageMutation.mutateAsync({
        sessionId: currentSessionId || "default",
        message: content,
      });

      // Add assistant message
      const assistantMessage: Message = {
        id: response.messageId,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error - show error message to user
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    setCurrentSessionId(Date.now().toString());
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#050505] overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentSessionId={currentSessionId}
        onSessionSelect={setCurrentSessionId}
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
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {messages.length === 0 ? (
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
          disabled={sendMessageMutation.isPending}
          placeholder="Ask your Agile Coach..."
        />
      </div>
    </div>
  );
}
