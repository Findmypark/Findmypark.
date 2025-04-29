import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Star, MapPin, IndianRupee } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ParkingSpot } from '@/types';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onPress: () => void;
  style?: ViewStyle;
}

export const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ spot, onPress, style }) => {
  const { 
    name, 
    address, 
    images, 
    price, 
    priceUnit, 
    rating, 
    reviews, 
    distance,
    availability,
  } = spot;

  // Format price unit for display
  const formatPriceUnit = (unit: string) => {
    switch(unit) {
      case 'hour': return 'hr';
      case 'day': return 'day';
      case 'month': return 'mo';
      default: return unit;
    }
  };

  // Helper function to check availability
  const isAvailable = () => {
    if (!availability) return false;
    
    if (typeof availability === 'string') {
      // If it's a string like "24/7", consider it available
      return true;
    }
    
    return availability.available;
  };

  // Helper function to get available slots
  const getAvailableSlots = () => {
    if (!availability) return 0;
    
    if (typeof availability === 'string') {
      // If it's a string, return the string itself
      return availability;
    }
    
    return availability.slots;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: images[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.yellow[500]} fill={colors.yellow[500]} />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({reviews})</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textLight} />
          <Text style={styles.address} numberOfLines={1}>{address}</Text>
          <Text style={styles.distance}>{distance} km</Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <IndianRupee size={14} color={colors.primary} />
            <Text style={styles.price}>
              {price}
              <Text style={styles.priceUnit}>/{formatPriceUnit(priceUnit)}</Text>
            </Text>
          </View>
          
          <View style={[
            styles.availabilityContainer,
            isAvailable() ? styles.available : styles.unavailable
          ]}>
            <Text style={styles.availabilityText}>
              {isAvailable() 
                ? (typeof availability === 'object' ? `${availability.slots} spots` : availability) 
                : 'Full'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
    flex: 1,
  },
  distance: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  priceUnit: {
    fontSize: 12,
    color: colors.textLight,
  },
  availabilityContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  available: {
    backgroundColor: colors.success + '20',
  },
  unavailable: {
    backgroundColor: colors.error + '20',
  },
  availabilityText: {
    fontSize: 12,
    color: colors.text,
  },
});