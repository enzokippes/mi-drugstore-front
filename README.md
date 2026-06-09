# Barba Negra Drugstore — Frontend

A React web application for an online pharmacy/drugstore featuring a product catalog, shopping cart, admin panel, order management, and a loyalty points system with a mobile-first responsive design.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| TypeScript 6 | Static typing |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 4 | Utility-first styles |
| React Router 7 | Client-side routing |
| Axios | HTTP client with interceptors |
| Lucide React | Icon library |
| Context API | Global state (Auth + Cart + Toast) |

## Project Structure

```
src/
├── context/
│   ├── AuthContext.tsx      # User authentication and session
│   └── CartContext.tsx      # Global shopping cart
├── components/
│   ├── AdminNav.tsx         # Admin navigation with hamburger menu
│   ├── ErrorBoundary.tsx    # React error boundary for graceful error handling
│   ├── Layout.tsx           # Admin layout wrapper
│   ├── Navbar.tsx           # Navbar component (currently unused)
│   ├── Toast.tsx            # Toast notification system
│   └── store/
│       ├── CartItemRow.tsx   # Memoized cart item row component
│       ├── CategoryTabs.tsx  # Category filter with mobile bottom sheet
│       ├── CheckoutSheet.tsx # Cart and checkout side drawer
│       ├── CombosSection.tsx # Combo products section
│       ├── FeaturedSection.tsx # Featured products section
│       ├── Footer.tsx         # Store footer with info columns
│       ├── LocationMap.tsx   # Store location map
│       ├── MobileBottomNav.tsx # Fixed bottom nav for mobile
│       ├── PaymentMethods.tsx # Payment methods display
│       ├── ProductCard.tsx   # Individual product card
│       ├── ProductGrid.tsx   # Product grid layout
│       ├── ProductSkeleton.tsx # Loading skeleton
│       ├── PromoBanner.tsx   # Rotating promotion banner
│       ├── QuickSearch.tsx   # Search with autocomplete
│       ├── StoreHeader.tsx   # Store header with mobile hamburger menu
│       └── WhatsAppButton.tsx # WhatsApp contact button
├── pages/
│   ├── NotFound.tsx         # 404 page
│   ├── Store.tsx            # Main store (public)
│   ├── Login.tsx            # User login
│   ├── Register.tsx          # User registration
│   ├── ForgotPassword.tsx    # Password reset request
│   ├── ResetPassword.tsx     # Password reset with token
│   ├── ProductDetail.tsx     # Product detail page
│   ├── Promotions.tsx        # Promotions page (public)
│   ├── MyOrders.tsx         # User order history
│   ├── Points.tsx            # Loyalty points and rewards
│   ├── Profile.tsx           # User profile with addresses
│   ├── Dashboard.tsx         # Admin product management
│   ├── ProductForm.tsx       # Create/edit product
│   ├── CategoryList.tsx      # Admin category list
│   ├── CategoryForm.tsx     # Create/edit category
│   ├── PromotionList.tsx    # Admin promotions list
│   ├── PromotionForm.tsx    # Create/edit promotion
│   ├── OrderManagement.tsx   # Admin order management
│   ├── AdminDashboard.tsx    # Admin dashboard with stats
│   ├── DeliveryZonesAdmin.tsx # Admin delivery zones
│   └── RewardsAdmin.tsx      # Admin points rewards
├── hooks/
│   └── useDebounce.ts       # Debounce hook
├── services/
│   └── api.ts               # Axios instance with interceptors
├── types/
│   └── index.ts             # Shared TypeScript interfaces
├── utils/
│   ├── categoryEmojis.ts    # Category emoji mapping
│   ├── env.ts               # Environment variable validation
│   └── imageUrl.ts          # Image URL helper
├── App.tsx                  # Routes and providers
├── main.tsx                 # Entry point
└── index.css                # Global styles and animations
screenshots/                  # Application screenshots (replace with actual)
    ├── store.png             # Main store view
    ├── admin-dashboard.png   # Admin dashboard with statistics
    ├── mobile-store.png     # Mobile view with hamburger menu
    ├── points.png           # Points page with rewards
    └── profile.png           # Profile with saved addresses
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL="http://localhost:3000"
```

In production, replace with your deployed backend URL.

**Note:** The app validates environment variables on startup. Missing required variables will cause the app to fail with a clear error message.

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The app runs at `http://localhost:5173`.

## Features

### Public Store

- **Product Catalog** with search and category filtering
- **Featured Products** section on homepage
- **Combos Section** for bundled products
- **Promotions Page** (`/promociones`) with active deals
- **Product Detail Page** with full information
- **Persistent Shopping Cart** (localStorage)
- **Checkout** with pickup or delivery options
- **Delivery Zones** with pricing based on location
- **WhatsApp Contact** with pre-filled messages
- **Location Map** and payment methods display

### Authentication

- **Registration** with password validation (8+ chars, uppercase, number)
- **Login** with JWT authentication
- **Forgot Password** flow with email reset link
- **Reset Password** with token validation
- **Protected Routes** and admin route guards
- **Automatic 401 Handling** for expired sessions

### User Features

- **Points System** (`/points`)
  - View current points balance
  - Browse available rewards
  - Redeem points for rewards
  - Points history with transactions
- **Profile Management** (`/profile`)
  - View user information
  - Manage saved addresses
  - Add/edit/delete addresses
  - Set default address
- **Order History** (`/my-orders`)
  - View past orders
  - Track order status
  - View order details

### Admin Panel

- **Dashboard** (`/dashboard`) - Product management with CRUD operations
- **Category Management** (`/categories`) - Full category CRUD
- **Promotion Management** (`/promotions`) - Full promotion CRUD
- **Order Management** (`/orders`) - View all orders, update status, track delivery
- **Admin Dashboard** (`/admin/dashboard`) - Statistics and overview
- **Delivery Zones** (`/admin/delivery-zones`) - Manage delivery areas and pricing
- **Rewards Management** (`/admin/rewards`) - Manage point rewards
- **Image Upload** via Cloudinary

### Responsive Design

Mobile-first approach with adaptive layouts:

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Navigation** | Full navbar with all links | Hamburger menu with drawer |
| **Categories** | Horizontal tabs | Bottom sheet with swipe |
| **Cart/Checkout** | Side drawer | Side drawer panel |
| **Product Grid** | 4 columns | 2 columns |
| **Bottom Nav** | Hidden | Fixed bar with cart + links |
| **Admin Menu** | Sidebar + top bar | Collapsible drawer |

#### Mobile-Specific Components

- **StoreHeader** (`src/components/store/StoreHeader.tsx`)
  - Hamburger menu for mobile navigation
  - Collapsible drawer with all store links
  - Touch-friendly cart button

- **CategoryTabs** (`src/components/store/CategoryTabs.tsx`)
  - Bottom sheet on mobile for category selection
  - Horizontal scrollable tabs on desktop

- **CheckoutSheet** (`src/components/store/CheckoutSheet.tsx`)
  - Side drawer panel for cart and checkout (slides from right)
  - Inline delivery form expansion when delivery is selected

- **Footer** (`src/components/store/Footer.tsx`)
  - 4 columns: about, links, contact, payment methods
  - Responsive grid layout

- **MobileBottomNav** (`src/components/store/MobileBottomNav.tsx`)
  - Fixed bottom navigation bar on mobile
  - Quick access to home, categories, cart

- **AdminNav** (`src/components/AdminNav.tsx`)
  - Hamburger menu for mobile admin navigation
  - Side drawer with admin links

## Error Handling & Production Readiness

- **ErrorBoundary** (`src/components/ErrorBoundary.tsx`)
  - Catches React errors and displays fallback UI
  - Allows users to reload the page or navigate home

- **404 Page** (`src/pages/NotFound.tsx`)
  - Custom page for invalid routes
  - Provides clear feedback and navigation options

- **Environment Validation** (`src/utils/env.ts`)
  - Validates required environment variables on app startup
  - Prevents app from running with missing configuration

- **API Error Logging** (`src/services/api.ts`)
  - Logs non-401 API errors to console for debugging
  - Automatic 401 handling redirects to login

## Accessibility

- `lang="es"` on HTML element
- Skip navigation link
- `aria-live` on toast notifications
- `aria-label` on interactive buttons
- `prefers-reduced-motion` respected
- Semantic HTML (`nav`, `main`, `section`, `footer`)
- Form inputs with associated labels
- `loading="lazy"` on images

## Screenshots

Replace these placeholder images with actual screenshots:

| File | Description |
|------|-------------|
| `screenshots/store.png` | Main store with product grid |
| `screenshots/admin-dashboard.png` | Admin dashboard with statistics |
| `screenshots/mobile-store.png` | Mobile view showing hamburger menu |
| `screenshots/points.png` | Points page with rewards list |
| `screenshots/profile.png` | User profile with saved addresses |

To capture screenshots:
1. Open the application in your browser
2. Take a screenshot of the relevant view
3. Save as PNG to the `screenshots/` folder
4. Replace the placeholder files

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint linting |

## Backend

This application consumes the API of [mi-drugstore-back](https://github.com/enzokippes/mi-drugstore-back).

Make sure the backend is running and the `VITE_API_URL` environment variable is set correctly.

## License

MIT