import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Linking,
} from 'react-native';
import { X, ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface HelpSupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  visible,
  onClose,
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const faqs = [
    {
      question: 'How do I book a parking spot?',
      answer: 'To book a parking spot, search for your desired location, select a parking spot, choose your date and time, and complete the payment process. You will receive a confirmation email with your booking details.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the scheduled start time. Go to "Bookings" in your profile, select the booking you want to cancel, and tap on "Cancel Booking". Refund policies may vary depending on the parking provider.'
    },
    {
      question: 'How do I list my parking space?',
      answer: 'To list your parking space, go to your profile and select "List Your Parking". Fill in the details about your parking space, including location, availability, and pricing. Once submitted, our team will review your listing and approve it within 24-48 hours.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, UPI, net banking, and mobile wallets. All payments are processed securely through our payment gateway.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your payment information. We do not store your credit card details on our servers.'
    },
  ];
  
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };
  
  const handleEmail = () => {
    Linking.openURL('mailto:support@parkeasy.com');
  };
  
  const handleChat = () => {
    // In a real app, this would open a chat interface
    alert('Chat support will be available soon!');
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              
              <View style={styles.contactOptions}>
                <TouchableOpacity 
                  style={styles.contactOption}
                  onPress={handleCall}
                >
                  <View style={styles.contactIconContainer}>
                    <Phone size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.contactOptionText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactOption}
                  onPress={handleEmail}
                >
                  <View style={styles.contactIconContainer}>
                    <Mail size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.contactOptionText}>Email</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactOption}
                  onPress={handleChat}
                >
                  <View style={styles.contactIconContainer}>
                    <MessageCircle size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.contactOptionText}>Chat</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.contactInfo}>
                <Text style={styles.contactInfoText}>
                  Customer Support: +91 9876543210
                </Text>
                <Text style={styles.contactInfoText}>
                  Email: support@parkeasy.com
                </Text>
                <Text style={styles.contactInfoText}>
                  Hours: 9:00 AM - 8:00 PM (Mon-Sat)
                </Text>
              </View>
            </View>
            
            <View style={styles.faqSection}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              
              {faqs.map((faq, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.faqItem}
                  onPress={() => toggleFaq(index)}
                >
                  <View style={styles.faqQuestion}>
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    {expandedFaq === index ? (
                      <ChevronUp size={20} color={colors.primary} />
                    ) : (
                      <ChevronDown size={20} color={colors.text} />
                    )}
                  </View>
                  
                  {expandedFaq === index && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  contactSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  contactOption: {
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  contactInfo: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
  },
  contactInfoText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  faqSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingVertical: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    lineHeight: 20,
  },
});