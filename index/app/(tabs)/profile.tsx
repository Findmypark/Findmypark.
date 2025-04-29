import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Car, 
  Heart, 
  Clock, 
  HelpCircle,
  ChevronRight,
  IndianRupee,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useParkingStore } from '@/store/parkingStore';
import { NotificationsModal } from '@/components/NotificationsModal';
import { SettingsModal } from '@/components/SettingsModal';
import { HelpSupportModal } from '@/components/HelpSupportModal';
import { DemoBanner } from '@/components/DemoBanner';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, userMode } = useAuthStore();
  const { parkingSpots } = useParkingStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleBackButton = () => {
    router.back();
  };
  
  // Get user's listed parking spots if they are a provider
  const userListings = userMode === 'provider' 
    ? parkingSpots.filter(spot => spot.owner.id === 'self')
    : [];
  
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <DemoBanner />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => setShowNotifications(true)}
            >
              <Bell size={24} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => setShowSettings(true)}
            >
              <Settings size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.userModeContainer}>
          <Text style={styles.userModeLabel}>Account Type:</Text>
          <View style={styles.userModeTag}>
            <Text style={styles.userModeText}>
              {userMode === 'provider' ? 'Parking Provider' : 'Parking Finder'}
            </Text>
          </View>
        </View>
        
        {userMode === 'provider' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Listings</Text>
            
            {userListings.length > 0 ? (
              userListings.map((spot) => (
                <TouchableOpacity 
                  key={spot.id}
                  style={styles.listingItem}
                  onPress={() => router.push(`/spot/${spot.id}`)}
                >
                  <Image 
                    source={{ uri: spot.images[0] }}
                    style={styles.listingImage}
                  />
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingName}>{spot.name}</Text>
                    <View style={styles.listingDetails}>
                      <View style={styles.listingPrice}>
                        <IndianRupee size={14} color={colors.primary} />
                        <Text style={styles.listingPriceText}>
                          {spot.price}/{spot.priceUnit}
                        </Text>
                      </View>
                      <View style={[
                        styles.listingStatus,
                        spot.available ? styles.listingStatusAvailable : styles.listingStatusUnavailable
                      ]}>
                        <Text style={styles.listingStatusText}>
                          {spot.available ? 'Available' : 'Unavailable'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyListingContainer}>
                <Text style={styles.emptyListingText}>
                  You haven't listed any parking spots yet.
                </Text>
                <TouchableOpacity
                  style={styles.addListingButton}
                  onPress={() => router.push('/auth/list-parking')}
                >
                  <Text style={styles.addListingButtonText}>
                    Add a Parking Spot
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {userListings.length > 0 && (
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => router.push('/auth/list-parking')}
              >
                <Text style={styles.addMoreButtonText}>
                  Add Another Parking Spot
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/auth/vehicle-details')}
          >
            <View style={styles.menuItemIcon}>
              <Car size={20} color={colors.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>My Vehicles</Text>
              <Text style={styles.menuItemDescription}>
                {user.vehicles.length > 0 
                  ? `${user.vehicles.length} vehicles added`
                  : 'Add your vehicles'
                }
              </Text>
            </View>
            <ChevronRight size={20} color={colors.gray[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/favorites')}
          >
            <View style={styles.menuItemIcon}>
              <Heart size={20} color={colors.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Favorites</Text>
              <Text style={styles.menuItemDescription}>
                {user.favorites.length > 0 
                  ? `${user.favorites.length} parking spots saved`
                  : 'Save your favorite spots'
                }
              </Text>
            </View>
            <ChevronRight size={20} color={colors.gray[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/bookings')}
          >
            <View style={styles.menuItemIcon}>
              <Clock size={20} color={colors.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Booking History</Text>
              <Text style={styles.menuItemDescription}>
                View your past and upcoming bookings
              </Text>
            </View>
            <ChevronRight size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowHelpSupport(true)}
          >
            <View style={styles.menuItemIcon}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Help & Support</Text>
              <Text style={styles.menuItemDescription}>
                Get help with your account or bookings
              </Text>
            </View>
            <ChevronRight size={20} color={colors.gray[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutMenuItem]}
            onPress={handleLogout}
          >
            <View style={[styles.menuItemIcon, styles.logoutIcon]}>
              <LogOut size={20} color={colors.error} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, styles.logoutText]}>
                Logout
              </Text>
              <Text style={styles.menuItemDescription}>
                Sign out from your account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      
      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <HelpSupportModal
        visible={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textLight,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  userModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  userModeLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  userModeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.primary + '20',
  },
  userModeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  logoutMenuItem: {
    borderBottomWidth: 0,
  },
  logoutIcon: {
    backgroundColor: colors.error + '10',
  },
  logoutText: {
    color: colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: 12,
    color: colors.textLight,
  },
  listingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  listingImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  listingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listingName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  listingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  listingPriceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  listingStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listingStatusAvailable: {
    backgroundColor: colors.success + '20',
  },
  listingStatusUnavailable: {
    backgroundColor: colors.error + '20',
  },
  listingStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  emptyListingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyListingText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  addListingButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addListingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  addMoreButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  addMoreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});