import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  AlertCircle,
  Smartphone,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { useParkingStore } from '@/store/parkingStore';
import { DemoBanner } from '@/components/DemoBanner';
import { PaymentMethod } from '@/types';

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    spotId: string;
    startTime: string;
    endTime: string;
    type: string;
    price: string;
    vehicleId: string;
  }>();
  
  const { user, addPaymentMethod, isLoading: authLoading, error: authError } = useAuthStore();
  const { bookParkingSpot, isLoading: bookingLoading, error: bookingError } = useParkingStore();
  
  const [paymentType, setPaymentType] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    user?.paymentMethods?.find(pm => pm.isDefault) || null
  );
  const [addingNewPayment, setAddingNewPayment] = useState(user?.paymentMethods?.length === 0);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const handleCardNumberChange = (value: string) => {
    setCardNumber(formatCardNumber(value));
  };
  
  const handleExpiryMonthChange = (value: string) => {
    // Only allow 2 digits
    const digits = value.replace(/\D/g, '');
    setExpiryMonth(digits.slice(0, 2));
  };
  
  const handleExpiryYearChange = (value: string) => {
    // Only allow 2 digits
    const digits = value.replace(/\D/g, '');
    setExpiryYear(digits.slice(0, 2));
  };
  
  const handleCvvChange = (value: string) => {
    // Only allow 3-4 digits
    const digits = value.replace(/\D/g, '');
    setCvv(digits.slice(0, 4));
  };
  
  const validateCardDetails = () => {
    // Clear previous errors
    setErrorMessage('');
    
    // Validate card number (should be 16 digits)
    const cardDigits = cardNumber.replace(/\D/g, '');
    if (cardDigits.length !== 16) {
      setErrorMessage('Please enter a valid 16-digit card number');
      return false;
    }
    
    // Validate cardholder name
    if (!cardholderName.trim()) {
      setErrorMessage('Please enter the cardholder name');
      return false;
    }
    
    // Validate expiry month (1-12)
    const month = parseInt(expiryMonth, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      setErrorMessage('Please enter a valid expiry month (1-12)');
      return false;
    }
    
    // Validate expiry year (current year or later)
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
    const year = parseInt(expiryYear, 10);
    if (isNaN(year) || year < currentYear) {
      setErrorMessage('Please enter a valid expiry year');
      return false;
    }
    
    // Validate CVV (3-4 digits)
    if (cvv.length < 3) {
      setErrorMessage('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };
  
  const validateUpiId = () => {
    // Clear previous errors
    setErrorMessage('');
    
    // Basic UPI ID validation (username@provider)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiRegex.test(upiId)) {
      setErrorMessage('Please enter a valid UPI ID (e.g., username@upi)');
      return false;
    }
    
    return true;
  };
  
  const handleAddPaymentMethod = async () => {
    let isValid = false;
    
    if (paymentType === 'card') {
      isValid = validateCardDetails();
    } else {
      isValid = validateUpiId();
    }
    
    if (!isValid) {
      return;
    }
    
    try {
      let success = false;
      
      if (paymentType === 'card') {
        success = await addPaymentMethod({
          id: '', // Will be assigned by the server
          type: 'card',
          cardNumber,
          cardholderName,
          expiryMonth: parseInt(expiryMonth, 10),
          expiryYear: parseInt(expiryYear, 10),
          isDefault,
          last4: cardNumber.slice(-4),
          cardBrand: 'visa', // Default to visa for demo
        });
      } else {
        success = await addPaymentMethod({
          id: '', // Will be assigned by the server
          type: 'upi',
          upiId,
          isDefault,
        });
      }
      
      if (success) {
        // Find the newly added payment method
        const newPaymentMethod = user?.paymentMethods?.find(pm => 
          (pm.type === 'card' && 'last4' in pm && pm.last4 === cardNumber.slice(-4)) ||
          (pm.type === 'upi' && 'upiId' in pm && pm.upiId === upiId)
        );
        
        if (newPaymentMethod) {
          setSelectedPaymentMethod(newPaymentMethod);
          setAddingNewPayment(false);
        }
      } else {
        setErrorMessage(authError || 'Failed to add payment method');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred');
      console.error('Add payment method error:', err);
    }
  };
  
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  
  const handleAddNewPaymentMethod = () => {
    setAddingNewPayment(true);
    setSelectedPaymentMethod(null);
  };
  
  const handleConfirmBooking = async () => {
    if (!selectedPaymentMethod) {
      setErrorMessage('Please select a payment method');
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Process the booking
      const success = await bookParkingSpot(
        params.spotId,
        new Date(params.startTime),
        new Date(params.endTime),
        params.vehicleId
      );
      
      if (success) {
        Alert.alert(
          'Booking Confirmed',
          'Your parking spot has been successfully booked!',
          [
            {
              text: 'View Bookings',
              onPress: () => router.push('/(tabs)/bookings'),
            },
          ]
        );
      } else {
        setErrorMessage(bookingError || 'Failed to complete booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setErrorMessage('An unexpected error occurred during booking');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <DemoBanner />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.content}>
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
            
            {user?.paymentMethods && user.paymentMethods.length > 0 && !addingNewPayment ? (
              <>
                <Text style={styles.title}>Select Payment Method</Text>
                
                <ScrollView style={styles.paymentMethodsList}>
                  {user.paymentMethods.map((method) => (
                    <TouchableOpacity 
                      key={method.id}
                      style={[
                        styles.paymentMethodItem,
                        selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethodItem
                      ]}
                      onPress={() => handleSelectPaymentMethod(method)}
                    >
                      {method.type === 'card' ? (
                        <View style={styles.paymentMethodContent}>
                          <CreditCard 
                            size={24} 
                            color={selectedPaymentMethod?.id === method.id ? colors.white : colors.primary} 
                          />
                          <View style={styles.paymentMethodDetails}>
                            <Text 
                              style={[
                                styles.paymentMethodName,
                                selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethodText
                              ]}
                            >
                              {method.cardBrand.toUpperCase()} •••• {method.last4}
                            </Text>
                            <Text 
                              style={[
                                styles.paymentMethodInfo,
                                selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethodText
                              ]}
                            >
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.paymentMethodContent}>
                          <Smartphone 
                            size={24} 
                            color={selectedPaymentMethod?.id === method.id ? colors.white : colors.primary} 
                          />
                          <View style={styles.paymentMethodDetails}>
                            <Text 
                              style={[
                                styles.paymentMethodName,
                                selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethodText
                              ]}
                            >
                              UPI
                            </Text>
                            <Text 
                              style={[
                                styles.paymentMethodInfo,
                                selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethodText
                              ]}
                            >
                              {method.upiId}
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addPaymentMethodButton}
                    onPress={handleAddNewPaymentMethod}
                  >
                    <Text style={styles.addPaymentMethodText}>+ Add New Payment Method</Text>
                  </TouchableOpacity>
                </ScrollView>
                
                <Button
                  title="Confirm Booking"
                  onPress={handleConfirmBooking}
                  loading={processingPayment}
                  disabled={!selectedPaymentMethod || processingPayment}
                  fullWidth
                  style={styles.confirmButton}
                />
              </>
            ) : (
              <>
                <Text style={styles.title}>Add Payment Method</Text>
                <Text style={styles.subtitle}>
                  Add a payment method to pay for parking
                </Text>
                
                <View style={styles.paymentTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.paymentTypeButton,
                      paymentType === 'card' && styles.paymentTypeButtonActive,
                    ]}
                    onPress={() => setPaymentType('card')}
                  >
                    <CreditCard 
                      size={24} 
                      color={paymentType === 'card' ? colors.primary : colors.textLight} 
                    />
                    <Text 
                      style={[
                        styles.paymentTypeText,
                        paymentType === 'card' && styles.paymentTypeTextActive,
                      ]}
                    >
                      Credit/Debit Card
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.paymentTypeButton,
                      paymentType === 'upi' && styles.paymentTypeButtonActive,
                    ]}
                    onPress={() => setPaymentType('upi')}
                  >
                    <Smartphone 
                      size={24} 
                      color={paymentType === 'upi' ? colors.primary : colors.textLight} 
                    />
                    <Text 
                      style={[
                        styles.paymentTypeText,
                        paymentType === 'upi' && styles.paymentTypeTextActive,
                      ]}
                    >
                      UPI
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={20} color={colors.error} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}
                
                {paymentType === 'card' ? (
                  <View style={styles.formContainer}>
                    <TextInput
                      label="Card Number"
                      value={cardNumber}
                      onChangeText={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="numeric"
                      maxLength={19}
                    />
                    
                    <TextInput
                      label="Cardholder Name"
                      value={cardholderName}
                      onChangeText={setCardholderName}
                      placeholder="John Doe"
                      autoCapitalize="words"
                    />
                    
                    <View style={styles.row}>
                      <View style={styles.column}>
                        <TextInput
                          label="Expiry Month"
                          value={expiryMonth}
                          onChangeText={handleExpiryMonthChange}
                          placeholder="MM"
                          keyboardType="numeric"
                          maxLength={2}
                        />
                      </View>
                      
                      <View style={styles.column}>
                        <TextInput
                          label="Expiry Year"
                          value={expiryYear}
                          onChangeText={handleExpiryYearChange}
                          placeholder="YY"
                          keyboardType="numeric"
                          maxLength={2}
                        />
                      </View>
                      
                      <View style={styles.column}>
                        <TextInput
                          label="CVV"
                          value={cvv}
                          onChangeText={handleCvvChange}
                          placeholder="123"
                          keyboardType="numeric"
                          maxLength={4}
                          secureTextEntry
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.formContainer}>
                    <TextInput
                      label="UPI ID"
                      value={upiId}
                      onChangeText={setUpiId}
                      placeholder="username@upi"
                      autoCapitalize="none"
                    />
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.defaultContainer}
                  onPress={() => setIsDefault(!isDefault)}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      isDefault && styles.checkboxChecked,
                    ]}>
                      {isDefault && <Check size={16} color={colors.white} />}
                    </View>
                  </View>
                  <Text style={styles.defaultText}>
                    Set as default payment method
                  </Text>
                </TouchableOpacity>
                
                <Button
                  title="Add Payment Method"
                  onPress={handleAddPaymentMethod}
                  loading={authLoading}
                  fullWidth
                />
                
                {user?.paymentMethods && user.paymentMethods.length > 0 && (
                  <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={() => setAddingNewPayment(false)}
                  >
                    <Text style={styles.skipText}>Back to payment methods</Text>
                    <ChevronRight size={16} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  bookingSummary: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  paymentTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    marginRight: 8,
  },
  paymentTypeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  paymentTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginLeft: 8,
  },
  paymentTypeTextActive: {
    color: colors.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  formContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  defaultText: {
    fontSize: 16,
    color: colors.text,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  skipText: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 4,
  },
  paymentMethodsList: {
    marginBottom: 24,
    maxHeight: 300,
  },
  paymentMethodItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  selectedPaymentMethodItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    marginLeft: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  paymentMethodInfo: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedPaymentMethodText: {
    color: colors.white,
  },
  addPaymentMethodButton: {
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
  addPaymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  confirmButton: {
    marginTop: 16,
  },
});