import { toast } from "sonner";

/**
 * Toast utility functions with consistent styling and messages
 */

export const toastSuccess = {
  sessionCreated: () => toast.success("Session created", {
    description: "Your new chat session is ready",
  }),
  
  sessionUpdated: () => toast.success("Session updated", {
    description: "Changes saved successfully",
  }),
  
  sessionDeleted: () => toast.success("Session deleted", {
    description: "Chat session removed",
  }),
  
  messageEdited: () => toast.success("Message edited", {
    description: "Your message has been updated",
  }),
  
  messageSent: () => toast.success("Message sent", {
    description: "AI is processing your request",
  }),
};

export const toastError = {
  sessionCreateFailed: (error?: string) => toast.error("Failed to create session", {
    description: error || "Please try again",
  }),
  
  sessionUpdateFailed: (error?: string) => toast.error("Failed to update session", {
    description: error || "Please try again",
  }),
  
  sessionDeleteFailed: (error?: string) => toast.error("Failed to delete session", {
    description: error || "Please try again",
  }),
  
  messageEditFailed: (error?: string) => toast.error("Failed to edit message", {
    description: error || "Please try again",
  }),
  
  messageSendFailed: (error?: string) => toast.error("Failed to send message", {
    description: error || "Unable to reach the AI. Please try again.",
  }),
  
  fetchFailed: (resource: string, error?: string) => toast.error(`Failed to load ${resource}`, {
    description: error || "Please refresh the page",
  }),
  
  networkError: () => toast.error("Network error", {
    description: "Please check your internet connection",
  }),
  
  generic: (message: string, description?: string) => toast.error(message, {
    description: description || "An unexpected error occurred",
  }),
};

export const toastInfo = {
  loading: (message: string) => toast.loading(message),
  
  processing: () => toast.loading("Processing your request..."),
  
  saving: () => toast.loading("Saving changes..."),
};

export const toastWarning = {
  unsavedChanges: () => toast.warning("Unsaved changes", {
    description: "Make sure to save your work",
  }),
  
  slowConnection: () => toast.warning("Slow connection", {
    description: "The request is taking longer than usual",
  }),
};

// Promise-based toasts for async operations
export const toastPromise = {
  operation(
    promise: Promise<any>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};
