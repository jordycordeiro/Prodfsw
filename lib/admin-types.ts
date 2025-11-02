// Tipos para o painel administrativo

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  prescriptions: Prescription[];
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: number;
  name: string;
  menuId: number;
  content: string;
  medications: Medication[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
}

export interface ContentItem {
  id: number;
  title: string;
  type: 'exam' | 'complaint' | 'template';
  category?: string;
  author: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  type: 'admin' | 'doctor' | 'user';
  status: 'active' | 'inactive';
  registrationDate: string;
  lastLogin?: string;
}

export interface FinancialPlan {
  id: number;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  activeUsers: number;
  status: 'active' | 'inactive';
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  startDate: string;
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'expired';
}

export interface Payment {
  id: number;
  userId: number;
  planId: number;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
}
