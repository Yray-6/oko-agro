// types/auth.ts

// Common types
export type FarmSizeUnit = 'hectare' | 'acre';
export type UserRole = 'farmer' | 'processor' | 'admin';

// Crop type
export interface Crop {
  id: string;
  name: string;
}

// User type
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string;
  country: string;
  state: string;
  farmName: string;
  farmSize: string;
  unit: FarmSizeUnit;
  estimatedAnnualProduction: string;
  farmingExperience: string;
  internetAccess: string;
  howUserSellCrops: string;
  bankName: string;
  accountNumber: string;
  role: UserRole;
  userVerified: boolean;
  userVerificationOtp: string | null;
  userVerificationOtpExpiryTime: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  crops: Crop[];
}

// Tokens type
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Request types
export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string;
  country: string;
  state: string;
  farmName: string;
  farmSize: number;
  unit: FarmSizeUnit;
  cropIds: string[];
  estimatedAnnualProduction: number;
  farmingExperience: string;
  internetAccess: string;
  howUserSellCrops: string;
  userPhoto: string; // base64 string
  farmPhoto: string; // base64 string
  bankName: string;
  accountNumber: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

export interface ResendOtpRequest {
  userId: string;
}

// Response types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

export interface RegisterUserResponse {
  id: string;
}

export interface LoginUserResponse {
  user: User;
  tokens: Tokens;
}

// Auth action types for the API route
export type AuthAction = 'register' | 'login' | 'verify-otp' | 'resend-otp';

export interface AuthApiRequest {
  action: AuthAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Store state types
export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationUserId: string | null; // Store userId after registration for OTP verification
}

// Store actions types
export interface AuthActions {
  // API actions
  register: (data: RegisterUserRequest) => Promise<void>;
  login: (data: LoginUserRequest) => Promise<void>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<void>;
  resendOtp: (data: ResendOtpRequest) => Promise<void>;
  logout: () => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Token management
  setTokens: (tokens: Tokens) => void;
  clearTokens: () => void;
  
  // User management
  setUser: (user: User) => void;
  clearUser: () => void;
}

export interface CropResponse {
  id: string;
  name: string;
}