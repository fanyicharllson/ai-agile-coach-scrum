"use client";

import type React from "react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  ChevronRight,
  Plus,
  Search,
  Pin,
  FolderOpen,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import { useSessions, useCreateSession } from "@/hooks/useChat";
import { useTheme } from "@/contexts/ThemeContext";
import UserProfile from "./userProfile";
import type { Session } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat?: () => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  currentSessionId,
  onSessionSelect,
  onNewChat,
}: SidebarProps) {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    pinned: true,
    recent: true,
    folders: false,
  });

  const { data: sessions, isLoading } = useSessions(user?.id);
  const createSession = useCreateSession();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNewSession = () => {
    if (onNewChat) {
      onNewChat();
    }
    // Don't create session here - it will be created lazily when user sends first message
  };

  const pinnedSessions = sessions?.filter((s) => s.isPinned) || [];
  const recentSessions = sessions?.filter((s) => !s.isPinned) || [];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onToggle}
      />

      {/* Toggle Button for when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 p-2 rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Open sidebar"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-[#050505] border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-[#0070B8] dark:text-[#00A3FF]">
              AgileMentor AI
            </h1>
            {/* Theme Toggle and toggle sidebar btn */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-500" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                aria-label="Open sidebar"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sprint sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0070B8] transition-all"
            />
          </div>

          {/* New Session Button */}
          <button
            onClick={handleNewSession}
            disabled={createSession.isPending}
            className="w-full px-4 py-3 bg-[#0070B8] dark:bg-[#0091E0] hover:bg-[#005a96] dark:hover:bg-[#007cbd] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Sprint Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {isLoading ? (
            <div className="px-4 py-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Loading sessions...
              </p>
            </div>
          ) : (
            <>
              {/* Pinned Sessions */}
              <SessionSection
                title="Pinned Sessions"
                icon={<Pin className="w-4 h-4" />}
                isExpanded={expandedSections.pinned}
                onToggle={() => toggleSection("pinned")}
                sessions={pinnedSessions}
                currentSessionId={currentSessionId}
                onSessionSelect={onSessionSelect}
              />

              {/* Recent Sessions */}
              <SessionSection
                title="Recent Sessions"
                icon={<ChevronRight className="w-4 h-4" />}
                isExpanded={expandedSections.recent}
                onToggle={() => toggleSection("recent")}
                sessions={recentSessions}
                currentSessionId={currentSessionId}
                onSessionSelect={onSessionSelect}
              />

              {/* Sprint Folders */}
              <SessionSection
                title="Sprint Folders"
                icon={<FolderOpen className="w-4 h-4" />}
                isExpanded={expandedSections.folders}
                onToggle={() => toggleSection("folders")}
                sessions={[]}
                currentSessionId={currentSessionId}
                onSessionSelect={onSessionSelect}
              />
            </>
          )}
        </div>

        {/* Footer - User Profile */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-3">
          <UserProfile />
        </div>
      </aside>
    </>
  );
}

interface SessionSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  sessions: Session[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
}

function SessionSection({
  title,
  icon,
  isExpanded,
  onToggle,
  sessions,
  currentSessionId,
  onSessionSelect,
}: SessionSectionProps) {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <span
          className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
        >
          {icon}
        </span>
        {title}
      </button>

      {isExpanded && (
        <div className="mt-1">
          {sessions.length === 0 ? (
            <p className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500">
              No sessions yet
            </p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  currentSessionId === session.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {session.category}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
