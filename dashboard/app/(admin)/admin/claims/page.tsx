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
import ClaimReviewDialog from "@/components/shared/ClaimReviewDialog";
import { Pagination } from "@/components/shared/Pagination";
import { claims } from "@/public/data/admin/claimsData";
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

const ITEMS_PER_PAGE = 10;

export default function ClaimsReview() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClaims = useMemo(() => {
    let filtered = claims.filter((claim) => {
      const matchesStatus =
        filterStatus === "all" || claim.status === filterStatus;
      const matchesSearch =
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claimant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    // Sort by submitted date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.submittedDate).getTime() -
        new Date(a.submittedDate).getTime()
    );
  }, [searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);
  const paginatedClaims = filteredClaims.slice(
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
      case "under-review":
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
      case "under-review":
        return <Eye className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleApprove = (claimId: string) => {
    console.log("Approving claim:", claimId);
  };

  const handleReject = (claimId: string) => {
    console.log("Rejecting claim:", claimId);
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
          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-pending">Pending</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {claims.filter((c) => c.status === "pending").length}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Pending Review
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-info">Review</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {claims.filter((c) => c.status === "under-review").length}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Under Review</p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">Approved</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {claims.filter((c) => c.status === "approved").length}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Approved</p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-error">Rejected</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {claims.filter((c) => c.status === "rejected").length}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Rejected</p>
            </CardContent>
          </Card>
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
                  Showing {paginatedClaims.length} of {filteredClaims.length}{" "}
                  claims
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
                    <SelectItem value="under-review">Under Review</SelectItem>
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
          {paginatedClaims.map((claim) => (
            <Card key={claim.id} className="glass-card rounded-2xl card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {claim.id}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {claim.policyName}
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
                      className={`status-badge ${getStatusColor(claim.status)}`}
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
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Claimant
                      </p>
                      <p className="font-medium text-slate-800 dark:text-slate-100">
                        {claim.claimant}
                      </p>
                    </div>
                  </div>
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
                        {new Date(claim.submittedDate).toLocaleDateString()}
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
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(claim.id)}
                        className="gradient-accent text-white floating-button"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showInfo={true}
          totalItems={filteredClaims.length}
          itemsPerPage={ITEMS_PER_PAGE}
          className="mb-8"
        />

        {filteredClaims.length === 0 && (
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
      </div>
    </div>
  );
}
