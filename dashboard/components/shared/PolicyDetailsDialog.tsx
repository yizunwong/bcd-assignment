'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Policy {
  id: string | number;
  name: string;
  category?: string;
  provider?: string;
  coverage?: string | number;
  premium?: string | number;
  sales?: number | string;
  revenue?: string | number;
  created?: Date | string;
  lastUpdated?: Date | string;
  description?: string;
  features?: string[];
  terms?: string;
  documents?: { name: string; url: string }[];
  reviews?: { user: string; rating: number; comment: string }[];
  rating?: number;
  status?: 'active' | 'inactive' | string;
}

export interface PolicyDetailsDialogProps {
  policy: Policy;
  open: boolean;
  onClose: () => void;
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const numberFormatter = new Intl.NumberFormat('en-US');

function formatValue(value?: string | number, opts?: { currency?: boolean }) {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'number') {
    return opts?.currency ? currency.format(value) : numberFormatter.format(value);
  }
  return value;
}

function formatDate(value?: Date | string) {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'PPP');
}

export default function PolicyDetailsDialog({ policy, open, onClose }: PolicyDetailsDialogProps) {
  const statusClass = policy.status === 'active' ? 'status-active' : 'status-warning';

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
            {policy.status && (
              <Badge className={cn('status-badge', statusClass)}>{
                policy.status.charAt(0).toUpperCase() + policy.status.slice(1)
              }</Badge>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Basic Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Policy ID</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">{policy.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Category</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">
                  {policy.category || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Provider</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">
                  {policy.provider || '-'}
                </p>
              </div>
              {policy.rating !== undefined && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rating</p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(policy.rating!) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`}
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

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Financial Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Coverage</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">
                  {formatValue(policy.coverage, { currency: typeof policy.coverage === 'number' })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Premium</p>
                <p className="text-emerald-600 dark:text-emerald-400 truncate">
                  {formatValue(policy.premium, { currency: typeof policy.premium === 'number' })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Sales</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">
                  {formatValue(policy.sales)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Revenue</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">
                  {formatValue(policy.revenue, { currency: typeof policy.revenue === 'number' })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Dates</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Created</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">
                  {formatDate(policy.created)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Last Updated</p>
                <p className="text-slate-800 dark:text-slate-100 truncate">
                  {formatDate(policy.lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {policy.description && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Description</h4>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {policy.description}
              </p>
            </div>
          )}

          {policy.features && policy.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Features</h4>
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
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Terms</h4>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {policy.terms}
              </p>
            </div>
          )}

          {policy.documents && policy.documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Documents</h4>
              <div className="space-y-1">
                {policy.documents.map((doc, idx) => (
                  <a key={idx} href={doc.url} className="flex items-center text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-1" /> {doc.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {policy.reviews && policy.reviews.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Reviews</h4>
              <div className="space-y-2">
                {policy.reviews.map((review, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">{review.user}</span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="w-full sm:w-auto">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

