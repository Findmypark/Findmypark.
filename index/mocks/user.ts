import { User, Vehicle, PaymentMethod } from '@/types';

// Mock user data
export const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
  favorites: ['1', '3', '6'],
  vehicles: [
    {
      id: 'v1',
      type: 'car',
      make: 'Honda',
      model: 'Civic',
      year: '2020',
      color: 'Blue',
      licensePlate: 'MH 01 AB 1234',
      isDefault: true,
    },
    {
      id: 'v2',
      type: 'car',
      make: 'Toyota',
      model: 'Corolla',
      year: '2019',
      color: 'Silver',
      licensePlate: 'MH 02 CD 5678',
      isDefault: false,
    },
    {
      id: 'v3',
      type: 'bike',
      make: 'Royal Enfield',
      model: 'Classic 350',
      year: '2021',
      color: 'Black',
      licensePlate: 'MH 03 EF 9012',
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 'pm1',
      type: 'card',
      cardNumber: '4111 1111 1111 1111',
      cardExpiry: '12/25',
      cardCvv: '123',
      cardHolderName: 'John Doe',
      isDefault: true,
    },
    {
      id: 'pm2',
      type: 'upi',
      upiId: 'johndoe@upi',
      isDefault: false,
    },
    {
      id: 'pm3',
      type: 'netbanking',
      bankName: 'HDFC Bank',
      isDefault: false,
    },
  ],
};

// Mock users array for admin purposes
export const users: User[] = [
  mockUser,
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+91 9876543211',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    favorites: ['2', '5', '8'],
    vehicles: [
      {
        id: 'v4',
        type: 'car',
        make: 'Hyundai',
        model: 'i20',
        year: '2021',
        color: 'Red',
        licensePlate: 'MH 04 GH 3456',
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: 'pm4',
        type: 'card',
        cardNumber: '5555 5555 5555 4444',
        cardExpiry: '10/24',
        cardCvv: '321',
        cardHolderName: 'Jane Smith',
        isDefault: true,
      },
    ],
  },
];

// Function to get user by ID
export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.id === userId);
};

// Function to get user by email
export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};