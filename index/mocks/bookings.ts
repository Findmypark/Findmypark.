import { Booking } from '@/types';

export const bookings: Booking[] = [
  {
    id: 'b1',
    spotId: '1',
    spotName: 'Downtown Secure Parking',
    spotImage: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    startTime: '2023-10-15T10:00:00Z',
    endTime: '2023-10-15T14:00:00Z',
    status: 'completed',
    price: 1200,
    address: '123 Main St, Hyderabad',
  },
  {
    id: 'b2',
    spotId: '3',
    spotName: 'Riverside Parking Lot',
    spotImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFya2luZyUyMGxvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    startTime: '2023-10-20T09:00:00Z',
    endTime: '2023-10-20T17:00:00Z',
    status: 'upcoming',
    price: 2500,
    address: '789 River Rd, Hyderabad',
  },
  {
    id: 'b3',
    spotId: '2',
    spotName: 'Central Park Garage',
    spotImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGFya2luZyUyMGdhcmFnZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    startTime: '2023-10-18T12:00:00Z',
    endTime: '2023-10-18T15:00:00Z',
    status: 'active',
    price: 900,
    address: '456 Park Ave, Hyderabad',
  },
];