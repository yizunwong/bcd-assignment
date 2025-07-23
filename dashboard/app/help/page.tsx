"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Wallet,
  DollarSign,
  Globe,
  FileQuestion,
  User,
  Users,
  Lock,
  RefreshCw,
  Smartphone,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const faqCategories = [
    { id: "general", name: "General Questions", icon: HelpCircle },
    { id: "account", name: "Account & Security", icon: User },
    { id: "policies", name: "Policies & Coverage", icon: Shield },
    { id: "claims", name: "Claims & Payouts", icon: DollarSign },
    { id: "payments", name: "Payments & Billing", icon: Wallet },
    { id: "technical", name: "Technical Support", icon: Smartphone },
  ];

  const faqs = {
    general: [
      {
        id: "what-is-blocksecure",
        question: "What is BlockSecure?",
        answer:
          "BlockSecure is a blockchain-powered insurance platform that provides transparent, efficient, and secure insurance coverage. We use smart contracts to automate policy management, claims processing, and payouts, resulting in faster service and lower costs compared to traditional insurance.",
      },
      {
        id: "how-blockchain-insurance-works",
        question: "How does blockchain insurance work?",
        answer:
          "Blockchain insurance uses smart contracts (self-executing code) to automate insurance processes. When you purchase a policy, a smart contract is created on the blockchain. This contract contains all policy terms and conditions. When a claim is filed, the smart contract automatically verifies the claim against predefined conditions and triggers instant payouts when approved, eliminating manual processing and reducing fraud.",
      },
      {
        id: "blockchain-vs-traditional",
        question:
          "How is blockchain insurance different from traditional insurance?",
        answer:
          "Blockchain insurance offers several advantages over traditional insurance: 1) Faster claims processing (minutes vs. weeks), 2) Lower premiums due to reduced overhead, 3) Complete transparency with all transactions recorded on the blockchain, 4) Automated payouts without manual intervention, 5) Immutable policy records that cannot be altered, and 6) Global accessibility 24/7.",
      },
      {
        id: "countries-available",
        question: "In which countries is BlockSecure available?",
        answer:
          "BlockSecure is currently available in over 120 countries worldwide. However, due to regulatory requirements, some features may be limited in certain jurisdictions. Please check our Regulatory Compliance page for specific information about your country or contact our support team for detailed availability information.",
      },
      {
        id: "get-started",
        question: "How do I get started with BlockSecure?",
        answer:
          "Getting started is simple: 1) Create an account on our platform, 2) Connect your crypto wallet, 3) Browse and select the insurance coverage you need, 4) Complete the application process, 5) Pay your premium using cryptocurrency or traditional payment methods, and 6) Receive your policy NFT in your wallet. The entire process takes just a few minutes.",
      },
    ],
    account: [
      {
        id: "create-account",
        question: "How do I create an account?",
        answer:
          "To create an account, click the \"Get Started\" button on our homepage. You'll need to provide your email address, create a password, and complete a brief verification process. Once verified, you'll be prompted to connect your crypto wallet to enable blockchain functionality.",
      },
      {
        id: "wallet-requirements",
        question: "What wallet do I need to use BlockSecure?",
        answer:
          "BlockSecure supports most major Ethereum-compatible wallets including MetaMask, WalletConnect, Coinbase Wallet, and Trust Wallet. Your wallet is used to sign transactions, receive policy NFTs, and receive claim payouts in cryptocurrency if desired.",
      },
      {
        id: "account-security",
        question: "How secure is my account?",
        answer:
          "We implement multiple layers of security including: 1) Two-factor authentication, 2) Advanced encryption for all sensitive data, 3) Secure wallet connection protocols, 4) Regular security audits, and 5) Fraud detection systems. We recommend enabling all security features and using a hardware wallet for maximum protection.",
      },
      {
        id: "delete-account",
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account at any time from your account settings. However, please note that if you have active policies, you'll need to cancel or transfer them first. Blockchain transactions related to your policies will remain on the blockchain as they cannot be deleted, but your personal information will be removed from our systems in accordance with our privacy policy.",
      },
      {
        id: "change-wallet",
        question: "Can I change my connected wallet?",
        answer:
          "Yes, you can change your connected wallet through your account settings. You'll need to go through a verification process to ensure security. Any policy NFTs in your old wallet will need to be transferred to your new wallet, which our support team can assist with.",
      },
    ],
    policies: [
      {
        id: "policy-types",
        question: "What types of insurance does BlockSecure offer?",
        answer:
          "BlockSecure offers a wide range of insurance products including: 1) Health insurance, 2) Travel insurance, 3) Agricultural/crop insurance, 4) Business insurance, 5) Property insurance, and 6) Specialty insurance products. Each category has multiple plans with different coverage levels to suit your specific needs.",
      },
      {
        id: "policy-customization",
        question: "Can I customize my insurance policy?",
        answer:
          "Yes, most of our insurance policies can be customized to meet your specific needs. During the application process, you can select coverage limits, deductibles, and additional coverage options. Our smart contracts are designed to be flexible while maintaining the security and transparency benefits of blockchain technology.",
      },
      {
        id: "policy-nft",
        question: "What is a policy NFT?",
        answer:
          "A policy NFT (Non-Fungible Token) is a digital representation of your insurance policy on the blockchain. It contains all the details of your coverage, terms, and conditions. The NFT serves as proof of insurance and gives you ownership of your policy. It's stored in your crypto wallet and can be transferred if needed.",
      },
      {
        id: "coverage-start",
        question: "When does my coverage start?",
        answer:
          "Your coverage begins immediately after your premium payment is confirmed on the blockchain. Unlike traditional insurance that may take days to activate, our smart contracts automatically initiate your coverage as soon as the transaction is verified, typically within minutes.",
      },
      {
        id: "policy-renewal",
        question: "How do policy renewals work?",
        answer:
          "Policy renewals can be set to automatic or manual mode. With automatic renewal, your policy will be renewed using your preferred payment method before expiration. You'll receive notifications 30, 15, and 5 days before renewal. For manual renewal, you'll need to confirm renewal before your policy expires. All renewal terms and any premium changes will be clearly communicated in advance.",
      },
    ],
    claims: [
      {
        id: "file-claim",
        question: "How do I file a claim?",
        answer:
          'Filing a claim is simple: 1) Log into your account, 2) Navigate to the "Claims" section, 3) Select the policy you\'re claiming against, 4) Complete the claim form with relevant details, 5) Upload any required documentation, and 6) Submit your claim. For certain policy types with oracle integration (like weather-based crop insurance), claims may be automatically triggered without manual filing.',
      },
      {
        id: "claim-processing-time",
        question: "How long does claim processing take?",
        answer:
          "Most claims are processed within minutes to hours, compared to days or weeks with traditional insurance. Simple claims with clear documentation may be approved and paid out instantly. More complex claims requiring additional verification typically take 24-48 hours. Our blockchain-based system eliminates unnecessary administrative delays.",
      },
      {
        id: "claim-documentation",
        question: "What documentation do I need for a claim?",
        answer:
          "Required documentation varies by policy type and claim nature. Common documents include: 1) Incident reports, 2) Photos or videos of damage, 3) Medical records for health claims, 4) Receipts or invoices, and 5) Official reports (police, weather, etc.). All documents are securely stored using encrypted, distributed storage systems.",
      },
      {
        id: "claim-payout-methods",
        question: "How are claim payouts made?",
        answer:
          "You can choose to receive claim payouts in cryptocurrency directly to your wallet or in fiat currency to your bank account. Crypto payouts are typically processed within minutes, while bank transfers may take 1-3 business days depending on your bank. There are no fees for cryptocurrency payouts, but bank transfers may incur standard banking fees.",
      },
      {
        id: "claim-rejection",
        question: "What if my claim is rejected?",
        answer:
          "If your claim is rejected, you'll receive a detailed explanation with the specific reasons. You can appeal the decision through our Claims Appeal process, which includes review by both AI systems and human specialists. The blockchain provides complete transparency into the decision-making process, ensuring fair treatment.",
      },
    ],
    payments: [
      {
        id: "payment-methods",
        question: "What payment methods are accepted?",
        answer:
          "We accept multiple payment methods including: 1) Cryptocurrency (ETH, USDC, DAI, and others), 2) Credit/debit cards, 3) Bank transfers, and 4) PayPal. Cryptocurrency payments offer the fastest processing and lowest fees, but all methods are fully supported.",
      },
      {
        id: "premium-frequency",
        question: "How often do I pay premiums?",
        answer:
          "You can choose from several premium payment frequencies: 1) Monthly (standard), 2) Quarterly (5% discount), 3) Semi-annually (7% discount), or 4) Annually (10% discount). You can change your payment frequency at renewal periods. Automatic payments can be set up for convenience.",
      },
      {
        id: "missed-payment",
        question: "What happens if I miss a payment?",
        answer:
          "If you miss a payment, you'll receive immediate notifications. There's a grace period of 7 days during which your coverage remains active. After the grace period, your policy will be suspended until payment is made. Unlike traditional insurance, there are no late fees or penalties, and your policy can be instantly reactivated upon payment.",
      },
      {
        id: "refund-policy",
        question: "What is your refund policy?",
        answer:
          "We offer a 14-day money-back guarantee on most policies if no claims have been made. If you cancel after this period, you'll receive a pro-rated refund for the unused portion of your premium. Refunds are processed in the same form as your original payment, typically within 1-3 business days.",
      },
      {
        id: "crypto-volatility",
        question: "How do you handle cryptocurrency price volatility?",
        answer:
          "To protect against cryptocurrency price volatility, premium amounts are fixed in USD value at the time of purchase or renewal. If you pay in cryptocurrency, the exact amount will be calculated using real-time exchange rates at the moment of transaction. For claim payouts in cryptocurrency, you can choose to lock in the exchange rate at the time of approval or receive the equivalent value at the time of payout.",
      },
    ],
    technical: [
      {
        id: "supported-devices",
        question: "What devices and browsers are supported?",
        answer:
          "Our platform is compatible with all modern devices including desktops, laptops, tablets, and smartphones. We support the latest versions of Chrome, Firefox, Safari, and Edge browsers. For mobile access, we offer native apps for iOS and Android with full functionality, including wallet integration.",
      },
      {
        id: "wallet-connection-issues",
        question: "I'm having trouble connecting my wallet. What should I do?",
        answer:
          "If you're experiencing wallet connection issues: 1) Ensure your wallet is unlocked, 2) Check that you're using a supported wallet, 3) Clear your browser cache, 4) Disable any ad-blockers or privacy extensions that might interfere with wallet connections, 5) Try using a different browser, or 6) Contact our technical support team for assistance.",
      },
      {
        id: "transaction-stuck",
        question: "My transaction is stuck or pending. What can I do?",
        answer:
          "For stuck transactions: 1) Check the blockchain explorer to verify the transaction status, 2) If the transaction is pending due to low gas fees, you may need to increase the gas price in your wallet, 3) If the transaction failed, you can try again, 4) For persistent issues, contact our support team with your transaction hash for assistance.",
      },
      {
        id: "data-export",
        question: "Can I export my policy and claim data?",
        answer:
          "Yes, you can export all your data in multiple formats including PDF, CSV, and JSON. From your account dashboard, navigate to Settings > Data Export to download your policy details, claim history, payment records, and other account information. This feature is useful for record-keeping and tax purposes.",
      },
      {
        id: "api-integration",
        question: "Do you offer API integration for businesses?",
        answer:
          "Yes, we provide a comprehensive API for business integrations. Our RESTful API allows partners to integrate insurance offerings into their platforms, manage policies programmatically, and automate claims processing. Full documentation, SDKs for major programming languages, and sandbox testing environments are available for developers.",
      },
    ],
  };

  const supportHours = [
    { day: "Monday - Friday", hours: "24 hours (Live Support)" },
    { day: "Saturday", hours: "8:00 AM - 8:00 PM UTC" },
    { day: "Sunday", hours: "10:00 AM - 6:00 PM UTC" },
  ];

  const troubleshootingGuides = [
    {
      title: "Wallet Connection Issues",
      icon: Wallet,
      steps: [
        "Ensure your wallet is unlocked and on the correct network (Ethereum Mainnet)",
        "Clear browser cache and cookies",
        "Disable browser extensions that might interfere",
        "Try using a different supported browser",
        "Update your wallet software to the latest version",
      ],
    },
    {
      title: "Payment Problems",
      icon: DollarSign,
      steps: [
        "Verify you have sufficient funds in your wallet or payment method",
        "Check for any transaction limits on your payment method",
        "Ensure your payment details are entered correctly",
        "For crypto payments, check gas prices and adjust if necessary",
        "Contact your bank if card payments are being declined",
      ],
    },
    {
      title: "Claim Submission Errors",
      icon: FileText,
      steps: [
        "Ensure all required fields are completed in the claim form",
        "Check that uploaded documents meet size and format requirements",
        "Verify your policy is active and covers the claimed incident",
        "Try using a different browser or device if form submission fails",
        "Clear your browser cache and try again",
      ],
    },
    {
      title: "Mobile App Troubleshooting",
      icon: Smartphone,
      steps: [
        "Update the app to the latest version",
        "Force close and restart the app",
        "Check your internet connection",
        "Clear the app cache in your device settings",
        "Uninstall and reinstall the app if problems persist",
      ],
    },
  ];

  const selfHelpResources = [
    {
      title: "Knowledge Base",
      description:
        "Comprehensive articles and guides on all aspects of our platform",
      icon: FileQuestion,
      link: "/knowledge-base",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step visual guides for common tasks and features",
      icon: FileText,
      link: "/tutorials",
    },
    {
      title: "Community Forum",
      description:
        "Connect with other users to share experiences and solutions",
      icon: Users,
      link: "/community",
    },
    {
      title: "Glossary",
      description: "Definitions of blockchain insurance terms and concepts",
      icon: HelpCircle,
      link: "/glossary",
    },
  ];

  const toggleQuestion = (questionId: string) => {
    if (expandedQuestions.includes(questionId)) {
      setExpandedQuestions(expandedQuestions.filter((id) => id !== questionId));
    } else {
      setExpandedQuestions([...expandedQuestions, questionId]);
    }
  };

  const filteredFaqs = searchTerm
    ? Object.values(faqs)
        .flat()
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : faqs[activeCategory as keyof typeof faqs];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-slate-200 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Help Center
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto">
            Find answers to your questions and get the support you need
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#contact">
              <Button variant="outline" className="floating-button">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="#guides">
              <Button variant="outline" className="floating-button">
                <FileText className="w-4 h-4 mr-2" />
                Troubleshooting Guides
              </Button>
            </Link>
            <Link href="#resources">
              <Button variant="outline" className="floating-button">
                <HelpCircle className="w-4 h-4 mr-2" />
                Self-Help Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Find quick answers to common questions about our platform
            </p>
          </div>

          {!searchTerm && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}

          {searchTerm && filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                No results found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We couldn't find any answers matching "{searchTerm}"
              </p>
              <Button
                onClick={() => setSearchTerm("")}
                className="gradient-accent text-white floating-button"
              >
                Clear Search
              </Button>
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-4">
            {searchTerm && filteredFaqs.length > 0 && (
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Showing {filteredFaqs.length} results for "{searchTerm}"
              </p>
            )}

            {filteredFaqs.map((faq) => (
              <Card
                key={faq.id}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleQuestion(faq.id)}
                >
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {faq.question}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-4 flex-shrink-0"
                  >
                    {expandedQuestions.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {expandedQuestions.includes(faq.id) && (
                  <CardContent className="pt-0 pb-6 px-6 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Contact Support
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our support team is available to help you with any questions or
              issues
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                    Contact Methods
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                          Live Chat
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Fastest response time
                        </p>
                        <Button className="gradient-accent text-white floating-button">
                          Start Chat
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                          Email Support
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Response within 24 hours
                        </p>
                        <a
                          href="mailto:support@blocksecure.com"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          support@blocksecure.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                          Phone Support
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          For urgent matters
                        </p>
                        <a
                          href="tel:+18005551234"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          +1 (800) 555-1234
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                    Support Hours
                  </h3>

                  <div className="space-y-4">
                    {supportHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {schedule.day}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                      <Globe className="w-4 h-4" />
                      <span>All times in UTC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass-card rounded-2xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                    Send Us a Message
                  </h3>

                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Your Name
                        </label>
                        <Input
                          placeholder="Enter your full name"
                          className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Subject
                      </label>
                      <Input
                        placeholder="What is your message about?"
                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Message
                      </label>
                      <Textarea
                        placeholder="Please describe your issue or question in detail..."
                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 min-h-[150px]"
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input type="checkbox" id="consent" className="mt-1" />
                      <label
                        htmlFor="consent"
                        className="text-sm text-slate-600 dark:text-slate-400"
                      >
                        I agree to the processing of my personal data in
                        accordance with the{" "}
                        <a
                          href="/privacy-policy"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <Button className="gradient-accent text-white floating-button w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting Guides */}
      <section
        id="guides"
        className="py-20 px-4 bg-white/50 dark:bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Troubleshooting Guides
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Step-by-step solutions to common issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {troubleshootingGuides.map((guide, index) => (
              <Card key={index} className="glass-card rounded-2xl card-hover">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <guide.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                      {guide.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {guide.steps.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5">
                          {stepIndex + 1}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Help Resources */}
      <section id="resources" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Self-Help Resources
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Explore our comprehensive knowledge base and learning materials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {selfHelpResources.map((resource, index) => (
              <Link key={index} href={resource.link}>
                <Card className="glass-card rounded-2xl h-full card-hover">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                      <resource.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">
                      {resource.description}
                    </p>
                    <Button
                      variant="outline"
                      className="floating-button w-full"
                    >
                      Explore
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            Still Have Questions?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Our support team is ready to assist you with any questions or
            concerns
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-accent text-white floating-button px-8 py-4"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with Support
            </Button>
            <Link href="mailto:support@blocksecure.com">
              <Button
                variant="outline"
                size="lg"
                className="floating-button px-8 py-4"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
