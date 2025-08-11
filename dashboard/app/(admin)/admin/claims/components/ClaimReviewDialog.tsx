"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { FileText } from "lucide-react";

import type { ReactNode } from "react";
import { ClaimResponseDto } from "@/api";

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
    status: claim.status || "",
    notes: "",
    reason: "",
    payment: "",
  });
  const [errors, setErrors] = useState({
    status: "",
    notes: "",
    reason: "",
    payment: "",
  });

  const validateForm = () => {
    const newErrors: any = {};
    if (!reviewForm.status) newErrors.status = "Status is required";
    if (!reviewForm.notes) newErrors.notes = "Assessment notes are required";
    if (
      (reviewForm.status === "rejected" ||
        reviewForm.status === "under-review") &&
      !reviewForm.reason
    ) {
      newErrors.reason = "Please provide a reason";
    }
    if (reviewForm.status === "approved") {
      if (!reviewForm.payment) {
        newErrors.payment = "Payment amount is required";
      } else if (isNaN(Number(reviewForm.payment))) {
        newErrors.payment = "Invalid amount";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setReviewForm({
            status: claim.status || "",
            notes: "",
            reason: "",
            payment: "",
          });
          setErrors({ status: "", notes: "", reason: "", payment: "" });
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
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Claim Information
              </h4>
              <div className="element-spacing">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Claim ID:
                  </span>
                  <span className="text-slate-800 dark:text-slate-100">
                    {claim.id}
                  </span>
                </div>
                {claim.submitted_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Submitted:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.submitted_date}
                    </span>
                  </div>
                )}
                {claim.type && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Type:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.type}
                    </span>
                  </div>
                )}
                {claim.type && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Type:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.type}
                    </span>
                  </div>
                )}
                {claim.amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Amount:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.amount}
                    </span>
                  </div>
                )}
                {claim.policy && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Policy:
                      </span>
                      <span className="text-slate-800 dark:text-slate-100">
                        {claim.policy.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Coverage:
                      </span>
                      <span className="text-slate-800 dark:text-slate-100">
                        {claim.policy.coverage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Premium:
                      </span>
                      <span className="text-slate-800 dark:text-slate-100">
                        {claim.policy.premium}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Policyholder
              </h4>
              <div className="element-spacing">
                {claim.submitted_by && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Name:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.submitted_by}
                    </span>
                  </div>
                )}
                {claim.policyholder_details?.date_of_birth && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Date of Birth:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.policyholder_details.date_of_birth}
                    </span>
                  </div>
                )}
                {claim.policyholder_details?.occupation && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Occupation:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.policyholder_details.occupation}
                    </span>
                  </div>
                )}
                {claim.policyholder_details?.address && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Address:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">
                      {claim.policyholder_details.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          {claim.claim_documents && (
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Attachments
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {claim.claim_documents.map((doc, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <a
                        href={doc.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-700 dark:text-slate-300 hover:underline"
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
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <Select
                  value={reviewForm.status}
                  onValueChange={(value) =>
                    setReviewForm({ ...reviewForm, status: value })
                  }
                >
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Assessment Notes
              </label>
              <Textarea
                value={reviewForm.notes}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, notes: e.target.value })
                }
                className="form-input min-h-[100px]"
                placeholder="Add notes..."
              />
              {errors.notes && (
                <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Approval / Rejection Reason
              </label>
              <Textarea
                value={reviewForm.reason}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, reason: e.target.value })
                }
                className="form-input min-h-[80px]"
                placeholder="Reason"
              />
              {errors.reason && (
                <p className="text-sm text-red-600 mt-1">{errors.reason}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Approved Payment Amount
              </label>
              <Input
                type="number"
                value={reviewForm.payment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, payment: e.target.value })
                }
                className="form-input"
                placeholder="0.00"
              />
              {errors.payment && (
                <p className="text-sm text-red-600 mt-1">{errors.payment}</p>
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
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClaimReviewDialog;
