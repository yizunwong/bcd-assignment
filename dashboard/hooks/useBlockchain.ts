import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
  usePublicClient,
} from "wagmi";
import { parseEther, decodeEventLog } from "viem";
import { useToast } from "@/components/shared/ToastProvider";
import InsuranceContractAbi from "@/abi/InsuranceContract.json";

const INSURANCE_CONTRACT_ABI = InsuranceContractAbi;

// Contract address - you'll need to update this with your deployed contract address
const INSURANCE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS as `0x${string}`;

export function useInsuranceContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { printMessage } = useToast();

  // Create coverage with payment
  const {
    data: createCoverageData,
    writeContractAsync: createCoverage,
    isPending: isCreatingCoverage,
    error: createCoverageError,
  } = useWriteContract();

  // Wait for transaction
  const {
    isLoading: isWaitingForTransaction,
    isSuccess: isTransactionSuccess,
  } = useWaitForTransactionReceipt({
    hash: createCoverageData,
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

  // Get user coverages
  const {
    data: userCoverages,
    isLoading: isLoadingUserCoverages,
    error: userCoveragesError,
    refetch: refetchUserCoverages,
  } = useReadContract({
    address: INSURANCE_CONTRACT_ADDRESS,
    abi: INSURANCE_CONTRACT_ABI,
    functionName: "getUserCoverages",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Create coverage with ETH payment
  const createCoverageWithPayment = async (
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

      const hash = await createCoverage({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "createCoverageWithPayment",
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

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const event = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({
              abi: INSURANCE_CONTRACT_ABI,
              data: log.data,
              topics: log.topics,
            });
          } catch {
            return null;
          }
        })
        .find((e) => e && e.eventName === "CoverageCreated");

      if (event) {
        return Number((event as any).args.coverageId);
      }
    } catch (error) {
      console.error("Error creating coverage:", error);
      printMessage("Failed to create coverage", "error");
    }
  };

  // Pay premium for existing coverage
  const payPremiumForCoverage = async (coverageId: number, premium: number) => {
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
        args: [BigInt(coverageId)],
        value: premiumWei,
      });
    } catch (error) {
      console.error("Error paying premium:", error);
      printMessage("Failed to pay premium", "error");
    }
  };

  // File a claim
  const fileClaimForCoverage = async (
    coverageId: number,
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
        args: [BigInt(coverageId), amountWei, description],
      });
    } catch (error) {
      console.error("Error filing claim:", error);
      printMessage("Failed to file claim", "error");
    }
  };

  // Get coverage details
  const getCoverageDetails = async (coverageId: number) => {
    try {
      const { data } = await useReadContract({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "getCoverage",
        args: [BigInt(coverageId)],
      });
      return data;
    } catch (error) {
      console.error("Error getting coverage details:", error);
      return null;
    }
  };

  return {
    // Contract interactions
    createCoverageWithPayment,
    payPremiumForCoverage,
    fileClaimForCoverage,
    getCoverageDetails,

    // State
    isCreatingCoverage,
    isPayingPremium,
    isFilingClaim,
    isWaitingForTransaction,
    isTransactionSuccess,
    isLoadingUserCoverages,

    // Data
    userCoverages,
    createCoverageData,
    payPremiumData,
    fileClaimData,

    // Errors
    createCoverageError,
    payPremiumError,
    fileClaimError,
    userCoveragesError,

    // Utilities
    refetchUserCoverages,
  };
}
