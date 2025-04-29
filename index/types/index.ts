export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  vehicles: Vehicle[];
  favorites: string[];
  paymentMethods: PaymentMethod[];
}

export interface Vehicle {
  id: string;
  type: 'car' | 'motorcycle' | 'truck' | 'van' | string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  isDefault?: boolean;
}

export type PaymentMethod = CardPaymentMethod | UpiPaymentMethod;

export interface CardPaymentMethod {
  id: string;
  type: 'card';
  cardNumber?: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  expiryDate?: string;
  cardholderName: string;
  cardHolderName?: string; // For backward compatibility
  isDefault: boolean;
  cardBrand: string;
}

export interface UpiPaymentMethod {
  id: string;
  type: 'upi';
  upiId: string;
  isDefault: boolean;
}

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  description: string;
  images: string[];
  price: number;
  priceUnit: 'hour' | 'day' | 'month';
  rating: number;
  reviews: number;
  distance?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  features: string[];
  amenities?: string[];
  availability?: {
    available: boolean;
    slots: number;
  } | string;
  restrictions?: string[];
  rules?: string[];
  ownerId?: string;
  ownerName?: string;
  ownerAvatar?: string;
  ownerRating?: number;
  type?: 'commercial' | 'private' | 'street' | 'garage' | 'lot' | 'basement';
  locationType?: 'commercial' | 'residential';
  securityFeatures?: string[];
  available?: boolean;
  isPopular?: boolean;
  totalSpots?: number;
  availableSpots?: number;
  // Calculated rates for different time periods
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  parkingType?: 'instant' | 'lease';
}

export interface Booking {
  id: string;
  spotId: string;
  spotName: string;
  spotAddress: string;
  spotImage: string;
  userId: string;
  vehicleId: string;
  vehicleInfo: {
    make: string;
    model: string;
    licensePlate: string;
  };
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  createdAt: Date;
  qrCode?: string;
  instructions?: string;
  address?: string; // Added for backward compatibility
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethodId: string;
  paymentMethodType: 'card' | 'upi';
  paymentMethodDetails: {
    last4?: string;
    brand?: string;
    upiId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  date: string;
  timestamp: number;
}