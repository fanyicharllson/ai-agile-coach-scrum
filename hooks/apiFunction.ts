import type { Message, Session, ChatResponse } from "@/types";

export const sendMessage = async (payload: {
  sessionId: string;
  message: string;
}): Promise<ChatResponse> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    
    if (response.status === 401) {
      throw new Error("Authentication required. Please sign in.");
    }
    if (response.status === 403) {
      throw new Error("Unauthorized access.");
    }
    
    throw new Error(error.error || error.details || "Failed to send message");
  }

  return response.json();
};

export const fetchSessions = async (userId?: string): Promise<Session[]> => {
  const url = userId ? `/api/sessions?userId=${userId}` : "/api/sessions";

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    
    if (response.status === 401) {
      throw new Error("Please sign in to view sessions");
    }
    
    throw new Error(error.error || error.details || "Failed to fetch sessions");
  }

  const data = await response.json();
  return data.sessions;
};

export const fetchSessionMessages = async (sessionId: string) => {
  const response = await fetch(`/api/chat?sessionId=${sessionId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    
    if (response.status === 401) {
      throw new Error("Please sign in to view messages");
    }
    
    throw new Error(error.error || error.details || "Failed to fetch messages");
  }

  const data = await response.json();
  return data.messages;
};

export const createSession = async (payload: {
  userId?: string;
  category?: Session["category"];
  title?: string;
}): Promise<Session> => {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    
    if (response.status === 401) {
      throw new Error("Please sign in to create sessions");
    }
    
    throw new Error(error.error || error.details || "Failed to create session");
  }

  const data = await response.json();
  return data.session;
};

export const updateSession = async (payload: {
  sessionId: string;
  title?: string;
  category?: Session["category"];
  isPinned?: boolean;
  isArchived?: boolean;
  folderId?: string | null;
}): Promise<Session> => {
  const response = await fetch("/api/sessions", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    
    if (response.status === 401) {
      throw new Error("Please sign in to update sessions");
    }
    
    throw new Error(error.error || error.details || "Failed to update session");
  }

  const data = await response.json();
  return data.session;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  const response = await fetch(`/api/sessions?sessionId=${sessionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    
    if (response.status === 401) {
      throw new Error("Please sign in to delete sessions");
    }
    
    throw new Error(error.error || error.details || "Failed to delete session");
  }
};

export const editMessage = async (payload: {
  messageId: string;
  content: string;
}): Promise<Message> => {
  const response = await fetch("/api/chat", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    
    if (response.status === 401) {
      throw new Error("Please sign in to edit messages");
    }
    
    throw new Error(error.error || error.details || "Failed to edit message");
  }

  const data = await response.json();
  return data.data;
};
