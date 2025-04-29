import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { colors } from '@/constants/colors';
import { MapPin, X, Check } from 'lucide-react-native';
import { locationCoordinates } from '@/constants/locations';
import { GoogleMap } from './GoogleMap';

interface LocationSelectorProps {
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
  onCancel: () => void;
  initialLocation?: { latitude: number; longitude: number };
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onSelectLocation,
  onCancel,
  initialLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(
    initialLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMapClick = (location: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
  };
  
  const handleConfirm = () => {
    if (selectedLocation) {
      setIsLoading(true);
      // Simulate a delay to show loading state
      setTimeout(() => {
        onSelectLocation(selectedLocation);
        setIsLoading(false);
      }, 1000);
    }
  };
  
  // Default to Hyderabad city center
  const defaultLocation = { latitude: 17.3850, longitude: 78.4867 };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onCancel}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location</Text>
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            (!selectedLocation) && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedLocation || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Check size={24} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.mapContainer}>
        <GoogleMap
          initialLocation="Hyderabad"
          onLocationSelect={handleMapClick}
          selectable={true}
          selectedLocation={selectedLocation || undefined}
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.instructionContainer}>
          <MapPin size={20} color={colors.primary} />
          <Text style={styles.instructionText}>
            Tap on the map to select your parking location
          </Text>
        </View>
        
        {selectedLocation && (
          <View style={styles.selectedLocationContainer}>
            <Text style={styles.selectedLocationTitle}>Selected Location</Text>
            <Text style={styles.selectedLocationText}>
              Latitude: {selectedLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.selectedLocationText}>
              Longitude: {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  confirmButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray[300],
  },
  mapContainer: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  instructionText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  selectedLocationContainer: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
  },
  selectedLocationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedLocationText: {
    fontSize: 12,
    color: colors.textLight,
  },
});