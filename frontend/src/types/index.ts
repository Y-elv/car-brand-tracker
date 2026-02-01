export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface CarBrand {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KilometerEntry {
  _id: string;
  user: string;
  brand: { _id: string; name: string };
  kilometers: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TotalByBrand {
  brandId: string;
  brandName: string;
  totalKilometers: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiError {
  success: false;
  message: string;
}
