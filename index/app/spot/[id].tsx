import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Clock, Car, Calendar, Phone, Shield } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { CustomDateTimePicker } from '@/components/DateTimePicker';
import { useParkingStore } from '@/store/parkingStore';

type ParkingType = 'hour' | 'day' | 'month';

const ParkingSpotDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getParkingSpotById } = useParkingStore();
  
  const [selectedType, setSelectedType] = useState<ParkingType>('hour');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2); // Default to 2 hours later
    return date;
  });

  // Find the parking spot by ID
  const parkingSpot = getParkingSpotById(id);
  
  if (!parkingSpot) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Parking spot not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const isResidential = parkingSpot.locationType === 'residential';

  // For residential parking, only show monthly option
  const availableTypes = isResidential 
    ? ['month'] as ParkingType[]
    : ['hour', 'day'] as ParkingType[];

  // If it's residential and we're not already on monthly, set it
  if (isResidential && selectedType !== 'month') {
    setSelectedType('month');
  }

  const calculatePrice = () => {
    if (selectedType === 'hour') {
      const hours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
      return (parkingSpot.hourlyRate || parkingSpot.price) * hours;
    } else if (selectedType === 'day') {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return (parkingSpot.dailyRate || parkingSpot.price * 8) * days;
    } else {
      return parkingSpot.monthlyRate || parkingSpot.price;
    }
  };

  const handleBookNow = () => {
    // For all parking types, navigate to vehicle selection
    router.push({
      pathname: '/auth/vehicle-details',
      params: { 
        spotId: parkingSpot.id,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        type: selectedType,
        price: calculatePrice().toString()
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Parking spot image */}
        <Image source={{ uri: parkingSpot.images[0] }} style={styles.image} />

        {/* Parking spot details */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{parkingSpot.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.yellow[500]} fill={colors.yellow[500]} />
              <Text style={styles.ratingText}>{parkingSpot.rating}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.locationText}>{parkingSpot.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.textLight} />
              <Text style={styles.infoText}>24/7 Access</Text>
            </View>
            <View style={styles.infoItem}>
              <Car size={16} color={colors.textLight} />
              <Text style={styles.infoText}>{parkingSpot.type || 'Standard'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Shield size={16} color={colors.textLight} />
              <Text style={styles.infoText}>Secure</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Parking type selection - only show for commercial parking */}
          {!isResidential && (
            <>
              <Text style={styles.sectionTitle}>Select Parking Type</Text>
              <View style={styles.parkingTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.parkingTypeButton,
                    selectedType === 'hour' && styles.selectedParkingType,
                  ]}
                  onPress={() => setSelectedType('hour')}
                >
                  <Text
                    style={[
                      styles.parkingTypeText,
                      selectedType === 'hour' && styles.selectedParkingTypeText,
                    ]}
                  >
                    Hourly
                  </Text>
                  <Text
                    style={[
                      styles.parkingTypePrice,
                      selectedType === 'hour' && styles.selectedParkingTypeText,
                    ]}
                  >
                    ₹{parkingSpot.price}/hr
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.parkingTypeButton,
                    selectedType === 'day' && styles.selectedParkingType,
                  ]}
                  onPress={() => setSelectedType('day')}
                >
                  <Text
                    style={[
                      styles.parkingTypeText,
                      selectedType === 'day' && styles.selectedParkingTypeText,
                    ]}
                  >
                    Daily
                  </Text>
                  <Text
                    style={[
                      styles.parkingTypePrice,
                      selectedType === 'day' && styles.selectedParkingTypeText,
                    ]}
                  >
                    ₹{parkingSpot.price * 8}/day
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Date and time selection for hourly and daily parking */}
          {!isResidential && (
            <View style={styles.dateTimeSection}>
              <CustomDateTimePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                mode={selectedType === 'hour' ? 'hourly' : 'hourly'}
              />
            </View>
          )}

          <View style={styles.divider} />

          {/* Owner information */}
          <Text style={styles.sectionTitle}>Parking Owner</Text>
          <View style={styles.ownerContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80' }}
              style={styles.ownerImage}
            />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{parkingSpot.ownerName || 'Parking Owner'}</Text>
              <Text style={styles.ownerJoined}>Member since 2021</Text>
            </View>
            {!isResidential && (
              <TouchableOpacity style={styles.callButton}>
                <Phone size={20} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{parkingSpot.description}</Text>
          
          {/* Rules and Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {parkingSpot.features.map((feature, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityText}>{feature}</Text>
              </View>
            ))}
          </View>
          
          {parkingSpot.rules && parkingSpot.rules.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Rules</Text>
              <View style={styles.rulesList}>
                {parkingSpot.rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <Text style={styles.ruleNumber}>{index + 1}.</Text>
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom booking bar */}
      <View style={styles.bookingBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{isResidential ? parkingSpot.price : calculatePrice()}</Text>
          <Text style={styles.priceUnit}>
            {isResidential ? '/month' : selectedType === 'hour' ? '/total' : '/total'}
          </Text>
        </View>
        <Button
          title="Book Now"
          onPress={handleBookNow}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 20,
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.yellow[700],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.textLight,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  parkingTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  parkingTypeButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  selectedParkingType: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  parkingTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  parkingTypePrice: {
    fontSize: 12,
    color: colors.textLight,
  },
  selectedParkingTypeText: {
    color: colors.white,
  },
  dateTimeSection: {
    marginBottom: 20,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ownerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  ownerJoined: {
    fontSize: 14,
    color: colors.textLight,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.pink[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textLight,
    marginBottom: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  amenityItem: {
    backgroundColor: colors.gray[100],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: colors.text,
  },
  rulesList: {
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ruleNumber: {
    width: 20,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  bookingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  priceUnit: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  bookButton: {
    flex: 1,
  },
});

export default ParkingSpotDetail;