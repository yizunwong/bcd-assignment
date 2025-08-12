import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { readContract } from "wagmi/actions";
import { parseEther, formatEther } from "viem";
import { useToast } from "@/components/shared/ToastProvider";

// InsuranceContract ABI - you'll need to generate this from your compiled contract
const INSURANCE_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ClaimApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ClaimFiled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentRefunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "policyholder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "coverage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "premium",
        type: "uint256",
      },
    ],
    name: "PolicyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum InsuranceContract.PolicyStatus",
        name: "newStatus",
        type: "uint8",
      },
    ],
    name: "PolicyStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "payer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
    ],
    name: "PremiumPaid",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    name: "approveClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "coverage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "premium",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "durationDays",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "agreementCid",
        type: "string",
      },
    ],
    name: "createPolicyWithPayment",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
    ],
    name: "emergencyRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "fileClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    name: "getClaim",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "policyId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
        ],
        internalType: "struct InsuranceContract.Claim",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
    ],
    name: "getPayment",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "policyId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "enum InsuranceContract.PaymentStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct InsuranceContract.Payment",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
    ],
    name: "getPolicy",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "policyholder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "coverage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "premium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nextPaymentDate",
            type: "uint256",
          },
          {
            internalType: "enum InsuranceContract.PolicyStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256[]",
            name: "claimIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "totalPaid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilizationRate",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "agreementCid",
            type: "string",
          },
        ],
        internalType: "struct InsuranceContract.Policy",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
    ],
    name: "getPolicyPayments",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserPolicies",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
    ],
    name: "payPremium",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "policyId",
        type: "uint256",
      },
      {
        internalType: "enum InsuranceContract.PolicyStatus",
        name: "newStatus",
        type: "uint8",
      },
    ],
    name: "updatePolicyStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

// Contract address - you'll need to update this with your deployed contract address
const INSURANCE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS as `0x${string}`;

export function useInsuranceContract() {
  const { address } = useAccount();
  const { printMessage } = useToast();

  // Create policy with payment
  const {
    data: createPolicyData,
    writeContract: createPolicy,
    isPending: isCreatingPolicy,
    error: createPolicyError,
  } = useWriteContract();

  // Wait for transaction
  const {
    isLoading: isWaitingForTransaction,
    isSuccess: isTransactionSuccess,
  } = useWaitForTransactionReceipt({
    hash: createPolicyData,
  });

  // Pay premium
  const {
    data: payPremiumData,
    writeContract: payPremium,
    isPending: isPayingPremium,
    error: payPremiumError,
  } = useWriteContract();

  // File claim
  const {
    data: fileClaimData,
    writeContract: fileClaim,
    isPending: isFilingClaim,
    error: fileClaimError,
  } = useWriteContract();

  // Get user policies
  const {
    data: userPolicies,
    isLoading: isLoadingUserPolicies,
    error: userPoliciesError,
    refetch: refetchUserPolicies,
  } = useReadContract({
    address: INSURANCE_CONTRACT_ADDRESS,
    abi: INSURANCE_CONTRACT_ABI,
    functionName: "getUserPolicies",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Create policy with ETH payment
  const createPolicyWithPayment = async (
    coverage: number, // in ETH
    premium: number, // in ETH
    durationDays: number,
    agreementCid: string
  ) => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      return;
    }

    try {
      const coverageWei = parseEther(coverage.toString());
      const premiumWei = parseEther(premium.toString());

      createPolicy({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "createPolicyWithPayment",
        args: [coverageWei, premiumWei, BigInt(durationDays), agreementCid],
        value: premiumWei,
      });
    } catch (error) {
      console.error("Error creating policy:", error);
      printMessage("Failed to create policy", "error");
    }
  };

  // Pay premium for existing policy
  const payPremiumForPolicy = async (policyId: number, premium: number) => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      return;
    }

    try {
      const premiumWei = parseEther(premium.toString());

      payPremium({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "payPremium",
        args: [BigInt(policyId)],
        value: premiumWei,
      });
    } catch (error) {
      console.error("Error paying premium:", error);
      printMessage("Failed to pay premium", "error");
    }
  };

  // File a claim
  const fileClaimForPolicy = async (
    policyId: number,
    amount: number, // in ETH
    description: string
  ) => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      return;
    }

    try {
      const amountWei = parseEther(amount.toString());

      fileClaim({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "fileClaim",
        args: [BigInt(policyId), amountWei, description],
      });
    } catch (error) {
      console.error("Error filing claim:", error);
      printMessage("Failed to file claim", "error");
    }
  };

  // Get policy details
  const getPolicyDetails = async (policyId: bigint) => {
    try {
      const data = await readContract({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "getPolicy",
        args: [policyId],
      });
      return data;
    } catch (error) {
      console.error("Error getting policy details:", error);
      return null;
    }
  };

  return {
    // Contract interactions
    createPolicyWithPayment,
    payPremiumForPolicy,
    fileClaimForPolicy,
    getPolicyDetails,

    // State
    isCreatingPolicy,
    isPayingPremium,
    isFilingClaim,
    isWaitingForTransaction,
    isTransactionSuccess,
    isLoadingUserPolicies,

    // Data
    userPolicies,
    createPolicyData,
    payPremiumData,
    fileClaimData,

    // Errors
    createPolicyError,
    payPremiumError,
    fileClaimError,
    userPoliciesError,

    // Utilities
    refetchUserPolicies,
  };
}
