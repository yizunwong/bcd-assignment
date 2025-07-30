"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  Heart,
  Plane,
  Sprout,
  Eye,
  Save,
  X,
  Upload,
  FileText,
  Download,
} from "lucide-react";
import { usePoliciesQuery } from "@/hooks/usePolicies";

export default function ManagePolicies() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [uploadedTermsFile, setUploadedTermsFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    category: "",
    coverage: "",
    premium: "",
    duration: "",
    description: "",
    claimTypes: [""],
  });

  // Fetch policies from API
  const {
    data: policiesData,
    isLoading,
    error,
  } = usePoliciesQuery({
    category: filterCategory !== "all" ? filterCategory : undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Debug: Log the raw API response
  useEffect(() => {
    console.log("Policies API response:", policiesData);
  }, [policiesData]);

  // Show error toast if error
  useEffect(() => {
    if (error) {
      // Replace with your toast logic if needed
      alert(
        "Failed to load policies: " +
          (typeof error === "string" ? error : "Unknown error")
      );
    }
  }, [error]);

  // Map API data to the UI format
  const policies = (policiesData?.data || []).map((policy) => ({
    id: policy.id,
    name: policy.name,
    category: policy.category,
    provider: policy.provider,
    coverage: policy.coverage ? `$${policy.coverage.toLocaleString()}` : "-",
    premium: policy.premium,
    status: "active", // fallback as API does not provide status
    sales: 0, // fallback as API does not provide sales
    revenue: "-", // fallback as API does not provide revenue
    created: "-", // fallback as API does not provide created_at
    lastUpdated: "-", // fallback as API does not provide updated_at
    description:
      typeof policy.description === "string" ? policy.description : "",
    features: policy.claim_types || [],
    terms: "", // fallback as API does not provide terms
  }));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return Heart;
      case "travel":
        return Plane;
      case "crop":
        return Sprout;
      default:
        return Shield;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "from-red-500 to-pink-500";
      case "travel":
        return "from-blue-500 to-cyan-500";
      case "crop":
        return "from-green-500 to-emerald-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "draft":
        return "status-pending";
      case "inactive":
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
    }
  };

  const filteredPolicies = useMemo(() => {
    let filtered = policies.filter((policy) => {
      const matchesTab = activeTab === "all" || policy.status === activeTab;
      const matchesSearch =
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || policy.category === filterCategory;
      return matchesTab && matchesSearch && matchesCategory;
    });

    // Sort by creation date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  }, [activeTab, searchTerm, filterCategory]);

  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  const handleCreatePolicy = () => {
    console.log("Creating policy:", newPolicy);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewPolicy({
      name: "",
      category: "",
      coverage: "",
      premium: "",
      duration: "",
      description: "",
      claimTypes: [""],
    });
    setUploadedTermsFile(null);
  };

  const addClaimType = () => {
    setNewPolicy({
      ...newPolicy,
      claimTypes: [...newPolicy.claimTypes, ""],
    });
  };

  const updateClaimType = (index: number, value: string) => {
    const updatedClaimTypes = [...newPolicy.claimTypes];
    updatedClaimTypes[index] = value;
    setNewPolicy({
      ...newPolicy,
      claimTypes: updatedClaimTypes,
    });
  };

  const removeClaimType = (index: number) => {
    setNewPolicy({
      ...newPolicy,
      claimTypes: newPolicy.claimTypes.filter((_, i) => i !== index),
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setUploadedTermsFile(file);
      } else {
        alert("Please upload a PDF file for terms and conditions.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setUploadedTermsFile(file);
      } else {
        alert("Please upload a PDF file for terms and conditions.");
      }
    }
  };

  const removeUploadedFile = () => {
    setUploadedTermsFile(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="section-spacing">
        <div className="max-w-7xl mx-auto text-center py-12">
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Loading policies...
          </h3>
        </div>
      </div>
    );
  }

  // Error state (in case not caught by useEffect)
  if (error) {
    return (
      <div className="section-spacing">
        <div className="max-w-7xl mx-auto text-center py-12">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Failed to load policies
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            {typeof error === "string"
              ? error
              : "An error occurred while fetching policies."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Manage Policies</h1>
              <p className="page-header-subtitle">
                Create, edit, and manage insurance policies
              </p>
            </div>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gradient-accent text-white floating-button">
                <Plus className="w-4 h-4 mr-2" />
                Create New Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Policy Name
                    </label>
                    <Input
                      value={newPolicy.name}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, name: e.target.value })
                      }
                      placeholder="Enter policy name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <Select
                      value={newPolicy.category}
                      onValueChange={(value) =>
                        setNewPolicy({ ...newPolicy, category: value })
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health Insurance</SelectItem>
                        <SelectItem value="travel">Travel Insurance</SelectItem>
                        <SelectItem value="crop">Crop Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Coverage Amount
                    </label>
                    <Input
                      value={newPolicy.coverage}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, coverage: e.target.value })
                      }
                      placeholder="e.g., $100,000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Premium
                    </label>
                    <Input
                      value={newPolicy.premium}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, premium: e.target.value })
                      }
                      placeholder="e.g., 0.8 ETH/month"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Duration
                    </label>
                    <Input
                      value={newPolicy.duration}
                      onChange={(e) =>
                        setNewPolicy({ ...newPolicy, duration: e.target.value })
                      }
                      placeholder="e.g., 12 months"
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={newPolicy.description}
                    onChange={(e) =>
                      setNewPolicy({
                        ...newPolicy,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the policy coverage and benefits"
                    className="form-input min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Claim Types
                  </label>
                  <div className="space-y-2">
                    {newPolicy.claimTypes.map((claimType, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={claimType}
                          onChange={(e) =>
                            updateClaimType(index, e.target.value)
                          }
                          placeholder="Enter claim type (e.g., Medical Expense, Emergency Care)"
                          className="form-input"
                        />
                        {newPolicy.claimTypes.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeClaimType(index)}
                            className="h-10 w-10 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addClaimType}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Claim Type
                    </Button>
                  </div>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Terms & Conditions Document
                    </label>

                    {!uploadedTermsFile ? (
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                          dragActive
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          Drag and drop your terms & conditions PDF here, or{" "}
                          <label className="text-emerald-600 dark:text-emerald-400 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300">
                            browse
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf"
                              onChange={handleFileSelect}
                            />
                          </label>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          PDF format only • Max 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {uploadedTermsFile.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {(uploadedTermsFile.size / 1024 / 1024).toFixed(
                                2
                              )}{" "}
                              MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={removeUploadedFile}
                            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePolicy}
                    className="flex-1 gradient-accent text-white floating-button"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Policy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">Active</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {policies.filter((p) => p.status === "active").length}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Active Policies
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-pending">Draft</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {policies.filter((p) => p.status === "draft").length}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Draft Policies
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-info">Total</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {policies.reduce((sum, p) => sum + p.sales, 0)}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Total Sales</p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">Revenue</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                1,341
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Total ETH Revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <Card className="glass-card rounded-2xl mb-8">
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                handleFilterChange(() => setActiveTab(value))
              }
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger value="active" className="rounded-lg">
                  Active Policies
                </TabsTrigger>
                <TabsTrigger value="draft" className="rounded-lg">
                  Draft Policies
                </TabsTrigger>
                <TabsTrigger value="all" className="rounded-lg">
                  All Policies
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Policy Management
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Showing {paginatedPolicies.length} of{" "}
                    {filteredPolicies.length} policies
                  </p>
                </div>

                <div className="responsive-stack">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search policies..."
                      value={searchTerm}
                      onChange={(e) =>
                        handleFilterChange(() => setSearchTerm(e.target.value))
                      }
                      className="form-input pl-10"
                    />
                  </div>
                  <Select
                    value={filterCategory}
                    onValueChange={(value) =>
                      handleFilterChange(() => setFilterCategory(value))
                    }
                  >
                    <SelectTrigger className="w-full md:w-48 form-input">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="health">Health Insurance</SelectItem>
                      <SelectItem value="travel">Travel Insurance</SelectItem>
                      <SelectItem value="crop">Crop Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-32 form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 per page</SelectItem>
                      <SelectItem value="30">30 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Policies Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {paginatedPolicies.map((policy) => {
            const CategoryIcon = getCategoryIcon(policy.category);
            return (
              <Card
                key={policy.id}
                className="glass-card rounded-2xl card-hover"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(policy.category)} flex items-center justify-center`}
                      >
                        <CategoryIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                          {policy.name}
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {policy.provider} • {policy.id}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`status-badge ${getStatusColor(policy.status)}`}
                    >
                      {policy.status.charAt(0).toUpperCase() +
                        policy.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-700 dark:text-slate-300">
                    {policy.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Coverage
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {policy.coverage}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Premium
                      </p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {policy.premium}
                      </p>
                    </div>
                  </div>

                  {policy.status === "active" && (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Sales
                        </p>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          {policy.sales}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Revenue
                        </p>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          {policy.revenue}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Key Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {policy.features.slice(0, 3).map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {policy.features.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                        >
                          +{policy.features.length - 3} more
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
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 floating-button"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showInfo={true}
          totalItems={filteredPolicies.length}
          itemsPerPage={itemsPerPage}
          className="mb-8"
        />

        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No policies found
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Try adjusting your search criteria or create a new policy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
