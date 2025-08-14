"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/shared/Pagination";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Coins,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Filter,
  Calendar,
  ArrowLeftRight,
} from "lucide-react";
import FluidTabs from "@/components/animata/fluid-tabs";
import { walletBalance } from "@/public/data/policyholder/walletData";
import WalletSection from "@/components/shared/WalletSectiom";
import { useTransactionsQuery, usePaymentStatsQuery } from "@/hooks/usePayment";
import { TransactionResponseDto } from "@/api";

const ITEMS_PER_PAGE = 10;

export default function WalletPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const { data: savedTxs, error: chainTxsError } = useTransactionsQuery();
  const { data: paymentStats } = usePaymentStatsQuery();
  const txArray = (savedTxs?.data ?? []) as TransactionResponseDto[];

  const transactions = useMemo(() => [...txArray], [txArray]);
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((tx) => tx.status === filterStatus);
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case "7days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          filterDate.setDate(now.getDate() - 90);
          break;
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      if (dateRange !== "all") {
        filtered = filtered.filter(
          (tx) => new Date(tx.createdAt) >= filterDate
        );
      }
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filterType, filterStatus, dateRange, transactions]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const pendingPayouts = [
    {
      id: "payout-001",
      claimId: "CL-002",
      amount: "450 USDC",
      description: "Prescription Medication Claim",
      estimatedDate: "2024-12-25",
      status: "processing",
    },
  ];

  const formatAddress = (address?: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Wallet</h1>
              <p className="page-header-subtitle">
                Manage your crypto assets and transaction history
              </p>
            </div>
          </div>
        </div>

        <div className="grid [grid-template-columns:auto_1fr_1fr] gap-6 items-stretch mb-8">
          {/* Wallet Section - auto width */}
          <WalletSection />

          {/* Stat Card: Total Payouts */}
          <Card className="glass-card rounded-2xl h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">+12.5%</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {paymentStats?.data?.totalPayoutsReceived ?? 0} ETH
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Total Payouts Received
              </p>
            </CardContent>
          </Card>

          {/* Stat Card: Monthly Premiums */}
          <Card className="glass-card rounded-2xl h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-info">Active</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {paymentStats?.data?.totalPremiumToPay ?? 0} ETH
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Premiums Due
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions and Pending Payouts */}
        <FluidTabs
          defaultTab="transactions"
          tabs={[
            {
              id: "transactions",
              label: "Transaction History",
              icon: <ArrowLeftRight size={18} />,
              content: (
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                          Recent Transactions
                        </CardTitle>
                        <p className="text-slate-600 dark:text-slate-400">
                          Showing {paginatedTransactions.length} of{" "}
                          {filteredTransactions.length} transactions
                        </p>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={filterType}
                          onValueChange={(value) =>
                            handleFilterChange(() => setFilterType(value))
                          }
                        >
                          <SelectTrigger className="w-32 form-input">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="received">Received</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={filterStatus}
                          onValueChange={(value) =>
                            handleFilterChange(() => setFilterStatus(value))
                          }
                        >
                          <SelectTrigger className="w-32 form-input">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={dateRange}
                          onValueChange={(value) =>
                            handleFilterChange(() => setDateRange(value))
                          }
                        >
                          <SelectTrigger className="w-32 form-input">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                            <SelectItem value="1year">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {paginatedTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                tx.type === "received"
                                  ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                  : "bg-gradient-to-r from-red-500 to-pink-500"
                              }`}
                            >
                              {tx.type === "received" ? (
                                <ArrowDownLeft className="w-6 h-6 text-white" />
                              ) : (
                                <ArrowUpRight className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                {tx.description} {tx.type}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                <span>
                                  {new Date(tx.createdAt).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span>{formatAddress(tx.txHash)}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                tx.type === "received"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-800 dark:text-slate-100"
                              }`}
                            >
                              {tx.type === "received" ? "+" : "-"}
                              {tx.amount}
                            </p>
                            <div className="flex items-center space-x-1">
                              {tx.status === "confirmed" ? (
                                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Clock className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                              )}
                              <span className="text-xs text-slate-500 dark:text-slate-500 capitalize">
                                {tx.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      showInfo={true}
                      totalItems={filteredTransactions.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />
                  </CardContent>
                </Card>
              ),
            },
            {
              id: "pending",
              label: "Pending Payouts",
              icon: <Clock size={18} />,
              content: (
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Pending Payouts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingPayouts.length > 0 ? (
                      <div className="space-y-4">
                        {pendingPayouts.map((payout) => (
                          <div
                            key={payout.id}
                            className="flex items-center justify-between p-4 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                  {payout.description}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Claim ID: {payout.claimId} • Est.{" "}
                                  {new Date(
                                    payout.estimatedDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                +{payout.amount}
                              </p>
                              <Badge className="status-badge status-pending">
                                <Clock className="w-3 h-3 mr-1" />
                                Processing
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Wallet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                          No pending payouts
                        </h3>
                        <p className="text-slate-500 dark:text-slate-500">
                          All your claim payouts have been processed
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
