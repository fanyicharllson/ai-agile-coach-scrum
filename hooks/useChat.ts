import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Only used for success toasts now
import {
  sendMessage,
  fetchSessions,
  fetchSessionMessages,
  createSession,
  updateSession,
  deleteSession,
  editMessage,
} from "./apiFunction";

/**
 * Send a message to the AI
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      // Invalidate sessions to update last message time
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      // Invalidate the specific session's messages
      queryClient.invalidateQueries({ queryKey: ["messages", data.sessionId] });
    },
    meta: {
      errorMessage: "Failed to send message",
    },
  });
};

/**
 * Fetch all sessions
 */
export const useSessions = (userId?: string) => {
  return useQuery({
    queryKey: ["sessions", userId],
    queryFn: () => fetchSessions(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    meta: {
      errorMessage: "Failed to load sessions",
    },
  });
};

/**r
 * Fetch messages for a specific session
 */
export const useSessionMessages = (sessionId: string | null) => {
  return useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => fetchSessionMessages(sessionId!),
    enabled: !!sessionId, // Only fetch if sessionId exists
    staleTime: 1000 * 60 * 5, // 5 minutes - prevent refetching during active chat
    refetchOnMount: false, // Don't refetch when component mounts with same sessionId
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    meta: {
      errorMessage: "Failed to load messages",
    },
  });
};

/**
 * Create a new session
 */
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: (newSession) => {
      // Invalidate sessions list to show the new session in sidebar
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      // Don't show toast for lazy creation - it's confusing UX
      return newSession;
    },
    meta: {
      errorMessage: "Failed to create session",
    },
  });
};

/**
 * Update session details (title, pin, archive, etc.)
 */
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSession,
    onSuccess: (updatedSession) => {
      // Update the sessions list cache
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session updated");
      return updatedSession;
    },
    meta: {
      errorMessage: "Failed to update session",
    },
  });
};

/**
 * Delete a session
 */
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session deleted");
    },
    meta: {
      errorMessage: "Failed to delete session",
    },
  });
};

/**
 * Edit a message
 */
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editMessage,
    onSuccess: (data, variables) => {
      // Invalidate messages for the session
      // Note: You'll need to track which session the message belongs to
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message edited");
    },
    meta: {
      errorMessage: "Failed to edit message",
    },
  });
};

/**
 * Search sessions
 */
export const useSearchSessions = (searchQuery: string, userId?: string) => {
  return useQuery({
    queryKey: ["sessions", "search", searchQuery, userId],
    queryFn: async () => {
      const url = userId
        ? `/api/sessions?search=${encodeURIComponent(
            searchQuery
          )}&userId=${userId}`
        : `/api/sessions?search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      return data.sessions;
    },
    enabled: searchQuery.length > 0, // Only search if there's a query
    staleTime: 1000 * 30, // 30 seconds
    meta: {
      errorMessage: "Failed to load messages",
    },
  });
};
