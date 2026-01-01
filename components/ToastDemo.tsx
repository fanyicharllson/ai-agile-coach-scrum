"use client";

import { toast } from "sonner";
import { toastSuccess, toastError, toastInfo, toastWarning } from "@/lib/toast";

/**
 * Toast Demo Component - For testing toast notifications
 * This component demonstrates all toast types with light/dark theme support
 */
export function ToastDemo() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Notifications Demo</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => toast.success("Success!", {
            description: "Your action completed successfully",
          })}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Success Toast
        </button>

        <button
          onClick={() => toast.error("Error occurred!", {
            description: "Something went wrong. Please try again.",
          })}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
        >
          Error Toast
        </button>

        <button
          onClick={() => toast.warning("Warning!", {
            description: "Please review your inputs",
          })}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 cursor-pointer"
        >
          Warning Toast
        </button>

        <button
          onClick={() => toast.info("Information", {
            description: "This is an informational message",
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Info Toast
        </button>

        <button
          onClick={() => toast.loading("Processing...", {
            description: "Please wait while we process your request",
          })}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
        >
          Loading Toast
        </button>

        <button
          onClick={() => {
            const promise = new Promise((resolve) => setTimeout(resolve, 2000));
            toast.promise(promise, {
              loading: "Loading data...",
              success: "Data loaded successfully!",
              error: "Failed to load data",
            });
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
        >
          Promise Toast
        </button>

        <button
          onClick={() => toastError.messageSendFailed("Network timeout")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
        >
          Message Send Error
        </button>

        <button
          onClick={() => toastSuccess.sessionCreated()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
        >
          Session Created
        </button>
      </div>
    </div>
  );
}
