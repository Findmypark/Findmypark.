import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ArrowLeft, DollarSign, Calendar, CreditCard, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function HowItWorksScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'How It Works',
          headerLeft: () => (
            <Button
              title=""
              variant="ghost"
              size="small"
              leftIcon={<ArrowLeft size={24} color={colors.text} />}
              onPress={() => router.back()}
              style={styles.backButton}
            />
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>How to List Your Parking Space</Text>
          <Text style={styles.subtitle}>
            Turn your unused parking space into a source of passive income in just a few simple steps
          </Text>
        </View>
        
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80' }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Create Your Listing</Text>
              <Text style={styles.stepDescription}>
                Add photos, description, and details about your parking space. Include information about size, access, and any special features.
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Set Your Availability</Text>
              <Text style={styles.stepDescription}>
                Choose when your space is available - hourly, daily, or monthly. You have complete control over your schedule.
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Set Your Price</Text>
              <Text style={styles.stepDescription}>
                Our pricing tool helps you set competitive rates based on your location and similar spaces in your area.
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Receive Bookings</Text>
              <Text style={styles.stepDescription}>
                Drivers will book your space through our app. You'll receive notifications and can manage all bookings from your dashboard.
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>5</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Paid</Text>
              <Text style={styles.stepDescription}>
                Payments are processed securely through our platform. You'll receive your earnings directly to your bank account.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Why List With Us?</Text>
          
          <View style={styles.featureItem}>
            <DollarSign size={24} color={colors.primary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Maximize Your Income</Text>
              <Text style={styles.featureDescription}>
                Our platform helps you optimize pricing and occupancy to maximize your earnings.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Flexible Scheduling</Text>
              <Text style={styles.featureDescription}>
                List your space when it's convenient for you - full-time or just when you're not using it.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <CreditCard size={24} color={colors.primary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure Payments</Text>
              <Text style={styles.featureDescription}>
                All payments are processed securely, and you'll receive your earnings directly.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <CheckCircle size={24} color={colors.primary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Verified Drivers</Text>
              <Text style={styles.featureDescription}>
                All drivers are verified through our platform for your peace of mind.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How much can I earn?</Text>
            <Text style={styles.faqAnswer}>
              Earnings vary based on location, availability, and demand. Urban areas with high parking demand can earn $100-$300 per month for a single space.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is my space eligible?</Text>
            <Text style={styles.faqAnswer}>
              Most private parking spaces, driveways, garages, and dedicated spots are eligible. The space should be legal to rent and have clear access.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What about insurance?</Text>
            <Text style={styles.faqAnswer}>
              Our platform provides liability coverage for all listed spaces during active bookings, giving you peace of mind.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I get paid?</Text>
            <Text style={styles.faqAnswer}>
              Payments are processed after each booking is completed. You can set up direct deposit to receive funds in your bank account.
            </Text>
          </View>
        </View>
        
        <View style={styles.ctaContainer}>
          <Button 
            title="List Your Space Now" 
            onPress={() => router.push('/auth/list-parking')}
            size="large"
            style={styles.ctaButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginLeft: -8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: 200,
    marginBottom: 24,
  },
  stepsContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumber: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
  featuresContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  faqContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
  ctaContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  ctaButton: {
    width: '100%',
  },
});