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
  vin?: string;
  purchaseDate?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  insuranceExpiry?: string;
  pucExpiry?: string;
  warrantyExpiry?: string;
}

export interface PartReplacement {
  id: string;
  partName: string;
  replacementDate: string;
  cost: number;
  notes?: string;
}

export interface AccidentRecord {
  id: string;
  description: string;
  date: string;
  severity: string;
  repairCost?: number;
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

export type SymptomType = 'EXHAUST' | 'FLUID_LEAK' | 'TYRE_WEAR' | 'ENGINE_BAY' | 'OTHER';

export interface VisualFault {
  id: number;
  car: Car;
  user: User;
  fileName: string;
  symptomType: SymptomType;
  detectedFault: string;
  confidenceScore: number;
  technicianRecommendations: string;
  fileUrl: string;
  status: string;
  createdAt: string;
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
  laborCost?: number;
  partsCost?: number;
  technicianNotes?: string;
  healthImpact?: number;
  logistics?: LogisticsRequest;
}
export type LogisticsStatus = 'PENDING' | 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED';
export type LogisticsType = 'PICKUP' | 'DELIVERY';

export interface LogisticsRequest {
  id: number;
  serviceRequest: ServiceRequest;
  type: LogisticsType;
  status: LogisticsStatus;
  driverName?: string;
  driverPhone?: string;
  pickupAddress: string;
  otp: string;
  currentLat: number;
  currentLng: number;
  scheduledTime: string;
  completedAt?: string;
}

export interface RepairProof {
  id: number;
  serviceRequest: ServiceRequest;
  type: 'BEFORE' | 'DURING' | 'AFTER';
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  uploadedAt: string;
}
