import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Car, Plus, X, ChevronDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Vehicle } from '@/types';
import { Button } from './Button';

export interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle | null) => void;
  showAddButton?: boolean;
  onAddVehicle?: () => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  showAddButton = true,
  onAddVehicle,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
  });
  
  const handleSelectVehicle = (vehicle: Vehicle) => {
    onSelectVehicle(vehicle);
    setShowModal(false);
  };
  
  const handleAddVehicle = () => {
    if (onAddVehicle) {
      onAddVehicle();
    } else {
      setShowModal(false);
      setShowAddVehicleModal(true);
    }
  };

  const handleSaveVehicle = () => {
    // Validate vehicle details
    if (!newVehicle.make || !newVehicle.model || !newVehicle.licensePlate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // In a real app, this would save to the backend
    // For now, we'll just simulate adding a new vehicle
    const vehicle: Vehicle = {
      id: `v${Date.now()}`,
      type: newVehicle.type || 'car',
      make: newVehicle.make,
      model: newVehicle.model,
      year: newVehicle.year || new Date().getFullYear(),
      color: newVehicle.color || 'Black',
      licensePlate: newVehicle.licensePlate,
      isDefault: vehicles.length === 0, // Make default if it's the first vehicle
    };

    // Select the new vehicle
    onSelectVehicle(vehicle);
    setShowAddVehicleModal(false);

    // Reset form
    setNewVehicle({
      type: 'car',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      licensePlate: '',
    });
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.vehicleInfo}>
          <Car size={20} color={colors.primary} />
          <Text style={styles.vehicleText}>
            {selectedVehicle 
              ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})`
              : 'Select a vehicle'}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.textLight} />
      </TouchableOpacity>
      
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vehicle</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.vehicleList}>
              {vehicles.map((vehicle) => (
                <TouchableOpacity 
                  key={vehicle.id}
                  style={[
                    styles.vehicleItem,
                    selectedVehicle?.id === vehicle.id && styles.selectedVehicleItem
                  ]}
                  onPress={() => handleSelectVehicle(vehicle)}
                >
                  <View style={styles.vehicleItemContent}>
                    <Car 
                      size={20} 
                      color={selectedVehicle?.id === vehicle.id ? colors.white : colors.primary} 
                    />
                    <View style={styles.vehicleDetails}>
                      <Text 
                        style={[
                          styles.vehicleName,
                          selectedVehicle?.id === vehicle.id && styles.selectedVehicleText
                        ]}
                      >
                        {vehicle.make} {vehicle.model}
                      </Text>
                      <Text 
                        style={[
                          styles.vehiclePlate,
                          selectedVehicle?.id === vehicle.id && styles.selectedVehicleText
                        ]}
                      >
                        {vehicle.licensePlate}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {vehicles.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No vehicles added yet
                  </Text>
                </View>
              )}
              
              {showAddButton && (
                <TouchableOpacity 
                  style={styles.addVehicleButton}
                  onPress={handleAddVehicle}
                >
                  <Plus size={20} color={colors.primary} />
                  <Text style={styles.addVehicleText}>Add New Vehicle</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal
        visible={showAddVehicleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Vehicle</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAddVehicleModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Make *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Honda, Toyota"
                  value={newVehicle.make}
                  onChangeText={(text) => setNewVehicle({...newVehicle, make: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Model *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Civic, Corolla"
                  value={newVehicle.model}
                  onChangeText={(text) => setNewVehicle({...newVehicle, model: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>License Plate *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., MH-01-AB-1234"
                  value={newVehicle.licensePlate}
                  onChangeText={(text) => setNewVehicle({...newVehicle, licensePlate: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 2023"
                  value={newVehicle.year?.toString()}
                  onChangeText={(text) => setNewVehicle({...newVehicle, year: parseInt(text) || new Date().getFullYear()})}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Color</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Black, White, Red"
                  value={newVehicle.color}
                  onChangeText={(text) => setNewVehicle({...newVehicle, color: text})}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Save Vehicle"
                  onPress={handleSaveVehicle}
                  fullWidth
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
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
  vehicleList: {
    padding: 16,
  },
  vehicleItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  selectedVehicleItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  vehicleItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleDetails: {
    marginLeft: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedVehicleText: {
    color: colors.white,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addVehicleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
});