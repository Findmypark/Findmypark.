import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Linking,
} from 'react-native';
import { Phone, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { JoinWaitlistModal } from './JoinWaitlistModal';

export const JoinWaitlistBanner = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleCallSupport = () => {
    Linking.openURL('tel:+918888888888');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Instant Parking Spots
          </Text>
          <Text style={styles.description}>
            Lease your space here immediately
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleCallSupport}
          >
            <Phone size={20} color={colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.joinButtonText}>Join Now</Text>
            <ChevronRight size={16} color={colors.primary} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
      </View>
      
      <JoinWaitlistModal 
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  joinButton: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 6,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});