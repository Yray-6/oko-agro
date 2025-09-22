// types/auth.ts

// Common types
export type FarmSizeUnit = 'hectare' | 'acre';
export type UserRole = 'farmer' | 'processor' | 'admin';

// Crop type
export interface Crop {
  id: string;
  name: string;
}


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string | null;
  country: string;
  state: string;
  farmName: string | null;
  farmSize: string | null;
  farmSizeUnit: FarmSizeUnit | null;
  estimatedAnnualProduction: string;
  farmingExperience: string | null;
  internetAccess: string | null;
  howUserSellCrops: string | null;
  bankName: string;
  accountNumber: string;
  role: UserRole;
  
  // Additional fields present in the data but missing from original interface
  companyName: string | null;
  businessRegNumber: string | null;
  yearEstablished: string | null;
  businessType: string | null;
  processsingCapacitySize: string | null;
  processsingCapacityUnit: string | null;
  operatingDaysPerWeek: string | null;
  storageCapacity: string | null;
  minimumOrderQuality: string | null;
  OperationsType: string | null;
  
  userVerified: boolean;
  userVerificationOtp?: string | null; // Made optional since it's not in the data
  userVerificationOtpExpiryTime?: string | null; // Made optional since it's not in the data
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Arrays
  crops: Crop[];
  certifications: CertificationResponse[];
  qualityStandards: QualityResponse[];
  files: UserFile[];
}

export interface UserFile {
  id: string;
  name: string;
  description: string;
  mimeType: string;
  size: string;
  url: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}


// Tokens type
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export type RegisterUserRequest = 
  | RegisterFarmerRequest 
  | RegisterProcessorRequest;

export interface BaseRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string; // Consider renaming to 'address'
  country: string;
  state: string;
  password: string;
  confirmPassword: string;
  cropIds: string[];
}

export interface RegisterFarmerRequest extends BaseRegisterRequest {
  role: 'farmer';
  farmName: string;
  farmSize: string;
  farmSizeUnit: FarmSizeUnit;
  estimatedAnnualProduction: string;
  farmingExperience: string;
  internetAccess: string;
  howUserSellCrops: string;
  userPhoto: string; // base64 string
  farmPhoto: string; // base64 string
  bankName: string;
  accountNumber: string;
}

export interface RegisterProcessorRequest extends BaseRegisterRequest {
  role: 'processor';
  companyName: string;
  businessRegNumber: string;
  yearEstablished: string;
  businessType: string;
  processsingCapacitySize: string;
  processsingCapacityUnit: string;
  operatingDaysPerWeek: string;
  storageCapacity: string;
  minimumOrderQuality: string;
  OperationsType: string;
  qualityStandardIds: string[];
  certificationIds: string[];
  businessRegCertDoc: string; // base64 string
  taxIdCertDoc: string; // base64 string
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
export type AuthAction = 'register' | 'login' | 'verify-otp' | 'resend-otp' | 'refresh';

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

// Add refresh token request interface
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Add refresh token response interface (only returns new access token)
export interface RefreshTokenResponse {
  accessToken: string;
}

// Update AuthActions interface to include refresh token function
export interface AuthActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setTokens: (tokens: Tokens) => void;
  clearTokens: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  register: (data: RegisterUserRequest) => Promise<void>;
  login: (data: LoginUserRequest) => Promise<void>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<void>;
  resendOtp: (data: ResendOtpRequest) => Promise<void>;
  fetchProfile: () => Promise<User | undefined>;
  refreshToken: () => Promise<boolean>; // Add this line
  logout: () => void;
}


export interface CropResponse {
  id: string;
  name: string;
}

export interface QualityResponse {
  id:string;
  name:string;
}

export interface CertificationResponse {
  id:string;
  name:string;
}