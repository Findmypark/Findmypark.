import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import { X, Check, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from './Button';
import { useParkingStore } from '@/store/parkingStore';

// Create a simple slider component since we can't use the external library
const SimpleSlider = ({ 
  values, 
  min, 
  max, 
  step, 
  onValuesChange 
}: { 
  values: number[]; 
  min: number; 
  max: number; 
  step: number; 
  onValuesChange: (values: number[]) => void; 
}) => {
  // This is a simplified slider - in a real app, you'd implement a proper slider
  // with gesture handling, but for now we'll just show the current values
  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.track}>
        <View style={sliderStyles.selectedTrack} />
      </View>
      <View style={sliderStyles.valueContainer}>
        <Text style={sliderStyles.valueText}>
          Current: {values.join(' - ')} (Min: {min}, Max: {max}, Step: {step})
        </Text>
        <Text style={sliderStyles.note}>
          Note: Slider functionality is simplified in this demo
        </Text>
      </View>
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  track: {
    width: '90%',
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
  },
  selectedTrack: {
    height: '100%',
    width: '50%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  valueContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 12,
    color: colors.textLight,
  },
  note: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
  },
});

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
}) => {
  const { filter, updateFilter, applyFilter, resetFilter } = useParkingStore();
  
  const [priceRange, setPriceRange] = useState<[number, number]>(filter.priceRange || [0, 5000]);
  const [distance, setDistance] = useState<number>(filter.distance || 10);
  const [amenities, setAmenities] = useState<string[]>(filter.amenities || []);
  const [availability, setAvailability] = useState<boolean>(filter.availability || true);
  const [rating, setRating] = useState<number>(filter.rating || 0);
  const [locationType, setLocationType] = useState<'commercial' | 'residential' | undefined>(filter.locationType);
  const [priceUnit, setPriceUnit] = useState<'hour' | 'day' | 'month' | undefined>(filter.priceUnit);
  const [parkingType, setParkingType] = useState<'instant' | 'lease' | undefined>(filter.parkingType);
  
  useEffect(() => {
    // Update local state when filter changes
    setPriceRange(filter.priceRange || [0, 5000]);
    setDistance(filter.distance || 10);
    setAmenities(filter.amenities || []);
    setAvailability(filter.availability || true);
    setRating(filter.rating || 0);
    setLocationType(filter.locationType);
    setPriceUnit(filter.priceUnit);
    setParkingType(filter.parkingType);
  }, [filter]);
  
  const handleApplyFilter = () => {
    updateFilter({
      priceRange,
      distance,
      amenities,
      availability,
      rating,
      locationType,
      priceUnit,
      parkingType,
    });
    
    applyFilter();
    onClose();
  };
  
  const handleResetFilter = () => {
    resetFilter();
    onClose();
  };
  
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  const amenityOptions = [
    'CCTV',
    'Security Guard',
    'Covered',
    'Open Air',
    'EV Charging',
    'Valet',
    'Car Wash',
  ];
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Parking Type */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Parking Type</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    parkingType === 'instant' && styles.selectedOptionButton
                  ]}
                  onPress={() => setParkingType('instant')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      parkingType === 'instant' && styles.selectedOptionText
                    ]}
                  >
                    Instant
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    parkingType === 'lease' && styles.selectedOptionButton
                  ]}
                  onPress={() => setParkingType('lease')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      parkingType === 'lease' && styles.selectedOptionText
                    ]}
                  >
                    Lease
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    parkingType === undefined && styles.selectedOptionButton
                  ]}
                  onPress={() => setParkingType(undefined)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      parkingType === undefined && styles.selectedOptionText
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeText}>₹{priceRange[0]}</Text>
                <Text style={styles.priceRangeText}>₹{priceRange[1]}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <SimpleSlider
                  values={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={5000}
                  step={50}
                  onValuesChange={(values: number[]) => setPriceRange([values[0], values[1]])}
                />
              </View>
            </View>
            
            {/* Distance */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.distanceContainer}>
                <Text style={styles.distanceText}>{distance} km</Text>
              </View>
              <View style={styles.sliderContainer}>
                <SimpleSlider
                  values={[distance]}
                  min={1}
                  max={20}
                  step={1}
                  onValuesChange={(values: number[]) => setDistance(values[0])}
                />
              </View>
            </View>
            
            {/* Location Type */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Location Type</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    locationType === 'commercial' && styles.selectedOptionButton
                  ]}
                  onPress={() => setLocationType('commercial')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      locationType === 'commercial' && styles.selectedOptionText
                    ]}
                  >
                    Commercial
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    locationType === 'residential' && styles.selectedOptionButton
                  ]}
                  onPress={() => setLocationType('residential')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      locationType === 'residential' && styles.selectedOptionText
                    ]}
                  >
                    Residential
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    locationType === undefined && styles.selectedOptionButton
                  ]}
                  onPress={() => setLocationType(undefined)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      locationType === undefined && styles.selectedOptionText
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Price Unit */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Price Unit</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    priceUnit === 'hour' && styles.selectedOptionButton
                  ]}
                  onPress={() => setPriceUnit('hour')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      priceUnit === 'hour' && styles.selectedOptionText
                    ]}
                  >
                    Hourly
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    priceUnit === 'day' && styles.selectedOptionButton
                  ]}
                  onPress={() => setPriceUnit('day')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      priceUnit === 'day' && styles.selectedOptionText
                    ]}
                  >
                    Daily
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    priceUnit === 'month' && styles.selectedOptionButton
                  ]}
                  onPress={() => setPriceUnit('month')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      priceUnit === 'month' && styles.selectedOptionText
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    priceUnit === undefined && styles.selectedOptionButton
                  ]}
                  onPress={() => setPriceUnit(undefined)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      priceUnit === undefined && styles.selectedOptionText
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity 
                    key={star}
                    onPress={() => setRating(star)}
                  >
                    <Star 
                      size={24} 
                      color={star <= rating ? colors.yellow[500] : colors.gray[300]} 
                      fill={star <= rating ? colors.yellow[500] : 'none'}
                    />
                  </TouchableOpacity>
                ))}
                
                {rating > 0 && (
                  <TouchableOpacity 
                    style={styles.clearRating}
                    onPress={() => setRating(0)}
                  >
                    <Text style={styles.clearRatingText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {/* Availability */}
            <View style={styles.filterSection}>
              <View style={styles.switchContainer}>
                <Text style={styles.sectionTitle}>Show Available Only</Text>
                <Switch
                  value={availability}
                  onValueChange={setAvailability}
                  trackColor={{ false: colors.gray[300], true: colors.primary + '50' }}
                  thumbColor={availability ? colors.primary : colors.gray[400]}
                />
              </View>
            </View>
            
            {/* Amenities */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {amenityOptions.map((amenity) => (
                  <TouchableOpacity 
                    key={amenity}
                    style={[
                      styles.amenityItem,
                      amenities.includes(amenity) && styles.selectedAmenityItem
                    ]}
                    onPress={() => toggleAmenity(amenity)}
                  >
                    {amenities.includes(amenity) && (
                      <Check size={16} color={colors.white} style={styles.checkIcon} />
                    )}
                    <Text 
                      style={[
                        styles.amenityText,
                        amenities.includes(amenity) && styles.selectedAmenityText
                      ]}
                    >
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button
              title="Reset"
              variant="outline"
              onPress={handleResetFilter}
              style={styles.resetButton}
            />
            <Button
              title="Apply Filters"
              onPress={handleApplyFilter}
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceRangeText: {
    fontSize: 14,
    color: colors.text,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  distanceContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  selectedOptionButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.white,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearRating: {
    marginLeft: 8,
  },
  clearRatingText: {
    fontSize: 14,
    color: colors.primary,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  selectedAmenityItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkIcon: {
    marginRight: 4,
  },
  amenityText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedAmenityText: {
    color: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});