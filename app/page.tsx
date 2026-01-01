"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.push("/ai-chat");
      } else {
        router.push("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex flex-col space-y-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200">
          Welcome to AgileMentor AI!
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Redirecting...
        </p>
      </div>
    </div>
  );
}
