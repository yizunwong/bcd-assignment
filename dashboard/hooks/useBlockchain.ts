import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
  usePublicClient,
} from "wagmi";
import { parseEther, decodeEventLog, keccak256, stringToBytes } from "viem";
import { useToast } from "@/components/shared/ToastProvider";
import InsuranceContractAbi from "@/abi/InsuranceContract.json";

const INSURANCE_CONTRACT_ABI = InsuranceContractAbi;

// Contract address - you'll need to update this with your deployed contract address
const INSURANCE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS as `0x${string}`;
const INSURANCE_ADMIN_ROLE_HASH = keccak256(
  stringToBytes("INSURANCE_ADMIN_ROLE")
);

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

  const { isLoading: isWaitingPay, isSuccess: isPaySuccess } =
    useWaitForTransactionReceipt({
      hash: payPremiumData,
    });

  // File claim
  const {
    data: fileClaimData,
    writeContractAsync: fileClaim,
    isPending: isFilingClaim,
    error: fileClaimError,
  } = useWriteContract();

  // Admin role management
  const {
    writeContractAsync: addAdmin,
    isPending: isAddingAdmin,
    error: addAdminError,
  } = useWriteContract();

  const {
    writeContractAsync: removeAdmin,
    isPending: isRemovingAdmin,
    error: removeAdminError,
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
  ): Promise<{ coverageId: number; txHash: `0x${string}` }> => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      throw new Error("WALLET_NOT_CONNECTED");
    }

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

    const receipt = await publicClient!.waitForTransactionReceipt({ hash });

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

    if (!event) throw new Error("COVERAGE_EVENT_NOT_FOUND");

    const coverageId = Number((event as any).args.coverageId);
    return { coverageId, txHash: hash };
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

      const hash = await fileClaim({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "fileClaim",
        args: [BigInt(coverageId), amountWei, description],
      });

      const receipt = await publicClient!.waitForTransactionReceipt({
        hash,
      });

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
        .find((e) => e && e.eventName === "ClaimFiled");

      if (event) {
        return Number((event as any).args.claimId);
      }
    } catch (error) {
      console.error("Error filing claim:", error);
      printMessage("Failed to file claim", "error");
    }
  };

  // Approve a claim
  const {
    data: approveClaimData,
    writeContractAsync: approveClaimWrite,
    isPending: isApprovingClaim,
    error: approveClaimError,
  } = useWriteContract();

  const approveClaimOnChain = async (
    claimId: number,
  ): Promise<`0x${string}` | undefined> => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      return;
    }

    try {
      const hash = await approveClaimWrite({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "approveClaim",
        args: [BigInt(claimId)],
      });

      // Wait for the transaction to be mined to ensure it succeeded
      await publicClient!.waitForTransactionReceipt({ hash });

      return hash;
    } catch (error) {
      console.error("Error approving claim:", error);
      printMessage("Failed to approve claim", "error");
      throw error;
    }
  };

  // Admin role helpers
  const grantAdminRole = async (
    account: `0x${string}`,
  ): Promise<`0x${string}` | undefined> => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      return;
    }
    try {
      const hash = await addAdmin({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "addAdmin",
        args: [account],
      });

      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } catch (error) {
      console.error("Error granting admin role:", error);
      printMessage("Failed to grant admin role", "error");
      throw error;
    }
  };

  const revokeAdminRole = async (
    account: `0x${string}`,
  ): Promise<`0x${string}` | undefined> => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      return;
    }
    try {
      const hash = await removeAdmin({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "removeAdmin",
        args: [account],
      });

      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } catch (error) {
      console.error("Error removing admin role:", error);
      printMessage("Failed to remove admin role", "error");
      throw error;
    }
  };

  const isInsuranceAdmin = async (account: `0x${string}`) => {
    try {
      return (await publicClient!.readContract({
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: INSURANCE_CONTRACT_ABI,
        functionName: "hasRole",
        args: [INSURANCE_ADMIN_ROLE_HASH, account],
      })) as boolean;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
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
    approveClaimOnChain,
    grantAdminRole,
    revokeAdminRole,
    isInsuranceAdmin,
    getCoverageDetails,

    // State
    isCreatingCoverage,
    isPayingPremium,
    isFilingClaim,
    isApprovingClaim,
    isAddingAdmin,
    isRemovingAdmin,
    isWaitingForTransaction,
    isTransactionSuccess,
    isLoadingUserCoverages,
    isWaitingPay,
    isPaySuccess,

    // Data
    userCoverages,
    createCoverageData,
    payPremiumData,
    fileClaimData,
    approveClaimData,

    // Errors
    createCoverageError,
    payPremiumError,
    fileClaimError,
    approveClaimError,
    addAdminError,
    removeAdminError,
    userCoveragesError,

    // Utilities
    refetchUserCoverages,
  };
}
