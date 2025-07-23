"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/shared/Pagination";
import {
  Code,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Upload,
  Settings,
  Activity,
  Zap,
  Shield,
  FileText,
  ExternalLink,
  Loader2,
  Hash,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
} from "lucide-react";
import { contracts } from "@/public/data/system-admin/contractsData";

const CONTRACTS_PER_PAGE = 6;
const TRANSACTIONS_PER_PAGE = 20;

export default function SmartContractManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [currentContractPage, setCurrentContractPage] = useState(1);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);

  // Data moved to public/data/system-admin/contractsData.ts

  // Generate sample transaction data
  const generateTransactions = (contractId: string, count: number) => {
    const types = [
      "Policy Creation",
      "Claim Submission",
      "Payout",
      "Premium Payment",
      "Oracle Update",
    ];
    const statuses = ["success", "pending", "failed"];

    return Array.from({ length: count }, (_, i) => ({
      id: `tx-${contractId}-${i + 1}`,
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: 18500000 + Math.floor(Math.random() * 100000),
      timestamp: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      value: (Math.random() * 10).toFixed(4),
      gasUsed: Math.floor(Math.random() * 200000) + 21000,
      gasPrice: (Math.random() * 50 + 10).toFixed(2),
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      function: [
        "createPolicy",
        "submitClaim",
        "processPayout",
        "updateOracle",
      ][Math.floor(Math.random() * 4)],
    }));
  };

  const allTransactions = useMemo(() => {
    if (!selectedContract) return [];
    return generateTransactions(selectedContract.id, 150); // Generate 150 transactions for demo
  }, [selectedContract]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "status-active";
      case "testing":
        return "status-info";
      case "maintenance":
        return "status-pending";
      case "deprecated":
        return "status-error";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="w-4 h-4" />;
      case "testing":
        return <Play className="w-4 h-4" />;
      case "maintenance":
        return <Settings className="w-4 h-4" />;
      case "deprecated":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Insurance Policy":
        return "from-blue-500 to-cyan-500";
      case "Parametric Insurance":
        return "from-green-500 to-emerald-500";
      case "Claims Management":
        return "from-purple-500 to-indigo-500";
      case "Treasury Management":
        return "from-yellow-500 to-orange-500";
      case "Oracle Service":
        return "from-red-500 to-pink-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "status-active";
      case "pending":
        return "status-pending";
      case "failed":
        return "status-error";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
    }
  };

  const filteredContracts = useMemo(() => {
    let filtered = contracts.filter((contract) => {
      const matchesSearch =
        contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || contract.status === filterStatus;
      const matchesType = filterType === "all" || contract.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });

    return filtered.sort(
      (a, b) =>
        new Date(b.deployedDate).getTime() - new Date(a.deployedDate).getTime()
    );
  }, [searchTerm, filterStatus, filterType]);

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions.filter((tx) => {
      const matchesType =
        transactionFilter === "all" || tx.type === transactionFilter;
      return matchesType;
    });

    return filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [allTransactions, transactionFilter]);

  const contractTotalPages = Math.ceil(
    filteredContracts.length / CONTRACTS_PER_PAGE
  );
  const paginatedContracts = filteredContracts.slice(
    (currentContractPage - 1) * CONTRACTS_PER_PAGE,
    currentContractPage * CONTRACTS_PER_PAGE
  );

  const transactionTotalPages = Math.ceil(
    filteredTransactions.length / TRANSACTIONS_PER_PAGE
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentTransactionPage - 1) * TRANSACTIONS_PER_PAGE,
    currentTransactionPage * TRANSACTIONS_PER_PAGE
  );

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleContractPageChange = async (page: number) => {
    setPageTransition(true);
    setCurrentContractPage(page);

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setPageTransition(false);
  };

  const handleTransactionPageChange = async (page: number) => {
    setIsLoading(true);
    setCurrentTransactionPage(page);

    // Simulate API call for cursor-based pagination
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const handleDeployContract = async () => {
    setIsLoading(true);
    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Deploying new contract");
    setIsLoading(false);
    setIsDeployDialogOpen(false);
  };

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract);
    setCurrentTransactionPage(1); // Reset transaction page when viewing new contract
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentContractPage(1);
  };

  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Smart Contract Management</h1>
              <p className="page-header-subtitle">
                Deploy, monitor, and manage blockchain smart contracts
              </p>
            </div>
          </div>
          <Dialog
            open={isDeployDialogOpen}
            onOpenChange={setIsDeployDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gradient-accent text-white floating-button">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Deploy New Smart Contract</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contract Name
                    </label>
                    <Input
                      placeholder="Enter contract name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contract Type
                    </label>
                    <Select>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="insurance">
                          Insurance Policy
                        </SelectItem>
                        <SelectItem value="parametric">
                          Parametric Insurance
                        </SelectItem>
                        <SelectItem value="claims">
                          Claims Management
                        </SelectItem>
                        <SelectItem value="treasury">
                          Treasury Management
                        </SelectItem>
                        <SelectItem value="oracle">Oracle Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe the contract functionality"
                    className="form-input min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Contract Code
                  </label>
                  <Textarea
                    placeholder="Paste Solidity contract code here..."
                    className="form-input min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Network
                    </label>
                    <Select>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mainnet">
                          Ethereum Mainnet
                        </SelectItem>
                        <SelectItem value="testnet">
                          Ethereum Testnet
                        </SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Gas Limit
                    </label>
                    <Input placeholder="e.g., 3000000" className="form-input" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeployDialogOpen(false)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeployContract}
                    className="flex-1 gradient-accent text-white floating-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    Deploy Contract
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <StatsCard
            title="Active Contracts"
            value={contracts
              .filter((c) => c.status === "deployed")
              .length.toString()}
            change="+2 this month"
            changeType="positive"
            icon={Code}
          />
          <StatsCard
            title="Total Transactions"
            value="13.5K"
            change="+8.2% this week"
            changeType="positive"
            icon={Activity}
          />
          <StatsCard
            title="Total Value Locked"
            value="1,965 ETH"
            change="$6.8M USD"
            changeType="neutral"
            icon={Shield}
          />
          <StatsCard
            title="Gas Efficiency"
            value="98.5%"
            change="Optimized"
            changeType="positive"
            icon={Zap}
          />
        </div>

        <Tabs defaultValue="contracts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger value="contracts" className="rounded-lg">
              Smart Contracts
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="deployment" className="rounded-lg">
              Deployment Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contracts">
            {/* Filters */}
            <Card className="glass-card rounded-2xl mb-6">
              <CardContent className="p-6">
                <div className="responsive-stack">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search contracts..."
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
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="deprecated">Deprecated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterType}
                    onValueChange={(value) =>
                      handleFilterChange(() => setFilterType(value))
                    }
                  >
                    <SelectTrigger className="w-full md:w-48 form-input">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Insurance Policy">
                        Insurance Policy
                      </SelectItem>
                      <SelectItem value="Parametric Insurance">
                        Parametric Insurance
                      </SelectItem>
                      <SelectItem value="Claims Management">
                        Claims Management
                      </SelectItem>
                      <SelectItem value="Treasury Management">
                        Treasury Management
                      </SelectItem>
                      <SelectItem value="Oracle Service">
                        Oracle Service
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {pageTransition && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-slate-600 dark:text-slate-400">
                  Loading contracts...
                </span>
              </div>
            )}

            {/* Contracts Grid */}
            {!pageTransition && (
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {paginatedContracts.map((contract) => (
                  <Card
                    key={contract.id}
                    className="glass-card rounded-2xl card-hover"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTypeColor(
                              contract.type
                            )} flex items-center justify-center`}
                          >
                            <Code className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                              {contract.name}
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {contract.type} • v{contract.version}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`status-badge ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {getStatusIcon(contract.status)}
                          <span className="ml-1 capitalize">
                            {contract.status}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-slate-700 dark:text-slate-300">
                        {contract.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Contract Address
                          </p>
                          <div className="flex items-center space-x-2">
                            <p className="font-mono text-sm text-slate-800 dark:text-slate-100">
                              {formatAddress(contract.address)}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Network
                          </p>
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {contract.network}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Transactions
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {contract.transactions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total Value
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {contract.totalValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Gas Used
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {contract.gasUsed}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Key Functions:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {contract.functions.slice(0, 3).map((func, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                            >
                              {func}
                            </Badge>
                          ))}
                          {contract.functions.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                            >
                              +{contract.functions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Button
                          variant="outline"
                          className="flex-1 floating-button"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Code
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 floating-button"
                          onClick={() => handleViewContract(contract)}
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          Transactions
                        </Button>
                        <Button
                          variant="outline"
                          className="text-slate-600 dark:text-slate-400"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentContractPage}
              totalPages={contractTotalPages}
              onPageChange={handleContractPageChange}
              showInfo={true}
              totalItems={filteredContracts.length}
              itemsPerPage={CONTRACTS_PER_PAGE}
              className="mb-8"
            />

            {filteredContracts.length === 0 && !pageTransition && (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No contracts found
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions">
            {selectedContract ? (
              <div className="space-y-6">
                {/* Contract Info Header */}
                <Card className="glass-card rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTypeColor(
                            selectedContract.type
                          )} flex items-center justify-center`}
                        >
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                            {selectedContract.name}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            {formatAddress(selectedContract.address)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Total Transactions
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          {filteredTransactions.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction Filters */}
                <Card className="glass-card rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          Transaction History
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Showing {paginatedTransactions.length} of{" "}
                          {filteredTransactions.length} transactions
                        </p>
                      </div>

                      <Select
                        value={transactionFilter}
                        onValueChange={setTransactionFilter}
                      >
                        <SelectTrigger className="w-full sm:w-48 form-input">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Policy Creation">
                            Policy Creation
                          </SelectItem>
                          <SelectItem value="Claim Submission">
                            Claim Submission
                          </SelectItem>
                          <SelectItem value="Payout">Payout</SelectItem>
                          <SelectItem value="Premium Payment">
                            Premium Payment
                          </SelectItem>
                          <SelectItem value="Oracle Update">
                            Oracle Update
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      Loading transactions...
                    </span>
                  </div>
                )}

                {/* Transactions List */}
                {!isLoading && (
                  <div className="space-y-4 mb-8">
                    {paginatedTransactions.map((tx) => (
                      <Card
                        key={tx.id}
                        className="glass-card rounded-2xl card-hover"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  tx.type === "Payout"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                    : tx.type === "Premium Payment"
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                    : tx.type === "Policy Creation"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                    : "bg-gradient-to-r from-orange-500 to-red-500"
                                }`}
                              >
                                {tx.type === "Payout" && (
                                  <ArrowUpRight className="w-6 h-6 text-white" />
                                )}
                                {tx.type === "Premium Payment" && (
                                  <ArrowDownLeft className="w-6 h-6 text-white" />
                                )}
                                {tx.type === "Policy Creation" && (
                                  <FileText className="w-6 h-6 text-white" />
                                )}
                                {(tx.type === "Claim Submission" ||
                                  tx.type === "Oracle Update") && (
                                  <Activity className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                    {tx.type}
                                  </h3>
                                  <Badge
                                    className={`status-badge ${getTransactionStatusColor(
                                      tx.status
                                    )}`}
                                  >
                                    {tx.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                  <div className="flex items-center space-x-1">
                                    <Hash className="w-3 h-3" />
                                    <span className="font-mono">
                                      {formatAddress(tx.hash)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(tx.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-slate-500 dark:text-slate-500">
                                    Value
                                  </p>
                                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                                    {tx.value} ETH
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-500 dark:text-slate-500">
                                    Block
                                  </p>
                                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                                    #{tx.blockNumber}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-500 dark:text-slate-500">
                                    Gas Used
                                  </p>
                                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                                    {tx.gasUsed.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-500 dark:text-slate-500">
                                    Gas Price
                                  </p>
                                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                                    {tx.gasPrice} Gwei
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 floating-button"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Transaction Pagination */}
                <Pagination
                  currentPage={currentTransactionPage}
                  totalPages={transactionTotalPages}
                  onPageChange={handleTransactionPageChange}
                  showInfo={true}
                  totalItems={filteredTransactions.length}
                  itemsPerPage={TRANSACTIONS_PER_PAGE}
                  className="mb-8"
                />

                {filteredTransactions.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      No transactions found
                    </h3>
                    <p className="text-slate-500 dark:text-slate-500">
                      Try adjusting your filter criteria
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Select a Contract
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  Choose a smart contract from the contracts tab to view its
                  transaction history
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="deployment">
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                  Recent Deployments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contracts.slice(0, 5).map((contract, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                          <Code className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            {contract.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Deployed on{" "}
                            {new Date(
                              contract.deployedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          className={`status-badge ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {contract.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="floating-button"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Log
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
