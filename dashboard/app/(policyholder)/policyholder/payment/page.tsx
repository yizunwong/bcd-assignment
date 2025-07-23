"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  ArrowLeft,
  Lock,
  CheckCircle,
  Info,
  CreditCard,
  Clock,
  Star,
  AlertCircle,
  Eye,
  EyeOff,
  Wallet,
  Zap,
  Globe,
  Award,
  Heart,
  Plane,
  Sprout,
} from "lucide-react";
import Link from "next/link";

export default function PaymentSummary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [tokenAmount, setTokenAmount] = useState("");
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ETH");

  // Mock policy data - in real app, this would come from URL params or API
  const policyData = {
    id: 1,
    name: "Comprehensive Health Coverage",
    category: "health",
    provider: "HealthSecure",
    coverage: "$100,000",
    premium: "0.8 ETH/month",
    rating: 4.8,
    features: [
      "Emergency Care",
      "Prescription Drugs",
      "Mental Health",
      "Dental",
    ],
    description:
      "Complete healthcare coverage with blockchain-verified claims processing",
    duration: "12 months",
    basePrice: 0.8,
    discount: 0.1,
    fees: 0.02,
    total: 0.72,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return Heart;
      case "travel":
        return Plane;
      case "crop":
        return Sprout;
      default:
        return Shield;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "from-red-500 to-pink-500";
      case "travel":
        return "from-blue-500 to-cyan-500";
      case "crop":
        return "from-green-500 to-emerald-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Redirect to confirmation page
    router.push("/policyholder/payment/confirmation");
  };

  const steps = [
    { id: 1, name: "Policy Selection", status: "completed" },
    { id: 2, name: "Payment Details", status: "current" },
    { id: 3, name: "Confirmation", status: "pending" },
  ];

  const CategoryIcon = getCategoryIcon(policyData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/policyholder/browse"
            className="flex items-center space-x-2 group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            <span className="text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Back to Policies
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Secure Payment
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="glass-card rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step.status === "completed"
                        ? "bg-emerald-500 text-white"
                        : step.status === "current"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      step.status === "current"
                        ? "text-blue-600 dark:text-blue-400"
                        : step.status === "completed"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-4 ${
                        step.status === "completed"
                          ? "bg-emerald-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress
              value={currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100}
              className="h-2"
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Policy Summary */}
          <div className="lg:col-span-1">
            <Card className="glass-card rounded-2xl sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Policy Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Policy Card */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(
                        policyData.category
                      )} flex items-center justify-center`}
                    >
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {policyData.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {policyData.provider}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                      {policyData.rating}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {policyData.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Coverage:
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {policyData.coverage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Duration:
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {policyData.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
                    Included Features
                  </h4>
                  <div className="space-y-2">
                    {policyData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Blockchain Secured</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>Licensed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="lg:col-span-2">
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 dark:text-slate-100 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["ETH", "USDC", "DAI"].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === method
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Wallet className="w-5 h-5" />
                          <span className="font-medium">{method}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Price Breakdown
                  </h3>
                  <div className="bg-slate-50/50 dark:bg-slate-700/30 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">
                        Base Premium (12 months)
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {policyData.basePrice} ETH
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center space-x-2">
                        <span>New Customer Discount (12%)</span>
                        <div className="group relative">
                          <Info className="w-4 h-4 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            First-time customer discount
                          </div>
                        </div>
                      </div>
                      <span className="font-medium">
                        -{policyData.discount} ETH
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600 dark:text-slate-400">
                          Network Fees
                        </span>
                        <div className="group relative">
                          <Info className="w-4 h-4 cursor-help text-slate-400" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Blockchain transaction fees
                          </div>
                        </div>
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {policyData.fees} ETH
                      </span>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {policyData.total} ETH
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-right mt-1">
                        ≈ $2,520 USD
                      </p>
                    </div>
                  </div>
                </div>

                {/* Token Amount Input */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      Payment Amount
                    </h3>
                    <button
                      onClick={() => setShowTokenDetails(!showTokenDetails)}
                      className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {showTokenDetails ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      <span>{showTokenDetails ? "Hide" : "Show"} Details</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      type="number"
                      value={tokenAmount || policyData.total}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      placeholder={`Enter ${paymentMethod} amount`}
                      className="form-input text-lg font-medium pr-20"
                      step="0.001"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {paymentMethod}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setTokenAmount(policyData.total.toString())
                        }
                        className="text-xs h-6 px-2"
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  {showTokenDetails && (
                    <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Wallet Balance
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Available: 5.2847 ETH ≈ $18,420 USD
                      </p>
                    </div>
                  )}
                </div>

                {/* Security Features */}
                <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium text-green-800 dark:text-green-200">
                      Security Features
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300">
                        End-to-end encryption
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300">
                        Smart contract verified
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300">
                        Multi-signature protection
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300">
                        Instant policy activation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Link href="/policyholder/browse" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full floating-button"
                    >
                      Modify Selection
                    </Button>
                  </Link>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || !tokenAmount}
                    className="flex-1 gradient-accent text-white floating-button relative overflow-hidden"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Confirm Payment</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By proceeding, you agree to our{" "}
                    <a
                      href="#"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-8 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>Global Coverage</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Licensed & Regulated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
