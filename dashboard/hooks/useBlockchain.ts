import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { useToast } from "@/components/shared/ToastProvider";
import InsuranceContractAbi from "@/abi/InsuranceContract.json";

const INSURANCE_CONTRACT_ABI = InsuranceContractAbi;

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
    agreementCid: string,
    name: string,
    category: string,
    provider: string
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
        args: [
          coverageWei,
          premiumWei,
          BigInt(durationDays),
          agreementCid,
          name,
          category,
          provider,
        ],
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
  const getPolicyDetails = async (policyId: number) => {
    try {
      const { data } = await useReadContract({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "getPolicy",
        args: [BigInt(policyId)],
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
