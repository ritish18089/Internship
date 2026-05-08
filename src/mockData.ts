import { User, Car, ServiceRequest } from './types';

export const MOCK_USERS: User[] = [
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', phone: '5551234567', role: 'CUSTOMER' },
];

export const MOCK_CARS: Car[] = [
  { id: 'c1', userId: '3', brand: 'Toyota', model: 'Camry', number: 'ABC-1234' },
  { id: 'c2', userId: '3', brand: 'Honda', model: 'Civic', number: 'XYZ-5678' },
  { id: 'c3', userId: '3', brand: 'Ford', model: 'Mustang', number: 'GT-500' },
];

export const MOCK_REQUESTS: ServiceRequest[] = [
  { id: 'r1', userId: '3', carId: 'c1', serviceType: 'Oil Change', requestDate: '2024-03-15', status: 'COMPLETED' },
  { id: 'r2', userId: '3', carId: 'c2', serviceType: 'Brake Inspection', requestDate: '2024-03-20', status: 'IN_PROGRESS' },
  { id: 'r3', userId: '3', carId: 'c3', serviceType: 'Engine Tuning', requestDate: '2024-03-22', status: 'PENDING' },
];
