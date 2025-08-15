# Coverly Insurance Platform

A full-stack decentralized insurance platform built with blockchain technology, providing transparent and efficient insurance services through smart contracts, a robust backend API, and an intuitive user interface.

## 📦 Project Structure

- **blockchain/** – Hardhat workspace with Solidity contracts (`InsuranceContract.sol`) and deployment scripts.
- **backend/** – NestJS REST API leveraging Supabase for persistence and Pinata for IPFS uploads.
- **dashboard/** – Next.js application used by policyholders and admins to interact with the system.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask or another Web3 wallet
- Git

### 1. Install Dependencies

Clone the repository and install packages in each workspace:

```bash
git clone <repo-url>
cd bcd-assignment

cd blockchain && npm install
cd ../backend && npm install
cd ../dashboard && npm install
```

### 2. Configure Environment Variables

Each workspace expects its own `.env` file:

#### Blockchain

No specific .env file is needed, but you can configure the Hardhat network in `hardhat.config.ts`.

CHAIN_ID=31337 # For local Hardhat network
RPC_URL=http://localhost:8545

#### Backend

Create a `.env` file in the `backend` directory with:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_PROJECT_ID=your_supabase_project_id
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
BUCKET_NAME=your_bucket_name
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PINATA_JWT=your_pinata_jwt
INSURANCE_CONTRACT_ADDRESS=0x... # Use the address from deployment

# Server Configuration
PORT=3000
CORS_ORIGIN=http://localhost:5001
```

#### Dashboard

Create a `.env` file in the `dashboard` directory with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS=0x... # Use the address from deployment
```

### 3. Start Development Servers

Run the below commands in sequential order:

1. Start the Hardhat local node
2. Deploy the smart contracts
3. Generate Supabase types
4. Run the backend API
5. Run the dashboard

```bash
# blockchain
cd blockchain
npx hardhat node
npx run deploy

# backend API
cd ../backend
npm supabase:types-window # Run this if you are using Windows operating system
npm supabase:types-unix # Run this if you are using Unix-based operating system
npm run dev

# dashboard
cd ../dashboard
npm run dev
```

The backend API will be available at http://localhost:3000 with Swagger documentation at http://localhost:3000/api.
The dashboard will be available at http://localhost:5000.

## 🧩 Core Functionality

### Smart Contracts

`/blockchain` contains the following smart contracts:

- **InsuranceContract.sol**: The main contract that handles:

  - Coverage creation and management
  - Premium payments and tracking
  - Claim filing, approval, and disbursement
  - Policy status management (Active, Claimed, Inactive, Expired)
  - Access control for admins and policyholders

Hardhat scripts manage compilation, deployment, and testing of these contracts.

### Backend API

`/backend` is a NestJS application that provides:

- **Authentication**: User registration, login, and profile management via Supabase
- **Policies**: Create, read, update, and delete insurance policies
- **Claims**: Submit and process insurance claims with document uploads
- **Payments**:
  - Track premium payments and claim disbursements
  - Integration with payment gateways
  - Support for both fiat and cryptocurrency payments
  - Payment intent creation for secure transactions
  - Transaction history and statistics
  - Blockchain-based payment verification
- **Notifications**: Real-time notifications for users
- **Activity Logging**: Track user actions and system events
- **IPFS Integration**:
  - Store policy documents and claim evidence on IPFS via Pinata
  - Secure file uploads with metadata tagging
  - Content-addressable storage with CID version 1
  - Custom file naming with timestamps
  - Policy and user ID metadata association
- **Swagger Documentation**: API documentation available at /api endpoint

### Dashboard

The Next.js dashboard (`/dashboard`) provides the UI for different user roles:

- **Policyholder Features**:

  - View and manage insurance policies
  - Submit and track claims
  - Make premium payments
  - View coverage details and documents
  - Receive notifications
  - Interactive dashboard with statistics and activity logs
  - Policy browsing and filtering
  - Document upload and management
  - Wallet integration for blockchain transactions
  - User profile management

- **Insurance Admin Features**:

  - Review and approve claims with detailed inspection
  - Manage policies and users with administrative controls
  - View comprehensive analytics and reports
  - Monitor real-time platform activity
  - Track financial metrics and performance indicators
  - Manage insurance providers and coverage types
  - Access audit logs for security monitoring
  - User profile management

- **System Admin Features**:

  - Manage system administrators and users
  - Monitor real-time user activity

- **System Integration**:
  - Custom React hooks in `dashboard/hooks` fetch data, submit transactions, and poll notifications
  - Web3 integration through `dashboard/providers` using Wagmi and Reown AppKit
  - Responsive design for mobile and desktop
  - Real-time data synchronization between blockchain and database
  - Comprehensive error handling and user feedback
  - Optimistic UI updates for improved user experience
  - Modular architecture with separation of concerns
  - Type-safe API integration with generated clients

## 🛠️ Extra Utilities

- **API Fetcher** – `dashboard/api/customFetcher` centralizes requests to the backend with JSON/form-data support.
- **Formatting Helpers** – `dashboard/utils/formatHelper` and `parseError` format numbers, dates, and error messages for display.
- **Auth Metadata Parser** – `backend/src/utils/auth-metadata` converts Supabase user metadata into typed objects.
- **Common DTOs** – `backend/src/common` provides shared response structures and middleware configuration.

### Notifications System

The notifications system provides real-time updates to users about important events in the platform. It includes:

- Real-time notifications with unread count
- Mark-as-read functionality (individual and bulk)
- Different notification types (success, error, info, warning)
- Responsive design for all devices
- Row Level Security (RLS) for data protection
- API endpoints for notification management

## 🔒 Security Features

- **Smart Contract Security**:

  - ReentrancyGuard to prevent reentrancy attacks
  - AccessControl for role-based permissions
  - Input validation for all function parameters

- **API Security**:

  - JWT authentication via Supabase with access and refresh tokens
  - Token-based session management with automatic refresh
  - Cookie-based token storage for enhanced security
  - Role-based access control with custom guards
  - Input validation with NestJS pipes and DTOs
  - Exception filters for standardized error handling
  - Supabase Row Level Security (RLS) for database protection

- **Frontend Security**:
  - Middleware for protected routes based on user roles
  - Secure API calls with authentication headers
  - Form validation and sanitization
  - Secure storage of sensitive information

## 🔍 Troubleshooting

### Common Issues

1. **"No QueryClient set" Error**

   - Ensure Web3Providers is properly configured
   - Check that QueryClientProvider is wrapping the app

2. **"Contract not found" Error**

   - Verify contract address is correct in your .env file
   - Ensure contract is deployed to the correct network
   - Check that wallet is connected to the right network

3. **"Insufficient funds" Error**

   - Ensure wallet has enough ETH for gas fees
   - Check that premium amount is correct

4. **"Transaction failed" Error**
   - Check gas limit and gas price
   - Verify contract state and requirements
   - Check for any revert conditions

## 📄 License

This project is licensed under the MIT License.
