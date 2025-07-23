"use client";

import { useState, useMemo } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Pagination } from "@/components/shared/Pagination";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Download,
  X,
} from "lucide-react";
import { claims } from "@/public/data/policyholder/claimsData";

const ITEMS_PER_PAGE = 8;

export default function Claims() {
  const [activeTab, setActiveTab] = useState<"my-claims" | "new-claim">(
    "my-claims"
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const sortedClaims = useMemo(() => {
    const sorted = [...claims].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.submittedDate).getTime() -
            new Date(a.submittedDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.submittedDate).getTime() -
            new Date(b.submittedDate).getTime()
          );
        case "amount-high":
          return (
            parseFloat(b.amount.replace(/[$,]/g, "")) -
            parseFloat(a.amount.replace(/[$,]/g, ""))
          );
        case "amount-low":
          return (
            parseFloat(a.amount.replace(/[$,]/g, "")) -
            parseFloat(b.amount.replace(/[$,]/g, ""))
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    return sorted;
  }, [sortBy]);

  const totalPages = Math.ceil(sortedClaims.length / ITEMS_PER_PAGE);
  const paginatedClaims = sortedClaims.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "status-active";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-error";
      case "under-review":
        return "status-info";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <AlertTriangle className="w-4 h-4" />;
      case "under-review":
        return <Eye className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
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
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
              <h1 className="page-header-title">Claims Management</h1>
              <p className="page-header-subtitle">
                Submit new claims and track existing ones
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("my-claims")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "my-claims"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            My Claims
          </button>
          <button
            onClick={() => setActiveTab("new-claim")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "new-claim"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Submit New Claim
          </button>
        </div>

        {activeTab === "my-claims" ? (
          /* My Claims Tab */
          <div>
            {/* Sort Controls */}
            <Card className="glass-card rounded-2xl mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      Your Claims
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Showing {paginatedClaims.length} of {sortedClaims.length}{" "}
                      claims
                    </p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 form-input">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount-high">
                        Amount: High to Low
                      </SelectItem>
                      <SelectItem value="amount-low">
                        Amount: Low to High
                      </SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Claims List */}
            <div className="content-spacing mb-8">
              {paginatedClaims.map((claim) => (
                <Card key={claim.id} className="glass-card rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                          {claim.id}
                        </CardTitle>
                        <p className="text-slate-600 dark:text-slate-400">
                          {claim.policyName} • {claim.type}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
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
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {claim.amount}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Claim Details */}
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                          Claim Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">
                              Submitted:
                            </span>
                            <span className="text-slate-800 dark:text-slate-100">
                              {new Date(
                                claim.submittedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {claim.processedDate && (
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">
                                Processed:
                              </span>
                              <span className="text-slate-800 dark:text-slate-100">
                                {new Date(
                                  claim.processedDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="pt-2">
                            <span className="text-slate-600 dark:text-slate-400">
                              Description:
                            </span>
                            <p className="text-slate-800 dark:text-slate-100 mt-1">
                              {claim.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                          Processing Timeline
                        </h4>
                        <div className="space-y-3">
                          {claim.timeline.map((step, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  step.status === "completed"
                                    ? "bg-emerald-500"
                                    : step.status === "current"
                                    ? "bg-blue-500"
                                    : "bg-slate-300 dark:bg-slate-600"
                                }`}
                              >
                                {step.status === "completed" ? (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                ) : step.status === "current" ? (
                                  <Clock className="w-3 h-3 text-white" />
                                ) : (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm font-medium ${
                                    step.status === "completed"
                                      ? "text-slate-800 dark:text-slate-100"
                                      : step.status === "current"
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-slate-500 dark:text-slate-500"
                                  }`}
                                >
                                  {step.step}
                                </p>
                                {step.date && (
                                  <p className="text-xs text-slate-500 dark:text-slate-500">
                                    {new Date(step.date).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                        Supporting Documents
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {claim.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-lg"
                          >
                            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {doc}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
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
              totalItems={sortedClaims.length}
              itemsPerPage={ITEMS_PER_PAGE}
              className="mt-8"
            />
          </div>
        ) : (
          /* New Claim Tab */
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                Submit New Claim
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Fill out the form below to submit a new insurance claim
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Policy
                  </label>
                  <Select>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Choose a policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POL-001">
                        Comprehensive Health Coverage
                      </SelectItem>
                      <SelectItem value="POL-002">
                        Global Travel Protection
                      </SelectItem>
                      <SelectItem value="POL-003">
                        Weather-Based Crop Insurance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Claim Type
                  </label>
                  <Select>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Expense</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="emergency">Emergency Care</SelectItem>
                      <SelectItem value="travel">Travel Incident</SelectItem>
                      <SelectItem value="weather">Weather Damage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Claim Amount
                </label>
                <Input
                  type="number"
                  placeholder="Enter claim amount in USD"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Provide detailed description of the incident..."
                  className="form-input min-h-[100px]"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Supporting Documents
                </label>
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
                    Drag and drop files here, or{" "}
                    <label className="text-emerald-600 dark:text-emerald-400 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300">
                      browse
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                  </p>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Selected Files:
                    </p>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {file.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 text-slate-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button className="flex-1 gradient-accent text-white floating-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
