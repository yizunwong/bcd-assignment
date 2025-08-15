"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Download,
  Shield,
  DollarSign,
  Calendar,
  MapPin,
  User,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";
import { PolicyControllerFindAllCategory } from "@/api";
import { formatDate, formatValue } from "@/utils/formatHelper";

export interface Policy {
  id: string | number;
  name: string;
  category: PolicyControllerFindAllCategory;
  provider?: string;
  coverage: number;
  premium: number;
  popular?: boolean;
  sales?: number | string;
  revenue: number;
  created?: Date | string;
  lastUpdated?: Date | string;
  status?: string;
  description?: string;
  features?: string[];
  terms?: string;
  documents?: { name: string; url: string }[];
  reviews?: { user: string; rating: number; comment: string }[];
  rating?: number;
}

export interface PolicyDetailsDialogProps {
  policy: Policy;
  open: boolean;
  onClose: () => void;
}

export default function PolicyDetailsDialog({
  policy,
  open,
  onClose,
}: PolicyDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-3xl max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center space-x-2 overflow-hidden">
            <DialogTitle className="text-lg font-semibold truncate">
              {policy.name}
            </DialogTitle>
            <DialogDescription>Policy Details</DialogDescription>
          </div>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Basic Information Box */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-500 to-gray-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                Basic Information
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Policy ID:
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  #{policy.id}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Category:
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-semibold capitalize">
                  {policy.category || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Provider:
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  {policy.provider || "-"}
                </span>
              </div>
              {policy.rating !== undefined && (
                <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Rating:
                  </span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(policy.rating!)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-slate-400"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                      {policy.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Details Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                Financial Details
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Coverage:
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  RM {formatValue(policy.coverage)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Premium:
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {formatValue(policy.premium, {
                    currency: typeof policy.premium === "number",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Sales:
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  {formatValue(policy.sales)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  Revenue:
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  {formatValue(policy.revenue, {
                    currency: typeof policy.revenue === "number",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Dates Box */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                Dates
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Created:
                </span>
                <span className="text-slate-800 dark:text-slate-100 font-semibold">
                  {formatDate(policy.created)}
                </span>
              </div>
            </div>
          </div>

          {policy.description && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                  Description
                </h4>
              </div>
              <div className="py-3 px-4 bg-white/60 dark:bg-slate-800/30 rounded-lg">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {policy.description}
                </p>
              </div>
            </div>
          )}

          {policy.features && policy.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                Features
              </h4>
              <div className="flex flex-wrap gap-1">
                {policy.features.map((feature, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {policy.terms && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                Terms
              </h4>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {policy.terms}
              </p>
            </div>
          )}

          {policy.documents && policy.documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                Documents
              </h4>
              <div className="space-y-1">
                {policy.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    className="flex items-center text-emerald-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-1" /> {doc.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {policy.reviews && policy.reviews.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                Reviews
              </h4>
              <div className="space-y-2">
                {policy.reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">
                        {review.user}
                      </span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-slate-400"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
