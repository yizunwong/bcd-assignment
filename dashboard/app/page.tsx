"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Smartphone,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Plane,
  Sprout,
  Wallet,
  ClipboardList,
  ShieldCheck,
  Coins,
  Timer,
  Eye,
  Building,
  Users2,
  Target,
  Verified,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);


  const howItWorksSteps = [
    {
      icon: Wallet,
      title: "Connect",
      description: "Connect your crypto wallet securely",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: ClipboardList,
      title: "Select",
      description: "Choose your perfect insurance plan",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: ShieldCheck,
      title: "Protected",
      description: "Instant coverage with blockchain security",
      gradient: "from-purple-500 to-indigo-500",
    },
  ];

  const keyBenefits = [
    {
      icon: Zap,
      title: "Instant Payouts",
      description:
        "Smart contracts enable automatic claim processing and instant payments",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Eye,
      title: "Complete Transparency",
      description:
        "Every transaction recorded on blockchain for full audit trail",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: DollarSign,
      title: "Lower Costs",
      description: "Eliminate intermediaries and reduce premiums by up to 40%",
      gradient: "from-emerald-500 to-green-500",
    },
  ];

  const featuredPlans = [
    {
      name: "Health Shield",
      type: "Health Insurance",
      icon: Heart,
      coverage: "$100,000",
      premium: "0.8 ETH/month",
      features: [
        "Emergency Care",
        "Prescription Coverage",
        "Global Network",
        "Instant Claims",
      ],
      popular: true,
      gradient: "from-red-500 to-pink-500",
    },
    {
      name: "Travel Guard",
      type: "Travel Insurance",
      icon: Plane,
      coverage: "$50,000",
      premium: "0.2 ETH/trip",
      features: [
        "Trip Cancellation",
        "Medical Emergency",
        "Lost Luggage",
        "24/7 Support",
      ],
      popular: false,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Crop Protect",
      type: "Agricultural Insurance",
      icon: Sprout,
      coverage: "$200,000",
      premium: "2.5 ETH/season",
      features: [
        "Weather Oracle",
        "Automated Payouts",
        "Satellite Monitoring",
        "Yield Protection",
      ],
      popular: false,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const trustStats = [
    { label: "Total Value Locked", value: "$125M+" },
    { label: "Policies Issued", value: "50K+" },
    { label: "Claims Processed", value: "15K+" },
    { label: "Customer Satisfaction", value: "98.5%" },
  ];

  const partners = [
    { name: "Chainlink", icon: Target },
    { name: "Polygon", icon: Building },
    { name: "Ethereum", icon: Coins },
    { name: "IPFS", icon: Globe },
    { name: "OpenZeppelin", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-5" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="relative w-20 h-20 mx-auto mb-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 animate-pulse"
              style={{ transform: "scale(1.1)" }}
            ></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-slate-200 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Insurance Without Limits
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Experience instant payouts, complete transparency, and global
            coverage powered by blockchain technology. No paperwork, no delays,
            just protection when you need it most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 px-8 py-4 text-lg"
              >
                <Wallet className="mr-2 w-5 h-5" />
                Get Covered Now
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 px-8 py-4 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {trustStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Get Protected in 3 Simple Steps
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our streamlined process gets you covered in minutes, not days
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div
                  className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-lg`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/how-it-works">
              <Button className="gradient-accent text-white floating-button px-8 py-3">
                Learn More <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Benefits Snapshot */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Why Choose Blockchain Insurance?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the advantages that traditional insurance simply can't
              match
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {keyBenefits.map((benefit, index) => (
              <Card
                key={index}
                className="glass-card rounded-2xl p-8 text-center card-hover"
              >
                <CardContent className="pt-6">
                  <div
                    className={`relative w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/benefits">
              <Button variant="outline" className="floating-button px-8 py-3">
                See All Benefits <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Popular Insurance Plans
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Choose from our most trusted coverage options
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredPlans.map((plan, index) => (
              <Card
                key={index}
                className={`glass-card rounded-2xl p-8 card-hover relative ${
                  plan.popular ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="pt-6">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-100 text-center">
                    {plan.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                    {plan.type}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">
                        Coverage:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {plan.coverage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">
                        Premium:
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {plan.premium}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-sm text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link href="/auth/register">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "gradient-accent text-white"
                          : "bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white"
                      } transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95`}
                    >
                      Get Quote
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/plans">
              <Button className="gradient-accent text-white floating-button px-8 py-3">
                Explore All Plans <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Trusted & Secure
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built on industry-leading security standards and partnerships
            </p>
          </div>

          {/* Security Badges */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card rounded-2xl p-6 text-center">
              <CardContent className="pt-4">
                <Award className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Security Audited
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Certified by leading security firms
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl p-6 text-center">
              <CardContent className="pt-4">
                <Verified className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Licensed & Regulated
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Compliant with global standards
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl p-6 text-center">
              <CardContent className="pt-4">
                <Lock className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  256-bit Encryption
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Military-grade security
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl p-6 text-center">
              <CardContent className="pt-4">
                <ShieldCheck className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Smart Contract Verified
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Immutable and transparent
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Partner Logos */}
          <div className="mb-12">
            <h3 className="text-center text-lg font-semibold text-slate-700 dark:text-slate-300 mb-8">
              Powered by Industry Leaders
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-400"
                >
                  <partner.icon className="w-6 h-6" />
                  <span className="font-medium">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/trust">
              <Button variant="outline" className="floating-button px-8 py-3">
                Learn About Our Security <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
