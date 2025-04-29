import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowLeft,
  List,
  Clock,
  IndianRupee,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { GoogleMap } from '@/components/GoogleMap';
import { FilterModal } from '@/components/FilterModal';
import { useParkingStore } from '@/store/parkingStore';
import { ParkingSpot } from '@/types';
import { popularLocations, locationCoordinates } from '@/constants/locations';

export default function MapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { location } = params;
  
  const { 
    parkingSpots, 
    filteredSpots, 
    fetchParkingSpots,
    setSelectedSpot,
    addRecentSearch
  } = useParkingStore();
  
  const [searchQuery, setSearchQuery] = useState<string>(location as string || '');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  useEffect(() => {
    fetchParkingSpots();
    
    if (location) {
      setSearchQuery(location as string);
      addRecentSearch(location as string);
    }
  }, [fetchParkingSpots, location]);
  
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
  
  const handleLocationSelect = (selectedLocation: string) => {
    setSearchQuery(selectedLocation);
    setShowSearchResults(false);
    addRecentSearch(selectedLocation);
  };
  
  const handleMarkerPress = (spotId: string) => {
    const spot = parkingSpots.find(s => s.id === spotId);
    if (spot) {
      setSelectedSpot(spot);
      router.push(`/spot/${spotId}`);
    }
  };
  
  const handleBackPress = () => {
    router.back();
  };
  
  const handleListViewPress = () => {
    router.push('/parking-list');
  };
  
  // Convert parking spots to map markers with availability info
  const mapMarkers = filteredSpots && filteredSpots.length > 0 ? filteredSpots.map(spot => {
    // Generate a random time for demo purposes
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    const availableTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    
    // Make sure we have valid coordinates
    if (!spot.location || (typeof spot.location.latitude !== 'number' || typeof spot.location.longitude !== 'number')) {
      // Use default coordinates for Hyderabad if location is missing
      return {
        id: spot.id,
        title: spot.name,
        latitude: 17.3850,
        longitude: 78.4867,
        available: spot.available || false,
        price: spot.price,
        priceUnit: spot.priceUnit || 'hour',
        availableUntil: availableTime
      };
    }
    
    return {
      id: spot.id,
      title: spot.name,
      latitude: spot.location.latitude,
      longitude: spot.location.longitude,
      available: spot.available || false,
      price: spot.price,
      priceUnit: spot.priceUnit || 'hour',
      availableUntil: availableTime
    };
  }) : [];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
        
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for locations"
            onChangeText={handleSearch}
            defaultValue={searchQuery}
          />
        </View>
        
        <Pressable 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={24} color={colors.text} />
        </Pressable>
        
        <Pressable 
          style={styles.listButton}
          onPress={handleListViewPress}
        >
          <List size={24} color={colors.text} />
        </Pressable>
      </View>
      
      {showSearchResults && (
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
      )}
      
      <View style={styles.mapContainer}>
        <GoogleMap
          initialLocation={searchQuery || 'Hyderabad'}
          markers={mapMarkers}
          onMarkerPress={handleMarkerPress}
        />
      </View>
      
      <View style={styles.mapLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.availableDot]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.unavailableDot]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  listButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 5,
    maxHeight: 300,
  },
  searchResults: {
    padding: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
  mapContainer: {
    flex: 1,
  },
  mapLegend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  availableDot: {
    backgroundColor: colors.success,
  },
  unavailableDot: {
    backgroundColor: colors.error,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
  },
});