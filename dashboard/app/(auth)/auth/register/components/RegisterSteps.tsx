import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle,
  Building,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import PhoneCodeDropdown from "@/components/shared/PhoneCodeDropDown";
import { Dispatch, SetStateAction } from "react";

export type Role = {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
};

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-emerald-500" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function RoleSelection({
  roles,
  selectedRole,
  setSelectedRole,
}: {
  roles: Role[];
  selectedRole: string;
  setSelectedRole: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Choose Your Account Type</h3>
        <p className="text-slate-600 dark:text-slate-400">Select the option that best describes you</p>
      </div>
      <div className="grid gap-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all duration-300 glass-card rounded-2xl ${
              selectedRole === role.id ? "ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20" : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <CardContent className="flex items-center p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center mr-4`}>
                <role.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white">{role.title}</h4>
              </div>
              {selectedRole === role.id && <CheckCircle className="w-6 h-6 text-emerald-500" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BasicInfo({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Basic Information</h3>
        <p className="text-slate-600 dark:text-slate-400">Tell us about yourself</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
          <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Enter your first name" className="form-input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
          <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Enter your last name" className="form-input" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
        <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" className="form-input" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
        <div className="flex space-x-2">
          <PhoneCodeDropdown value={formData.phoneCode} onChange={(val) => setFormData({ ...formData, phoneCode: val })} />
          <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter your phone number" className="form-input flex-1" required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password *</label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Create a password" className="form-input pr-10" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password *</label>
          <div className="relative">
            <Input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm your password" className="form-input pr-10" required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoleSpecificInfo({
  selectedRole,
  formData,
  setFormData,
}: {
  selectedRole: string;
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
}) {
  if (selectedRole === "policyholder") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Personal Details</h3>
          <p className="text-slate-600 dark:text-slate-400">Additional information for your insurance profile</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth *</label>
            <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Occupation *</label>
            <Input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} placeholder="Your occupation" className="form-input" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address *</label>
          <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Enter your full address" className="form-input" required />
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })} className="mt-1" />
            <label htmlFor="terms" className="text-sm text-slate-700 dark:text-slate-300">
              I agree to the <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service</Link> and understand that my account will be subject to verification.
            </label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox id="privacy" checked={formData.agreeToPrivacy} onCheckedChange={(checked) => setFormData({ ...formData, agreeToPrivacy: checked as boolean })} className="mt-1" />
            <label htmlFor="privacy" className="text-sm text-slate-700 dark:text-slate-300">
              I agree to the <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</Link> and consent to the processing of my personal data.
            </label>
          </div>
        </div>
      </div>
    );
  }
  if (selectedRole === "admin") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Insurance Provider Setup</h3>
          <p className="text-slate-600 dark:text-slate-400">You'll be redirected to complete your provider registration</p>
        </div>
        <div className="p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <Building className="w-8 h-8 text-blue-400" />
            <div>
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">Insurance Provider Registration</h4>
              <p className="text-blue-600 dark:text-blue-400 text-sm">Complete registration with additional business requirements</p>
            </div>
          </div>
          <div className="space-y-3 text-blue-700 dark:text-blue-300 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Business license and registration documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Professional insurance certifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Financial statements and compliance verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Enhanced security and regulatory compliance</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })} className="mt-1" />
            <label htmlFor="terms" className="text-sm text-slate-700 dark:text-slate-300">
              I agree to the <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service</Link> and <Link href="/provider-terms" className="text-emerald-400 hover:text-emerald-300">Provider Agreement</Link>.
            </label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox id="privacy" checked={formData.agreeToPrivacy} onCheckedChange={(checked) => setFormData({ ...formData, agreeToPrivacy: checked as boolean })} className="mt-1" />
            <label htmlFor="privacy" className="text-sm text-slate-700 dark:text-slate-300">
              I agree to the <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</Link> and consent to business data processing and regulatory compliance checks.
            </label>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
