import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Car, Building, ChevronRight, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

export default function ChooseModeScreen() {
  const router = useRouter();
  const { setUserMode, user } = useAuthStore();
  
  const [selectedMode, setSelectedMode] = useState<'finder' | 'provider' | null>(null);
  
  const handleContinue = () => {
    if (selectedMode) {
      setUserMode(selectedMode);
      router.push('/');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.name?.split(' ')[0] || 'User'}!
          </Text>
          <Text style={styles.subtitle}>
            Choose how you want to use ParkEasy
          </Text>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedMode === 'finder' && styles.optionCardSelected
            ]}
            onPress={() => setSelectedMode('finder')}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionIconContainer}>
                <Car size={28} color={colors.primary} />
              </View>
              
              {selectedMode === 'finder' && (
                <View style={styles.checkContainer}>
                  <Check size={20} color={colors.white} />
                </View>
              )}
            </View>
            
            <Text style={styles.optionTitle}>Parking Finder</Text>
            
            <Text style={styles.optionDescription}>
              Find and book parking spots near your destination
            </Text>
            
            <View style={styles.optionFeatures}>
              <View style={styles.optionFeatureItem}>
                <Check size={16} color={colors.primary} />
                <Text style={styles.optionFeatureText}>
                  Search for available parking
                </Text>
              </View>
              
              <View style={styles.optionFeatureItem}>
                <Check size={16} color={colors.primary} />
                <Text style={styles.optionFeatureText}>
                  Book hourly or monthly spots
                </Text>
              </View>
              
              <View style={styles.optionFeatureItem}>
                <Check size={16} color={colors.primary} />
                <Text style={styles.optionFeatureText}>
                  Save favorite locations
                </Text>
              </View>
            </View>
            
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGFya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60' }}
              style={styles.optionImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedMode === 'provider' && styles.optionCardSelected
            ]}
            onPress={() => setSelectedMode('provider')}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionIconContainer}>
                <Building size={28} color={colors.secondary} />
              </View>
              
              {selectedMode === 'provider' && (
                <View style={[styles.checkContainer, { backgroundColor: colors.secondary }]}>
                  <Check size={20} color={colors.white} />
                </View>
              )}
            </View>
            
            <Text style={styles.optionTitle}>Parking Provider</Text>
            
            <Text style={styles.optionDescription}>
              List your unused parking space and earn money
            </Text>
            
            <View style={styles.optionFeatures}>
              <View style={styles.optionFeatureItem}>
                <Check size={16} color={colors.secondary} />
                <Text style={styles.optionFeatureText}>
                  List your parking space
                </Text>
              </View>
              
              <View style={styles.optionFeatureItem}>
                <Check size={16} color={colors.secondary} />
                <Text style={styles.optionFeatureText}>
                  Set your own pricing
                </Text>
              </View>
              
              <View style={styles.optionFeatureItem}>
                <Check size={16} color={colors.secondary} />
                <Text style={styles.optionFeatureText}>
                  Manage bookings and availability
                </Text>
              </View>
            </View>
            
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1590674899484-13d6c7094a9f?q=80&w=2574&auto=format&fit=crop' }}
              style={styles.optionImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            You can switch between modes anytime from your profile settings
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedMode}
          rightIcon={<ChevronRight size={20} color={colors.white} />}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  optionsContainer: {
    padding: 16,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  optionCardSelected: {
    borderColor: colors.primary,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  optionFeatures: {
    marginBottom: 16,
  },
  optionFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionFeatureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  optionImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  noteContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
});