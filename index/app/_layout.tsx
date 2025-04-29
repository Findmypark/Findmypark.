import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@/lib/trpc';
import { useAuthStore } from '@/store/authStore';

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const { fetchUser } = useAuthStore();
  
  useEffect(() => {
    // Check if user is authenticated on app start
    fetchUser();
  }, [fetchUser]);
  
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="auth/login" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="auth/welcome" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="auth/vehicle-details" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="auth/payment-method" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="auth/choose-mode" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="auth/list-parking" 
            options={{ 
              title: 'List Your Parking',
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="spot/[id]" 
            options={{ 
              title: 'Parking Details',
              animation: 'slide_from_right',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="parking-list" 
            options={{ 
              title: 'Parking Spots',
              animation: 'slide_from_right',
            }} 
          />
        </Stack>
      </QueryClientProvider>
    </trpc.Provider>
  );
}