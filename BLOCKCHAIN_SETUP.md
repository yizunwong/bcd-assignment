# Blockchain Integration Setup Guide

This guide will help you set up the blockchain integration for the insurance payment system.

## Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. MetaMask or another Web3 wallet
4. Hardhat (for local development)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install blockchain dependencies
cd blockchain
npm install

# Install frontend dependencies
cd ../dashboard
npm install
```

### 2. Deploy the Smart Contract

```bash
# Start local Hardhat node
cd blockchain
npx hardhat node

# In a new terminal, deploy the contract
npx hardhat run scripts/deploy-insurance.ts --network localhost
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `dashboard` directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Blockchain Configuration
NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS=0x... # Use the address from deployment
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://localhost:8545

# AppKit Configuration
NEXT_PUBLIC_APPKIT_PROJECT_ID=75468e8f70a76e9e90aba88c038eb643
```

### 4. Update Contract Address

After deployment, update the contract address in:

- `dashboard/hooks/useBlockchain.ts` (INSURANCE_CONTRACT_ADDRESS)
- Your `.env.local` file

### 5. Start the Application

```bash
# Start the backend
cd backend
npm run start:dev

# Start the frontend
cd dashboard
npm run dev
```

## Smart Contract Features

### InsuranceContract.sol

The smart contract provides the following functionality:

1. **Policy Creation with Payment**
   - `createPolicyWithPayment(coverage, premium, durationDays)`
   - Creates a new insurance policy and collects ETH payment
   - Returns the policy ID

2. **Premium Payments**
   - `payPremium(policyId)`
   - Allows policyholders to pay monthly premiums

3. **Claim Filing**
   - `fileClaim(policyId, amount, description)`
   - Allows policyholders to file claims

4. **Claim Approval**
   - `approveClaim(claimId)`
   - Allows contract owner to approve claims and transfer funds

5. **Policy Management**
   - `getPolicy(policyId)` - Get policy details
   - `getUserPolicies(user)` - Get all policies for a user
   - `updatePolicyStatus(policyId, status)` - Update policy status

## Frontend Integration

### useBlockchain Hook

The `useBlockchain.ts` hook provides:

- `createPolicyWithPayment(coverage, premium, durationDays)`
- `payPremiumForPolicy(policyId, premium)`
- `fileClaimForPolicy(policyId, amount, description)`
- `getPolicyDetails(policyId)`

### Payment Flow

1. User selects a policy and payment method (ETH/Stripe)
2. For ETH payments:
   - User connects wallet
   - Frontend calls `createPolicyWithPayment`
   - Smart contract creates policy and collects ETH
   - Backend creates coverage record
3. For Stripe payments:
   - Standard Stripe payment flow
   - Backend creates coverage record

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Only owner can approve claims and withdraw funds
- **SafeMath**: Prevents overflow/underflow
- **Input Validation**: All inputs are validated
- **Access Control**: Only policyholders can access their policies

## Testing

```bash
# Run smart contract tests
cd blockchain
npx hardhat test

# Run frontend tests
cd dashboard
npm test
```

## Network Configuration

### Local Development (Hardhat)

- Chain ID: 31337
- RPC URL: http://localhost:8545
- Currency: ETH

### Testnet (Sepolia)

- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- Currency: Sepolia ETH

### Mainnet

- Chain ID: 1
- RPC URL: https://mainnet.infura.io/v3/YOUR_PROJECT_ID
- Currency: ETH

## Troubleshooting

### Common Issues

1. **"No QueryClient set" Error**
   - Ensure Web3Providers is properly configured
   - Check that QueryClientProvider is wrapping the app

2. **"Contract not found" Error**
   - Verify contract address is correct
   - Ensure contract is deployed to the correct network
   - Check that wallet is connected to the right network

3. **"Insufficient funds" Error**
   - Ensure wallet has enough ETH for gas fees
   - Check that premium amount is correct

4. **"Transaction failed" Error**
   - Check gas limit and gas price
   - Verify contract state and requirements
   - Check for any revert conditions

### Debug Mode

Enable debug logging by setting:

```env
NEXT_PUBLIC_DEBUG=true
```

## Production Deployment

1. Deploy contract to mainnet
2. Update environment variables
3. Configure proper RPC endpoints
4. Set up monitoring and alerts
5. Test thoroughly on testnet first

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review contract logs
3. Check browser console for errors
4. Verify network configuration
