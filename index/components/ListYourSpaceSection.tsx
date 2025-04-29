import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, DollarSign, Clock, Shield, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from './Button';

export const ListYourSpaceSection = () => {
  const router = useRouter();
  
  const handleListSpace = () => {
    router.push('/auth/list-parking');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>List Your Space</Text>
        <Text style={styles.subtitle}>
          Turn your unused parking space into extra income
        </Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80' }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Earn up to $300/month</Text>
        </View>
      </View>
      
      <View style={styles.benefitsContainer}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIconContainer}>
            <DollarSign size={20} color={colors.white} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Earn Extra Income</Text>
            <Text style={styles.benefitDescription}>
              Turn your unused parking space into a steady source of income
            </Text>
          </View>
        </View>
        
        <View style={styles.benefitItem}>
          <View style={[styles.benefitIconContainer, { backgroundColor: colors.secondary }]}>
            <Clock size={20} color={colors.white} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Flexible Scheduling</Text>
            <Text style={styles.benefitDescription}>
              Choose when your space is available - hourly, daily, or monthly
            </Text>
          </View>
        </View>
        
        <View style={styles.benefitItem}>
          <View style={[styles.benefitIconContainer, { backgroundColor: colors.success }]}>
            <Shield size={20} color={colors.white} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Secure & Protected</Text>
            <Text style={styles.benefitDescription}>
              Our platform handles payments, insurance, and customer support
            </Text>
          </View>
        </View>
        
        <View style={styles.benefitItem}>
          <View style={[styles.benefitIconContainer, { backgroundColor: colors.warning }]}>
            <MapPin size={20} color={colors.white} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>High Demand</Text>
            <Text style={styles.benefitDescription}>
              Urban areas have high parking demand - your space is valuable
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.ctaContainer}>
        <Button 
          title="List Your Space Now" 
          onPress={handleListSpace}
          size="large"
          rightIcon={<ArrowRight size={18} color={colors.white} />}
          style={styles.ctaButton}
        />
        
        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => router.push('/how-it-works')}
        >
          <Text style={styles.learnMoreText}>Learn how it works</Text>
          <ArrowRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 22,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  overlayText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaButton: {
    marginBottom: 16,
    width: '100%',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  learnMoreText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
    fontWeight: '500',
  },
});