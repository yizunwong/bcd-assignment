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
import { useEffect, useRef } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { useInsuranceContract } from "@/hooks/useBlockchain";
import { usePaymentMutation } from "@/hooks/usePayment";

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
  const { payPremiumForCoverage, isPayingPremium, payPremiumData } =
    useInsuranceContract();
  const { createTransaction } = usePaymentMutation();

  // remember the amount used when we initiated the tx
  const payingAmountRef = useRef<number | null>(null);
  // make sure we only record a given hash once
  const lastRecordedHashRef = useRef<string | null>(null);

  // Wait for the tx ONLY when we actually have a hash
  const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: payPremiumData,
    confirmations: 2,
    // wagmi v2: this prevents polling when no hash; if you're on v1, remove `query`
    query: { enabled: !!payPremiumData },
  });

  // Button click -> fire ONE on-chain tx
  const handlePayPremium = () => {
    const premiumAmount = parseFloat(String(policy.premium)); // handles "0.1" or "0.1 ETH"
    if (!Number.isFinite(premiumAmount)) return;

    payingAmountRef.current = premiumAmount;
    payPremiumForCoverage(Number(policy.id), premiumAmount);
  };

  // After tx confirms -> record it ONCE, do not send a new tx
  useEffect(() => {
    const recordOnce = async () => {
      if (!isTxSuccess || !payPremiumData) return;

      // avoid duplicate records if the dialog re-renders
      if (lastRecordedHashRef.current === payPremiumData) return;
      lastRecordedHashRef.current = payPremiumData;

      const amount =
        payingAmountRef.current ?? parseFloat(String(policy.premium));
      if (!Number.isFinite(amount)) return;

      await createTransaction({
        description: `Paid premium for policy ${policy.name}`,
        coverageId: Number(policy.id),
        txHash: payPremiumData,
        amount,
        currency: "ETH",
        status: "confirmed",
        type: "sent",
      });
    };

    recordOnce();
    // depend only on what truly changes the effect
    // (avoid putting `policy` object itself here to prevent spurious reruns)
  }, [
    isTxSuccess,
    payPremiumData,
    createTransaction,
    policy.id,
    policy.premium,
  ]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{policy.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Provider
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {policy.provider}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Coverage
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {policy.coverage}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Premium
            </p>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {policy.premium}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
            <Badge>{policy.status}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Policy Period
              </p>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {new Date(policy.startDate).toLocaleDateString()} -{" "}
              {new Date(policy.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Next Payment
              </p>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {new Date(policy.nextPayment).toLocaleDateString()}
            </p>
          </div>
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
            disabled={isPayingPremium || (!!payPremiumData && !isTxSuccess)}
          >
            Pay Premium
          </Button>

          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
