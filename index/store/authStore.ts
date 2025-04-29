import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Vehicle, PaymentMethod } from '@/types';
import { mockUser } from '@/mocks/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  userMode: 'finder' | 'provider' | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password?: string }) => Promise<boolean>;
  addVehicle: (vehicle: Vehicle) => Promise<boolean>;
  removeVehicle: (vehicleId: string) => Promise<boolean>;
  addPaymentMethod: (paymentMethod: PaymentMethod) => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  addToFavorites: (spotId: string) => Promise<boolean>;
  removeFromFavorites: (spotId: string) => Promise<boolean>;
  setUserMode: (mode: 'finder' | 'provider') => void;
  fetchUser: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      userMode: null,
      
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          
          // If no token, we're not authenticated
          if (!token) {
            set({ isLoading: false });
            return;
          }
          
          // Verify token with backend
          const isValid = await get().verifyToken();
          
          if (!isValid) {
            // Token is invalid, clear auth state
            set({ 
              user: null, 
              isAuthenticated: false, 
              token: null, 
              userMode: null,
              isLoading: false 
            });
            return;
          }
          
          // If we have a valid token and user, we're authenticated
          if (get().user) {
            set({ isAuthenticated: true, isLoading: false });
          } else {
            // If we have a token but no user, clear auth state
            set({ 
              isAuthenticated: false, 
              token: null, 
              isLoading: false 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
        }
      },
      
      verifyToken: async () => {
        const { token } = get();
        
        if (!token) {
          return false;
        }
        
        try {
          // For demo account, always return true
          if (token.startsWith('demo_token_')) {
            return true;
          }
          
          // In a real app, we would verify with the backend
          // For now, just check if token starts with "token_"
          return token.startsWith('token_');
        } catch (error) {
          console.error("Token verification error:", error);
          return false;
        }
      },
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log("Login attempt with:", email, password);
          
          // For demo account, use mock data
          if (email === 'demo@parkeasy.com' && password === 'password123') {
            console.log("Using demo account");
            
            // Create a mock token
            const token = `demo_token_${Math.random().toString(36).substring(2, 15)}`;
            
            // Store token in AsyncStorage
            await AsyncStorage.setItem('auth-token', token);
            
            // Use mock user data
            const userData: User = {
              id: 'demo_user',
              name: 'Demo User',
              email: 'demo@parkeasy.com',
              phone: '+1234567890',
              avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
              vehicles: [
                {
                  id: 'v1',
                  make: 'Toyota',
                  model: 'Camry',
                  year: 2020,
                  licensePlate: 'ABC123',
                  color: 'Silver',
                  type: 'sedan'
                }
              ],
              favorites: ['spot_1', 'spot_3'],
              paymentMethods: [
                {
                  id: 'pm1',
                  type: 'card',
                  cardNumber: '4111 1111 1111 1111',
                  cardholderName: 'Demo User',
                  expiryMonth: 12,
                  expiryYear: 25,
                  isDefault: true,
                  last4: '1111',
                  cardBrand: 'visa',
                }
              ],
            };
            
            set({ 
              user: userData, 
              isAuthenticated: true, 
              token: token,
              isLoading: false,
              error: null
            });
            
            return true;
          }
          
          // For non-demo accounts, we would use the backend
          // For now, just simulate a failed login
          set({ 
            error: 'Invalid email or password', 
            isLoading: false 
          });
          return false;
        } catch (error) {
          console.error("Login error:", error);
          const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        // Clear token from AsyncStorage
        AsyncStorage.removeItem('auth-token');
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null,
          userMode: null,
          error: null
        });
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!userData.email || !userData.password || !userData.name) {
            throw new Error('Email, password, and name are required');
          }
          
          // For demo purposes, simulate a successful registration
          // Create a mock token
          const token = `token_${Math.random().toString(36).substring(2, 15)}`;
          
          // Store token in AsyncStorage
          await AsyncStorage.setItem('auth-token', token);
          
          // Create user object
          const newUser: User = {
            id: `user_${Math.random().toString(36).substring(2, 15)}`,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            avatar: userData.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
            vehicles: userData.vehicles || [],
            favorites: userData.favorites || [],
            paymentMethods: userData.paymentMethods || [],
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            token: token,
            isLoading: false,
            error: null
          });
          
          return true;
        } catch (error) {
          console.error("Registration error:", error);
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },
      
      setUserMode: (mode) => {
        set({ userMode: mode });
      },
      
      addVehicle: async (vehicle) => {
        const { user } = get();
        
        if (!user) {
          set({ error: 'User not authenticated' });
          return false;
        }
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedVehicles = [...user.vehicles, vehicle];
          set({ user: { ...user, vehicles: updatedVehicles } });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage });
          return false;
        }
      },
      
      removeVehicle: async (vehicleId) => {
        const { user } = get();
        
        if (!user) {
          set({ error: 'User not authenticated' });
          return false;
        }
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedVehicles = user.vehicles.filter(v => v.id !== vehicleId);
          set({ user: { ...user, vehicles: updatedVehicles } });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage });
          return false;
        }
      },
      
      addPaymentMethod: async (paymentMethod) => {
        const { user, token } = get();
        
        if (!user || !token) {
          set({ error: 'User not authenticated' });
          return false;
        }
        
        try {
          set({ isLoading: true });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Generate a random ID for the payment method
          const paymentMethodId = `pm_${Math.random().toString(36).substring(2, 15)}`;
          
          // If this payment method is set as default, unset any existing default
          let updatedPaymentMethods = [...user.paymentMethods];
          
          if (paymentMethod.isDefault) {
            updatedPaymentMethods = updatedPaymentMethods.map(pm => ({
              ...pm,
              isDefault: false,
            }));
          }
          
          // Add the new payment method
          const newPaymentMethod = {
            ...paymentMethod,
            id: paymentMethodId,
          };
          
          // For card type, ensure cardBrand is present
          if (newPaymentMethod.type === 'card' && !('cardBrand' in newPaymentMethod)) {
            (newPaymentMethod as any).cardBrand = 'visa'; // Default to visa if not provided
          }
          
          updatedPaymentMethods.push(newPaymentMethod as PaymentMethod);
          
          set({ 
            user: { ...user, paymentMethods: updatedPaymentMethods },
            isLoading: false,
            error: null
          });
          
          return true;
        } catch (error) {
          console.error("Payment method error:", error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to add payment method';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },
      
      removePaymentMethod: async (paymentMethodId) => {
        const { user } = get();
        
        if (!user) {
          set({ error: 'User not authenticated' });
          return false;
        }
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentMethodId);
          set({ user: { ...user, paymentMethods: updatedPaymentMethods } });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage });
          return false;
        }
      },
      
      updateUser: async (userData) => {
        const { user } = get();
        
        if (!user) {
          set({ error: 'User not authenticated' });
          return false;
        }
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ user: { ...user, ...userData } });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage });
          return false;
        }
      },
      
      addToFavorites: async (spotId) => {
        const { user } = get();
        
        if (!user) {
          set({ error: 'User not authenticated' });
          return false;
        }
        
        try {
          set({ isLoading: true });
          
          // Check if already in favorites
          if (user.favorites.includes(spotId)) {
            set({ isLoading: false });
            return true;
          }
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedFavorites = [...user.favorites, spotId];
          set({ 
            user: { ...user, favorites: updatedFavorites },
            isLoading: false,
            error: null
          });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },
      
      removeFromFavorites: async (spotId) => {
        const { user } = get();
        
        if (!user) {
          set({ error: 'User not authenticated' });
          return false;
        }
        
        try {
          set({ isLoading: true });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedFavorites = user.favorites.filter(id => id !== spotId);
          set({ 
            user: { ...user, favorites: updatedFavorites },
            isLoading: false,
            error: null
          });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        userMode: state.userMode,
      }),
    }
  )
);