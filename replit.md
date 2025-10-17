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

## Recent Changes (October 17, 2025)
- ✅ Configured Vite dev server for Replit environment (port 5000, host 0.0.0.0)
- ✅ Added allowedHosts configuration for Replit proxy domains (.repl.co, .replit.dev)
- ✅ Created TypeScript configuration (tsconfig.json)
- ✅ Set up Tailwind CSS with @tailwindcss/postcss
- ✅ Installed all npm dependencies
- ✅ Configured deployment settings for Replit (autoscale deployment)
- ✅ Created .gitignore for Node.js project
- ✅ Set up development workflow

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
- lucide-react (icons)
- sonner (toast notifications)
- next-themes (theme support)

## User Preferences
None set yet.
