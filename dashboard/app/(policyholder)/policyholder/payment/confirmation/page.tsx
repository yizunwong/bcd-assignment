"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Download,
  Home,
  FileText,
  Mail,
  Calendar,
  Clock,
  Shield,
  Zap,
  ExternalLink,
  Copy,
  Star,
  Heart,
  Plane,
  Sprout,
  ArrowRight,
  Bell,
  CreditCard,
  Globe,
  Lock,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function PaymentConfirmation() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [currentStep] = useState(3);

  // Mock transaction data - in real app, this would come from payment processing
  const transactionData = {
    id: "TX-2024-001234",
    blockHash: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    amount: "0.72 ETH",
    usdAmount: "$2,520.00",
    paymentMethod: "ETH",
    timestamp: new Date().toISOString(),
    networkFee: "0.02 ETH",
    status: "confirmed",
    confirmations: 12,
  };

  const policyData = {
    id: "POL-2024-5678",
    name: "Comprehensive Health Coverage",
    category: "health",
    provider: "HealthSecure",
    coverage: "$100,000",
    duration: "12 months",
    effectiveDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const steps = [
    { id: 1, name: "Policy Selection", status: "completed" },
    { id: 2, name: "Payment Details", status: "completed" },
    { id: 3, name: "Confirmation", status: "current" },
  ];

  const nextSteps = [
    {
      title: "Policy Activation",
      description:
        "Your policy will be automatically activated within 24 hours",
      icon: Zap,
      timeframe: "Within 24 hours",
    },
    {
      title: "Welcome Package",
      description:
        "You'll receive a welcome email with your policy documents and member ID",
      icon: Mail,
      timeframe: "Within 1 hour",
    },
    {
      title: "Digital Wallet",
      description:
        "Your policy NFT will be minted and sent to your connected wallet",
      icon: Shield,
      timeframe: "Within 2 hours",
    },
    {
      title: "Customer Support",
      description:
        "Our 24/7 support team is available for any questions or assistance",
      icon: Bell,
      timeframe: "Available now",
    },
  ];

  const CategoryIcon = getCategoryIcon(policyData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation Header */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 opacity-20 animate-ping"></div>
          </div>

          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your insurance policy has been purchased successfully. Welcome to
            BlockSecure!
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="glass-card rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step.status === "completed" || step.status === "current"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      step.status === "current"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : step.status === "completed"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-1 mx-4 bg-emerald-500" />
                  )}
                </div>
              ))}
            </div>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transaction Summary */}
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transaction Details */}
              <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-emerald-800 dark:text-emerald-200">
                      Payment Confirmed
                    </span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {transactionData.confirmations} confirmations
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Amount Paid:
                    </span>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {transactionData.amount}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {transactionData.usdAmount}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Payment Method:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {transactionData.paymentMethod}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Network Fee:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {transactionData.networkFee}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Transaction Date:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {new Date(transactionData.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Hash */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Transaction Hash
                </label>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300">
                    {formatAddress(transactionData.blockHash)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transactionData.blockHash)}
                    className="h-8 w-8 p-0"
                    aria-label="Copy transaction hash"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    aria-label="View on blockchain explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    Transaction hash copied to clipboard!
                  </p>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Transaction ID
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <code className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    {transactionData.id}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Information */}
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Policy Information
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

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Policy ID:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {policyData.id}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Coverage:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {policyData.coverage}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Duration:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {policyData.duration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Effective Date:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {new Date(policyData.effectiveDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Expiry Date:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {new Date(policyData.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Activation Pending
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="glass-card rounded-2xl mt-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-100 flex items-center">
              <ArrowRight className="w-6 h-6 mr-3 text-emerald-600 dark:text-emerald-400" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {step.description}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {step.timeframe}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/policyholder" className="flex-1">
            <Button className="w-full gradient-accent text-white floating-button">
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>

          <Button variant="outline" className="flex-1 floating-button">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>

          <Link href="/policyholder/coverage" className="flex-1">
            <Button variant="outline" className="w-full floating-button">
              <FileText className="w-4 h-4 mr-2" />
              View Policy Details
            </Button>
          </Link>
        </div>

        {/* Support Information */}
        <Card className="glass-card rounded-2xl mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Need Help?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Our customer support team is available 24/7 to assist you with
                any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="floating-button">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="floating-button">
                  <Bell className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
