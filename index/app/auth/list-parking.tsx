import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, MapPin, Clock, IndianRupee, Calendar, Info, Camera, X, Upload, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useParkingStore } from '@/store/parkingStore';
import { LocationSelector } from '@/components/LocationSelector';
import * as ImagePicker from 'expo-image-picker';
import { DemoBanner } from '@/components/DemoBanner';

export default function ListParkingScreen() {
  const router = useRouter();
  const { addParkingSpot } = useParkingStore();
  
  const [parkingName, setParkingName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [totalSpots, setTotalSpots] = useState('');
  const [priceUnit, setPriceUnit] = useState<'hour' | 'day' | 'month'>('hour');
  const [locationType, setLocationType] = useState<'commercial' | 'residential'>('commercial');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSecured, setIsSecured] = useState(false);
  const [hasCctv, setHasCctv] = useState(false);
  const [has24Access, setHas24Access] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  
  const amenityOptions = [
    { id: 'secured', label: 'Secured Parking', state: isSecured, setter: setIsSecured },
    { id: 'cctv', label: 'CCTV Surveillance', state: hasCctv, setter: setHasCctv },
    { id: '24_access', label: '24/7 Access', state: has24Access, setter: setHas24Access },
  ];
  
  const handleLocationSelect = (location: { latitude: number; longitude: number }) => {
    setCoordinates(location);
    setShowLocationSelector(false);
  };
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };
  
  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Collect amenities
      const selectedAmenities = amenityOptions
        .filter(option => option.state)
        .map(option => option.id);
      
      // Use uploaded photos or default images
      const parkingImages = photos.length > 0 
        ? photos 
        : [
            'https://images.unsplash.com/photo-1590674899484-13d6c7094a9f?q=80&w=2574&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=2574&auto=format&fit=crop'
          ];
      
      await addParkingSpot({
        id: `spot_${Date.now()}`,
        name: parkingName,
        address,
        description,
        price: parseFloat(price),
        priceUnit,
        rating: 0,
        reviews: 0,
        images: parkingImages,
        amenities: selectedAmenities,
        coordinates,
        available: true,
        availableSpots: parseInt(totalSpots, 10),
        locationType,
        owner: {
          id: 'self',
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop',
          rating: 4.5,
        }
      });
      
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error adding parking spot:', error);
      Alert.alert('Error', 'Failed to add parking spot. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const isFormValid = () => {
    return (
      parkingName.trim() !== '' &&
      address.trim() !== '' &&
      description.trim() !== '' &&
      price.trim() !== '' && !isNaN(parseFloat(price)) &&
      totalSpots.trim() !== '' && !isNaN(parseInt(totalSpots, 10)) &&
      coordinates.latitude !== 0 && coordinates.longitude !== 0 &&
      (locationType !== 'residential' || photos.length > 0) // Require photos for residential
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <DemoBanner />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List Your Parking</Text>
          <View style={styles.placeholder} />
        </View>

        {showLocationSelector ? (
          <LocationSelector 
            onSelectLocation={handleLocationSelect}
            onCancel={() => setShowLocationSelector(false)}
          />
        ) : (
          <>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formContainer}>
                <TextInput
                  label="Parking Name"
                  value={parkingName}
                  onChangeText={setParkingName}
                  placeholder="e.g., Jubilee Hills Secure Parking"
                  autoCapitalize="words"
                />
                
                <View style={styles.locationInputContainer}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <TouchableOpacity 
                    style={styles.locationButton}
                    onPress={() => setShowLocationSelector(true)}
                  >
                    <MapPin size={20} color={colors.primary} />
                    <Text style={styles.locationButtonText}>
                      {coordinates.latitude !== 0 
                        ? 'Location Selected (Tap to change)' 
                        : 'Select Location on Map'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Full address of your parking"
                  multiline
                  numberOfLines={2}
                />
                
                <TextInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your parking space"
                  multiline
                  numberOfLines={3}
                />
                
                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <TextInput
                      label="Price"
                      value={price}
                      onChangeText={setPrice}
                      placeholder="0"
                      keyboardType="numeric"
                      leftIcon={<IndianRupee size={16} color={colors.textLight} />}
                    />
                  </View>
                  
                  <View style={styles.halfInput}>
                    <TextInput
                      label="Total Spots"
                      value={totalSpots}
                      onChangeText={setTotalSpots}
                      placeholder="1"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                
                <Text style={styles.sectionTitle}>Parking Type</Text>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      locationType === 'commercial' && styles.segmentButtonActive
                    ]}
                    onPress={() => setLocationType('commercial')}
                  >
                    <Text style={[
                      styles.segmentButtonText,
                      locationType === 'commercial' && styles.segmentButtonTextActive
                    ]}>
                      Commercial
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      locationType === 'residential' && styles.segmentButtonActive
                    ]}
                    onPress={() => setLocationType('residential')}
                  >
                    <Text style={[
                      styles.segmentButtonText,
                      locationType === 'residential' && styles.segmentButtonTextActive
                    ]}>
                      Residential
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.sectionTitle}>Pricing Unit</Text>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      priceUnit === 'hour' && styles.segmentButtonActive,
                      locationType === 'residential' && styles.disabledSegment
                    ]}
                    onPress={() => locationType !== 'residential' && setPriceUnit('hour')}
                    disabled={locationType === 'residential'}
                  >
                    <Text style={[
                      styles.segmentButtonText,
                      priceUnit === 'hour' && styles.segmentButtonTextActive,
                      locationType === 'residential' && styles.disabledText
                    ]}>
                      Hourly
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      priceUnit === 'day' && styles.segmentButtonActive
                    ]}
                    onPress={() => setPriceUnit('day')}
                  >
                    <Text style={[
                      styles.segmentButtonText,
                      priceUnit === 'day' && styles.segmentButtonTextActive
                    ]}>
                      Daily
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      priceUnit === 'month' && styles.segmentButtonActive,
                      locationType === 'commercial' && styles.disabledSegment
                    ]}
                    onPress={() => locationType !== 'commercial' && setPriceUnit('month')}
                    disabled={locationType === 'commercial'}
                  >
                    <Text style={[
                      styles.segmentButtonText,
                      priceUnit === 'month' && styles.segmentButtonTextActive,
                      locationType === 'commercial' && styles.disabledText
                    ]}>
                      Monthly
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Photo upload section - only for residential */}
                {locationType === 'residential' && (
                  <>
                    <Text style={styles.sectionTitle}>Photos</Text>
                    <Text style={styles.photoDescription}>
                      Upload photos of your parking space (required for residential listings)
                    </Text>
                    
                    <View style={styles.photoGrid}>
                      {photos.map((photo, index) => (
                        <View key={index} style={styles.photoContainer}>
                          <Image source={{ uri: photo }} style={styles.photo} />
                          <TouchableOpacity 
                            style={styles.removePhotoButton}
                            onPress={() => removePhoto(index)}
                          >
                            <X size={16} color={colors.white} />
                          </TouchableOpacity>
                        </View>
                      ))}
                      
                      <TouchableOpacity 
                        style={styles.addPhotoButton}
                        onPress={pickImage}
                      >
                        <Upload size={24} color={colors.primary} />
                        <Text style={styles.addPhotoText}>Add Photo</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {photos.length === 0 && (
                      <Text style={styles.photoWarning}>
                        Photos are required for residential parking listings
                      </Text>
                    )}
                  </>
                )}
                
                <Text style={styles.sectionTitle}>Amenities</Text>
                {amenityOptions.map((option) => (
                  <View key={option.id} style={styles.amenityRow}>
                    <Text style={styles.amenityText}>{option.label}</Text>
                    <Switch
                      value={option.state}
                      onValueChange={option.setter}
                      trackColor={{ false: colors.gray[300], true: colors.primaryLight }}
                      thumbColor={option.state ? colors.primary : colors.gray[100]}
                    />
                  </View>
                ))}
                
                <View style={styles.infoContainer}>
                  <Info size={20} color={colors.primary} />
                  <Text style={styles.infoText}>
                    Your listing will be reviewed before it appears on the platform. This usually takes 24-48 hours.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title="Submit Listing"
                onPress={handleSubmit}
                disabled={!isFormValid()}
                loading={loading}
                fullWidth
                rightIcon={<ChevronRight size={20} color={colors.white} />}
              />
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  locationInputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 14,
    color: colors.textLight,
  },
  segmentButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  disabledSegment: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.gray[400],
  },
  amenityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  amenityText: {
    fontSize: 14,
    color: colors.text,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight + '20',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
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
  photoDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  photoContainer: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[50],
  },
  addPhotoText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  photoWarning: {
    fontSize: 12,
    color: colors.error,
    marginBottom: 16,
  },
});