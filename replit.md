# E-commerce Home Page

## Overview
This is an e-commerce homepage for "SPICE HOUSE" - a premium spice retail store featuring authentic flavors from India. The application showcases a modern, responsive design with product categories, featured products, and a shopping cart system.

**Tech Stack:**
- React 18.3.1 with TypeScript
- Vite 6.3.5 (build tool & dev server)
- Tailwind CSS with shadcn/ui components
- Radix UI primitives for accessible UI components

**Current State:** ✅ Fully configured and running in Replit environment

## Project Structure
```
/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── figma/        # Figma-specific components
│   │   ├── Header.tsx    # Main navigation header
│   │   ├── Hero.tsx      # Hero section
│   │   ├── Categories.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── Newsletter.tsx
│   │   └── Footer.tsx
│   ├── pages/            # Page components
│   │   ├── CategoryPage.tsx
│   │   └── ProductDetailsPage.tsx
│   ├── contexts/         # React Context providers
│   │   ├── CartContext.tsx
│   │   └── NavigationContext.tsx
│   ├── data/             # Static data
│   │   └── products.ts
│   ├── styles/           # Global styles
│   │   └── globals.css
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Base styles
├── index.html
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Recent Changes

### October 18, 2025
- ✅ Installed framer-motion for animations
- ✅ Implemented Order Summary Modal Feature:
  - Modal displays complete order details on "View Order Details" button click
  - Shows purchased items with images, quantities, and prices
  - Displays delivery address from checkout form
  - Cost breakdown with subtotal, discount, shipping, and total
  - Estimated delivery date (3-5 days from order date)
  - Smooth framer-motion animations with slide-up and fade effects
  - Data guard: button only visible when order data is available (prevents errors on page refresh)
  - Graceful fallback messaging when accessed without checkout data
  - Responsive design with mobile and desktop support
- ✅ Enhanced data flow: CheckoutPage now passes complete order data (items, address, pricing) to OrderSuccessPage via NavigationContext
- ✅ Improved UX with proper loading states and conditional rendering

### October 17, 2025
- ✅ Configured Vite dev server for Replit environment (port 5000, host 0.0.0.0)
- ✅ Added allowedHosts configuration for Replit proxy domains (.repl.co, .replit.dev)
- ✅ Created TypeScript configuration (tsconfig.json)
- ✅ Set up Tailwind CSS with @tailwindcss/postcss
- ✅ Installed all npm dependencies
- ✅ Configured deployment settings for Replit (autoscale deployment)
- ✅ Created .gitignore for Node.js project
- ✅ Set up development workflow
- ✅ Implemented complete checkout flow with:
  - CheckoutPage with delivery form and order summary
  - Dummy Razorpay payment gateway modal
  - OrderSuccessPage with success animation
  - Navigation from product details "Buy Now" and cart "Checkout" buttons
- ✅ Enhanced CheckoutPage with improved UX:
  - Scaled up card boxes with larger padding (p-8) and text (text-base)
  - Moved card titles inside as soft hint labels
  - Added dependent State-City dropdowns with all Indian states and major cities
  - Implemented Payment Method selection (Razorpay/UPI/Cards or Cash on Delivery)
  - Added Coupon/Discount box with 10% discount functionality
  - Moved payment button below payment section with conditional text
  - COD orders now skip payment modal and go directly to success page
- ✅ Modern UI Enhancements:
  - Increased spacing and padding across all sections (p-10, gap-10, h-12 inputs, h-14 buttons)
  - Blue accent color scheme with modern hover and focus effects
  - Enhanced card styling (rounded-3xl, shadow-lg)
  - Better visual hierarchy with larger fonts and spacious layout
- ✅ Dynamic Country-Based Selection:
  - Country selector dynamically updates State and City dropdowns
  - Support for India, USA, UK, and Canada with region-specific data
  - Smart state/city reset when country changes
  - Clear disabled states with helpful placeholder messages
- ✅ Smart Payment Rules:
  - Cash on Delivery (COD) only available for India
  - Auto-switches to Razorpay when non-India country selected
  - Visual feedback with disabled styling and informative messages

## Development

### Running Locally
The dev server is already configured and running:
```bash
npm run dev
```
Server runs on: http://0.0.0.0:5000

### Building for Production
```bash
npm run build
```
Build output: `./build` directory

### Deployment
Deployment is configured for Replit autoscale:
- Build command: `npm run build`
- Run command: `npx vite preview --host 0.0.0.0 --port 5000`

## Features
- 🛒 Shopping cart with add/remove functionality
- 💳 Complete checkout flow with delivery form and payment
- 💰 Dummy Razorpay payment gateway integration
- ✅ Order success page with confirmation
- 📋 **NEW:** Order Summary modal with complete order details, animations, and estimated delivery
- 📱 Responsive design for all screen sizes
- 🎨 Modern UI with Tailwind CSS
- ♿ Accessible components using Radix UI
- 🔄 Client-side navigation (no page reloads)
- 🎯 Product categories and filtering
- 📧 Newsletter signup

## Architecture Notes
- Uses React Context for state management (Cart and Navigation)
- Client-side routing implemented via NavigationContext
- Component library: shadcn/ui built on Radix UI primitives
- Styling: Tailwind CSS with custom theme configuration
- HMR (Hot Module Replacement) enabled for fast development

## Dependencies
Key packages:
- React & React DOM 18.3.1
- Vite 6.3.5
- TypeScript
- Tailwind CSS with @tailwindcss/postcss
- Radix UI components
- framer-motion (animations)
- lucide-react (icons)
- sonner (toast notifications)
- next-themes (theme support)

## Backend Setup (Spring Boot + MySQL)

### Backend Stack
- **Framework**: Spring Boot 3.2.0 with Java 19
- **Database**: MariaDB 10.11.13 (MySQL-compatible)
- **Port**: Backend runs on port 8080
- **Authentication**: JWT-based with role-based access control (CUSTOMER, ADMIN)

### Database Configuration
- **Database Name**: ecommerce_db
- **User**: ecommerce_user (dedicated user with limited privileges)
- **Connection**: JDBC via MySQL Connector

### Security Configuration
**⚠️ Important for Production:**
The current setup uses environment variables with fallback defaults for development convenience. For production deployment:

1. Set these secrets via Replit Secrets UI:
   - `MYSQL_USER`: Database username
   - `MYSQL_PASSWORD`: Strong database password
   
2. The application will automatically use these secrets when available

3. Current fallback values are for development only and should be changed for production

### Available API Endpoints

**Public Endpoints (No Authentication)**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/categories` - Get all categories

**Protected Endpoints (Requires JWT Token)**:
- `GET /api/users/me` - Get current user profile
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Place order

### Testing the Backend
Use the included `Spice_House_API_Postman_Collection.json` to test all endpoints with Postman.

### Workflows Running
1. **MySQL Server** - Database server (internal port 3306)
2. **Spring Boot Backend** - API server (port 8080)
3. **Vite Dev Server** - Frontend (port 5000)

## User Preferences
None set yet.
