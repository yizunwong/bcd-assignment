"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClaimReviewDialog from "@/app/(admin)/admin/claims/components/ClaimReviewDialog";
import { Pagination } from "@/components/shared/Pagination";
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  Download,
  User,
  Calendar,
  DollarSign,
  Shield,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useClaimsQuery,
  useClaimStatsQuery,
  useUpdateClaimStatusMutation,
} from "@/hooks/useClaims";
import { useInsuranceContract } from "@/hooks/useBlockchain";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/shared/ToastProvider";
import Ticker from "@/components/animata/text/ticker";
import { StatsCard } from "@/components/shared/StatsCard";
import { useAccount } from "wagmi";

const ITEMS_PER_PAGE = 10;

export default function ClaimsReview() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingClaimId, setProcessingClaimId] = useState<number | null>(
    null
  );
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { updateClaimStatus } = useUpdateClaimStatusMutation();
  const { approveClaimOnChain } = useInsuranceContract();
  const { printMessage } = useToast();
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  const hasFilters = filterStatus !== "all" || !!debouncedSearchTerm;

  const filters = hasFilters
    ? {
        ...(filterStatus !== "all" && {
          status: filterStatus,
        }),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      }
    : {};

  const {
    data: claimsData,
    isLoading,
    error,
  } = useClaimsQuery({
    ...filters,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    // userId: meData?.data?.id,
  });

  const claims = claimsData?.data ?? [];

  const { data: stats } = useClaimStatsQuery();

  const totalPages = Math.ceil(claims.length / ITEMS_PER_PAGE);
  const paginatedClaims = claims.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "claimed":
        return "status-info";
      case "approved":
        return "status-active";
      case "rejected":
        return "status-error";
      default:
        return "status-pending";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "status-error";
      case "medium":
        return "status-warning";
      case "low":
        return "status-active";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "claimed":
        return <Eye className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleApprove = async (claimId: number) => {
    if (isProcessing) return; // Prevent multiple clicks

    // Check wallet connection first
    if (!isConnected || !address) {
      setShowWalletDialog(true);
      printMessage(
        "Please connect your wallet to approve claims on the blockchain",
        "error"
      );
      return;
    }

    setIsProcessing(true);
    setProcessingClaimId(claimId);
    setProcessingAction("approve");
    setShowProcessingDialog(true);

    try {
      let claimHash: string | undefined;
      let blockchainSuccess = false;

      // Show explicit message about MetaMask requirement
      printMessage(
        "Please confirm the transaction in MetaMask to approve the claim on blockchain",
        "info"
      );

      // Try blockchain approval first - this should trigger MetaMask
      try {
        printMessage(
          "Initiating blockchain approval... Please check MetaMask",
          "info"
        );
        claimHash = await approveClaimOnChain(Number(claimId));
        if (claimHash) {
          blockchainSuccess = true;
          console.log("Blockchain approval successful:", claimHash);
          printMessage("Blockchain transaction confirmed!", "success");
        }
      } catch (blockchainError: any) {
        console.warn("Blockchain approval failed:", blockchainError);

        // Check if user rejected the transaction
        if (
          blockchainError?.message?.includes("rejected") ||
          blockchainError?.message?.includes("denied")
        ) {
          printMessage(
            "Transaction rejected by user. Proceeding with database-only approval.",
            "info"
          );
        } else {
          printMessage(
            "Blockchain transaction failed. Proceeding with database-only approval.",
            "info"
          );
        }
      }

      // Update database status regardless of blockchain result
      await updateClaimStatus(String(claimId), "approved", {
        txHash: claimHash || "blockchain_unavailable",
      });

      // Show appropriate success message
      if (blockchainSuccess) {
        printMessage(
          "Claim approved successfully! Blockchain transaction completed.",
          "success"
        );
      } else {
        printMessage(
          "Claim approved successfully! (Note: Blockchain unavailable, approved in database only)",
          "success"
        );
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["/claim"] });
      await queryClient.invalidateQueries({ queryKey: ["/claim/stats"] });

      // Trigger page refresh after delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error approving claim:", error);
      printMessage("Failed to approve claim. Please try again.", "error");
    } finally {
      setIsProcessing(false);
      setProcessingClaimId(null);
      setShowProcessingDialog(false);
      setProcessingAction(null);
    }
  };

  const handleReject = async (claimId: number) => {
    if (isProcessing) return; // Prevent multiple clicks

    setIsProcessing(true);
    setProcessingClaimId(claimId);
    setProcessingAction("reject");
    setShowProcessingDialog(true);

    try {
      // For rejection, we only update the database (no blockchain interaction needed)
      // Provide a meaningful txHash value to satisfy the frontend API requirements
      await updateClaimStatus(String(claimId), "rejected", {
        txHash: "rejected_no_blockchain_required",
      });

      printMessage("Claim rejected successfully!", "success");

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["/claim"] });
      await queryClient.invalidateQueries({ queryKey: ["/claim/stats"] });

      // Trigger page refresh after delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error rejecting claim:", error);
      printMessage("Failed to reject claim. Please try again.", "error");
    } finally {
      setIsProcessing(false);
      setProcessingClaimId(null);
      setShowProcessingDialog(false);
      setProcessingAction(null);
    }
  };

  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Claims Review</h1>
              <p className="page-header-subtitle">
                Review and process insurance claims
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Pending Review"
            value={
              <Ticker
                value={(stats?.data?.pending ?? 0).toString()}
                className="text-slate-800 dark:text-slate-100"
              />
            }
            icon={Clock}
          />

          <StatsCard
            title="Claimed Claims"
            value={
              <Ticker
                value={(stats?.data?.claimed ?? 0).toString()}
                className="text-slate-800 dark:text-slate-100"
              />
            }
            icon={CheckCircle}
          />

          <StatsCard
            title="Approved Claims"
            value={
              <Ticker
                value={(stats?.data?.approved ?? 0).toString()}
                className="text-slate-800 dark:text-slate-100"
              />
            }
            icon={Clock}
          />

          <StatsCard
            title="Rejected Claims"
            value={
              <Ticker
                value={(stats?.data?.rejected ?? 0).toString()}
                className="text-slate-800 dark:text-slate-100"
              />
            }
            icon={X}
          />
        </div>

        {/* Filters */}
        <Card className="glass-card rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Claims Review Queue
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Showing {paginatedClaims.length} of {claims.length} claims
                </p>
              </div>

              <div className="responsive-stack">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search claims by ID, claimant, or type..."
                    value={searchTerm}
                    onChange={(e) =>
                      handleFilterChange(() => setSearchTerm(e.target.value))
                    }
                    className="form-input pl-10"
                  />
                </div>
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    handleFilterChange(() => setFilterStatus(value))
                  }
                >
                  <SelectTrigger className="w-full md:w-48 form-input">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Claims</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims List */}
        <div className="content-spacing mb-8">
          {isLoading ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Loading claims...
              </h3>
            </div>
          ) : (
            paginatedClaims.map((claim) => (
              <Card
                key={claim.id}
                className="glass-card rounded-2xl card-hover"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {claim.policy?.name || "Unknown Policy"}
                        {" "}
                        <span className="text-sm font-normal text-slate-600 dark:text-slate-300">
                          (Claimed by: <span className="font-medium text-indigo-600 dark:text-indigo-400">
                            {claim.submitted_by || "Unknown User"}
                          </span>)
                        </span>
                      </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Claim #{claim.id} • {claim.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`status-badge ${getPriorityColor(
                          claim.priority
                        )}`}
                      >
                        {claim.priority.toUpperCase()}
                      </Badge>
                      <Badge
                        className={`status-badge ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {getStatusIcon(claim.status)}
                        <span className="ml-1 capitalize">
                          {claim.status.replace("-", " ")}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Amount
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {claim.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Submitted
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {new Date(claim.submitted_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Type
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {claim.type}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    {claim.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <ClaimReviewDialog
                        claim={claim}
                        trigger={
                          <Button variant="outline" className="floating-button">
                            <Eye className="w-4 h-4 mr-2" />
                            Review Details
                          </Button>
                        }
                      />
                    </div>
                    {(claim.status === "pending" ||
                      claim.status === "under-review") && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(claim.id)}
                          disabled={isProcessing}
                          className={`text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isProcessing &&
                          processingClaimId === claim.id &&
                          processingAction === "reject" ? (
                            <>
                              <div className="w-4 h-4 mr-1 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(claim.id)}
                          disabled={isProcessing}
                          className={`gradient-accent text-white floating-button disabled:opacity-50 disabled:cursor-not-allowed ${
                            !isConnected
                              ? "ring-2 ring-yellow-400 ring-offset-2"
                              : ""
                          }`}
                          title={
                            !isConnected
                              ? "Connect wallet to approve on blockchain"
                              : "Approve claim"
                          }
                        >
                          {isProcessing &&
                          processingClaimId === claim.id &&
                          processingAction === "approve" ? (
                            <>
                              <div className="w-4 h-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {!isConnected ? "Connect & Approve" : "Approve"}
                            </>
                          )}
                        </Button>
                      </div>
                    )}{" "}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showInfo={true}
            totalItems={claims.length}
            itemsPerPage={ITEMS_PER_PAGE}
            className="mb-8"
          />
        )}

        {claims.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No claims found
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}

        {/* Processing Dialog */}
        <Dialog open={showProcessingDialog} onOpenChange={() => {}}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 border-4 rounded-full animate-spin ${
                    processingAction === "approve"
                      ? "border-emerald-500 border-t-transparent"
                      : "border-red-500 border-t-transparent"
                  }`}
                />
                {processingAction === "approve"
                  ? "Approving Claim"
                  : "Rejecting Claim"}
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {processingAction === "approve"
                  ? "Please confirm the transaction in MetaMask to approve the claim on blockchain. If blockchain fails, we'll proceed with database approval."
                  : "Please wait while we reject the claim and update the status..."}
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  • Updating claim status
                </p>
                {processingAction === "approve" && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    • Waiting for MetaMask confirmation
                  </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  • Refreshing data
                </p>
              </div>
              {processingAction === "approve" && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    🦊 Check MetaMask for transaction confirmation
                  </p>
                </div>
              )}
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  ⚠️ Please do not close this window or navigate away
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Wallet Connection Dialog */}
        <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  🦊
                </div>
                Wallet Connection Required
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                To approve claims on the blockchain, you need to connect your
                MetaMask wallet.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • Connect your wallet using the button in the top right corner
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • Make sure you're on the correct network (Hardhat/Local)
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • Ensure your wallet has admin permissions
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowWalletDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowWalletDialog(false);
                    // The wallet connection should be handled by the connect button in the navbar
                    printMessage(
                      "Please use the connect button in the top navigation",
                      "info"
                    );
                  }}
                  className="flex-1 gradient-accent text-white"
                >
                  Got It
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
