"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Building,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string>(
    searchParams.get("role") || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Policyholder Specific
    dateOfBirth: "",
    address: "",
    occupation: "",
    annualIncome: "",

    // Common
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  const roles = [
    {
      id: "policyholder",
      title: "Individual/Policyholder",
      description: "Personal insurance coverage for individuals and families",
      icon: User,
      gradient: "from-blue-500 to-teal-500",
    },
    {
      id: "admin",
      title: "Insurance Provider",
      description: "Insurance companies, brokers, and service providers",
      icon: Building,
      gradient: "from-emerald-500 to-green-500",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (selectedRole === "admin") {
        // Redirect to provider registration
        window.location.href = "/auth/register/provider";
      } else {
        console.log("Registration data:", { ...formData, role: selectedRole });
        // Handle policyholder registration logic here
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep
                ? "bg-emerald-500 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Choose Your Account Type
        </h3>
        <p className="text-slate-600">
          Select the option that best describes you
        </p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/50 rounded-2xl ${
              selectedRole === role.id
                ? "ring-2 ring-emerald-500 bg-emerald-50/50"
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <CardContent className="flex items-center p-6">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center mr-4`}
              >
                <role.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-800">
                  {role.title}
                </h4>
                <p className="text-slate-600">{role.description}</p>
              </div>
              {selectedRole === role.id && (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Basic Information
        </h3>
        <p className="text-slate-600">Tell us about yourself</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            First Name *
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Enter your first name"
            className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Last Name *
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Enter your last name"
            className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email Address *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Phone Number *
        </label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter your phone number"
          className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Create a password"
              className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm your password"
              className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoleSpecificInfo = () => {
    if (selectedRole === "policyholder") {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Personal Details
            </h3>
            <p className="text-slate-600">
              Additional information for your insurance profile
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth *
              </label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="bg-white/50 border-slate-200 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Occupation *
              </label>
              <Input
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                placeholder="Your occupation"
                className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address *
            </label>
            <Textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter your full address"
              className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Annual Income Range
            </label>
            <Select
              value={formData.annualIncome}
              onValueChange={(value) =>
                setFormData({ ...formData, annualIncome: value })
              }
            >
              <SelectTrigger className="bg-white/50 border-slate-200 text-slate-900">
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-25k">Under $25,000</SelectItem>
                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                <SelectItem value="over-150k">Over $150,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-slate-700">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Terms of Service
                </Link>{" "}
                and understand that my account will be subject to verification.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={formData.agreeToPrivacy}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    agreeToPrivacy: checked as boolean,
                  })
                }
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm text-slate-700">
                I agree to the{" "}
                <Link
                  href="/privacy"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Privacy Policy
                </Link>{" "}
                and consent to the processing of my personal data.
              </label>
            </div>
          </div>
        </div>
      );
    } else if (selectedRole === "admin") {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Insurance Provider Setup
            </h3>
            <p className="text-slate-600">
              You'll be redirected to complete your provider registration
            </p>
          </div>

          <div className="p-6 bg-blue-50/50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <Building className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800">
                  Insurance Provider Registration
                </h4>
                <p className="text-blue-700 text-sm">
                  Complete registration with additional business requirements
                </p>
              </div>
            </div>

            <div className="space-y-3 text-blue-700 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Business license and registration documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Professional insurance certifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Financial statements and compliance verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Enhanced security and regulatory compliance</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-slate-700">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/provider-terms"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Provider Agreement
                </Link>
                .
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={formData.agreeToPrivacy}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    agreeToPrivacy: checked as boolean,
                  })
                }
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm text-slate-700">
                I agree to the{" "}
                <Link
                  href="/privacy"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Privacy Policy
                </Link>{" "}
                and consent to business data processing and regulatory
                compliance checks.
              </label>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 group mb-8"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
            <span className="text-slate-600 group-hover:text-emerald-600 transition-colors">
              Back to Home
            </span>
          </Link>

          <div className="relative w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 animate-pulse"
              style={{ transform: "scale(1.1)" }}
            ></div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-slate-600">
            Join the future of decentralized insurance
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Registration Form */}
        <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/50 rounded-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderRoleSelection()}
              {currentStep === 2 && renderBasicInfo()}
              {currentStep === 3 && renderRoleSpecificInfo()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="border-slate-300 text-white bg-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-400 transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    Previous
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={
                    (currentStep === 1 && !selectedRole) ||
                    (currentStep === 3 &&
                      (!formData.agreeToTerms || !formData.agreeToPrivacy))
                  }
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ml-auto"
                >
                  {currentStep === 3 ? (
                    selectedRole === "admin" ? (
                      <>
                        Continue to Provider Setup
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "Create Account"
                    )
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
