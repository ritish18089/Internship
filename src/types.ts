export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
}

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface Car {
  id: string;
  userId: string;
  model: string;
  brand: string;
  number: string;
}

export type ServiceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ServiceSlot {
  id?: string;
  date: string;
  time: string;
  capacity: number;
  available?: boolean;
  remaining?: number;
}

export interface ServiceRequest {
  id: string;
  userId?: string;
  carId?: string;
  user?: User;
  car?: Car;
  serviceType: string;
  requestDate: string;
  bookingDate: string;
  bookingTime: string;
  status: ServiceStatus;
  cost?: number;
}
