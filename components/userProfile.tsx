"use client";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, User, Settings, ChevronUp, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

function UserProfile() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Get user's initials for fallback
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    } else if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.slice(0, 2).toUpperCase();
    }
    return "AD"; // Default fallback
  };

  const displayName = user?.fullName || user?.firstName || "User";
  const displayEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  return (
    <div className="relative">
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {getUserInitials()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {displayName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {displayEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  openUserProfile();
                  setIsOpen(false);
                }}
                className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Manage Account</span>
              </button>

              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Dark Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  // Add settings logic here
                  toast.info("Settings Coming Soon!", {
                    description: "Stay tuned.",
                  });
                  setIsOpen(false);
                }}
                className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>

              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      >
        {/* Profile Picture */}
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
            {getUserInitials()}
          </div>
        )}

        {/* User Info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {displayEmail}
          </p>
        </div>

        {/* Chevron Icon */}
        <ChevronUp
          className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default UserProfile;
