# Oko Agro - Quick Reference Guide

## Quick Links

### 🚀 Getting Started
```bash
npm install
npm run dev
```

### 📁 Key Directories
- `app/store/` - Zustand state stores
- `app/components/` - Reusable components
- `app/api/` - API routes
- `app/types/` - TypeScript definitions

### 🔑 Common Tasks

#### Adding a New Page
1. Create file in appropriate route directory
2. Add to navigation in layout if needed
3. Implement page component

#### Adding a New API Endpoint
1. Create route file in `app/api/[endpoint]/route.ts`
2. Export `POST` or `GET` handler
3. Use action-based pattern

#### Adding a New Store
1. Create file in `app/store/use[Name]Store.ts`
2. Use Zustand `create()` with `persist()` if needed
3. Export hook: `export const use[Name]Store = create(...)`

#### Adding a New Component
1. Create file in `app/components/`
2. Add `"use client"` if interactive
3. Export component

### 🎨 Styling Quick Reference

#### Colors
```typescript
mainGreen: #004829
green: #0BA964
blue: #0B99A9
yellow: #FFDD55
red: #CD0003
```

#### Common Classes
```css
/* Cards */
rounded-[20px] border border-[#EAECF0] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]

/* Buttons */
bg-[#004829] text-white rounded-[10px] px-4 py-2

/* Text */
text-[18px] font-semibold text-[#101828]
```

### 🔐 Authentication

#### Check Authentication
```typescript
const { isAuthenticated, user } = useAuthStore();
```

#### Login
```typescript
const { login } = useAuthStore();
await login({ email, password, role });
```

#### Logout
```typescript
const { logout } = useAuthStore();
await logout();
```

### 📡 API Calls

#### Using Store Actions
```typescript
const { fetchUserProducts } = useProductStore();
await fetchUserProducts(userId);
```

#### Direct API Call
```typescript
import apiClient from '@/app/utils/apiClient';
const response = await apiClient.post('/api/products', {
  action: 'create',
  ...data
});
```

### 🎯 Common Patterns

#### Form with Validation
```typescript
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
});

const formik = useFormik({
  initialValues: { email: '' },
  validationSchema,
  onSubmit: async (values) => {
    // Handle submit
  },
});
```

#### Modal Component
```typescript
import Modal from '@/app/components/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  {/* Content */}
</Modal>
```

#### Toast Notification
```typescript
import { useToast } from '@/app/hooks/useToast';

const { showToast } = useToast();
showToast('Success message', 'success');
showToast('Error message', 'error');
```

### 📊 State Management

#### Accessing Store
```typescript
const { products, isLoading } = useProductStore();
```

#### Updating Store
```typescript
const { createProduct } = useProductStore();
await createProduct(productData);
```

### 🛣️ Routing

#### Navigation
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

#### Protected Routes
- Middleware handles authentication
- Layouts check user role
- Redirects to login if not authenticated

### 🎨 Component Structure

#### Client Component Template
```typescript
"use client";
import React from 'react';

interface Props {
  // Define props
}

export default function ComponentName({ }: Props) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### 📝 Type Definitions

#### Common Types
```typescript
// User
import { User } from '@/app/types';

// Product
import { Product } from '@/app/types';

// API Response
import { ApiResponse } from '@/app/types';
```

### 🔧 Utilities

#### Format Price
```typescript
import { formatPrice } from '@/app/helpers';
const formatted = formatPrice(1000); // "₦1,000"
```

#### API Client
```typescript
import apiClient from '@/app/utils/apiClient';
// Automatically includes auth token
```

### 🐛 Debugging

#### Check Store State
```typescript
const state = useAuthStore.getState();
console.log(state);
```

#### Check API Response
```typescript
try {
  const response = await apiClient.post(...);
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data);
}
```

### 📚 File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useToast.ts`)
- Stores: `camelCase.ts` with `use` prefix (e.g., `useAuthStore.ts`)
- Types: `PascalCase` (e.g., `User`, `Product`)
- Utils: `camelCase.ts` (e.g., `apiClient.ts`)

### 🚨 Common Issues

#### Token Expired
- Automatic refresh on 401
- Check `useTokenMonitor` hook
- Verify token in localStorage

#### CORS Errors
- Check API route configuration
- Verify backend CORS settings

#### Type Errors
- Check `app/types/index.ts`
- Ensure all props are typed
- Use TypeScript strict mode

---

**For detailed documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

