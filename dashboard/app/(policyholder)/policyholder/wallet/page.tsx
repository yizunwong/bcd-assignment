"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Copy,
  ExternalLink,
  Coins,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Filter,
  Calendar,
} from "lucide-react";
import {
  walletBalance,
  allTransactions,
} from "@/public/data/policyholder/walletData";

const ITEMS_PER_PAGE = 10;

export default function WalletPage() {
  const [walletAddress] = useState(
    "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
  );
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

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
        filtered = filtered.filter((tx) => new Date(tx.date) >= filterDate);
      }
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filterType, filterStatus, dateRange]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string) => {
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

        {/* Wallet Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Balance Card */}
          <Card className="lg:col-span-2 glass-card rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                  Wallet Balance
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>{formatAddress(walletAddress)}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(walletAddress)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {copied && (
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                    {walletBalance.eth}
                  </span>
                  <span className="text-xl text-slate-600 dark:text-slate-400">
                    ETH
                  </span>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  ${walletBalance.usd} USD
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="gradient-accent text-white floating-button">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline" className="floating-button">
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Receive
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="glass-card rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="status-badge status-active">+12.5%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  $162,950
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Total Payouts Received
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="status-badge status-info">Active</Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  $3.5 ETH
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Monthly Premiums
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Token Holdings */}
        <Card className="glass-card rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
              Token Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {walletBalance.tokens.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {token.symbol}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {token.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {token.balance}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      ${token.usdValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions and Pending Payouts */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger value="transactions" className="rounded-lg">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg">
              Pending Payouts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
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
                            {tx.description}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>
                              {new Date(tx.date).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{formatAddress(tx.hash)}</span>
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
                          {tx.status === "completed" ? (
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
          </TabsContent>

          <TabsContent value="pending">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
