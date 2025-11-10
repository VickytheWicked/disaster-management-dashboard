// Type definitions for the Disaster Relief System

export type UserRole = 'Admin' | 'Warehouse owner' | 'Volunteer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
}

export interface Resource {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  condition: 'New' | 'Good' | 'Fair' | 'Damaged';
  expiryDate?: string;
  location: string;
  category: string;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'SMS' | 'Email' | 'Broadcast';
  recipients: string;
  timestamp: string;
  status: 'Sent' | 'Pending' | 'Failed';
  sender: string;
}

export interface DashboardStats {
  totalResources: number;
  activeVolunteers: number;
  recentAlerts: number;
  lowStockItems: number;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
