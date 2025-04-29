import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { 
  Home, 
  Map, 
  Calendar, 
  User,
  Bell,
  Settings,
  Search,
  Plus
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useParkingStore } from '@/store/parkingStore';
import { useAuthStore } from '@/store/authStore';
import { DemoBanner } from '@/components/DemoBanner';

export default function TabsLayout() {
  const { fetchParkingSpots, fetchBookings, fetchUser } = useParkingStore();
  
  useEffect(() => {
    // Load initial data
    fetchParkingSpots();
    fetchBookings();
    fetchUser();
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      <DemoBanner />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.gray[200],
            height: Platform.OS === 'ios' ? 90 : 70,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -5,
          },
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
            headerShown: false,
          }}
        />
        
        <Tabs.Screen
          name="map"
          options={{
            title: 'Find',
            tabBarIcon: ({ color }) => <Search size={24} color={color} />,
            headerShown: false,
          }}
        />
        
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
            headerShown: false,
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}