import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import { DemoBanner } from '@/components/DemoBanner';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();
  
  useEffect(() => {
    // Check authentication status
    fetchUser();
  }, []);
  
  // If loading, show loading indicator
  if (isLoading) {
    return (
      <View style={styles.container}>
        <DemoBanner />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }
  
  // If authenticated, redirect to home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  
  // If not authenticated, redirect to login
  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
  },
});