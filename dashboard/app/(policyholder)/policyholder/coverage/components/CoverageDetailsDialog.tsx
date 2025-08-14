"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInsuranceContract } from "@/hooks/useBlockchain";
import { usePaymentMutation } from "@/hooks/usePayment";
import LeaveReviewDialog from "./LeaveReviewDialog";

interface CoveragePolicy {
  id: string;
  name: string;
  provider: string;
  coverage: string;
  premium: string;
  status: string;
  startDate: string;
  endDate: string;
  nextPayment: string;
  benefits: string[];
}

interface CoverageDetailsDialogProps {
  policy: CoveragePolicy;
  open: boolean;
  onClose: () => void;
}

export default function CoverageDetailsDialog({
  policy,
  open,
  onClose,
}: CoverageDetailsDialogProps) {
  const {
    payPremiumForCoverage,
    isPayingPremium,
    isWaitingPay,
    isPaySuccess,
    payPremiumData,
  } = useInsuranceContract();

  const { createTransaction } = usePaymentMutation();

  const [reviewOpen, setReviewOpen] = useState(false);

  // Track amount being paid to record later
  const payingAmountRef = useRef<number | null>(null);
  // Prevent duplicate transaction recording
  const hasRecordedTxRef = useRef(false);

  // Handle pay button click
  const handlePayPremium = () => {
    const premiumAmount = parseFloat(String(policy.premium));
    if (!Number.isFinite(premiumAmount)) return;

    payingAmountRef.current = premiumAmount;
    hasRecordedTxRef.current = false; // reset for new tx
    payPremiumForCoverage(Number(policy.id), premiumAmount);
  };

  // Record transaction after success
  useEffect(() => {
    if (!isPaySuccess || hasRecordedTxRef.current) return;

    hasRecordedTxRef.current = true;
    const amount =
      payingAmountRef.current ?? parseFloat(String(policy.premium));

    if (!Number.isFinite(amount)) return;

    createTransaction({
      description: `Paid premium for policy ${policy.name}`,
      coverageId: Number(policy.id),
      txHash: payPremiumData!, // ← If your hook returns it, pass here
      amount,
      currency: "ETH",
      status: "confirmed",
      type: "sent",
    });
  }, [isPaySuccess, createTransaction, policy.id, policy.premium, policy.name]);

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{policy.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <InfoRow label="Provider" value={policy.provider} />
            <InfoRow label="Coverage" value={policy.coverage} />
            <InfoRow
              label="Premium"
              value={policy.premium}
              valueClass="text-emerald-600 dark:text-emerald-400"
            />
            <InfoRow label="Status" value={<Badge>{policy.status}</Badge>} />

            <InfoRow
              label={
                <LabelWithIcon
                  icon={<Calendar className="w-4 h-4" />}
                  text="Policy Period"
                />
              }
              value={`${new Date(
                policy.startDate
              ).toLocaleDateString()} - ${new Date(
                policy.endDate
              ).toLocaleDateString()}`}
            />

            <InfoRow
              label={
                <LabelWithIcon
                  icon={<Clock className="w-4 h-4" />}
                  text="Next Payment"
                />
              }
              value={new Date(policy.nextPayment).toLocaleDateString()}
            />

            {policy.benefits.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Benefits
                </p>
                <div className="flex flex-wrap gap-1">
                  {policy.benefits.map((benefit, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              onClick={handlePayPremium}
              disabled={isPayingPremium || isWaitingPay}
            >
              {isWaitingPay ? "Processing..." : "Pay Premium"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setReviewOpen(true)}
              className="flex-1"
            >
              Leave Review
            </Button>

            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LeaveReviewDialog
        policyId={policy.id}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </>
  );
}

function InfoRow({
  label,
  value,
  valueClass = "",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
      <div
        className={`text-sm font-medium text-slate-800 dark:text-slate-100 ${valueClass}`}
      >
        {value}
      </div>
    </div>
  );
}


function LabelWithIcon({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
}
