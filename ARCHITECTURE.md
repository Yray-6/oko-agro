# Oko Agro - Project Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [State Management](#state-management)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Architecture](#api-architecture)
8. [Routing & Navigation](#routing--navigation)
9. [Component Architecture](#component-architecture)
10. [Data Flow](#data-flow)
11. [Styling & UI](#styling--ui)
12. [Development Workflow](#development-workflow)

---

## Overview

**Oko Agro** is a Next.js-based agricultural marketplace platform connecting farmers and processors. The application facilitates product listings, order management, transaction processing, and user management across three distinct user roles: Farmers, Processors, and Administrators.

### Key Features
- Multi-role authentication (Farmer, Processor, Admin)
- Product listing and management
- Order processing and tracking
- Transaction history
- User management (Admin)
- Calendar/scheduling system
- Real-time notifications

---

## Technology Stack

### Core Framework
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### State Management
- **Zustand 5.0.8** - Lightweight state management
- **Zustand Persist** - State persistence middleware

### HTTP Client
- **Axios 1.11.0** - HTTP client for API requests

### Form Management
- **Formik 2.4.6** - Form state management
- **Yup 1.7.0** - Schema validation

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React 0.542.0** - Icon library
- **React Hot Toast 2.6.0** - Toast notifications
- **Next.js Image** - Optimized image component

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Next.js bundler (dev mode)

### Fonts
- **Urbanist** (Google Fonts) - Primary font family

---

## Project Structure

```
oko-agro/
├── app/                          # Next.js App Router directory
│   ├── admin/                    # Admin dashboard routes
│   │   ├── analytics/            # Analytics page
│   │   ├── layout.tsx           # Admin layout wrapper
│   │   ├── order-management/     # Order management
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── settings/            # Admin settings
│   │   └── user-management/     # User management
│   │       ├── [id]/            # Dynamic user detail page
│   │       └── page.tsx         # User list page
│   │
│   ├── api/                      # API routes (Next.js API routes)
│   │   ├── auth/                # Authentication endpoints
│   │   │   └── route.ts        # Auth API handler
│   │   ├── events/              # Events API
│   │   ├── products/            # Products API
│   │   └── requests/            # Buy requests API
│   │
│   ├── assets/                   # Static assets
│   │   ├── icons/               # SVG icons & React icon components
│   │   └── images/              # Image files
│   │
│   ├── components/               # Reusable React components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   │   ├── Cards.tsx        # Stat cards
│   │   │   ├── ChartCard.tsx    # Chart visualization card
│   │   │   ├── LinkCard.tsx     # Navigation cards
│   │   │   ├── ProductCard.tsx  # Product display cards
│   │   │   └── ...
│   │   ├── dashboad-processor/  # Processor dashboard components
│   │   ├── forms/               # Form components
│   │   │   ├── LoginFarmer.tsx
│   │   │   ├── LoginProcessor.tsx
│   │   │   ├── FarmerOnboarding.tsx
│   │   │   └── ...
│   │   ├── Modal.tsx            # Modal component
│   │   ├── ToastContainer.tsx   # Toast notifications
│   │   └── ...
│   │
│   ├── dashboard/                # Farmer dashboard routes
│   │   ├── calendar/            # Calendar view
│   │   ├── find-processor/      # Processor search
│   │   ├── layout.tsx           # Farmer dashboard layout
│   │   ├── orders/              # Orders management
│   │   ├── page.tsx             # Dashboard home
│   │   ├── products/            # Product management
│   │   ├── settings/            # User settings
│   │   └── transactions/       # Transaction history
│   │
│   ├── dashboard-processor/      # Processor dashboard routes
│   │   ├── calendar-processor/  # Processor calendar
│   │   ├── find-farmer/         # Farmer search
│   │   ├── layout.tsx          # Processor dashboard layout
│   │   ├── orders/             # Processor orders
│   │   ├── page.tsx            # Processor dashboard
│   │   ├── settings/           # Processor settings
│   │   └── transaction-history/ # Transaction history
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useToast.ts         # Toast notification hook
│   │   └── useTokenMonitor.ts  # Token expiration monitoring
│   │
│   ├── store/                    # Zustand state stores
│   │   ├── useAuthStore.ts     # Authentication state
│   │   ├── useProductStore.ts  # Product state
│   │   ├── useRequestStore.ts  # Buy request state
│   │   ├── useEventStore.ts    # Event/calendar state
│   │   └── useDataStore.ts     # General data state
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts            # All type definitions
│   │
│   ├── utils/                    # Utility functions
│   │   └── apiClient.ts        # Axios instance configuration
│   │
│   ├── helpers/                  # Helper functions
│   │   └── index.ts            # Utility helpers
│   │
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── middleware.ts            # Next.js middleware
│   ├── page.tsx                 # Landing page
│   │
│   └── [auth-routes]/           # Authentication routes
│       ├── login-farmer/
│       ├── login-processor/
│       ├── register-farmer/
│       ├── register-processor/
│       ├── verify-otp/
│       └── reset-password/
│
├── public/                       # Public static files
│   └── icons/                   # Public icon assets
│
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # Project readme
```

---

## Architecture Patterns

### 1. **App Router Pattern (Next.js 13+)**
The application uses Next.js App Router with:
- **File-based routing** - Routes defined by folder structure
- **Server and Client Components** - Hybrid rendering
- **Layouts** - Nested layouts for different sections
- **Route Groups** - Organized route segments

### 2. **State Management Pattern**
- **Zustand** for global state management
- **Local Component State** for UI-specific state
- **Server State** via API routes
- **Persisted State** for authentication tokens

### 3. **Component Composition Pattern**
- **Container/Presentational** separation
- **Reusable UI components**
- **Layout components** for consistent structure
- **Form components** with validation

### 4. **API Route Pattern**
- **Next.js API Routes** as backend proxy
- **Action-based API design** (single endpoint, multiple actions)
- **Centralized error handling**
- **Token-based authentication**

---

## State Management

### Store Architecture

The application uses **Zustand** stores for global state management:

#### 1. **useAuthStore** (`app/store/useAuthStore.ts`)
Manages authentication state and user session.

**State:**
```typescript
{
  user: User | null
  tokens: Tokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registrationUserId: string | null
  hasHydrated: boolean
}
```

**Actions:**
- `register()` - User registration
- `login()` - User login
- `verifyOtp()` - OTP verification
- `logout()` - User logout
- `refreshToken()` - Token refresh
- `fetchProfile()` - Fetch user profile
- `forgotPassword()` - Password reset request
- `resetPassword()` - Password reset

**Persistence:**
- Uses `persist` middleware
- Stores in `localStorage` as `auth-storage`
- Persists: user, tokens, isAuthenticated, registrationUserId

#### 2. **useProductStore** (`app/store/useProductStore.ts`)
Manages product listings and operations.

**State:**
- `products: Product[]`
- `isLoading: boolean`
- `error: string | null`

**Actions:**
- `fetchUserProducts()` - Fetch user's products
- `createProduct()` - Create new product
- `updateProduct()` - Update product
- `deleteProduct()` - Delete product

#### 3. **useRequestStore** (`app/store/useRequestStore.ts`)
Manages buy requests (processor requests for products).

**State:**
- `myRequests: BuyRequest[]`
- `isFetching: boolean`
- `isCreating: boolean`

**Actions:**
- `fetchMyRequests()` - Fetch user's requests
- `createRequest()` - Create buy request

#### 4. **useEventStore** (`app/store/useEventStore.ts`)
Manages calendar events and scheduling.

#### 5. **useDataStore** (`app/store/useDataStore.ts`)
General data store for shared application data.

### State Flow

```
Component → Store Action → API Call → Store Update → Component Re-render
```

---

## Authentication & Authorization

### Authentication Flow

1. **Registration**
   ```
   User Registration → OTP Sent → OTP Verification → Account Created
   ```

2. **Login**
   ```
   Credentials → API Call → Tokens Received → Store Tokens → Redirect to Dashboard
   ```

3. **Token Management**
   - Access tokens stored in Zustand (persisted)
   - Refresh tokens used for token renewal
   - Automatic token refresh on 401 errors
   - Token expiration monitoring via `useTokenMonitor` hook

### Authorization

#### Role-Based Access Control (RBAC)

Three user roles:
1. **Farmer** (`farmer`)
   - Access: `/dashboard/*`
   - Can list products, manage orders, view transactions

2. **Processor** (`processor`)
   - Access: `/dashboard-processor/*`
   - Can create buy requests, manage orders, view transactions

3. **Admin** (`admin`)
   - Access: `/admin/*`
   - Full system access, user management, analytics

#### Route Protection

**Middleware** (`app/middleware.ts`):
- Checks for authentication token in cookies
- Redirects unauthenticated users to login
- Allows public paths: `/login`, `/register`, `/api/auth`

**Layout-Level Protection**:
- Each dashboard layout checks authentication
- Redirects based on user role
- Handles token expiration

### Token Refresh Strategy

```typescript
// Automatic refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry original request
      }
    }
  }
);
```

---

## API Architecture

### API Route Structure

All API routes are in `app/api/` directory:

#### 1. **Auth API** (`/api/auth`)
**Endpoint:** `POST /api/auth`

**Actions:**
- `register` - User registration
- `login` - User authentication
- `verifyOtp` - OTP verification
- `resendOtp` - Resend OTP
- `refreshToken` - Refresh access token
- `forgotPassword` - Request password reset
- `resetPassword` - Reset password
- `getProfile` - Get user profile

**Request Format:**
```typescript
{
  action: 'register' | 'login' | 'verifyOtp' | ...
  ...actionSpecificData
}
```

#### 2. **Products API** (`/api/products`)
**Endpoint:** `POST /api/products`

**Actions:**
- `create` - Create product listing
- `update` - Update product
- `delete` - Delete product
- `getUserProducts` - Get user's products
- `getAllProducts` - Get all products (with filters)

#### 3. **Requests API** (`/api/requests`)
**Endpoint:** `POST /api/requests`

**Actions:**
- `create` - Create buy request
- `getMyRequests` - Get user's requests
- `update` - Update request status

#### 4. **Events API** (`/api/events`)
**Endpoint:** `POST /api/events`

**Actions:**
- Calendar event management

### API Client Configuration

**File:** `app/utils/apiClient.ts`

**Features:**
- Base URL: `/api`
- Automatic token injection via interceptors
- 401 error handling with redirect
- 30-second timeout
- Request/response interceptors

**Token Injection:**
```typescript
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Routing & Navigation

### Route Structure

#### Public Routes
- `/` - Landing page
- `/login-farmer` - Farmer login
- `/login-processor` - Processor login
- `/register-farmer` - Farmer registration
- `/register-processor` - Processor registration
- `/verify-otp` - OTP verification
- `/reset-password` - Password reset

#### Protected Routes

**Farmer Dashboard** (`/dashboard/*`)
- `/dashboard` - Dashboard home
- `/dashboard/products` - Product management
- `/dashboard/orders` - Order management
- `/dashboard/transactions` - Transaction history
- `/dashboard/calendar` - Calendar view
- `/dashboard/find-processor` - Find processors
- `/dashboard/settings` - User settings

**Processor Dashboard** (`/dashboard-processor/*`)
- `/dashboard-processor` - Dashboard home
- `/dashboard-processor/orders` - Order management
- `/dashboard-processor/find-farmer` - Find farmers
- `/dashboard-processor/transaction-history` - Transactions
- `/dashboard-processor/calendar-processor` - Calendar
- `/dashboard-processor/settings` - Settings

**Admin Dashboard** (`/admin/*`)
- `/admin` - Admin dashboard
- `/admin/user-management` - User management
- `/admin/user-management/[id]` - User details
- `/admin/order-management` - Order management
- `/admin/analytics` - Analytics
- `/admin/settings` - Admin settings

### Layout Hierarchy

```
Root Layout (app/layout.tsx)
  ├── Landing Page (app/page.tsx)
  ├── Auth Routes (login, register, etc.)
  ├── Farmer Dashboard Layout (app/dashboard/layout.tsx)
  │   └── Dashboard Pages
  ├── Processor Dashboard Layout (app/dashboard-processor/layout.tsx)
  │   └── Processor Pages
  └── Admin Layout (app/admin/layout.tsx)
      └── Admin Pages
```

### Navigation Components

Each layout includes:
- **Sidebar Navigation** - Role-specific menu items
- **Top Header** - Search, notifications, user profile
- **Breadcrumbs** - Contextual navigation (where applicable)

---

## Component Architecture

### Component Categories

#### 1. **Layout Components**
- `app/layout.tsx` - Root layout
- `app/dashboard/layout.tsx` - Farmer dashboard layout
- `app/dashboard-processor/layout.tsx` - Processor layout
- `app/admin/layout.tsx` - Admin layout

**Features:**
- Sidebar navigation
- Header with search and notifications
- Role-based menu items
- Authentication checks

#### 2. **Page Components**
Located in route directories:
- `app/dashboard/page.tsx` - Dashboard home
- `app/admin/page.tsx` - Admin dashboard
- etc.

#### 3. **Reusable UI Components**
Located in `app/components/`:

**Dashboard Components:**
- `Cards.tsx` - Stat cards
- `ChartCard.tsx` - Chart visualization
- `LinkCard.tsx` - Navigation cards
- `ProductCard.tsx` - Product display
- `ProductCardContainer.tsx` - Product grid
- `RecentActivity.tsx` - Activity feed

**Form Components:**
- `LoginFarmer.tsx` - Farmer login form
- `LoginProcessor.tsx` - Processor login form
- `FarmerOnboarding.tsx` - Farmer registration
- `ProcessorRegistrationForm.tsx` - Processor registration
- `FormFields.tsx` - Reusable form fields

**Utility Components:**
- `Modal.tsx` - Modal dialog
- `ToastContainer.tsx` - Toast notifications
- `Loading.tsx` - Loading spinner

#### 4. **Icon Components**
Located in `app/assets/icons/`:
- React components for SVG icons
- Custom icon components (Logo, Dashboard, etc.)
- Lucide React icons for simple icons

### Component Patterns

#### 1. **Client Components**
All interactive components use `"use client"` directive:
```typescript
"use client";
import React from 'react';
```

#### 2. **Server Components**
Default for static content (Next.js 13+)

#### 3. **Container/Presentational Pattern**
- Container components handle logic
- Presentational components handle UI

---

## Data Flow

### Request Flow

```
User Action
  ↓
Component Event Handler
  ↓
Store Action (Zustand)
  ↓
API Client (Axios)
  ↓
API Route (Next.js)
  ↓
External API (Backend)
  ↓
Response Processing
  ↓
Store Update
  ↓
Component Re-render
```

### Example: Product Creation

```
1. User fills form (Formik)
2. Form submission → handleSubmit()
3. useProductStore.createProduct()
4. apiClient.post('/api/products', { action: 'create', ...data })
5. API route processes request
6. Store updates with new product
7. UI updates automatically
```

### State Synchronization

- **Optimistic Updates** - UI updates before API confirmation
- **Error Handling** - Rollback on failure
- **Loading States** - UI feedback during operations

---

## Styling & UI

### Styling Approach

**Tailwind CSS 4** - Utility-first CSS framework

**Configuration:**
- Custom theme in `app/globals.css`
- Custom colors defined:
  - `mainGreen: #004829`
  - `lightGreen: #73ffc2`
  - `green: #0BA964`
  - `yellow: #FFDD55`
  - `blue: #0B99A9`
  - etc.

**Font:**
- **Urbanist** (Google Fonts)
- Configured in `app/layout.tsx`
- CSS variable: `--font-urbanist`

### Design System

**Colors:**
- Primary: Green (`#004829`)
- Secondary: Blue (`#0B99A9`)
- Accent: Yellow (`#FFDD55`)
- Error: Red (`#CD0003`)

**Components:**
- Consistent border radius: `20px` for cards
- Shadow: `0px 1px 2px 0px rgba(16,24,40,0.05)`
- Spacing: Tailwind spacing scale

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Flexible grid layouts

### Image Optimization

- **Next.js Image** component used throughout
- Automatic optimization
- Lazy loading
- Responsive images

---

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Development Tools

- **Turbopack** - Fast bundler (dev mode)
- **ESLint** - Code linting
- **TypeScript** - Type checking

### Code Organization

**Naming Conventions:**
- Components: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase with `use` prefix (`useToast.ts`)
- Stores: camelCase with `use` prefix (`useAuthStore.ts`)
- Types: PascalCase (`User`, `Product`)
- Files: kebab-case or PascalCase (component files)

**File Structure:**
- One component per file
- Co-located types when component-specific
- Shared types in `app/types/index.ts`

### Best Practices

1. **Type Safety**
   - All components typed with TypeScript
   - API responses typed
   - Store state typed

2. **Error Handling**
   - Try-catch blocks in async operations
   - Error states in stores
   - User-friendly error messages

3. **Performance**
   - Code splitting via Next.js
   - Lazy loading images
   - Optimized re-renders with Zustand

4. **Accessibility**
   - Semantic HTML
   - Alt text for images
   - ARIA labels where needed

---

## Security Considerations

### Authentication Security
- JWT tokens for authentication
- Token refresh mechanism
- Secure token storage (localStorage with encryption consideration)
- HTTPS in production

### API Security
- Token-based authentication
- CORS configuration
- Input validation
- SQL injection prevention (backend)

### Client-Side Security
- XSS prevention via React
- CSRF protection via tokens
- Secure cookie handling

---

## Future Enhancements

### Potential Improvements
1. **Real-time Features**
   - WebSocket integration for live updates
   - Real-time notifications

2. **Performance**
   - Service Worker for offline support
   - Image CDN integration
   - Caching strategies

3. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright/Cypress)

4. **Monitoring**
   - Error tracking (Sentry)
   - Analytics integration
   - Performance monitoring

---

## Conclusion

This architecture provides:
- ✅ Scalable structure
- ✅ Type-safe development
- ✅ Maintainable codebase
- ✅ Role-based access control
- ✅ Optimized performance
- ✅ Developer-friendly patterns

For questions or contributions, please refer to the project repository.

---

**Last Updated:** 2025
**Version:** 0.1.0

