'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, CheckCircle, X } from 'lucide-react';

import type { ReactNode } from 'react';

interface ClaimReviewDialogProps {
  claim: any;
  trigger?: ReactNode;
}

export function ClaimReviewDialog({ claim, trigger }: ClaimReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const adjusters = ['Alice Brown', 'David Lee', 'Monica Garcia'];
  const [reviewForm, setReviewForm] = useState({
    status: claim.status || '',
    notes: '',
    adjuster: '',
    reason: '',
    payment: '',
  });
  const [errors, setErrors] = useState({
    status: '',
    notes: '',
    adjuster: '',
    reason: '',
    payment: '',
  });

  const validateForm = () => {
    const newErrors: any = {};
    if (!reviewForm.status) newErrors.status = 'Status is required';
    if (!reviewForm.adjuster) newErrors.adjuster = 'Select an adjuster';
    if (!reviewForm.notes) newErrors.notes = 'Assessment notes are required';
    if (
      (reviewForm.status === 'rejected' || reviewForm.status === 'under-review') &&
      !reviewForm.reason
    ) {
      newErrors.reason = 'Please provide a reason';
    }
    if (reviewForm.status === 'approved') {
      if (!reviewForm.payment) {
        newErrors.payment = 'Payment amount is required';
      } else if (isNaN(Number(reviewForm.payment))) {
        newErrors.payment = 'Invalid amount';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprove = () => {
    setReviewForm({ ...reviewForm, status: 'approved' });
    if (!validateForm()) return;
    console.log('Approving claim:', claim.id, reviewForm);
    setOpen(false);
  };

  const handleReject = () => {
    setReviewForm({ ...reviewForm, status: 'rejected' });
    if (!validateForm()) return;
    console.log('Rejecting claim:', claim.id, reviewForm);
    setOpen(false);
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;
    console.log('Saving claim:', claim.id, reviewForm);
    setOpen(false);
  };

  const handleRequestInfo = () => {
    setReviewForm({ ...reviewForm, status: 'under-review' });
    if (!validateForm()) return;
    console.log('Requesting additional info for', claim.id);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setReviewForm({
            status: claim.status || '',
            notes: '',
            adjuster: '',
            reason: '',
            payment: '',
          });
          setErrors({ status: '', notes: '', adjuster: '', reason: '', payment: '' });
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
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Claim Information</h4>
              <div className="element-spacing">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Claim ID:</span>
                  <span className="text-slate-800 dark:text-slate-100">{claim.id}</span>
                </div>
                {claim.date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Submitted:</span>
                    <span className="text-slate-800 dark:text-slate-100">{claim.date}</span>
                  </div>
                )}
                {claim.type && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Type:</span>
                    <span className="text-slate-800 dark:text-slate-100">{claim.type}</span>
                  </div>
                )}
                {claim.category && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Category:</span>
                    <span className="text-slate-800 dark:text-slate-100">{claim.category}</span>
                  </div>
                )}
                {claim.amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                    <span className="text-slate-800 dark:text-slate-100">{claim.amount}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Policyholder</h4>
              <div className="element-spacing">
                {claim.submittedBy && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Name:</span>
                    <span className="text-slate-800 dark:text-slate-100">{claim.submittedBy}</span>
                  </div>
                )}
                {claim.policyNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Policy #:</span>
                    <span className="text-slate-800 dark:text-slate-100">{claim.policyNumber}</span>
                  </div>
                )}
                {claim.contact && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Contact:</span>
                    <span className="text-slate-800 dark:text-slate-100">{claim.contact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Incident Details */}
          {claim.incidentDetails && (
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Incident Details</h4>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                {claim.incidentDetails}
              </p>
            </div>
          )}

          {/* Documents */}
          {claim.documents && (
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Attachments</h4>
              <div className="grid grid-cols-2 gap-2">
                {claim.documents.map((doc: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{doc}</span>
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <Select value={reviewForm.status} onValueChange={(value) => setReviewForm({ ...reviewForm, status: value })}>
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
                {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Claims Adjuster</label>
                <Select value={reviewForm.adjuster} onValueChange={(value) => setReviewForm({ ...reviewForm, adjuster: value })}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Assign adjuster" />
                  </SelectTrigger>
                  <SelectContent>
                    {adjusters.map((adj) => (
                      <SelectItem key={adj} value={adj}>{adj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.adjuster && <p className="text-sm text-red-600 mt-1">{errors.adjuster}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Assessment Notes</label>
              <Textarea
                value={reviewForm.notes}
                onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                className="form-input min-h-[100px]"
                placeholder="Add notes..."
              />
              {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Approval / Rejection Reason</label>
              <Textarea
                value={reviewForm.reason}
                onChange={(e) => setReviewForm({ ...reviewForm, reason: e.target.value })}
                className="form-input min-h-[80px]"
                placeholder="Reason" />
              {errors.reason && <p className="text-sm text-red-600 mt-1">{errors.reason}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Approved Payment Amount</label>
              <Input
                type="number"
                value={reviewForm.payment}
                onChange={(e) => setReviewForm({ ...reviewForm, payment: e.target.value })}
                className="form-input"
                placeholder="0.00" />
              {errors.payment && <p className="text-sm text-red-600 mt-1">{errors.payment}</p>}
            </div>
          </div>

          <div className="responsive-stack pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="outline" onClick={handleRequestInfo} className="flex-1">Request Info</Button>
            <Button variant="outline" onClick={handleReject} className="flex-1 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
              <X className="w-4 h-4 mr-2" />
              Reject Claim
            </Button>
            <Button onClick={handleApprove} className="flex-1 gradient-accent text-white floating-button">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Claim
            </Button>
            <Button onClick={handleSaveChanges} className="flex-1 gradient-accent text-white floating-button">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClaimReviewDialog;
