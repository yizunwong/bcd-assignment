"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  Shield,
  Wallet,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Zap,
  Eye,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  Bell,
  Download,
  Upload,
  Search,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1);

  const mainSteps = [
    {
      id: 1,
      title: "Connect Your Wallet",
      subtitle: "Secure blockchain connection",
      icon: Wallet,
      gradient: "from-blue-500 to-cyan-500",
      timeframe: "30 seconds",
      description:
        "Connect your crypto wallet to access our decentralized insurance platform. We support all major wallets including MetaMask, WalletConnect, and Coinbase Wallet.",
      requirements: [
        "Compatible crypto wallet (MetaMask, WalletConnect, etc.)",
        "Sufficient ETH for gas fees",
        "Valid email address for notifications",
      ],
      subSteps: [
        'Click "Connect Wallet" button',
        "Select your preferred wallet provider",
        "Approve the connection request",
        "Verify your wallet address",
        "Complete email verification",
      ],
      tips: [
        "Ensure you have enough ETH for transaction fees",
        "Use a hardware wallet for maximum security",
        "Keep your seed phrase secure and private",
      ],
    },
    {
      id: 2,
      title: "Select Your Coverage",
      subtitle: "Choose the perfect plan",
      icon: ClipboardList,
      gradient: "from-emerald-500 to-teal-500",
      timeframe: "5 minutes",
      description:
        "Browse our comprehensive insurance options and customize your coverage based on your specific needs. Our AI-powered recommendation engine helps you find the optimal protection.",
      requirements: [
        "Basic personal information",
        "Coverage amount preferences",
        "Risk assessment questionnaire",
      ],
      subSteps: [
        "Browse available insurance categories",
        "Compare coverage options and pricing",
        "Complete risk assessment form",
        "Customize your coverage limits",
        "Review policy terms and conditions",
      ],
      tips: [
        "Use our comparison tool to find the best value",
        "Consider bundling multiple policies for discounts",
        "Read policy terms carefully before proceeding",
      ],
    },
    {
      id: 3,
      title: "Instant Protection",
      subtitle: "Immediate coverage activation",
      icon: ShieldCheck,
      gradient: "from-purple-500 to-indigo-500",
      timeframe: "Immediate",
      description:
        "Once payment is confirmed, your policy is instantly activated on the blockchain. Smart contracts ensure transparent, automated claim processing and instant payouts.",
      requirements: [
        "Completed payment transaction",
        "Blockchain confirmation",
        "Policy NFT minting",
      ],
      subSteps: [
        "Confirm payment transaction",
        "Wait for blockchain confirmation",
        "Receive policy NFT in your wallet",
        "Access your coverage dashboard",
        "Download policy documents",
      ],
      tips: [
        "Save your policy NFT securely",
        "Set up notifications for important updates",
        "Familiarize yourself with the claims process",
      ],
    },
  ];

  const detailedProcess = [
    {
      phase: "Registration & Setup",
      duration: "2-3 minutes",
      steps: [
        "Create account with email verification",
        "Connect and verify crypto wallet",
        "Complete basic KYC requirements",
        "Set up notification preferences",
      ],
    },
    {
      phase: "Policy Selection",
      duration: "5-10 minutes",
      steps: [
        "Browse insurance categories",
        "Use AI recommendation engine",
        "Compare coverage options",
        "Customize policy parameters",
        "Review terms and pricing",
      ],
    },
    {
      phase: "Underwriting & Approval",
      duration: "1-5 minutes",
      steps: [
        "Automated risk assessment",
        "Smart contract validation",
        "Premium calculation",
        "Instant approval notification",
      ],
    },
    {
      phase: "Payment & Activation",
      duration: "1-2 minutes",
      steps: [
        "Secure payment processing",
        "Blockchain transaction confirmation",
        "Policy NFT minting",
        "Coverage activation",
        "Dashboard access granted",
      ],
    },
    {
      phase: "Ongoing Management",
      duration: "Continuous",
      steps: [
        "Real-time policy monitoring",
        "Automated premium payments",
        "Claim submission portal",
        "Instant payout processing",
        "Policy renewal notifications",
      ],
    },
  ];

  const claimsProcess = [
    {
      step: 1,
      title: "Submit Claim",
      description: "File your claim through our mobile app or web portal",
      icon: Upload,
      timeframe: "2 minutes",
    },
    {
      step: 2,
      title: "Smart Contract Processing",
      description:
        "Blockchain smart contracts automatically process approved claims",
      icon: Settings,
      timeframe: "1 minute",
    },
    {
      step: 3,
      title: "Instant Payout",
      description:
        "Receive your payout directly to your wallet in cryptocurrency",
      icon: Zap,
      timeframe: "Immediate",
    },
  ];

  const prerequisites = [
    {
      category: "Technical Requirements",
      items: [
        "Modern web browser (Chrome, Firefox, Safari, Edge)",
        "Stable internet connection",
        "Compatible crypto wallet",
        "Basic understanding of cryptocurrency",
      ],
    },
    {
      category: "Financial Requirements",
      items: [
        "Sufficient cryptocurrency for premiums",
        "ETH for blockchain transaction fees",
        "Valid payment method for fiat conversion",
        "Minimum coverage amount varies by policy type",
      ],
    },
    {
      category: "Documentation",
      items: [
        "Valid government-issued ID",
        "Proof of address (utility bill, bank statement)",
        "Income verification (for certain policies)",
        "Medical records (for health insurance)",
      ],
    },
    {
      category: "Eligibility Criteria",
      items: [
        "Age requirements (18+ for most policies)",
        "Geographic restrictions may apply",
        "No active claims with other insurers",
        "Pass automated risk assessment",
      ],
    },
  ];

  const selectedStep = mainSteps.find((step) => step.id === activeStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <ClipboardList className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-slate-200 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            How BlockSecure Works
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto">
            Get comprehensive insurance coverage in just 3 simple steps. Our
            blockchain-powered platform makes insurance faster, more
            transparent, and more affordable than ever before.
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>5 minutes to coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Instant activation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Automated payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Three Simple Steps to Protection
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our streamlined process gets you covered faster than traditional
              insurance
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
              {mainSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeStep === step.id
                      ? "bg-white dark:bg-slate-700 shadow-lg text-slate-800 dark:text-slate-100"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${step.gradient} flex items-center justify-center`}
                  >
                    <step.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Step Details */}
          {selectedStep && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedStep.gradient} flex items-center justify-center`}
                  >
                    <selectedStep.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                      {selectedStep.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedStep.subtitle}
                    </p>
                    <Badge className="mt-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedStep.timeframe}
                    </Badge>
                  </div>
                </div>

                <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
                  {selectedStep.description}
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {selectedStep.requirements.map((req, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                      Pro Tips
                    </h4>
                    <ul className="space-y-2">
                      {selectedStep.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                  Step-by-Step Process
                </h4>
                <div className="space-y-4">
                  {selectedStep.subSteps.map((subStep, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        {index + 1}
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">
                        {subStep}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link href="/auth/register">
                    <Button className="gradient-accent text-white floating-button px-8 py-3">
                      Start Step {selectedStep.id}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Process Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Complete Process Timeline
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Detailed breakdown of every phase from registration to ongoing
              coverage management
            </p>
          </div>

          <div className="space-y-8">
            {detailedProcess.map((phase, index) => (
              <Card key={index} className="glass-card rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                        {phase.phase}
                      </h3>
                      <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {phase.duration}
                      </Badge>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {phase.steps.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="flex items-center space-x-3 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Claims Process */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Lightning-Fast Claims Process
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the future of insurance claims with automated
              processing and instant payouts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {claimsProcess.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  {index < claimsProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-4 w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {step.description}
                </p>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {step.timeframe}
                </Badge>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Total claims processing time:{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Under 3 minutes
              </span>
            </p>
            <Link href="/auth/register">
              <Button className="gradient-accent text-white floating-button px-8 py-3">
                Experience Fast Claims
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              What You Need to Get Started
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Make sure you have everything ready for a smooth onboarding
              experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {prerequisites.map((category, index) => (
              <Card key={index} className="glass-card rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join thousands who have already discovered the benefits of
            blockchain insurance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="gradient-accent text-white floating-button px-8 py-4"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/benefits">
              <Button
                variant="outline"
                size="lg"
                className="floating-button px-8 py-4"
              >
                Learn About Benefits
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
