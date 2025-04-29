import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Car, Clock, MapPin, CreditCard } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const features = [
    {
      icon: <MapPin size={32} color={colors.primary} />,
      title: 'Find Nearby Parking',
      description: 'Discover parking spots near you with real-time availability',
    },
    {
      icon: <Clock size={32} color={colors.primary} />,
      title: 'Hourly & Monthly Plans',
      description: 'Choose between hourly parking or monthly subscriptions',
    },
    {
      icon: <Car size={32} color={colors.primary} />,
      title: 'Multiple Vehicles',
      description: 'Add all your vehicles for quick and easy booking',
    },
    {
      icon: <CreditCard size={32} color={colors.primary} />,
      title: 'Easy Payments',
      description: 'Pay securely with UPI, credit/debit cards, or net banking',
    },
  ];

  const handleContinue = () => {
    router.push('/auth/vehicle-details');
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
            Welcome to FindMyPark, {user?.name?.split(' ')[0] || 'User'}!
          </Text>
          <Text style={styles.subtitle}>
            Find and book parking spots across Hyderabad with ease
          </Text>
        </View>

        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGFya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60' }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What you can do</Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  {feature.icon}
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.pricingContainer}>
          <Text style={styles.pricingTitle}>Parking Options</Text>
          
          <View style={styles.pricingCards}>
            <View style={[styles.pricingCard, styles.hourlyCard]}>
              <View style={styles.pricingHeader}>
                <Text style={styles.pricingType}>Hourly Parking</Text>
                <Text style={styles.pricingPrice}>
                  <Text style={styles.currency}>₹</Text>50
                  <Text style={styles.pricingPeriod}>/hour</Text>
                </Text>
              </View>
              <Text style={styles.pricingDescription}>
                Perfect for short visits to shopping malls, restaurants, or quick errands
              </Text>
              <View style={styles.pricingFeatures}>
                <Text style={styles.pricingFeature}>• Pay only for what you use</Text>
                <Text style={styles.pricingFeature}>• No long-term commitment</Text>
                <Text style={styles.pricingFeature}>• Available across all locations</Text>
              </View>
            </View>

            <View style={[styles.pricingCard, styles.monthlyCard]}>
              <View style={styles.pricingHeader}>
                <Text style={styles.pricingType}>Monthly Subscription</Text>
                <Text style={styles.pricingPrice}>
                  <Text style={styles.currency}>₹</Text>3,000
                  <Text style={styles.pricingPeriod}>/month</Text>
                </Text>
              </View>
              <Text style={styles.pricingDescription}>
                Ideal for regular commuters, office-goers, or residents needing dedicated parking
              </Text>
              <View style={styles.pricingFeatures}>
                <Text style={styles.pricingFeature}>• Reserved spot guarantee</Text>
                <Text style={styles.pricingFeature}>• 24/7 access</Text>
                <Text style={styles.pricingFeature}>• Save up to 40% vs hourly rates</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue to Add Vehicle"
          onPress={handleContinue}
          size="large"
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
  heroImage: {
    width: '100%',
    height: 200,
  },
  featuresContainer: {
    padding: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  pricingContainer: {
    padding: 24,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  pricingCards: {
    gap: 16,
  },
  pricingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  hourlyCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  monthlyCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  pricingHeader: {
    marginBottom: 12,
  },
  pricingType: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  currency: {
    fontSize: 18,
  },
  pricingPeriod: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textLight,
  },
  pricingDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  pricingFeatures: {
    gap: 8,
  },
  pricingFeature: {
    fontSize: 14,
    color: colors.text,
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