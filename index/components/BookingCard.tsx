import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Car,
  IndianRupee,
  QrCode,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Booking } from '@/types';
import { Button } from './Button';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  onViewQR?: (bookingId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onViewQR,
}) => {
  const router = useRouter();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return colors.info;
      case 'active':
        return colors.success;
      case 'completed':
        return colors.gray[500];
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray[500];
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  const formatDate = (date: Date | string) => {
    if (!date) return '';
    
    // Convert to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatTime = (date: Date | string) => {
    if (!date) return '';
    
    // Convert to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  const handleViewDetails = () => {
    router.push(`/booking/${booking.id}`);
  };
  
  const handleCancel = () => {
    if (onCancel) {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => onCancel(booking.id),
          },
        ]
      );
    }
  };
  
  const handleViewQR = () => {
    if (onViewQR) {
      onViewQR(booking.id);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator, 
              { backgroundColor: getStatusColor(booking.status) }
            ]} 
          />
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
        <Text style={styles.bookingId}>Booking #{booking.id.slice(-4)}</Text>
      </View>
      
      <View style={styles.content}>
        <Image 
          source={{ uri: booking.spotImage }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.details}>
          <Text style={styles.spotName}>{booking.spotName}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.textLight} />
            <Text style={styles.locationText} numberOfLines={1}>
              {booking.spotAddress || booking.address || 'Location not available'}
            </Text>
          </View>
          
          <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <Calendar size={14} color={colors.textLight} />
              <Text style={styles.timeText}>
                {formatDate(booking.startTime)}
              </Text>
            </View>
            
            <View style={styles.timeItem}>
              <Clock size={14} color={colors.textLight} />
              <Text style={styles.timeText}>
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </Text>
            </View>
          </View>
          
          <View style={styles.vehicleContainer}>
            <Car size={14} color={colors.textLight} />
            <Text style={styles.vehicleText}>
              {booking.vehicleInfo.make} {booking.vehicleInfo.model} ({booking.vehicleInfo.licensePlate})
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <View style={styles.priceValue}>
            <IndianRupee size={14} color={colors.primary} />
            <Text style={styles.priceText}>{booking.totalPrice}</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {booking.status === 'upcoming' && (
            <Button
              title="Cancel"
              variant="outline"
              size="small"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
          )}
          
          {(booking.status === 'upcoming' || booking.status === 'active') && (
            <Button
              title="View QR"
              variant="outline"
              size="small"
              leftIcon={<QrCode size={14} color={colors.primary} />}
              onPress={handleViewQR}
              style={styles.qrButton}
            />
          )}
          
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={handleViewDetails}
          >
            <Text style={styles.detailsText}>Details</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  bookingId: {
    fontSize: 12,
    color: colors.textLight,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  spotName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
    flex: 1,
  },
  timeContainer: {
    marginBottom: 8,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  priceValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
  },
  qrButton: {
    marginRight: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
});