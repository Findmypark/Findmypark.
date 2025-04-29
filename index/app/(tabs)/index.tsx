import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight,
  X,
  Bell,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { JoinWaitlistBanner } from '@/components/JoinWaitlistBanner';
import { ParkingTypeSection } from '@/components/ParkingTypeSection';
import { useParkingStore } from '@/store/parkingStore';
import { useAuthStore } from '@/store/authStore';
import { popularLocations } from '@/constants/locations';
import { NotificationsModal } from '@/components/NotificationsModal';
import { ListYourSpaceSection } from '@/components/ListYourSpaceSection';

export default function HomeScreen() {
  const router = useRouter();
  const { user, userMode } = useAuthStore();
  const { 
    recentSearches = [], 
    addRecentSearch, 
    clearRecentSearches,
    fetchParkingSpots
  } = useParkingStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    // Fetch parking spots when component mounts
    fetchParkingSpots();
  }, [fetchParkingSpots]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      const results = popularLocations.filter(loc => 
        loc.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };
  
  const handleLocationSelect = (location: string) => {
    addRecentSearch(location);
    router.push({
      pathname: '/(tabs)/map',
      params: { location }
    });
  };
  
  const handleSearchFocus = () => {
    setShowSearchResults(searchQuery.length > 0);
  };
  
  const handleClearRecentSearches = () => {
    clearRecentSearches();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(' ')[0] || 'User'}
            </Text>
            <Text style={styles.subGreeting}>
              Find parking spots near you
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
          >
            <Bell size={24} color={colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for locations"
            onChangeText={handleSearch}
            onFocus={handleSearchFocus}
            defaultValue={searchQuery}
          />
        </View>
      </View>
      
      {showSearchResults ? (
        <View style={styles.searchResultsContainer}>
          <ScrollView style={styles.searchResults}>
            {searchResults.map((result, index) => (
              <Pressable 
                key={index}
                style={styles.searchResultItem}
                onPress={() => handleLocationSelect(result)}
              >
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.searchResultText}>{result}</Text>
              </Pressable>
            ))}
            
            {searchResults.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No locations found for "{searchQuery}"
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Moved JoinWaitlistBanner to the top */}
          <View style={styles.topBannerContainer}>
            <JoinWaitlistBanner />
          </View>
          
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClearRecentSearches}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentSearchesContainer}
              >
                {recentSearches.map((search) => (
                  <TouchableOpacity 
                    key={search.id}
                    style={styles.recentSearchItem}
                    onPress={() => handleLocationSelect(search.query)}
                  >
                    <View style={styles.recentSearchIconContainer}>
                      <Clock size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.recentSearchText}>{search.query}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Locations</Text>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/map')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularLocationsContainer}
            >
              {popularLocations.slice(0, 6).map((location, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.popularLocationItem}
                  onPress={() => handleLocationSelect(location)}
                >
                  <View style={styles.popularLocationContent}>
                    <MapPin size={16} color={colors.white} />
                    <Text style={styles.popularLocationText}>{location}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <ParkingTypeSection
            type="instant"
            title="Hourly Parking"
            description="Book and park immediately at commercial spots"
          />
          
          <ParkingTypeSection
            type="lease"
            title="Monthly Parking"
            description="Long-term parking solutions for residential areas"
          />
          
          {/* Add the List Your Space section at the bottom */}
          <ListYourSpaceSection />
          
        </ScrollView>
      )}
      
      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textLight,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  searchContainer: {
    marginBottom: 8,
  },
  topBannerContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchResultText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearText: {
    fontSize: 14,
    color: colors.primary,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  recentSearchesContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentSearchIconContainer: {
    marginRight: 6,
  },
  recentSearchText: {
    fontSize: 14,
    color: colors.text,
  },
  popularLocationsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  popularLocationItem: {
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  popularLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  popularLocationText: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 6,
  },
});