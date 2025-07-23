"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  Shield,
  Zap,
  Eye,
  DollarSign,
  Globe,
  Lock,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Smartphone,
  FileText,
  BarChart3,
  Target,
  Coins,
  RefreshCw,
  AlertTriangle,
  Building,
  Heart,
  Plane,
} from "lucide-react";
import Link from "next/link";

export default function BenefitsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const keyBenefits = [
    {
      id: "instant-payouts",
      category: "speed",
      icon: Zap,
      title: "Instant Payouts",
      description:
        "Smart contracts enable automatic claim processing and instant payments within minutes, not weeks",
      gradient: "from-yellow-500 to-orange-500",
      stats: "95% faster than traditional insurance",
      details: [
        "Automated claim verification using AI",
        "Smart contract execution for approved claims",
        "Direct wallet transfers in cryptocurrency",
        "No waiting for bank processing times",
        "Real-time transaction tracking",
      ],
    },
    {
      id: "transparency",
      category: "trust",
      icon: Eye,
      title: "Complete Transparency",
      description:
        "Every transaction recorded on blockchain for full audit trail and unprecedented transparency",
      gradient: "from-blue-500 to-cyan-500",
      stats: "100% transparent operations",
      details: [
        "All transactions visible on blockchain",
        "Immutable claim processing records",
        "Public smart contract code",
        "Real-time policy status updates",
        "Open-source verification tools",
      ],
    },
    {
      id: "lower-costs",
      category: "financial",
      icon: DollarSign,
      title: "Lower Costs",
      description:
        "Eliminate intermediaries and reduce premiums by up to 40% compared to traditional insurance",
      gradient: "from-emerald-500 to-green-500",
      stats: "Up to 40% cost savings",
      details: [
        "No middleman fees or commissions",
        "Reduced administrative overhead",
        "Automated underwriting processes",
        "Efficient claims processing",
        "Competitive premium pricing",
      ],
    },
    {
      id: "global-coverage",
      category: "accessibility",
      icon: Globe,
      title: "Global Coverage",
      description:
        "Decentralized network provides worldwide coverage with 24/7 accessibility from anywhere",
      gradient: "from-purple-500 to-indigo-500",
      stats: "120+ countries supported",
      details: [
        "No geographic restrictions",
        "24/7 global accessibility",
        "Multi-currency support",
        "International claim processing",
        "Cross-border policy transfers",
      ],
    },
    {
      id: "security",
      category: "trust",
      icon: Lock,
      title: "Enhanced Security",
      description:
        "Military-grade encryption and blockchain immutability ensure your data and funds are secure",
      gradient: "from-red-500 to-pink-500",
      stats: "256-bit encryption standard",
      details: [
        "Blockchain immutability",
        "Multi-signature security",
        "Regular security audits",
        "Decentralized data storage",
        "Zero single points of failure",
      ],
    },
    {
      id: "automation",
      category: "speed",
      icon: RefreshCw,
      title: "Smart Automation",
      description:
        "AI-powered automation handles everything from underwriting to claims processing",
      gradient: "from-teal-500 to-cyan-500",
      stats: "90% automated processes",
      details: [
        "Automated policy issuance",
        "AI-driven risk assessment",
        "Smart contract execution",
        "Automatic premium payments",
        "Predictive claim analysis",
      ],
    },
  ];

  const comparisonData = [
    {
      feature: "Claim Processing Time",
      traditional: "2-6 weeks",
      blockchain: "2-4 minutes",
      improvement: "95% faster",
    },
    {
      feature: "Premium Costs",
      traditional: "$1,200/year",
      blockchain: "$720/year",
      improvement: "40% cheaper",
    },
    {
      feature: "Transparency",
      traditional: "Limited visibility",
      blockchain: "Full transparency",
      improvement: "100% visible",
    },
    {
      feature: "Global Access",
      traditional: "Regional only",
      blockchain: "24/7 worldwide",
      improvement: "Always available",
    },
    {
      feature: "Documentation",
      traditional: "Paper-based",
      blockchain: "Digital & secure",
      improvement: "Instant access",
    },
    {
      feature: "Fraud Prevention",
      traditional: "Manual review",
      blockchain: "AI + Blockchain",
      improvement: "99.9% accuracy",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Nomad",
      company: "Remote Tech Consultant",
      content:
        "BlockSecure saved my European trip when my flight was cancelled. The instant payout covered my expenses immediately, unlike traditional insurance that would have taken weeks.",
      rating: 5,
      avatar: "👩‍💻",
      benefit: "Instant Payouts",
      savings: "$2,400 claim paid in 3 minutes",
    },
    {
      name: "Michael Rodriguez",
      role: "Farm Owner",
      company: "Rodriguez Family Farms",
      content:
        "The weather oracle system is revolutionary. When the frost hit our crops, the payout was automatic based on real weather data. No paperwork, no disputes, just instant protection.",
      rating: 5,
      avatar: "👨‍🌾",
      benefit: "Automated Claims",
      savings: "$45,000 automatic payout",
    },
    {
      name: "Dr. Emily Watson",
      role: "Healthcare Professional",
      company: "City Medical Center",
      content:
        "As a doctor, I appreciate the transparency of blockchain-based health insurance. Every claim is processed fairly and quickly, with complete visibility into the process.",
      rating: 5,
      avatar: "👩‍⚕️",
      benefit: "Transparency",
      savings: "60% faster claim processing",
    },
    {
      name: "James Liu",
      role: "Business Owner",
      company: "TechStart Solutions",
      content:
        "We switched our company insurance to BlockSecure and saved 35% on premiums while getting better coverage. The smart contracts eliminate the bureaucracy.",
      rating: 5,
      avatar: "👨‍💼",
      benefit: "Cost Savings",
      savings: "35% reduction in premiums",
    },
    {
      name: "Maria Gonzalez",
      role: "Travel Blogger",
      company: "Wanderlust Adventures",
      content:
        "Having global coverage that works instantly anywhere in the world is a game-changer for frequent travelers. No more worrying about coverage gaps.",
      rating: 5,
      avatar: "✈️",
      benefit: "Global Coverage",
      savings: "Worldwide protection",
    },
    {
      name: "David Kim",
      role: "Cryptocurrency Investor",
      company: "Crypto Capital",
      content:
        "The security and immutability of blockchain insurance gives me peace of mind. My policies are stored as NFTs and can never be lost or tampered with.",
      rating: 5,
      avatar: "💎",
      benefit: "Security",
      savings: "Unbreakable protection",
    },
  ];

  const statisticsData = [
    {
      category: "Performance Metrics",
      stats: [
        {
          label: "Average Claim Processing Time",
          value: "3.2 minutes",
          improvement: "95% faster",
        },
        {
          label: "Customer Satisfaction Rate",
          value: "98.5%",
          improvement: "15% higher",
        },
        {
          label: "Cost Reduction vs Traditional",
          value: "40%",
          improvement: "Significant savings",
        },
        {
          label: "Global Availability",
          value: "24/7",
          improvement: "Always accessible",
        },
      ],
    },
    {
      category: "Security & Trust",
      stats: [
        { label: "Security Incidents", value: "0", improvement: "100% secure" },
        {
          label: "Fraud Detection Accuracy",
          value: "99.9%",
          improvement: "AI-powered",
        },
        {
          label: "Data Transparency",
          value: "100%",
          improvement: "Fully visible",
        },
        {
          label: "Smart Contract Audits",
          value: "5+",
          improvement: "Verified secure",
        },
      ],
    },
    {
      category: "Market Impact",
      stats: [
        {
          label: "Total Value Protected",
          value: "$125M+",
          improvement: "Growing rapidly",
        },
        {
          label: "Policies Issued",
          value: "50K+",
          improvement: "Trusted by thousands",
        },
        {
          label: "Claims Processed",
          value: "15K+",
          improvement: "Proven track record",
        },
        {
          label: "Countries Served",
          value: "120+",
          improvement: "Global reach",
        },
      ],
    },
  ];

  const uniqueSellingPoints = [
    {
      title: "No Paperwork Required",
      description:
        "Digital-first approach eliminates traditional paperwork and bureaucracy",
      icon: FileText,
      benefit: "Save hours of administrative work",
    },
    {
      title: "Programmable Policies",
      description:
        "Smart contracts enable customizable, programmable insurance policies",
      icon: Target,
      benefit: "Tailored coverage for your specific needs",
    },
    {
      title: "Decentralized Governance",
      description:
        "Community-driven decisions ensure fair and transparent operations",
      icon: Users,
      benefit: "Democratic control over platform development",
    },
    {
      title: "Interoperable Coverage",
      description:
        "Policies work across different platforms and blockchain networks",
      icon: RefreshCw,
      benefit: "Future-proof insurance solutions",
    },
    {
      title: "Real-time Analytics",
      description:
        "Advanced analytics provide insights into your coverage and claims",
      icon: BarChart3,
      benefit: "Data-driven insurance decisions",
    },
    {
      title: "Mobile-First Design",
      description: "Optimized for mobile devices with native app functionality",
      icon: Smartphone,
      benefit: "Manage insurance on the go",
    },
  ];

  const categories = [
    { id: "all", label: "All Benefits" },
    { id: "speed", label: "Speed & Efficiency" },
    { id: "financial", label: "Financial Benefits" },
    { id: "trust", label: "Trust & Security" },
    { id: "accessibility", label: "Accessibility" },
  ];

  const filteredBenefits =
    selectedCategory === "all"
      ? keyBenefits
      : keyBenefits.filter((benefit) => benefit.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-slate-200 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Why Choose Blockchain Insurance?
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto">
            Discover the revolutionary advantages that make blockchain insurance
            superior to traditional coverage in every way that matters.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                95%
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Faster Processing
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                40%
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Lower Costs
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                100%
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Transparent
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                24/7
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Global Access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Categories */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Revolutionary Benefits
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Experience advantages that traditional insurance simply cannot
              match
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBenefits.map((benefit) => (
              <Card
                key={benefit.id}
                className="glass-card rounded-2xl card-hover"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {benefit.description}
                  </p>

                  <Badge className="mb-6 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {benefit.stats}
                  </Badge>

                  <div className="space-y-2">
                    {benefit.details.map((detail, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {detail}
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

      {/* Comparison Table */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Traditional vs Blockchain Insurance
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              See the dramatic differences that make blockchain insurance the
              clear choice
            </p>
          </div>

          <Card className="glass-card rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="text-left p-6 text-slate-700 dark:text-slate-300 font-semibold">
                        Feature
                      </th>
                      <th className="text-center p-6 text-slate-700 dark:text-slate-300 font-semibold">
                        Traditional Insurance
                      </th>
                      <th className="text-center p-6 text-emerald-700 dark:text-emerald-400 font-semibold">
                        BlockSecure
                      </th>
                      <th className="text-center p-6 text-slate-700 dark:text-slate-300 font-semibold">
                        Improvement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <td className="p-6 font-medium text-slate-800 dark:text-slate-100">
                          {row.feature}
                        </td>
                        <td className="p-6 text-center text-slate-600 dark:text-slate-400">
                          {row.traditional}
                        </td>
                        <td className="p-6 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                          {row.blockchain}
                        </td>
                        <td className="p-6 text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {row.improvement}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Real Stories, Real Benefits
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Hear from customers who have experienced the BlockSecure
              difference firsthand
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card rounded-2xl card-hover">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {testimonial.name}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-slate-500 dark:text-slate-500 text-xs">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex justify-between items-center">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {testimonial.benefit}
                      </Badge>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {testimonial.savings}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Proven Results
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Data-driven evidence of our superior performance and customer
              satisfaction
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {statisticsData.map((category, index) => (
              <Card key={index} className="glass-card rounded-2xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                    {category.category}
                  </h3>
                  <div className="space-y-6">
                    {category.stats.map((stat, statIndex) => (
                      <div key={statIndex}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {stat.label}
                          </span>
                          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {stat.value}
                          </span>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                          {stat.improvement}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Selling Points */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Unique Advantages
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Features and capabilities that set us apart from any other
              insurance solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueSellingPoints.map((point, index) => (
              <Card key={index} className="glass-card rounded-2xl card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {point.description}
                  </p>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {point.benefit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            Experience the Benefits Today
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join the insurance revolution and discover why thousands choose
            BlockSecure for superior protection
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
            <Link href="/plans">
              <Button
                variant="outline"
                size="lg"
                className="floating-button px-8 py-4"
              >
                Compare Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
