'use client';

import { useState, useEffect } from 'react';
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
} from '@/components/ui/dialog';
import { Plus, Save, X } from 'lucide-react';
import type { Policy } from './PolicyDetailsDialog';

export interface EditPolicyDialogProps {
  policy: Policy;
  open: boolean;
  onClose: () => void;
  onSave?: (policy: Policy) => void;
}

export default function EditPolicyDialog({
  policy,
  open,
  onClose,
  onSave,
}: EditPolicyDialogProps) {
  const [formData, setFormData] = useState<Policy>({ ...policy });

  useEffect(() => {
    if (open) {
      setFormData({ ...policy });
    }
  }, [open, policy]);

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), ''],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...(formData.features || [])];
    features[index] = value;
    setFormData({ ...formData, features });
  };

  const removeFeature = (index: number) => {
    const features = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features });
  };

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-4xl max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Edit Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Policy Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                placeholder="Enter policy name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health Insurance</SelectItem>
                  <SelectItem value="travel">Travel Insurance</SelectItem>
                  <SelectItem value="crop">Crop Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Coverage Amount
              </label>
              <Input
                value={formData.coverage as any}
                onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                placeholder="e.g., $100,000"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Premium
              </label>
              <Input
                value={formData.premium as any}
                onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                placeholder="e.g., 0.8 ETH/month"
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input min-h-[100px]"
              placeholder="Describe the policy coverage and benefits"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Key Features
            </label>
            <div className="space-y-2">
              {(formData.features || []).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Enter feature"
                    className="form-input"
                  />
                  {(formData.features || []).length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="h-10 w-10 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFeature} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Terms & Conditions
            </label>
            <Textarea
              value={formData.terms || ''}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="form-input min-h-[100px]"
              placeholder="Enter policy terms and conditions"
            />
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 gradient-accent text-white floating-button">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
