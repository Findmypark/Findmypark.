import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParkingSpot, Booking, User, RecentSearch } from '@/types';
import { parkingSpots as mockParkingSpots } from '@/mocks/parkingSpots';
import { mockUser } from '@/mocks/user';

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: 'b1',
    spotId: '1',
    spotName: 'Downtown Secure Parking',
    spotImage: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
    status: 'upcoming',
    totalPrice: 160, // 2 hours * ₹80
    spotAddress: 'Hitech City, Hyderabad',
    userId: 'u1',
    vehicleId: 'v1',
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      licensePlate: 'MH-01-AB-1234'
    },
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: new Date(),
    qrCode: 'https://example.com/qr/b1'
  },
  {
    id: 'b2',
    spotId: '3',
    spotName: 'Riverside Parking Lot',
    spotImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFya2luZyUyMGxvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    status: 'active',
    totalPrice: 120, // 3 hours * ₹40
    spotAddress: 'Jubilee Hills, Hyderabad',
    userId: 'u1',
    vehicleId: 'v1',
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      licensePlate: 'MH-01-AB-1234'
    },
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    createdAt: new Date(),
    qrCode: 'https://example.com/qr/b2'
  },
  {
    id: 'b3',
    spotId: '2',
    spotName: 'Central Park Garage',
    spotImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGFya2luZyUyMGdhcmFnZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    status: 'completed',
    totalPrice: 180, // 3 hours * ₹60
    spotAddress: 'Banjara Hills, Hyderabad',
    userId: 'u1',
    vehicleId: 'v2',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Corolla',
      licensePlate: 'MH-01-CD-5678'
    },
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: new Date(),
    qrCode: 'https://example.com/qr/b3'
  },
  {
    id: 'b4',
    spotId: '4',
    spotName: 'Tech Park Basement',
    spotImage: 'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya2luZyUyMGdhcmFnZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    status: 'cancelled',
    totalPrice: 400, // 4 hours * ₹100
    spotAddress: 'Gachibowli, Hyderabad',
    userId: 'u1',
    vehicleId: 'v1',
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      licensePlate: 'MH-01-AB-1234'
    },
    paymentStatus: 'refunded',
    paymentMethod: 'upi',
    createdAt: new Date(),
    qrCode: 'https://example.com/qr/b4'
  },
];

interface Filter {
  priceRange?: [number, number];
  distance: number;
  amenities: string[];
  availability: boolean;
  rating: number;
  locationType?: 'commercial' | 'residential';
  priceUnit?: 'hour' | 'day' | 'month';
  location?: string;
  parkingType?: 'instant' | 'lease';
}

interface ParkingState {
  parkingSpots: ParkingSpot[];
  filteredSpots: ParkingSpot[];
  bookings: Booking[];
  user: User | null;
  filter: Filter;
  selectedSpot: ParkingSpot | null;
  isLoading: boolean;
  error: string | null;
  recentSearches: RecentSearch[];
  
  // Actions
  fetchParkingSpots: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setSelectedSpot: (spot: ParkingSpot | null) => void;
  toggleFavorite: (spotId: string) => void;
  bookSpot: (spotId: string, startTime: string, endTime: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  updateFilter: (filter: Partial<Filter>) => void;
  applyFilter: () => void;
  resetFilter: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addParkingSpot: (spot: ParkingSpot) => Promise<boolean>;
  getParkingSpotById: (id: string) => ParkingSpot | undefined;
  bookParkingSpot: (spotId: string, startTime: Date, endTime: Date, vehicleId: string) => Promise<boolean>;
}

const defaultFilter: Filter = {
  priceRange: [0, 5000],
  distance: 10,
  amenities: [],
  availability: true,
  rating: 0,
};

export const useParkingStore = create<ParkingState>()(
  persist(
    (set, get) => ({
      parkingSpots: mockParkingSpots,
      filteredSpots: mockParkingSpots,
      bookings: mockBookings,
      user: mockUser,
      filter: defaultFilter,
      selectedSpot: null,
      isLoading: false,
      error: null,
      recentSearches: [],

      fetchParkingSpots: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll use mock data
          set({ 
            parkingSpots: mockParkingSpots,
            filteredSpots: mockParkingSpots,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: "Failed to fetch parking spots", 
            isLoading: false 
          });
        }
      },

      fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set({ bookings: mockBookings, isLoading: false });
        } catch (error) {
          set({ 
            error: "Failed to fetch bookings", 
            isLoading: false 
          });
        }
      },

      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set({ user: mockUser, isLoading: false });
        } catch (error) {
          set({ 
            error: "Failed to fetch user data", 
            isLoading: false 
          });
        }
      },

      setSelectedSpot: (spot) => {
        set({ selectedSpot: spot });
      },

      toggleFavorite: (spotId) => {
        const { user } = get();
        if (!user) return;

        const isFavorite = user.favorites.includes(spotId);
        const updatedFavorites = isFavorite
          ? user.favorites.filter(id => id !== spotId)
          : [...user.favorites, spotId];

        set({
          user: {
            ...user,
            favorites: updatedFavorites
          }
        });
      },

      bookSpot: async (spotId, startTime, endTime) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          const spot = get().parkingSpots.find(s => s.id === spotId);
          if (!spot) {
            throw new Error("Parking spot not found");
          }

          const { user } = get();
          if (!user) {
            throw new Error("User not authenticated");
          }

          // Get the first vehicle or use a default one
          const vehicle = user.vehicles[0] || {
            id: 'default',
            make: 'Unknown',
            model: 'Car',
            licensePlate: 'UNKNOWN'
          };

          const newBooking: Booking = {
            id: `b${Date.now()}`,
            spotId,
            spotName: spot.name,
            spotImage: spot.images[0],
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status: 'upcoming',
            totalPrice: calculatePrice(spot.price, spot.priceUnit, startTime, endTime),
            spotAddress: spot.address,
            userId: user.id,
            vehicleId: vehicle.id,
            vehicleInfo: {
              make: vehicle.make,
              model: vehicle.model,
              licensePlate: vehicle.licensePlate
            },
            paymentStatus: 'paid',
            paymentMethod: 'card',
            createdAt: new Date(),
            qrCode: `https://example.com/qr/b${Date.now()}`
          };

          set(state => ({
            bookings: [...state.bookings, newBooking],
            isLoading: false
          }));
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to book parking spot", 
            isLoading: false 
          });
          return false;
        }
      },

      cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' } 
                : booking
            ),
            isLoading: false
          }));
          return true;
        } catch (error) {
          set({ 
            error: "Failed to cancel booking", 
            isLoading: false 
          });
          return false;
        }
      },

      updateFilter: (partialFilter) => {
        set(state => ({
          filter: { ...state.filter, ...partialFilter }
        }));
      },

      applyFilter: () => {
        const { parkingSpots, filter } = get();
        const filtered = parkingSpots.filter(spot => {
          // Filter by price
          if (filter.priceRange && (spot.price < filter.priceRange[0] || spot.price > filter.priceRange[1])) {
            return false;
          }

          // Filter by distance
          if (spot.distance && filter.distance && spot.distance > filter.distance) {
            return false;
          }

          // Filter by availability
          if (filter.availability && !spot.available) {
            return false;
          }

          // Filter by rating
          if (filter.rating && spot.rating < filter.rating) {
            return false;
          }

          // Filter by location
          if (filter.location && !spot.address.toLowerCase().includes(filter.location.toLowerCase())) {
            return false;
          }

          // Filter by location type
          if (filter.locationType && spot.locationType !== filter.locationType) {
            return false;
          }

          // Filter by price unit
          if (filter.priceUnit && spot.priceUnit !== filter.priceUnit) {
            return false;
          }

          // Filter by parking type (instant or lease)
          if (filter.parkingType) {
            if (filter.parkingType === 'instant') {
              // Instant parking is hourly or daily commercial parking
              return (spot.priceUnit === 'hour' || spot.priceUnit === 'day') && 
                     spot.locationType === 'commercial';
            } else if (filter.parkingType === 'lease') {
              // Lease parking is monthly residential parking
              return spot.priceUnit === 'month' && 
                     spot.locationType === 'residential';
            }
          }

          // Filter by amenities
          if (filter.amenities && filter.amenities.length > 0) {
            const hasAllAmenities = filter.amenities.every(amenity => 
              spot.features.some(feature => feature.toLowerCase().includes(amenity.toLowerCase()))
            );
            if (!hasAllAmenities) {
              return false;
            }
          }

          return true;
        });
        set({ filteredSpots: filtered });
      },

      resetFilter: () => {
        set({ 
          filter: defaultFilter,
          filteredSpots: get().parkingSpots
        });
      },

      addRecentSearch: (query) => {
        set(state => {
          // Check if this search already exists
          const existingIndex = state.recentSearches.findIndex(
            search => search.query.toLowerCase() === query.toLowerCase()
          );
          
          // Create a new search object
          const newSearch = {
            id: `search_${Date.now()}`,
            query,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
          };
          
          let updatedSearches;
          
          if (existingIndex >= 0) {
            // If it exists, remove it and add the new one at the beginning
            updatedSearches = [
              newSearch,
              ...state.recentSearches.filter((_, index) => index !== existingIndex)
            ];
          } else {
            // If it doesn't exist, add it at the beginning
            updatedSearches = [newSearch, ...state.recentSearches];
          }
          
          // Keep only the most recent 10 searches
          if (updatedSearches.length > 10) {
            updatedSearches = updatedSearches.slice(0, 10);
          }
          
          return { recentSearches: updatedSearches };
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      addParkingSpot: async (spot) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set(state => ({
            parkingSpots: [spot, ...state.parkingSpots],
            filteredSpots: [spot, ...state.filteredSpots],
            isLoading: false
          }));
          return true;
        } catch (error) {
          set({ 
            error: "Failed to add parking spot", 
            isLoading: false 
          });
          return false;
        }
      },

      getParkingSpotById: (id) => {
        return get().parkingSpots.find(spot => spot.id === id);
      },

      bookParkingSpot: async (spotId, startTime, endTime, vehicleId) => {
        set({ isLoading: true, error: null });
        try {
          const spot = get().parkingSpots.find(s => s.id === spotId);
          if (!spot) {
            throw new Error("Parking spot not found");
          }

          const { user } = get();
          if (!user) {
            throw new Error("User not authenticated");
          }

          // Find the selected vehicle
          const vehicle = user.vehicles.find(v => v.id === vehicleId) || user.vehicles[0];
          if (!vehicle) {
            throw new Error("Vehicle not found");
          }

          // Generate a QR code for the booking
          const qrCode = `https://example.com/qr/b${Date.now()}`;

          // Create a new booking
          const newBooking: Booking = {
            id: `b${Date.now()}`,
            spotId,
            spotName: spot.name,
            spotImage: spot.images[0],
            startTime,
            endTime,
            status: 'upcoming',
            totalPrice: calculatePrice(
              spot.price, 
              spot.priceUnit, 
              startTime.toISOString(), 
              endTime.toISOString()
            ),
            spotAddress: spot.address,
            userId: user.id,
            vehicleId: vehicle.id,
            vehicleInfo: {
              make: vehicle.make,
              model: vehicle.model,
              licensePlate: vehicle.licensePlate
            },
            paymentStatus: 'paid',
            paymentMethod: 'card',
            createdAt: new Date(),
            qrCode
          };

          // Add the booking to the store
          set(state => ({
            bookings: [...state.bookings, newBooking],
            isLoading: false,
            error: null
          }));

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to book parking spot";
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          console.error("Booking error:", errorMessage);
          return false;
        }
      }
    }),
    {
      name: 'parking-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        bookings: state.bookings,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// Helper function to calculate price based on duration
function calculatePrice(
  basePrice: number, 
  unit: string, 
  startTime: string, 
  endTime: string
): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  
  // Convert to hours
  const durationHours = durationMs / (1000 * 60 * 60);
  
  if (unit === 'hour') {
    return Math.ceil(durationHours) * basePrice;
  } else if (unit === 'day') {
    const durationDays = durationHours / 24;
    return Math.ceil(durationDays) * basePrice;
  } else if (unit === 'month') {
    // For monthly, calculate based on the number of months
    const startMonth = start.getMonth();
    const startYear = start.getFullYear();
    const endMonth = end.getMonth();
    const endYear = end.getFullYear();
    
    const months = (endYear - startYear) * 12 + (endMonth - startMonth);
    return Math.max(1, months) * basePrice;
  } else {
    // Default fallback
    return basePrice;
  }
}