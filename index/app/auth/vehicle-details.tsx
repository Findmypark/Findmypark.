import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Car, ChevronRight, ArrowLeft, Bike, Truck } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useAuthStore } from '@/store/authStore';
import { VehicleSelector } from '@/components/VehicleSelector';

// Indian state codes for license plates
const INDIAN_STATE_CODES = [
  'AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 
  'KA', 'KL', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB', 
  'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB', 'AN', 'CH', 
  'DN', 'DD', 'DL', 'JK', 'LA', 'LD', 'PY'
];

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    spotId: string;
    startTime: string;
    endTime: string;
    type: string;
    price: string;
  }>();
  
  const { user, addVehicle } = useAuthStore();
  
  const [vehicleType, setVehicleType] = useState<'car' | 'motorcycle' | 'truck'>('car');
  const [licensePlate, setLicensePlate] = useState('');
  const [carName, setCarName] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [licensePlateError, setLicensePlateError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(user?.vehicles?.[0] || null);
  const [addingNewVehicle, setAddingNewVehicle] = useState(user?.vehicles?.length === 0);

  const vehicleTypes = [
    {
      type: 'car',
      label: 'Car',
      icon: <Car size={24} color={vehicleType === 'car' ? colors.white : colors.text} />,
    },
    {
      type: 'motorcycle',
      label: 'Motorcycle',
      icon: <Bike size={24} color={vehicleType === 'motorcycle' ? colors.white : colors.text} />,
    },
    {
      type: 'truck',
      label: 'Truck',
      icon: <Truck size={24} color={vehicleType === 'truck' ? colors.white : colors.text} />,
    },
  ];

  // Validate Indian license plate format
  const validateLicensePlate = (plate: string) => {
    // Remove spaces for validation
    const cleanPlate = plate.replace(/\s/g, '').toUpperCase();
    
    // Basic format: 2 letters (state code) + 1-2 digits (district code) + 1-2 letters (series) + 1-4 digits (number)
    // Example: TS09AB1234, AP02CD5678
    const regex = /^([A-Z]{2})(\d{1,2})([A-Z]{1,2})(\d{1,4})$/;
    const match = cleanPlate.match(regex);
    
    if (!match) {
      return 'Invalid format. Example: TS 09 AB 1234';
    }
    
    const stateCode = match[1];
    if (!INDIAN_STATE_CODES.includes(stateCode)) {
      return `Invalid state code. Valid codes include: TS, AP, TN, etc.`;
    }
    
    return '';
  };

  // Format license plate as user types
  useEffect(() => {
    if (licensePlate) {
      // Remove all spaces first
      const cleanPlate = licensePlate.replace(/\s/g, '').toUpperCase();
      
      // Format with spaces: XX 00 XX 0000
      let formattedPlate = '';
      for (let i = 0; i < cleanPlate.length; i++) {
        if (i === 2 || i === 4 || i === 6) {
          formattedPlate += ' ';
        }
        formattedPlate += cleanPlate[i];
      }
      
      // Only update if it's different to avoid infinite loop
      if (formattedPlate !== licensePlate) {
        setLicensePlate(formattedPlate);
      }
      
      // Validate after formatting
      setLicensePlateError(validateLicensePlate(cleanPlate));
    } else {
      setLicensePlateError('');
    }
  }, [licensePlate]);

  const handleSaveVehicle = async () => {
    // Final validation before saving
    if (addingNewVehicle) {
      const error = validateLicensePlate(licensePlate);
      if (error) {
        Alert.alert('Invalid License Plate', error);
        return;
      }
      
      if (!carName.trim() || !model.trim() || !year.trim()) {
        Alert.alert('Missing Information', 'Please fill in all required fields');
        return;
      }
      
      setLoading(true);
      
      try {
        const newVehicle = {
          id: Date.now().toString(),
          type: vehicleType,
          licensePlate,
          make: carName,
          model,
          year: parseInt(year, 10),
          color: 'Not specified',
          isDefault: user?.vehicles?.length === 0,
        };
        
        await addVehicle(newVehicle);
        setSelectedVehicle(newVehicle);
        setAddingNewVehicle(false);
      } catch (error) {
        console.error('Error saving vehicle:', error);
        Alert.alert('Error', 'Failed to save vehicle information');
      } finally {
        setLoading(false);
      }
    } else {
      // Continue with selected vehicle
      if (!selectedVehicle) {
        Alert.alert('Vehicle Required', 'Please select a vehicle or add a new one');
        return;
      }
      
      // Navigate to payment with all booking details
      router.push({
        pathname: '/auth/payment-method',
        params: {
          spotId: params.spotId,
          startTime: params.startTime,
          endTime: params.endTime,
          type: params.type,
          price: params.price,
          vehicleId: selectedVehicle.id,
        }
      });
    }
  };

  const isFormValid = () => {
    if (addingNewVehicle) {
      return (
        licensePlate.trim() !== '' &&
        !licensePlateError &&
        carName.trim() !== '' &&
        model.trim() !== '' &&
        year.trim() !== '' &&
        !isNaN(parseInt(year, 10))
      );
    } else {
      return selectedVehicle !== null;
    }
  };

  const handleAddNewVehicle = () => {
    setAddingNewVehicle(true);
    setSelectedVehicle(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          <Text style={styles.headerTitle}>Vehicle Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {user?.vehicles && user.vehicles.length > 0 && !addingNewVehicle ? (
              <>
                <Text style={styles.sectionTitle}>Select Your Vehicle</Text>
                <VehicleSelector
                  vehicles={user.vehicles}
                  selectedVehicle={selectedVehicle}
                  onSelectVehicle={setSelectedVehicle}
                  onAddVehicle={handleAddNewVehicle}
                />
                
                {selectedVehicle && (
                  <View style={styles.selectedVehicleDetails}>
                    <Text style={styles.vehicleDetailTitle}>Selected Vehicle:</Text>
                    <Text style={styles.vehicleDetailText}>
                      {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                    </Text>
                    <Text style={styles.vehicleDetailText}>
                      License Plate: {selectedVehicle.licensePlate}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Add Your Vehicle</Text>
                <View style={styles.vehicleTypeContainer}>
                  {vehicleTypes.map((item) => (
                    <TouchableOpacity
                      key={item.type}
                      style={[
                        styles.vehicleTypeButton,
                        vehicleType === item.type && styles.vehicleTypeButtonActive,
                      ]}
                      onPress={() => setVehicleType(item.type as any)}
                    >
                      <View style={[
                        styles.vehicleTypeIconContainer,
                        vehicleType === item.type && styles.vehicleTypeIconContainerActive,
                      ]}>
                        {item.icon}
                      </View>
                      <Text style={[
                        styles.vehicleTypeText,
                        vehicleType === item.type && styles.vehicleTypeTextActive,
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  label="License Plate Number"
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                  placeholder="e.g., TS 09 AB 1234"
                  autoCapitalize="characters"
                  error={licensePlateError}
                  helperText="Format: State Code + District Code + Series + Number"
                />

                <TextInput
                  label="Car Name"
                  value={carName}
                  onChangeText={setCarName}
                  placeholder="e.g., Maruti Suzuki, Tata, Honda"
                  autoCapitalize="words"
                />

                <TextInput
                  label="Model"
                  value={model}
                  onChangeText={setModel}
                  placeholder="e.g., Swift, Nexon, City"
                  autoCapitalize="words"
                />

                <TextInput
                  label="Year"
                  value={year}
                  onChangeText={setYear}
                  placeholder="e.g., 2022"
                  keyboardType="number-pad"
                />
              </>
            )}

            <View style={styles.bookingSummary}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Parking Type:</Text>
                <Text style={styles.summaryValue}>
                  {params.type === 'hour' ? 'Hourly' : 
                   params.type === 'day' ? 'Daily' : 'Monthly'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Start Time:</Text>
                <Text style={styles.summaryValue}>
                  {new Date(params.startTime).toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>End Time:</Text>
                <Text style={styles.summaryValue}>
                  {new Date(params.endTime).toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Price:</Text>
                <Text style={styles.summaryValue}>₹{params.price}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={addingNewVehicle ? "Save Vehicle" : "Continue to Payment"}
            onPress={handleSaveVehicle}
            disabled={!isFormValid()}
            loading={loading}
            fullWidth
            rightIcon={<ChevronRight size={20} color={colors.white} />}
          />
          {addingNewVehicle && user?.vehicles && user.vehicles.length > 0 && (
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => setAddingNewVehicle(false)}
            >
              <Text style={styles.skipButtonText}>Back to vehicle selection</Text>
            </TouchableOpacity>
          )}
        </View>
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  vehicleTypeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleTypeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  vehicleTypeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  vehicleTypeIconContainerActive: {
    backgroundColor: colors.primary,
  },
  vehicleTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  vehicleTypeTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedVehicleDetails: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  vehicleDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  vehicleDetailText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  bookingSummary: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
});