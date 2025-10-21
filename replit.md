# Spice House E-commerce Application

## Overview
A full-stack e-commerce application for "SPICE HOUSE," a premium Malvani spice retail store. The platform supports user authentication, product browsing, shopping cart management, order placement with multiple payment options (Razorpay, COD), and a comprehensive admin panel for managing users, orders, products, coupons, and analytics. The project aims to deliver an authentic e-commerce experience with a focus on regional Indian spices.

## User Preferences
None set yet.

## System Architecture
The application is built with a modern tech stack, ensuring scalability, performance, and maintainability.

**Tech Stack:**
-   **Frontend**: React 18.3.1 with TypeScript, Vite 6.3.5, styled with Tailwind CSS and `shadcn/ui` components.
-   **Backend**: Spring Boot 3.2.0 with Java 19.
-   **Database**: MariaDB 10.11.13 (MySQL-compatible).
-   **Authentication**: JWT-based authentication with Role-Based Access Control (RBAC) for both customer and admin interfaces.

**UI/UX Decisions:**
-   **Design System**: Utilizes Tailwind CSS and `shadcn/ui` for a consistent, responsive, and accessible user interface.
-   **Navigation**: Implemented with React Router for seamless page transitions and URL management.
-   **State Management**: Leverages React Context API (`AuthContext`, `CartContext`) for managing global states like user authentication and shopping cart.

**Technical Implementations & Feature Specifications:**
-   **Authentication**: Secure JWT-based authentication for user login/registration and admin access. Includes token refresh mechanisms and role-based access control.
-   **Product Catalog**: Dynamic fetching of products and categories from the backend API, with filtering capabilities.
-   **Shopping Cart**: Backend-synchronized cart management, allowing users to add, update, and remove items. Features cross-tab and same-tab synchronization.
-   **Order Management**: Supports order creation, history viewing, and detailed order tracking.
-   **Admin Panel**: A dedicated administrative interface for managing users, products, orders, and coupons, featuring robust authentication, authorization, and audit logging.
-   **API Service Layer**: A centralized frontend API service layer (Axios-based) for consistent interaction with backend endpoints, automatic JWT token injection, and global error handling.
-   **Database Management**: Schema and data seeding handled by `schema.sql` and `data.sql` for consistent setup across environments.
-   **Error Handling**: Comprehensive error handling, including `JsonIgnore` and `JsonIgnoreProperties` to prevent infinite recursion in API responses and secure CORS configuration.

**System Design Choices:**
-   **Backend API**: Centralized data management, secure authentication, and user-specific data handling.
-   **JWT Authentication**: Chosen for its stateless nature, cross-tab compatibility, and industry-standard security.
-   **Cart Synchronization**: Utilizes custom events for same-tab updates and storage events for cross-tab synchronization to maintain data consistency.

## External Dependencies
-   **Payment Gateway**: Razorpay for online payment processing.
-   **Database**: MariaDB (MySQL-compatible).
-   **Frontend Libraries**: React, Vite, Tailwind CSS, `shadcn/ui`, `framer-motion`.
-   **Backend Frameworks**: Spring Boot, Hibernate (JPA).
-   **API Client**: Axios for frontend-backend communication.