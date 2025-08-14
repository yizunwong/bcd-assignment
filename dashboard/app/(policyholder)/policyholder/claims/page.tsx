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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClaimsQuery } from "@/hooks/useClaims";
import { useInsuranceContract } from "@/hooks/useBlockchain";
import { usePolicyClaimTypesQuery } from "@/hooks/usePolicies";
import {
  useCreateClaimMutation,
  useUploadClaimDocumentsMutation,
} from "@/hooks/useClaims";
import { useAuthStore } from "@/store/useAuthStore";
import { useMeQuery } from "@/hooks/useAuth";
import { z } from "zod";

const ITEMS_PER_PAGE = 4;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const NewClaimSchema = z.object({
  selectedPolicy: z.string().min(1, "Please select a policy"),
  claimType: z.string().min(1, "Please select a claim type"),
  claimAmount: z
    .string()
    .min(1, "Please enter a claim amount")
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().min(1, "Please provide a description"),
  // at least 1 file, max 3 files
  files: z
    .array(z.instanceof(File))
    .min(1, "Please attach at least one supporting document")
    .max(3, "You can upload up to 3 files only")
    .superRefine((files, ctx) => {
      const seen = new Set<string>();
      for (const f of files) {
        const name = f.name.toLowerCase();
        if (seen.has(name)) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate file are not allowed",
          });
        } else {
          seen.add(name);
        }
        if (f.size > MAX_FILE_SIZE_BYTES) {
          ctx.addIssue({
            code: "custom",
            message: "Each file must be 10MB or less",
          });
        }
      }
    }),
});

export default function Claims() {
  const [activeTab, setActiveTab] = useState<"my-claims" | "new-claim">(
    "my-claims"
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [claimType, setClaimType] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [description, setDescription] = useState("");
  const userId = useAuthStore((state) => state.userId);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof NewClaimSchema>, string>>
  >({});
  const { data: meData } = useMeQuery();

  const priority = "low";

  const { fileClaimForCoverage, isFilingClaim } = useInsuranceContract();
  const { data: policyClaimTypes } = usePolicyClaimTypesQuery();
  const policies = policyClaimTypes?.data ?? [];
  const selectedPolicyData = policies.find(
    (p) => p.id.toString() === selectedPolicy
  );
  const claimTypes = selectedPolicyData?.claim_types || [];

  const handlePolicyChange = (val: string) => {
    setSelectedPolicy(val);
    setClaimType("");
    if (errors.selectedPolicy)
      setErrors((e) => ({ ...e, selectedPolicy: undefined }));
  };
  const { createClaim, isPending: isCreating } = useCreateClaimMutation();
  const { uploadClaimDocuments, isPending: isUploading } =
    useUploadClaimDocumentsMutation();

  // Map UI sort selection to backend sort params
  const listParams = (() => {
    const base: any = {
      userId: meData?.data?.id,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };
    switch (sortBy) {
      case "newest":
        return { ...base, sortBy: "id", sortOrder: "desc" };
      case "amount-high":
        return { ...base, sortBy: "amount", sortOrder: "desc" };
      case "amount-low":
        return { ...base, sortBy: "amount", sortOrder: "asc" };
      case "status":
        return { ...base, sortBy: "status", sortOrder: "asc" };
      case "all":
      default:
        return base; // server defaults to id asc
    }
  })();

  const {
    data: claimsData,
    isLoading,
    error,
    refetch: refetchClaims,
  } = useClaimsQuery(listParams);

  const claims = useMemo(
    () =>
      (claimsData?.data ?? []).map((claim) => ({
        id: claim.id.toString(),
        policyName: claim.policy?.name ?? "",
        type: claim.type,
        amount: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(claim.amount ?? 0),
        status: claim.status,
        submittedDate: claim.submitted_date,
        processedDate: undefined,
        description: claim.description,
        documents: claim.claim_documents?.map((doc) => doc.name) ?? [],
        timeline: [],
      })),
    [claimsData]
  );

  // Use server-provided order
  const sortedClaims = claims;

  const totalPages = Math.ceil((claimsData?.count || 0) / ITEMS_PER_PAGE);
  const paginatedClaims = sortedClaims; // server provides paginated data
  // Safety: strictly render max ITEMS_PER_PAGE in case API returns extra
  const displayedClaims = useMemo(() => {
    return paginatedClaims.slice(0, ITEMS_PER_PAGE);
  }, [paginatedClaims]);

  if (error) {
    return (
      <div className="section-spacing">
        <div className="max-w-7xl mx-auto">Error loading claims</div>
      </div>
    );
  }

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
      setSelectedFiles((prev) => {
        const existing = new Set(prev.map((f) => f.name.toLowerCase()));
        const newlyAccepted: File[] = [];
        const newlyNames = new Set<string>();
        let hadDuplicate = false;
        let hadTooLarge = false;
        for (const f of files) {
          const lname = f.name.toLowerCase();
          if (existing.has(lname) || newlyNames.has(lname)) {
            hadDuplicate = true;
            continue;
          }
          if (f.size > MAX_FILE_SIZE_BYTES) {
            hadTooLarge = true;
            continue;
          }
          newlyNames.add(lname);
          newlyAccepted.push(f);
        }
        const merged = [...prev, ...newlyAccepted];
        if (merged.length > 3) {
          setErrors((er) => ({
            ...er,
            files: "You can upload up to 3 files only",
          }));
        }
        if (hadDuplicate) {
          setErrors((er) => ({
            ...er,
            files: "Duplicate file are not allowed",
          }));
        }
        if (hadTooLarge) {
          setErrors((er) => ({
            ...er,
            files: "Each file must be 10MB or less",
          }));
        }
        const next = merged.slice(0, 3);
        if (!hadDuplicate && !hadTooLarge && next.length > 0) {
          setErrors((e2) => ({ ...e2, files: undefined }));
        }
        return next;
      });
    }
  };

  const validateForm = () => {
    const result = NewClaimSchema.safeParse({
      selectedPolicy,
      claimType,
      claimAmount,
      description,
      files: selectedFiles,
    });
    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof z.infer<typeof NewClaimSchema>, string>
      > = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof z.infer<typeof NewClaimSchema>;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => {
        const existing = new Set(prev.map((f) => f.name.toLowerCase()));
        const newlyAccepted: File[] = [];
        const newlyNames = new Set<string>();
        let hadDuplicate = false;
        let hadTooLarge = false;
        for (const f of files) {
          const lname = f.name.toLowerCase();
          if (existing.has(lname) || newlyNames.has(lname)) {
            hadDuplicate = true;
            continue;
          }
          if (f.size > MAX_FILE_SIZE_BYTES) {
            hadTooLarge = true;
            continue;
          }
          newlyNames.add(lname);
          newlyAccepted.push(f);
        }
        const merged = [...prev, ...newlyAccepted];
        if (merged.length > 3) {
          setErrors((er) => ({
            ...er,
            files: "You can upload up to 3 files only",
          }));
        }
        if (hadDuplicate) {
          setErrors((er) => ({
            ...er,
            files: "Duplicate file are not allowed",
          }));
        }
        if (hadTooLarge) {
          setErrors((er) => ({
            ...er,
            files: "Each file must be 10MB or less",
          }));
        }
        const next = merged.slice(0, 3);
        if (!hadDuplicate && !hadTooLarge && next.length > 0) {
          setErrors((e2) => ({ ...e2, files: undefined }));
        }
        return next;
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  console.log(selectedPolicy);

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
                      Showing {displayedClaims.length} of{" "}
                      {claimsData?.count || 0} claims
                    </p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 form-input">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
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
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {displayedClaims.map((claim) => (
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
                            {new Date(claim.submittedDate).toLocaleDateString()}
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
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showInfo={true}
                totalItems={claimsData?.count || 0}
                itemsPerPage={ITEMS_PER_PAGE}
                className="mt-8"
              />
            )}

            {displayedClaims.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No claims found
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  Try adjusting your search criteria or submit a new claim
                </p>
              </div>
            )}
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
                  <Select
                    value={selectedPolicy}
                    onValueChange={handlePolicyChange}
                  >
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Choose a policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies.map((policy) => (
                        <SelectItem
                          key={policy.id}
                          value={policy.id.toString()}
                        >
                          {policy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedPolicy && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.selectedPolicy}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Claim Type
                  </label>
                  <Select
                    value={claimType}
                    onValueChange={(v) => {
                      setClaimType(v);
                      if (errors.claimType)
                        setErrors((e) => ({ ...e, claimType: undefined }));
                    }}
                  >
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      {claimTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.claimType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.claimType}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Claim Amount
                </label>
                <Input
                  type="number"
                  placeholder="Enter claim amount in ETH"
                  className="form-input"
                  value={claimAmount}
                  onChange={(e) => {
                    setClaimAmount(e.target.value);
                    if (errors.claimAmount)
                      setErrors((er) => ({ ...er, claimAmount: undefined }));
                  }}
                />
                {errors.claimAmount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.claimAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Provide detailed description of the incident..."
                  className="form-input min-h-[100px]"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors((er) => ({ ...er, description: undefined }));
                  }}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
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
                        disabled={selectedFiles.length >= 3}
                      />
                    </label>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each).
                    Max 3 files.
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
                {errors.files && (
                  <p className="mt-2 text-sm text-red-500">{errors.files}</p>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button
                  className="flex-1 gradient-accent text-white floating-button"
                  onClick={async () => {
                    // Validate
                    if (!validateForm()) return;
                    if (
                      !selectedPolicy ||
                      !claimType ||
                      !claimAmount ||
                      !description
                    )
                      return;
                    const amount = parseFloat(claimAmount);
                    try {
                      const claimId = await fileClaimForCoverage(
                        Number(selectedPolicy),
                        amount,
                        description
                      );
                      if (!claimId) {
                        console.error("Failed to file claim on blockchain");
                        return;
                      }

                      await createClaim({
                        id: claimId,
                        coverage_id: Number(selectedPolicy),
                        type: claimType,
                        priority,
                        amount,
                        description,
                      });
                      if (claimId && selectedFiles.length > 0) {
                        await uploadClaimDocuments(String(claimId), {
                          files: selectedFiles,
                        });
                      }

                      // Refresh claims list and switch to My Claims tab
                      await refetchClaims();
                      setActiveTab("my-claims");

                      // Reset form fields and show success dialog
                      setSelectedPolicy("");
                      setClaimType("");
                      setClaimAmount("");
                      setDescription("");
                      setSelectedFiles([]);
                      setDragActive(false);
                      setShowSuccess(true);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  disabled={isFilingClaim || isCreating || isUploading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Claim submitted successfully
              </DialogTitle>
            </DialogHeader>
            <p className="text-slate-600 dark:text-slate-400">
              Your claim has been submitted. You can track its status under "My
              Claims".
            </p>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setShowSuccess(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
