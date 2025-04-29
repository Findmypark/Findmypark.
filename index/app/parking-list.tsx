import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Filter, 
  MapPin,
  Search,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ParkingSpotCard } from '@/components/ParkingSpotCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterModal } from '@/components/FilterModal';
import { useParkingStore } from '@/store/parkingStore';
import { ParkingSpot } from '@/types';

export default function ParkingListScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const { 
    filteredSpots, 
    parkingSpots, 
    filter, 
    applyFilter,
    isLoading,
  } = useParkingStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  
  useEffect(() => {
    // Apply initial filtering based on the type parameter
    applyFilter();
  }, []);
  
  useEffect(() => {
    // Filter spots based on search query
    if (searchQuery.trim() === '') {
      setSpots(filteredSpots);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = filteredSpots.filter(spot => 
        spot.name.toLowerCase().includes(query) || 
        spot.address.toLowerCase().includes(query)
      );
      setSpots(filtered);
    }
  }, [filteredSpots, searchQuery]);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  
  const handleSpotPress = (spotId: string) => {
    router.push(`/spot/${spotId}`);
  };
  
  const handleFilterPress = () => {
    setShowFilterModal(true);
  };
  
  const handleApplyFilter = () => {
    applyFilter();
  };
  
  const getTitle = () => {
    if (type === 'commercial') {
      return 'Commercial Parking';
    } else if (type === 'residential') {
      return 'Residential Parking';
    } else {
      return 'All Parking Spots';
    }
  };
  
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading parking spots...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Parking Spots Found</Text>
        <Text style={styles.emptyText}>
          Try adjusting your filters or search for a different location.
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{getTitle()}</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for parking spots"
            onChangeText={handleSearch}
            defaultValue={searchQuery}
          />
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <Filter size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterInfo}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.filterInfoText}>
            {filter.location || 'All locations'} • {spots.length} spots found
          </Text>
        </View>
      </View>
      
      <FlatList
        data={spots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParkingSpotCard
            spot={item}
            onPress={() => handleSpotPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      <FilterModal 
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterInfoText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});