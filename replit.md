# StreamMall - Decentralized Digital Content Marketplace

## Overview

StreamMall is a decentralized marketplace for digital content with real-time streaming payments. Users can buy and sell various types of digital content (courses, games, designs, documents) with pay-per-minute pricing models. The platform features real-time streaming, wallet integration, and comprehensive dashboards for both buyers and sellers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Component Library**: Shadcn/ui components for consistent design system

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for fast bundling and compilation
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom logging middleware for API requests

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: @neondatabase/serverless for serverless database connections

## Key Components

### Database Schema
- **Users**: User profiles with wallet addresses and roles (buyer/seller/admin)
- **Content**: Digital content with metadata, pricing, and creator information
- **Streams**: Active streaming sessions with time tracking and cost calculation
- **Transactions**: Payment records linked to streaming sessions
- **Wallet Balances**: User wallet balance tracking

### Frontend Components
- **Navigation**: Global navigation with wallet connection status
- **Product Cards**: Content display with category badges and ratings
- **Stream Status**: Real-time streaming controls and cost tracking
- **Wallet Connection**: Wallet integration interface
- **Dashboards**: Separate interfaces for buyers and sellers

### API Endpoints
- **User Management**: CRUD operations for user profiles
- **Content Management**: Content creation, retrieval, and management
- **Streaming**: Stream session management and tracking
- **Transactions**: Payment processing and history
- **Analytics**: Marketplace and user analytics

## Data Flow

1. **User Registration**: Users create accounts and connect wallets
2. **Content Discovery**: Browse and filter content by category and search
3. **Stream Initiation**: Users start streaming sessions with real-time payment tracking
4. **Payment Processing**: Automatic payment calculation based on streaming time
5. **Transaction Recording**: All payments are recorded for transparency
6. **Analytics**: Real-time dashboard updates for both buyers and sellers

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL)
- **Payment Processing**: Simulated wallet integration (ready for real wallet connection)
- **File Storage**: External URLs for content and thumbnails
- **Authentication**: Session-based authentication (ready for wallet auth)

### Development Dependencies
- **Replit Integration**: Custom vite plugin for Replit development environment
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Database**: Drizzle push for schema synchronization
- **Environment Variables**: DATABASE_URL required for database connection

### Production Deployment
- **Build Process**: Vite build for frontend, esbuild for backend
- **Static Assets**: Frontend built to dist/public directory
- **Server**: Express server serves both API and static files
- **Database Migrations**: Drizzle migrations for schema changes

### Key Architectural Decisions

1. **Monorepo Structure**: Frontend, backend, and shared code in single repository for easier development and deployment
2. **Shared Schema**: Common type definitions between frontend and backend prevent type mismatches
3. **Real-time Streaming**: Custom hooks manage streaming state and payment calculations
4. **Wallet Integration**: Modular wallet system allows for easy integration with different wallet providers
5. **Component-based UI**: Reusable components with consistent styling and behavior
6. **Type Safety**: Full TypeScript coverage with Zod validation for runtime type checking

The application is designed to be scalable, maintainable, and ready for integration with real blockchain wallet providers and payment systems.

## Recent Changes (January 2025)

### Blockchain Integration Implementation
- **Smart Contract Development**: Created StreamMall.sol with comprehensive content management, streaming payments, and access control
- **Web3 Integration**: Implemented real Web3 functionality using ethers.js with Rabby wallet support
- **Schema Migration**: Updated data types to be blockchain-compatible with wallet addresses and wei-based pricing
- **Hardhat Configuration**: Set up deployment pipeline for Ethereum Sepolia testnet
- **Real Wallet Connection**: Replaced mock wallet with actual Web3 wallet integration
- **Error Handling**: Added comprehensive error handling for blockchain operations

### Technical Architecture Updates
- **Contract ABI**: Generated and integrated complete ABI for smart contract interactions
- **Environment Configuration**: Added blockchain-specific environment variables for RPC URLs and contract addresses
- **User Authentication**: Migrated to wallet-based authentication using blockchain addresses
- **Payment Processing**: Implemented real-time streaming payments with wei-based calculations
- **Network Support**: Configured for Ethereum Sepolia testnet with automatic network switching

### Next Steps
- Deploy smart contract to Sepolia testnet
- Test end-to-end streaming functionality
- Implement real blockchain-based content creation and streaming
- Add comprehensive error handling for blockchain failures
- Create detailed user documentation for Web3 interactions