import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ParkingSpotCard } from './ParkingSpotCard';
import { useParkingStore } from '@/store/parkingStore';
import { ParkingSpot } from '@/types';

interface ParkingTypeSectionProps {
  title: string;
  type: 'instant' | 'lease';
  description?: string;
  showViewAll?: boolean;
}

export const ParkingTypeSection: React.FC<ParkingTypeSectionProps> = ({
  title,
  type,
  description,
  showViewAll = true,
}) => {
  const router = useRouter();
  const { parkingSpots } = useParkingStore();
  
  // Filter spots based on type
  const filteredSpots = parkingSpots.filter(spot => {
    if (type === 'instant') {
      // Instant parking is hourly or daily commercial parking
      return (spot.priceUnit === 'hour' || spot.priceUnit === 'day') && 
             spot.locationType === 'commercial';
    } else if (type === 'lease') {
      // Lease parking is monthly residential parking
      return spot.priceUnit === 'month' && 
             spot.locationType === 'residential';
    }
    return false;
  });
  
  // Limit to 5 spots for the section view
  const displaySpots = filteredSpots.slice(0, 5);
  
  const handleViewAll = () => {
    router.push({
      pathname: '/parking-list',
      params: { type }
    });
  };
  
  const handleSpotPress = (spot: ParkingSpot) => {
    router.push({
      pathname: `/spot/${spot.id}`,
    });
  };
  
  if (displaySpots.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No parking spots available</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        {showViewAll && filteredSpots.length > 5 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={handleViewAll}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displaySpots.map((spot) => (
          <ParkingSpotCard
            key={spot.id}
            spot={spot}
            onPress={() => handleSpotPress(spot)}
            style={styles.card}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    marginRight: 12,
    width: 280,
  },
  emptyContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
  },
});