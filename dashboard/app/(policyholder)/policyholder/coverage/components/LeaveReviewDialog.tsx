"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useLeaveReviewMutation } from "@/hooks/useReviews";
import { useToast } from "@/components/shared/ToastProvider";

interface LeaveReviewDialogProps {
  policyId: string;
  open: boolean;
  onClose: () => void;
}

export default function LeaveReviewDialog({
  policyId,
  open,
  onClose,
}: LeaveReviewDialogProps) {
  const { leaveReview, isPending } = useLeaveReviewMutation();
  const { printMessage } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      printMessage("Please select a rating", "error");
      return;
    }
    try {
      await leaveReview(policyId, {
        rating,
        ...(comment ? { comment } : {}),
      });
      printMessage("Review submitted successfully", "success");
      setRating(0);
      setHover(0);
      setComment("");
      onClose();
    } catch {
      printMessage("Failed to submit review", "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const val = i + 1;
              const active = (hover || rating) >= val;
              return (
                <Star
                  key={val}
                  className={`w-6 h-6 cursor-pointer ${
                    active ? "fill-yellow-500 text-yellow-500" : "text-slate-400"
                  }`}
                  onMouseEnter={() => setHover(val)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(val)}
                />
              );
            })}
          </div>
          <Textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-4 gap-2">
          <Button onClick={handleSubmit} loading={isPending}>
            Submit
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

