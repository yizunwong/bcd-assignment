import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
  usePublicClient,
} from "wagmi";
import {
  parseEther,
  decodeEventLog,
  keccak256,
  stringToBytes,
  getAddress,
  parseUnits,
} from "viem";
import { useToast } from "@/components/shared/ToastProvider";
import InsuranceContractAbi from "@/abi/InsuranceContract.json";
import ICOAbi from "@/abi/ICO.json";
import ERC20Abi from "@/abi/CoverlyToken.json";

const INSURANCE_CONTRACT_ABI = InsuranceContractAbi;
const ICO_CONTRACT_ABI = ICOAbi;
const TOKEN_CONTRACT_ADDRESS = getAddress(
  process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as string
) as `0x${string}`;

// Contract addresses from environment (validated & checksummed)
const INSURANCE_CONTRACT_ADDRESS = getAddress(
  process.env.NEXT_PUBLIC_INSURANCE_CONTRACT_ADDRESS as string
) as `0x${string}`;
const ICO_CONTRACT_ADDRESS = getAddress(
  process.env.NEXT_PUBLIC_ICO_CONTRACT_ADDRESS as string
) as `0x${string}`;
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

  // Buy Coverly tokens
  const {
    writeContractAsync: buyToken,
    isPending: isBuyingToken,
    error: buyTokenError,
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

  const {
    writeContractAsync: approveToken,
    isPending: isApprovingToken,
    error: approveTokenError,
  } = useWriteContract();

  // Create coverage with ETH payment
  const createCoverageWithPayment = async (
    coverageTokens: number,
    premiumTokens: number,
    durationDays: number,
    agreementCid: string,
    name: string,
    category: string,
    provider: string
  ) => {
    if (!address) throw new Error("WALLET_NOT_CONNECTED");

    const coverageUnits = parseUnits(coverageTokens.toString(), 18);
    const premiumUnits = parseUnits(premiumTokens.toString(), 18);

    const balance = await publicClient.readContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: ERC20Abi,
      functionName: "balanceOf",
      args: [address],
    });
    console.log("Token balance:", balance.toString());

    // Approve first and wait for the transaction to be mined to ensure the
    // allowance is updated before creating the coverage.
    const approveHash = await approveToken({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: ERC20Abi,
      functionName: "approve",
      args: [INSURANCE_CONTRACT_ADDRESS, premiumUnits],
    });
    await publicClient!.waitForTransactionReceipt({ hash: approveHash });

    // Optional: check current allowance for debugging purposes
    const allowance = await publicClient.readContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: ERC20Abi,
      functionName: "allowance",
      args: [address, INSURANCE_CONTRACT_ADDRESS],
    });
    console.log("Current allowance:", allowance.toString());

    const hash = await createCoverage({
      address: INSURANCE_CONTRACT_ADDRESS,
      abi: INSURANCE_CONTRACT_ABI,
      functionName: "createCoverageWithTokenPayment",
      args: [
        coverageUnits,
        premiumUnits,
        BigInt(durationDays),
        agreementCid,
        name,
        category,
        provider,
      ],
      // No ETH value here
    });

    const receipt = await publicClient!.waitForTransactionReceipt({ hash });

    // If the transaction reverted, provide a clearer error message.
    if (receipt.status === "reverted") {
      throw new Error("COVERAGE_CREATION_FAILED");
    }

    // Try to extract the coverage id from the emitted event. We filter logs by
    // contract address and specify the event name to avoid decoding errors.
    let coverageId: number | undefined;
    for (const log of receipt.logs) {
      if (log.address?.toLowerCase() !== INSURANCE_CONTRACT_ADDRESS.toLowerCase())
        continue;
      try {
        const decoded = decodeEventLog({
          abi: INSURANCE_CONTRACT_ABI,
          data: log.data,
          topics: log.topics,
          eventName: "CoverageCreated",
        });
        coverageId = Number((decoded.args as any).coverageId);
        break;
      } catch {
        /* ignore */
      }
    }

    // Fallback: if the event was not found (e.g. some providers omit logs),
    // fetch the user's coverage list and assume the most recent one is ours.
    if (!coverageId) {
      try {
        const ids = (await publicClient.readContract({
          address: INSURANCE_CONTRACT_ADDRESS,
          abi: INSURANCE_CONTRACT_ABI,
          functionName: "getUserCoverages",
          args: [address],
        })) as bigint[];
        if (ids.length > 0) {
          coverageId = Number(ids[ids.length - 1]);
        }
      } catch {
        /* ignore */
      }
    }

    if (!coverageId) throw new Error("COVERAGE_ID_NOT_FOUND");

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

  // Buy Coverly tokens from ICO contract
  const buyCoverlyTokens = async (amount: number) => {
    if (!address) {
      printMessage("Please connect your wallet first", "error");
      return;
    }

    try {
      const costWei = BigInt(amount) * parseEther("0.0001");

      await buyToken({
        address: ICO_CONTRACT_ADDRESS,
        abi: ICO_CONTRACT_ABI,
        functionName: "buyToken",
        value: costWei,
      });
      printMessage("Tokens purchased", "success");
    } catch (error) {
      console.error("Error buying tokens:", error);
      printMessage("Failed to buy tokens", "error");
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
    claimId: number
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
    account: `0x${string}`
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
    account: `0x${string}`
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
    buyCoverlyTokens,
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
    isBuyingToken,

    // Data
    userCoverages,
    createCoverageData,
    payPremiumData,
    fileClaimData,
    approveClaimData,

    // ICO
    buyTokenError,

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
