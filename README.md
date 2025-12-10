# Oko Agro

An agricultural marketplace platform connecting farmers and processors, built with Next.js 15, React 19, and TypeScript.

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Comprehensive project architecture documentation
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference guide for common tasks

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

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

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Overview

Oko Agro is a full-stack agricultural marketplace platform that enables:

- **Farmers** to list products and manage orders
- **Processors** to find and purchase agricultural products
- **Administrators** to manage users, orders, and view analytics

### Key Features

- Multi-role authentication (Farmer, Processor, Admin)
- Product listing and management
- Order processing and tracking
- Transaction history
- Calendar/scheduling system
- Real-time notifications
- User management dashboard

## 🛠️ Technology Stack

- **Framework:** Next.js 15.5.2 (App Router)
- **UI Library:** React 19.1.0
- **Language:** TypeScript 5
- **State Management:** Zustand 5.0.8
- **Styling:** Tailwind CSS 4
- **Forms:** Formik + Yup
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📁 Project Structure

```
oko-agro/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── components/         # Reusable components
│   ├── dashboard/          # Farmer dashboard
│   ├── dashboard-processor/ # Processor dashboard
│   ├── store/              # Zustand stores
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── public/                  # Static assets
└── ...
```

For detailed structure, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🔐 Authentication

The application uses JWT-based authentication with role-based access control:

- **Farmers:** Access to `/dashboard/*`
- **Processors:** Access to `/dashboard-processor/*`
- **Admins:** Access to `/admin/*`

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📝 License

This project is private and proprietary.

---

For detailed architecture and development guidelines, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).
