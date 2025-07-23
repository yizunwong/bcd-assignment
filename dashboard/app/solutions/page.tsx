"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  Shield,
  Heart,
  Plane,
  Sprout,
  Building,
  Zap,
  Globe,
  Lock,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Smartphone,
  Eye,
  Award,
  Target,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const [selectedSolution, setSelectedSolution] = useState("health");

  const solutions = [
    {
      id: "health",
      name: "Health Insurance",
      icon: Heart,
      gradient: "from-red-500 to-pink-500",
      description:
        "Comprehensive healthcare coverage with global network access and instant claim processing",
      features: [
        "Emergency medical care worldwide",
        "Prescription drug coverage",
        "Mental health support",
        "Dental and vision care",
        "Telemedicine consultations",
        "Preventive care programs",
      ],
      capabilities: [
        "AI-powered claim verification",
        "Real-time health monitoring integration",
        "Smart contract automation",
        "Global provider network",
        "Instant payout processing",
        "Blockchain medical records",
      ],
      useCases: [
        "Individual health coverage",
        "Family protection plans",
        "Corporate employee benefits",
        "Travel medical insurance",
        "Chronic condition management",
        "Emergency medical evacuation",
      ],
      stats: {
        coverage: "Up to $500K",
        claims: "15K+ processed",
        satisfaction: "98.5%",
        avgPayout: "24 hours",
      },
    },
    {
      id: "travel",
      name: "Travel Insurance",
      icon: Plane,
      gradient: "from-blue-500 to-cyan-500",
      description:
        "Worldwide travel protection with automated claim processing and 24/7 emergency assistance",
      features: [
        "Trip cancellation coverage",
        "Medical emergency abroad",
        "Lost luggage protection",
        "Flight delay compensation",
        "Emergency evacuation",
        "Adventure sports coverage",
      ],
      capabilities: [
        "Real-time flight tracking",
        "Automated delay compensation",
        "GPS-based emergency response",
        "Multi-currency support",
        "Instant policy activation",
        "Digital travel documents",
      ],
      useCases: [
        "Business travel protection",
        "Vacation insurance",
        "Adventure travel coverage",
        "Digital nomad plans",
        "Group travel policies",
        "Cruise insurance",
      ],
      stats: {
        coverage: "Up to $200K",
        claims: "8K+ processed",
        satisfaction: "97.2%",
        avgPayout: "12 hours",
      },
    },
    {
      id: "agriculture",
      name: "Agricultural Insurance",
      icon: Sprout,
      gradient: "from-green-500 to-emerald-500",
      description:
        "Smart contract-based crop protection using IoT sensors and weather oracles for automated payouts",
      features: [
        "Weather-based protection",
        "Yield guarantee coverage",
        "Livestock protection",
        "Equipment insurance",
        "Market price protection",
        "Organic certification coverage",
      ],
      capabilities: [
        "IoT sensor integration",
        "Satellite monitoring",
        "Weather oracle data",
        "Automated claim triggers",
        "Real-time crop assessment",
        "Predictive analytics",
      ],
      useCases: [
        "Crop yield protection",
        "Livestock mortality coverage",
        "Weather damage claims",
        "Equipment breakdown",
        "Market volatility protection",
        "Organic farm certification",
      ],
      stats: {
        coverage: "Up to $2M",
        claims: "5K+ processed",
        satisfaction: "96.8%",
        avgPayout: "6 hours",
      },
    },
  ];

  const caseStudies = [
    {
      title: "Global Health Network Saves $2M in Processing Costs",
      company: "MediCorp International",
      industry: "Healthcare",
      challenge:
        "Manual claim processing taking 30+ days with high administrative costs",
      solution:
        "Implemented blockchain-based health insurance with smart contract automation",
      results: [
        "95% reduction in processing time",
        "$2M annual savings in administrative costs",
        "40% increase in customer satisfaction",
        "99.8% claim accuracy rate",
      ],
      icon: Heart,
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Farm Cooperative Protects 10,000 Acres with Automated Payouts",
      company: "Green Valley Cooperative",
      industry: "Agriculture",
      challenge:
        "Weather-related crop losses with delayed insurance payouts affecting cash flow",
      solution:
        "Weather oracle-based crop insurance with instant automated payouts",
      results: [
        "Instant payouts within 6 hours of weather events",
        "100% transparent claim process",
        "25% reduction in premium costs",
        "$5M in protected crop value",
      ],
      icon: Sprout,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Travel Agency Reduces Claim Processing by 90%",
      company: "Wanderlust Travel",
      industry: "Travel & Tourism",
      challenge:
        "Complex international travel claims with multiple currencies and regulations",
      solution:
        "Blockchain travel insurance with multi-currency support and automated processing",
      results: [
        "90% reduction in claim processing time",
        "Support for 50+ currencies",
        "24/7 automated customer service",
        "98% customer satisfaction rate",
      ],
      icon: Plane,
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  const technicalSpecs = [
    {
      category: "Blockchain Infrastructure",
      specs: [
        "Ethereum mainnet deployment",
        "Layer 2 scaling solutions",
        "IPFS document storage",
        "Multi-signature security",
        "Smart contract auditing",
        "Gas optimization protocols",
      ],
    },
    {
      category: "Security & Compliance",
      specs: [
        "SOC 2 Type II certification",
        "GDPR compliance",
        "AES-256 encryption",
        "Multi-factor authentication",
        "Regular security audits",
        "Penetration testing",
      ],
    },
    {
      category: "Integration Capabilities",
      specs: [
        "RESTful API endpoints",
        "Webhook notifications",
        "SDK for major platforms",
        "Oracle data feeds",
        "Third-party integrations",
        "Mobile app support",
      ],
    },
    {
      category: "Performance Metrics",
      specs: [
        "99.9% uptime guarantee",
        "<2 second response time",
        "10,000+ TPS capacity",
        "24/7 monitoring",
        "Auto-scaling infrastructure",
        "Global CDN deployment",
      ],
    },
  ];

  const selectedSolutionData = solutions.find((s) => s.id === selectedSolution);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-slate-200 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Comprehensive Insurance Solutions
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto">
            Discover our complete range of blockchain-powered insurance products
            designed to protect what matters most to you and your business.
          </p>
        </div>
      </section>

      {/* Solution Categories */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16 mx-auto max-w-4xl">
            {solutions.map((solution) => (
              <Card
                key={solution.id}
                className={`glass-card rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedSolution === solution.id
                    ? "ring-2 ring-emerald-500 scale-105"
                    : "hover:scale-105"
                }`}
                onClick={() => setSelectedSolution(solution.id)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${solution.gradient} flex items-center justify-center`}
                  >
                    <solution.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {solution.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Solution Details */}
          {selectedSolutionData && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedSolutionData.gradient} flex items-center justify-center`}
                  >
                    <selectedSolutionData.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                      {selectedSolutionData.name}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedSolutionData.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {selectedSolutionData.stats.coverage}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Max Coverage
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {selectedSolutionData.stats.claims}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Claims Processed
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedSolutionData.stats.satisfaction}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Satisfaction Rate
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {selectedSolutionData.stats.avgPayout}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Avg Payout Time
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedSolutionData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Advanced Capabilities
                  </h3>
                  <div className="space-y-3">
                    {selectedSolutionData.capabilities.map(
                      (capability, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg"
                        >
                          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {capability}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Use Cases
                  </h3>
                  <div className="space-y-3">
                    {selectedSolutionData.useCases.map((useCase, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg"
                      >
                        <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {useCase}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/auth/register">
                    <Button className="gradient-accent text-white floating-button px-8 py-3">
                      Get Started with {selectedSolutionData.name}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Success Stories
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              See how our solutions have transformed businesses and protected
              millions in assets
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="glass-card rounded-2xl card-hover">
                <CardContent className="p-8">
                  <div
                    className={`w-12 h-12 mb-6 rounded-xl bg-gradient-to-r ${study.gradient} flex items-center justify-center`}
                  >
                    <study.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {study.title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {study.company} • {study.industry}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">
                        Challenge
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {study.challenge}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">
                        Solution
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {study.solution}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">
                        Results
                      </h4>
                      <ul className="space-y-1">
                        {study.results.map((result, resultIndex) => (
                          <li
                            key={resultIndex}
                            className="flex items-center text-sm text-slate-600 dark:text-slate-400"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Technical Specifications
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built on enterprise-grade infrastructure with industry-leading
              security and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalSpecs.map((category, index) => (
              <Card key={index} className="glass-card rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.specs.map((spec, specIndex) => (
                      <li
                        key={specIndex}
                        className="flex items-center text-sm text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0" />
                        {spec}
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            Ready to Get Protected?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of satisfied customers who trust BlockSecure for
            their insurance needs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="gradient-accent text-white floating-button px-8 py-4"
              >
                Start Your Coverage
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/plans">
              <Button
                variant="outline"
                size="lg"
                className="floating-button px-8 py-4"
              >
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
