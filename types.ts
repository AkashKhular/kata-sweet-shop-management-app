export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  token?: string;
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type SweetFilter = {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
};