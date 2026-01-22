// types/auth.ts


// Common types
export type FarmSizeUnit = 'hectare' | 'acre';
export type EstimatedAnnualProductionUnit = 'tonne' | 'kg' | 'tons';
export type UserRole = 'farmer' | 'processor' | 'admin' | 'super_admin';

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
  operationsType: string | null;

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
  estimatedAnnualProductionUnit: EstimatedAnnualProductionUnit;
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
  businessType?: string;
  processsingCapacitySize: string;
  processsingCapacityUnit: string;
  operatingDaysPerWeek: string;
  storageCapacity: string;
  minimumOrderQuality: string;
  operationsType: string;
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
// export interface UserProductsResponse {
//   statusCode: number,
//   message: string,
//   data: UserProducts[]
// }

export interface UserProducts {
  statusCode: number;
  message: string;
  data: ProductDetails[]
}

export interface UserProductsResponse {
  statusCode: number;
  message: string;
  data: ProductDetails
}


export interface ProductDetails extends BaseEntityProduct {
  name: string;
  cropType?: CropType;
  quantity: string;
  quantityUnit: string;
  pricePerUnit: string;
  priceCurrency: string;
  locationAddress: string;
  owner?: ProductOwner;
  photos: ProductPhoto[] ;
  harvestEvent?: HarvestEvent;
  isDeleted?: boolean;
  cropId?:string;
  status:string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';


}

interface HarvestEvent extends BaseEntityProduct {
  name: string;
  description: string;
  referenceId: string;
  referenceType: string;
  eventDate: string;
  status: string;
  isDeleted: boolean;
}

interface ProductPhoto extends BaseEntityProduct {
  name: string;
  url: string;
  publicId: string;
  description: string;
  mimeType: string;
  size: string;
}

export interface ProductOwner extends BaseEntityProduct{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string;
  country: string;
  state: string;
  farmName: string;
  farmSize: number | null;
  farmSizeUnit: string;
  estimatedAnnualProduction: string;
  farmingExperience: string;
  internetAccess: string;
  howUserSellCrops: string;
  bankName: string;
  accountNumber: string;
  role: string;

  // Business-related fields (nullable for farmers)
  companyName: string | null;
  businessRegNumber: string | null;
  yearEstablished: number | null;
  businessType: string | null;
  processsingCapacitySize: number | null;
  processsingCapacityUnit: string | null;
  operatingDaysPerWeek: number | null;
  storageCapacity: number | null;
  minimumOrderQuality: number | null;
  operationsType: string | null;

  userVerified: boolean;
  isDeleted: boolean;
}

interface BaseEntityProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CropType extends BaseEntityProduct {
  name: string
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
  id: string;
  name: string;
}

export interface CertificationResponse {
  id: string;
  name: string;
}



export interface CreateProduct {
  name: string;
  cropId: string;
  quantity: string;
  quantityUnit: string;
  pricePerUnit: string;
  priceCurrency: string;
  harvestDate: string;
  locationAddress: string;
  photos: string[];
}

export interface EditProduct {
  productId: string;
  name: string;
  quantity: string;
  quantityUnit: string;
  pricePerUnit: string;
  priceCurrency: string;
  harvestDate: string;
  locationAddress: string;
}



export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  farmName: string | null;
  state: string;
  country: string;
  farmAddress: string;
  crops: Crop[];
  perfectMatch: boolean;
}

export interface UsersSearchResponse {
  items: UserProfile[];
  matchedRecord: number;
  totalRecord: number;
  pageNumber: number;
  pageSize: number;
}

// Request interfaces for the store (simplified DTOs)
export interface CreateProductRequest {
  name: string;
  cropId: string;
  quantity: string;
  quantityUnit: 'kilogram' | 'tonne';
  pricePerUnit: string;
  priceCurrency: string;
  harvestDate: string;
  locationAddress: string;
  photos: string[];
}

export interface UpdateProductRequest {
  productId: string;
  name: string;
  quantity: string;
  quantityUnit: string;
  pricePerUnit: string;
  priceCurrency: string;
  harvestDate?: string;
  locationAddress: string;
}

export interface SearchUsersParams {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Internal request interfaces with action field
export interface CreateProductApiRequest extends CreateProductRequest {
  action: 'create';
}

export interface UpdateProductApiRequest extends UpdateProductRequest {
  action: 'update';
}


export interface EventOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string;
  country: string;
  state: string;
  farmName: string;
  role: string;
  userVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Event interfaces
export interface EventDetails {
  id: string;
  name: string;
  description?: string;
  referenceType: string;
  referenceId?: string;
  eventDate: string;
  isHarvestEvent?: boolean;
  cropId?: string;
  crop?: {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  };
  cropQuantity?: string;
  cropQuantityUnit?: string;
  status?: 'upcoming' | 'in-progress' | 'completed';
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    farmAddress?: string;
    farmName?: string;
    state?: string;
    country?: string;
    role?: string;
  };
  product?: {
    id: string;
    name: string;
    quantity?: string;
    quantityUnit?: string;
    locationAddress?: string;
  };
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

// Product/Crop Info

export interface CropType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}


export interface EventProduct {
  id: string;
  name: string;
  cropType: CropType;
  quantity: string;
  quantityUnit: string;
  pricePerUnit: string;
  priceCurrency: string;
  locationAddress: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Main Event Interface
export interface Event {
  id: string;
  name: string;
  description: string | null;
  referenceId: string | null;
  referenceType: 'custom' | 'product' | 'order';
  eventDate: string; // ISO 8601 format
  isHarvestEvent?: boolean;
  cropId?: string;
  cropQuantity?: string;
  cropQuantityUnit?: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  owner: EventOwner;
  product: EventProduct | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface CreateEventResponse {
  statusCode: 201;
  message: string;
  data: EventDetails;
}

export interface GetEventResponse {
  statusCode: 200;
  message: string;
  data: EventDetails;
}

export interface GetUserEventsResponse {
  statusCode: 200;
  message: string;
  data: EventDetails[];
}

// UI-specific types
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  location: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  category: 'quality-inspection' | 'delivery' | 'crop-harvest' | 'custom';
  description?: string;
}


// export type ProductQuantityUnit = 'kilogram' | 'tons' | 'bags' | 'pieces';
export type PaymentMethod = 'pay_on_delivery' | 'bank_transfer' | 'mobile_money' | 'cash';
// export type BuyRequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
// export type BusinessType = 'food processing' | 'export' | 'retail' | 'wholesale';
// export type OperationsType = 'seasonal' | 'year-round';





// File/Document
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

// Buyer/Seller User Profile (Processor or Farmer)
export interface BuyRequestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string;
  country: string;
  state: string;
  role: 'processor' | 'farmer';
  userVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Farmer-specific fields
  farmName?: string | null;
  farmSize?: string | null;
  farmSizeUnit?: string | null;
  estimatedAnnualProduction?: string | null;
  farmingExperience?: string | null;
  internetAccess?: string | null;
  howUserSellCrops?: string | null;
  
  // Processor-specific fields
  companyName?: string | null;
  businessRegNumber?: string | null;
  yearEstablished?: string | null;
  businessType?: string| null;
  processsingCapacitySize?: string | null;
  processsingCapacityUnit?: string | null;
  operatingDaysPerWeek?: string | null;
  storageCapacity?: string | null;
  minimumOrderQuality?: string | null;
  operationsType?: string| null;
  
  // Common optional fields
  bankName?: string | null;
  accountNumber?: string | null;
  
  // Relationships
  certifications?: CertificationResponse[];
  qualityStandards?: QualityResponse[];
  crops?: CropType[];
  files?: UserFile[];
}

// Full Buyer Profile (includes sensitive data like password - only in detailed fetch)
export interface BuyRequestBuyerFull extends BuyRequestUser {
  password?: string;
  userVerificationOtp?: string | null;
  userVerificationOtpExpiryTime?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpiryTime?: string | null;
  passwordChangedAt?: string | null;
}

// Product reference (if linked to a specific product)
export interface ProductReference {
  id: string;
  name: string;
  // Add other product fields as needed
}

// Main Buy Request Interface
export interface BuyRequest {
  id: string;
  requestNumber: number | string;
  description: string;
  cropType: CropType;
  qualityStandardType: QualityResponse;
  productQuantity: string;
  productQuantityUnit: string;
  pricePerUnitOffer: string;
  estimatedDeliveryDate: string;
  deliveryLocation: string;
  preferredPaymentMethod: PaymentMethod;
  status: string;
  isGeneral: boolean;
  buyer: BuyRequestUser | BuyRequestBuyerFull;
  seller: BuyRequestUser | null;
  product: ProductReference | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  orderState?: string; // Order state for accepted orders (e.g., 'awaiting_shipping', 'in_transit', 'delivered', 'completed')
  orderStateTime?: string;
  paymentAmount?: string;
  paymentConfirmed?: boolean;
  paymentConfirmedAt?: string;
  purchaseOrderDoc?: UserFile | null; // Purchase order document
}

// Create Buy Request Payload
export interface CreateBuyRequestRequest {
  description: string;
  cropId: string;
  qualityStandardId: string;
  productQuantity: string;
  productQuantityUnit: string;
  pricePerUnitOffer: string;
  estimatedDeliveryDate: string;
  deliveryLocation: string;
  preferredPaymentMethod: PaymentMethod;
  isGeneral: boolean;
  productId?: string; // Optional - if linking to specific product
  sellerId?: string;
  purchaseOrderDoc?: string; // Optional - base64 encoded purchase order document (required when isGeneral is false)
}

// Update Buy Request Payload
export interface UpdateBuyRequestRequest {
  buyRequestId: string;
  description?: string;
  cropId?: string;
  qualityStandardId?: string;
  productQuantity?: string;
  productQuantityUnit?: string;
  pricePerUnitOffer?: string;
  estimatedDeliveryDate?: string;
  deliveryLocation?: string;
  preferredPaymentMethod?: PaymentMethod;
  isGeneral?: boolean;
  productId?: string;
}

// Update Buy Request Status Payload (for farmers)
export interface UpdateBuyRequestStatusRequest {
  buyRequestId: string;
  status:string;
  productId?: string; // If farmer is linking their product
}

// API Request Types with action
export interface CreateBuyRequestApiRequest extends CreateBuyRequestRequest {
  action: 'create';
}

export interface UpdateBuyRequestApiRequest extends UpdateBuyRequestRequest {
  action: 'update';
}

export interface UpdateBuyRequestStatusApiRequest extends UpdateBuyRequestStatusRequest {
  action: 'update-status';
}

// API Response Types
export interface BuyRequestResponse {
  statusCode: number;
  message: string;
  data: BuyRequest;
}

export interface BuyRequestsListResponse {
  statusCode: number;
  message: string;
  data: MyBuyRequest;
}

export interface GeneralBuyRequestsListResponse {
  statusCode: number;
  message: string;
  data: BuyRequest[];
}

export interface MyBuyRequest {
  items:BuyRequest[];
   totalRecord: number,
  pageNumber: number,
    pageSize: number
}

export interface DeleteBuyRequestResponse {
  statusCode: number;
  message: string;
  data?: null;
}

export interface UserBuyRequestsListResponse {
  statusCode: number;
  message: string;
  data: BuyRequest[];
}

// If you want to add it to the store state, also add this interface:
export interface FetchUserRequestsParams {
  userId: string;
}

export enum BuyRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum OrderState {
  AWAITING_SHIPPING = 'awaiting_shipping',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
}

// Ongoing Buy Requests Response
export interface OngoingBuyRequestResponse {
  statusCode: number;
  message: string;
  data: {
    items: BuyRequest[];
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  };
}

// Update Order State Request
export interface UpdateOrderStateRequest {
  buyRequestId: string;
  orderState: OrderState;
}

// Admin Management Types
export interface CreateAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface CreateAdminResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
  };
}

export interface UpdateUserStatusRequest {
  userId: string;
  isDisabled: boolean;
}

export interface UpdateAdminPasswordRequest {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

// Admin Dashboard Types
export interface AdminDashboardStats {
  totalUsers: number;
  totalTransactionValue: number;
  completedOrders: number;
  pendingListings: number;
}

export interface AdminDashboardResponse {
  statusCode: number;
  message: string;
  data: AdminDashboardStats;
}

// Users List Types
export interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmAddress: string | null;
  country: string;
  state: string;
  farmName: string | null;
  companyName: string | null;
  role: UserRole;
  userVerified: boolean;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  crops: Array<{
    id: string;
    name: string;
  }>;
  perfectMatch?: boolean;
}

export interface UsersListResponse {
  statusCode: number;
  message: string;
  data: {
    items: UserListItem[];
    totalRecord: number;
    totalFarmerRecord?: number;
    totalProcessorRecord?: number;
    matchedRecord?: number;
    pageNumber: number;
    pageSize: number;
  };
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = 'buy_request' | 'order_status' | 'contact_message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType?: 'buy_request' | 'order';
  relatedEntityId?: string;
  senderId?: string;
  senderName?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Notification[];
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
    unreadCount: number;
  };
}

export interface MarkNotificationReadResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    isRead: boolean;
  };
}

export interface MarkAllNotificationsReadResponse {
  statusCode: number;
  message: string;
  data: {
    markedCount: number;
  };
}

export interface SendContactMessageRequest {
  buyRequestId: string;
  processorId: string;
  message?: string;
}

export interface SendContactMessageResponse {
  statusCode: number;
  message: string;
  data: Notification;
}

export interface FetchNotificationsParams {
  pageNumber?: number;
  pageSize?: number;
  type?: NotificationType;
  isRead?: boolean;
}

// Direct Buy Request Types
export interface DirectBuyRequestRequest {
  buyRequestId: string;
  sellerId: string;
}

export interface DirectBuyRequestResponse {
  statusCode: number;
  message: string;
  data: BuyRequest;
}

export interface UploadPurchaseOrderRequest {
  buyRequestId: string;
  purchaseOrderDoc: string; // base64 encoded
}

export interface UploadPurchaseOrderResponse {
  statusCode: number;
  message: string;
  data: BuyRequest;
}

// ============================================
// RATING TYPES
// ============================================

export interface UserRatingStats {
  average: number;
  total: number;
  breakdown: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface UserRatingStatsResponse {
  statusCode: number;
  message: string;
  data: UserRatingStats;
}

export interface CreateRatingRequest {
  buyRequestId: string;
  score: number; // 1-5
  comment?: string;
}

export interface Rating {
  id: string;
  buyRequestId: string;
  raterId: string; // User who gave the rating
  ratedUserId: string; // User being rated (farmer or processor)
  score: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingResponse {
  statusCode: number;
  message: string;
  data: Rating;
}

// ============================================
// DISPUTE TYPES
// ============================================

export interface Dispute {
  id: string;
  buyRequestId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdBy: string; // User ID who created the dispute
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  buyRequest?: BuyRequest; // Optional: full buy request details
}

export interface CreateDisputeRequest {
  buyRequestId: string;
  reason: string;
}

export interface CreateDisputeResponse {
  statusCode: number;
  message: string;
  data: Dispute;
}

export interface DisputesListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Dispute[];
    total: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface DisputeResponse {
  statusCode: number;
  message: string;
  data: Dispute;
}

export interface ResolveDisputeResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    status: 'resolved' | 'rejected';
    resolvedAt: string;
  };
}