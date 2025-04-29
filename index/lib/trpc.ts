import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Get the base URL for the API
const getBaseUrl = () => {
  // In a browser, use the current URL
  if (typeof window !== "undefined") {
    return "";
  }
  
  // In development, use localhost
  return "http://localhost:3000";
};

// Create tRPC client for direct use (without hooks)
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      async headers() {
        try {
          // Get the auth token from AsyncStorage
          const token = await AsyncStorage.getItem("auth-token");
          
          return {
            authorization: token ? `Bearer ${token}` : "",
          };
        } catch (error) {
          console.error("Error getting auth token:", error);
          return {};
        }
      },
    }),
  ],
});