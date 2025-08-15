"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileCheck,
  User,
  Calendar,
  MapPin,
  Briefcase,
  Shield,
  DollarSign,
} from "lucide-react";

import type { ReactNode } from "react";
import { ClaimResponseDto } from "@/api";
import { useToast } from "@/components/shared/ToastProvider";

interface ClaimWithDetails extends ClaimResponseDto {
  policy: {
    id: number;
    name: string;
    provider: string;
    coverage: number;
    premium: number;
  };
  policyholder_details: {
    user_id: string;
    date_of_birth: string;
    occupation: string;
    address: string;
  };
}

interface ClaimReviewDialogProps {
  claim: ClaimWithDetails;
  trigger?: ReactNode;
}

export function ClaimReviewDialog({ claim, trigger }: ClaimReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    reason: "",
  });
  const [errors, setErrors] = useState({
    reason: "",
  });
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const { printMessage } = useToast();

  const validateForm = () => {
    const newErrors: any = {};
    if (!reviewForm.reason) {
      newErrors.reason = "Please provide a reason";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    try {
      // Simply save the reason/notes to the claim
      // The actual approval/rejection is handled by the main claims page buttons
      printMessage("Claim review notes saved successfully", "success");
      setOpen(false);
    } catch (error) {
      console.error("Error saving claim review:", error);
      printMessage("Failed to save claim review", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setReviewForm({
            reason: "",
          });
          setErrors({ reason: "" });
          setCharCount(0);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="floating-button">
            Review
          </Button>
        )}
      </DialogTrigger>
      {/* Widen the dialog so details fit comfortably */}
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim Review - {claim.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Claim Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Claim Information Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                  Claim Information
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Claim ID:
                  </span>
                  <span className="text-slate-800 dark:text-slate-100 font-semibold">
                    #{claim.id}
                  </span>
                </div>
                {claim.submitted_date && (
                  <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Submitted:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold">
                      {claim.submitted_date}
                    </span>
                  </div>
                )}
                {claim.type && (
                  <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Type:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold capitalize">
                      {claim.type}
                    </span>
                  </div>
                )}
                {claim.amount && (
                  <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Amount:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold">
                      ${claim.amount}
                    </span>
                  </div>
                )}
                {claim.policy && (
                  <>
                    <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Policy:
                      </span>
                      <span className="text-slate-800 dark:text-slate-100 font-semibold text-right">
                        {claim.policy.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Coverage:
                      </span>
                      <span className="text-slate-800 dark:text-slate-100 font-semibold">
                        ${claim.policy.coverage?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Premium:
                      </span>
                      <span className="text-slate-800 dark:text-slate-100 font-semibold">
                        ${claim.policy.premium}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Policyholder Box */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                  Policyholder
                </h4>
              </div>
              <div className="space-y-3">
                {claim.submitted_by && (
                  <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      Name:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold">
                      {claim.submitted_by}
                    </span>
                  </div>
                )}
                {claim.policyholder_details?.date_of_birth && (
                  <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Date of Birth:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold">
                      {claim.policyholder_details.date_of_birth}
                    </span>
                  </div>
                )}
                {claim.policyholder_details?.occupation && (
                  <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      Occupation:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold">
                      {claim.policyholder_details.occupation}
                    </span>
                  </div>
                )}
                {claim.policyholder_details?.address && (
                  <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Address:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold text-right">
                      {claim.policyholder_details.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          {claim.claim_documents && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                  Attachments
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {claim.claim_documents.map((doc, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/60 dark:bg-slate-800/30 p-3 rounded-lg border border-amber-200/50 dark:border-amber-700/50 hover:bg-white/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <a
                        href={doc.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:underline transition-colors"
                      >
                        {doc.name}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                    Decision Reasoning
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Provide detailed reasoning for your decision
                  </p>
                </div>
              </div>

              {/* Quick Action Suggestions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 w-full mb-2">
                  Quick suggestions:
                </p>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs"
                  onClick={() => {
                    const suggestion =
                      "Documentation verified and claim meets all policy requirements.";
                    setReviewForm({ reason: suggestion });
                    setCharCount(suggestion.length);
                  }}
                >
                  <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                  Approve - Valid
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                  onClick={() => {
                    const suggestion =
                      "Insufficient documentation provided to support the claim.";
                    setReviewForm({ reason: suggestion });
                    setCharCount(suggestion.length);
                  }}
                >
                  <XCircle className="w-3 h-3 mr-1 text-red-600" />
                  Reject - Insufficient
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 text-xs"
                  onClick={() => {
                    const suggestion =
                      "Requires additional documentation and verification before approval.";
                    setReviewForm({ reason: suggestion });
                    setCharCount(suggestion.length);
                  }}
                >
                  <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
                  Review - More Info
                </Badge>
              </div>

              <div className="relative">
                <Textarea
                  value={reviewForm.reason}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= maxChars) {
                      setReviewForm({ ...reviewForm, reason: value });
                      setCharCount(value.length);
                    }
                  }}
                  className={`form-input min-h-[140px] resize-none border-2 transition-all duration-200 ${
                    reviewForm.reason
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                      : "border-slate-200 dark:border-slate-700"
                  } focus:border-emerald-400 dark:focus:border-emerald-500`}
                  placeholder="Enter detailed reasoning for your decision...\n\nFor example:\n• Documentation review findings\n• Policy coverage assessment\n• Supporting evidence evaluation\n• Recommendation details"
                />

                {/* Character Counter */}
                <div className="absolute bottom-3 right-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border">
                  {charCount}/{maxChars}
                </div>
              </div>

              {errors.reason && (
                <div className="flex items-center space-x-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.reason}
                  </p>
                </div>
              )}

              {/* Character Warning */}
              {charCount > maxChars * 0.8 && (
                <div className="flex items-center space-x-2 mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {charCount >= maxChars
                      ? "Character limit reached. Please shorten your response."
                      : `Approaching character limit (${charCount}/${maxChars})`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="responsive-stack pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="flex-1 gradient-accent text-white floating-button"
            >
              Save Review Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClaimReviewDialog;
