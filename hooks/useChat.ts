import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    },
  });
};

/**
 * Fetch all sessions
 */
export const useSessions = (userId?: string) => {
  const query = useQuery({
    queryKey: ["sessions", userId],
    queryFn: () => fetchSessions(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Handle errors with toast in React Query v5
  if (query.isError) {
    console.error("Error fetching sessions:", query.error);
    toast.error("Failed to load sessions", {
      description: query.error instanceof Error ? query.error.message : "Please try refreshing the page.",
    });
  }

  return query;
};

/**
 * Fetch messages for a specific session
 */
export const useSessionMessages = (sessionId: string | null) => {
  const query = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => fetchSessionMessages(sessionId!),
    enabled: !!sessionId, // Only fetch if sessionId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Handle errors with toast in React Query v5
  if (query.isError) {
    console.error("Error fetching messages:", query.error);
    toast.error("Failed to load messages", {
      description: query.error instanceof Error ? query.error.message : "Please try again.",
    });
  }

  return query;
};

/**
 * Create a new session
 */
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: (newSession) => {
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("New chat created");
      return newSession;
    },
    onError: (error) => {
      console.error("Error creating session:", error);
      toast.error("Failed to create session", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
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
    onError: (error) => {
      console.error("Error updating session:", error);
      toast.error("Failed to update session", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
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
    onError: (error) => {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
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
    onError: (error) => {
      console.error("Error editing message:", error);
      toast.error("Failed to edit message", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    },
  });
};

/**
 * Search sessions
 */
export const useSearchSessions = (searchQuery: string, userId?: string) => {
  const query = useQuery({
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
  });

  // Handle errors with toast in React Query v5
  if (query.isError) {
    console.error("Search error:", query.error);
    toast.error("Search failed", {
      description: query.error instanceof Error ? query.error.message : "Please try again.",
    });
  }

  return query;
};
