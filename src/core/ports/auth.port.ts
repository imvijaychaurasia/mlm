import { Entitlements } from '../config/pricing';

import { Entitlements } from '../config/pricing';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  entitlements?: Entitlements;
  entitlements?: Entitlements;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
  phone?: string;
}

export interface OTPVerification {
  phone: string;
  otp: string;
}

export interface AuthPort {
  login(credentials: AuthCredentials): Promise<{ user: User; token: string }>;
  loginWithGoogle(): Promise<{ user: User; token: string }>;
  signup(data: SignupData): Promise<{ user: User; token: string }>;
  sendOTP(phone: string): Promise<{ success: boolean; message: string }>;
  verifyOTP(data: OTPVerification): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<{ token: string }>;
}