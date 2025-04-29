import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { X, Check, Mail, User, MapPin, Phone, MessageCircle, PhoneCall } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { TextInput } from './TextInput';
import { Button } from './Button';

interface JoinWaitlistModalProps {
  visible: boolean;
  onClose: () => void;
}

export const JoinWaitlistModal: React.FC<JoinWaitlistModalProps> = ({
  visible,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [contactPreference, setContactPreference] = useState<'call' | 'message' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async () => {
    if (!name || !email || !phone || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate contact preference
    if (!contactPreference) {
      Alert.alert('Contact Preference', 'Please select how we should contact you');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setLocation('');
        setContactPreference(null);
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:7093656134');
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isSuccess ? 'Success!' : 'Instant Parking Solutions'}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {isSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Check size={32} color={colors.white} />
                </View>
                <Text style={styles.successTitle}>Request Received!</Text>
                <Text style={styles.successMessage}>
                  Thank you for your interest. Our team will contact you shortly to provide immediate parking solutions in your area.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalDescription}>
                  Get immediate access to premium parking spots in your area. Fill out the form below and our team will contact you shortly.
                </Text>
                
                <View style={styles.formContainer}>
                  <TextInput
                    label="Full Name *"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    leftIcon={<User size={20} color={colors.textLight} />}
                  />
                  
                  <TextInput
                    label="Email Address *"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Mail size={20} color={colors.textLight} />}
                  />
                  
                  <TextInput
                    label="Phone Number *"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    leftIcon={<Phone size={20} color={colors.textLight} />}
                  />
                  
                  <TextInput
                    label="Preferred Location *"
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter your preferred area"
                    leftIcon={<MapPin size={20} color={colors.textLight} />}
                  />
                  
                  <View style={styles.contactPreferenceContainer}>
                    <Text style={styles.contactPreferenceLabel}>How should we contact you? *</Text>
                    <View style={styles.contactOptions}>
                      <TouchableOpacity 
                        style={[
                          styles.contactOption,
                          contactPreference === 'call' && styles.contactOptionSelected
                        ]}
                        onPress={() => setContactPreference('call')}
                      >
                        <PhoneCall 
                          size={20} 
                          color={contactPreference === 'call' ? colors.white : colors.primary} 
                        />
                        <Text 
                          style={[
                            styles.contactOptionText,
                            contactPreference === 'call' && styles.contactOptionTextSelected
                          ]}
                        >
                          Call Me
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.contactOption,
                          contactPreference === 'message' && styles.contactOptionSelected
                        ]}
                        onPress={() => setContactPreference('message')}
                      >
                        <MessageCircle 
                          size={20} 
                          color={contactPreference === 'message' ? colors.white : colors.primary} 
                        />
                        <Text 
                          style={[
                            styles.contactOptionText,
                            contactPreference === 'message' && styles.contactOptionTextSelected
                          ]}
                        >
                          Message Me
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={styles.assistanceContainer}>
                  <Text style={styles.assistanceTitle}>Need immediate assistance?</Text>
                  <TouchableOpacity 
                    style={styles.assistanceButton}
                    onPress={handleCallSupport}
                  >
                    <PhoneCall size={16} color={colors.white} />
                    <Text style={styles.assistanceButtonText}>
                      Contact our team: 7093656134
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.servicesContainer}>
                  <Text style={styles.servicesTitle}>Our Instant Services:</Text>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <Check size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.serviceText}>
                      Immediate parking spot allocation
                    </Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <Check size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.serviceText}>
                      24/7 customer support
                    </Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <Check size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.serviceText}>
                      Flexible hourly and monthly options
                    </Text>
                  </View>
                  
                  <View style={styles.serviceItem}>
                    <View style={styles.serviceIconContainer}>
                      <Check size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.serviceText}>
                      Secure payment processing
                    </Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
          
          {!isSuccess && (
            <View style={styles.modalFooter}>
              <Button
                title={isLoading ? 'Submitting...' : 'Submit Request'}
                onPress={handleSubmit}
                disabled={isLoading}
                leftIcon={isLoading ? <ActivityIndicator size="small" color={colors.white} /> : undefined}
                fullWidth
              />
            </View>
          )}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    maxHeight: '70%',
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 24,
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  contactPreferenceContainer: {
    marginTop: 16,
  },
  contactPreferenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  contactOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  contactOptionSelected: {
    backgroundColor: colors.primary,
  },
  contactOptionText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  contactOptionTextSelected: {
    color: colors.white,
  },
  assistanceContainer: {
    backgroundColor: colors.gray[100],
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  assistanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  assistanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  assistanceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    marginLeft: 8,
  },
  servicesContainer: {
    backgroundColor: colors.gray[100],
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});