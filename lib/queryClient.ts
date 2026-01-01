import { QueryClient, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
    // Global mutation cache event listener - handles ALL mutation errors in one place
    mutationCache: new MutationCache({
      onError: (error: any, _variables, _context, mutation: any) => {
        const message = error?.message || "An error occurred";
        const title = mutation.options.meta?.errorMessage || "Operation failed";
        
        toast.error(title, {
          description: message,
        });
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
