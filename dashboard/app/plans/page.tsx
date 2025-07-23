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
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Globe,
  Clock,
  DollarSign,
  Users,
  Award,
  Target,
  Smartphone,
  Eye,
  Lock,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlansPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "All Categories", icon: Shield },
    { id: "health", name: "Health Insurance", icon: Heart },
    { id: "travel", name: "Travel Insurance", icon: Plane },
    { id: "crop", name: "Agricultural Insurance", icon: Sprout },
  ];

  const plans = [
    {
      id: "health-basic",
      name: "Health Basic",
      category: "health",
      icon: Heart,
      gradient: "from-red-500 to-pink-500",
      coverage: "$50,000",
      premium: "0.5 ETH/month",
      popular: false,
      description:
        "Essential health coverage for individuals with basic medical needs",
      features: [
        "Emergency care",
        "Primary care visits",
        "Prescription coverage",
        "Preventive care",
        "Telemedicine access",
      ],
      limitations: [
        "No dental or vision coverage",
        "Limited specialist visits",
        "No international coverage",
        "Pre-existing conditions waiting period",
      ],
      bestFor: "Young, healthy individuals seeking essential coverage",
      rating: 4.2,
      reviews: 245,
    },
    {
      id: "health-premium",
      name: "Health Premium",
      category: "health",
      icon: Heart,
      gradient: "from-red-500 to-pink-500",
      coverage: "$100,000",
      premium: "0.8 ETH/month",
      popular: true,
      description:
        "Comprehensive health coverage with enhanced benefits and global network",
      features: [
        "All Basic features",
        "Specialist consultations",
        "Mental health coverage",
        "Dental and vision care",
        "Global emergency coverage",
        "Wellness programs",
        "Alternative medicine",
      ],
      limitations: [
        "Some cosmetic procedures excluded",
        "Limited coverage for certain experimental treatments",
      ],
      bestFor: "Families and individuals wanting comprehensive coverage",
      rating: 4.8,
      reviews: 789,
    },
    {
      id: "health-elite",
      name: "Health Elite",
      category: "health",
      icon: Heart,
      gradient: "from-red-500 to-pink-500",
      coverage: "$250,000",
      premium: "1.5 ETH/month",
      popular: false,
      description:
        "Premium healthcare with global coverage and exclusive benefits",
      features: [
        "All Premium features",
        "Unlimited global coverage",
        "Executive health checkups",
        "Private hospital rooms",
        "Medical evacuation",
        "Concierge medical service",
        "Family coverage options",
        "Chronic condition management",
      ],
      limitations: ["High deductible for certain elective procedures"],
      bestFor:
        "High-net-worth individuals and executives requiring premium care",
      rating: 4.9,
      reviews: 312,
    },
    {
      id: "travel-basic",
      name: "Travel Basic",
      category: "travel",
      icon: Plane,
      gradient: "from-blue-500 to-cyan-500",
      coverage: "$25,000",
      premium: "0.1 ETH/trip",
      popular: false,
      description:
        "Essential travel protection for domestic and international trips",
      features: [
        "Emergency medical coverage",
        "Trip cancellation",
        "Lost luggage protection",
        "Travel delay compensation",
        "24/7 assistance hotline",
      ],
      limitations: [
        "Limited adventure sports coverage",
        "Maximum trip duration of 30 days",
        "Limited electronics coverage",
        "No rental car coverage",
      ],
      bestFor: "Occasional travelers seeking basic protection",
      rating: 4.3,
      reviews: 178,
    },
    {
      id: "travel-premium",
      name: "Travel Premium",
      category: "travel",
      icon: Plane,
      gradient: "from-blue-500 to-cyan-500",
      coverage: "$50,000",
      premium: "0.2 ETH/trip",
      popular: true,
      description:
        "Comprehensive travel insurance with enhanced benefits for frequent travelers",
      features: [
        "All Basic features",
        "Higher coverage limits",
        "Adventure sports coverage",
        "Rental car protection",
        "Business equipment coverage",
        "Pet emergency coverage",
        "Cruise protection",
      ],
      limitations: [
        "Maximum trip duration of 60 days",
        "Some extreme sports excluded",
      ],
      bestFor: "Frequent travelers and families on vacation",
      rating: 4.7,
      reviews: 423,
    },
    {
      id: "travel-nomad",
      name: "Digital Nomad",
      category: "travel",
      icon: Plane,
      gradient: "from-blue-500 to-cyan-500",
      coverage: "$75,000",
      premium: "0.3 ETH/month",
      popular: false,
      description:
        "Long-term travel insurance designed for digital nomads and remote workers",
      features: [
        "All Premium features",
        "Long-term global coverage",
        "Work equipment protection",
        "Co-working space liability",
        "Multiple country coverage",
        "Visa assistance services",
        "Remote health consultations",
        "Evacuation services",
      ],
      limitations: [
        "Requires proof of remote work status",
        "Some countries excluded due to regulations",
      ],
      bestFor: "Digital nomads and long-term international travelers",
      rating: 4.9,
      reviews: 156,
    },
    {
      id: "crop-basic",
      name: "Crop Basic",
      category: "crop",
      icon: Sprout,
      gradient: "from-green-500 to-emerald-500",
      coverage: "$100,000",
      premium: "1.0 ETH/season",
      popular: false,
      description:
        "Essential crop protection against major weather events and natural disasters",
      features: [
        "Weather damage coverage",
        "Drought protection",
        "Flood insurance",
        "Fire damage",
        "Basic pest coverage",
        "Satellite monitoring",
      ],
      limitations: [
        "Limited market price protection",
        "Basic crops only",
        "Coverage caps on certain events",
        "Limited equipment coverage",
      ],
      bestFor: "Small farms with standard crop varieties",
      rating: 4.4,
      reviews: 89,
    },
    {
      id: "crop-premium",
      name: "Crop Premium",
      category: "crop",
      icon: Sprout,
      gradient: "from-green-500 to-emerald-500",
      coverage: "$200,000",
      premium: "2.5 ETH/season",
      popular: true,
      description:
        "Comprehensive agricultural insurance with advanced monitoring and protection",
      features: [
        "All Basic features",
        "IoT sensor integration",
        "Market price protection",
        "Equipment breakdown",
        "Livestock coverage",
        "Yield guarantee",
        "Organic certification",
        "Automated weather alerts",
      ],
      limitations: [
        "Some exotic crops may have limited coverage",
        "Requires IoT sensor installation",
      ],
      bestFor: "Medium to large farms with diverse crops",
      rating: 4.8,
      reviews: 134,
    },
  ];

  const specialOffers = [
    {
      title: "New Customer Discount",
      description: "Get 15% off your first year of coverage",
      code: "NEWCUSTOMER15",
      expires: "Limited time offer",
    },
    {
      title: "Multi-Policy Bundle",
      description: "Save 20% when you combine health and travel insurance",
      code: "BUNDLE20",
      expires: "No expiration",
    },
    {
      title: "Annual Payment Discount",
      description: "Save 10% when paying annually instead of monthly",
      code: "ANNUAL10",
      expires: "No expiration",
    },
  ];

  const billingTerms = [
    {
      title: "Payment Methods",
      details: [
        "Cryptocurrency (ETH, USDC, DAI)",
        "Credit/Debit Card",
        "Bank Transfer",
        "PayPal",
      ],
    },
    {
      title: "Billing Frequency",
      details: [
        "Monthly (standard)",
        "Quarterly (5% discount)",
        "Semi-annually (7% discount)",
        "Annually (10% discount)",
      ],
    },
    {
      title: "Cancellation Policy",
      details: [
        "Cancel anytime with no penalties",
        "Pro-rated refunds for unused coverage",
        "Instant cancellation processing",
        "No hidden fees or charges",
      ],
    },
    {
      title: "Premium Adjustments",
      details: [
        "Transparent pricing model",
        "No mid-term premium increases",
        "Renewal rates provided 30 days in advance",
        "Price lock guarantee available",
      ],
    },
  ];

  const filteredPlans =
    selectedCategory === "all"
      ? plans
      : plans.filter((plan) => plan.category === selectedCategory);

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      case "price-low":
        return (
          parseFloat(a.premium.split(" ")[0]) -
          parseFloat(b.premium.split(" ")[0])
        );
      case "price-high":
        return (
          parseFloat(b.premium.split(" ")[0]) -
          parseFloat(a.premium.split(" ")[0])
        );
      case "coverage":
        return (
          parseInt(b.coverage.replace(/\D/g, "")) -
          parseInt(a.coverage.replace(/\D/g, ""))
        );
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const togglePlanSelection = (planId: string) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter((id) => id !== planId));
    } else {
      if (selectedPlans.length < 3) {
        setSelectedPlans([...selectedPlans, planId]);
      }
    }
  };

  const selectedPlansData = plans.filter((plan) =>
    selectedPlans.includes(plan.id)
  );

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
            Insurance Plans & Pricing
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto">
            Explore our comprehensive range of blockchain-powered insurance
            plans designed to fit your specific needs and budget.
          </p>
        </div>
      </section>

      {/* Plan Categories */}
      <section className="py-10 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 dark:border-emerald-400"
                    : "bg-white/80 dark:bg-slate-700/50 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-slate-100 dark:bg-slate-600"
                  } flex items-center justify-center mb-2`}
                >
                  <category.icon
                    className={`w-6 h-6 ${
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    selectedCategory === category.id
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 md:mb-0">
              {selectedCategory === "all"
                ? "All Insurance Plans"
                : `${
                    categories.find((c) => c.id === selectedCategory)?.name
                  } Plans`}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Sort by:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-white/80 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="coverage">Coverage Amount</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant={showComparison ? "default" : "outline"}
                onClick={() => setShowComparison(!showComparison)}
                className={showComparison ? "gradient-accent text-white" : ""}
              >
                {showComparison ? "Hide Comparison" : "Compare Plans"}
                {showComparison ? null : (
                  <span className="ml-2 text-xs">
                    ({selectedPlans.length}/3)
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Selected Plans for Comparison */}
          {showComparison && selectedPlans.length > 0 && (
            <Card className="glass-card rounded-2xl mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Plan Comparison
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-medium">
                          Feature
                        </th>
                        {selectedPlansData.map((plan) => (
                          <th
                            key={plan.id}
                            className="text-center p-3 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-2`}
                              >
                                <plan.icon className="w-5 h-5 text-white" />
                              </div>
                              {plan.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                          Coverage
                        </td>
                        {selectedPlansData.map((plan) => (
                          <td
                            key={plan.id}
                            className="p-3 text-center font-semibold text-emerald-600 dark:text-emerald-400"
                          >
                            {plan.coverage}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                          Premium
                        </td>
                        {selectedPlansData.map((plan) => (
                          <td
                            key={plan.id}
                            className="p-3 text-center text-slate-700 dark:text-slate-300"
                          >
                            {plan.premium}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                          Rating
                        </td>
                        {selectedPlansData.map((plan) => (
                          <td
                            key={plan.id}
                            className="p-3 text-center text-slate-700 dark:text-slate-300"
                          >
                            <div className="flex items-center justify-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span>{plan.rating}</span>
                              <span className="text-xs text-slate-500 ml-1">
                                ({plan.reviews})
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                          Features
                        </td>
                        {selectedPlansData.map((plan) => (
                          <td
                            key={plan.id}
                            className="p-3 text-center text-slate-700 dark:text-slate-300"
                          >
                            <div className="text-sm">
                              {plan.features.length} features
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                          Best For
                        </td>
                        {selectedPlansData.map((plan) => (
                          <td
                            key={plan.id}
                            className="p-3 text-center text-sm text-slate-600 dark:text-slate-400"
                          >
                            {plan.bestFor}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                          Action
                        </td>
                        {selectedPlansData.map((plan) => (
                          <td key={plan.id} className="p-3 text-center">
                            <Link href="/auth/register">
                              <Button className="gradient-accent text-white floating-button">
                                Get Quote
                              </Button>
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`glass-card rounded-2xl card-hover relative ${
                  plan.popular ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}
                      >
                        <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                          {plan.name}
                        </h3>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span>{plan.rating}</span>
                          <span className="text-xs ml-1">
                            ({plan.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {showComparison && (
                      <button
                        onClick={() => togglePlanSelection(plan.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPlans.includes(plan.id)
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {selectedPlans.includes(plan.id) && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {plan.description}
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

                  <div className="mb-6">
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
                      Key Features:
                    </h4>
                    <div className="space-y-2">
                      {plan.features
                        .slice(0, 5)
                        .map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center text-sm text-slate-600 dark:text-slate-400"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      {plan.features.length > 5 && (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          +{plan.features.length - 5} more features
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
                      Limitations:
                    </h4>
                    <div className="space-y-2">
                      {plan.limitations
                        .slice(0, 2)
                        .map((limitation, limitIndex) => (
                          <div
                            key={limitIndex}
                            className="flex items-center text-sm text-slate-600 dark:text-slate-400"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                            {limitation}
                          </div>
                        ))}
                      {plan.limitations.length > 2 && (
                        <div className="text-sm text-amber-600 dark:text-amber-400">
                          +{plan.limitations.length - 2} more limitations
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>
                        <strong>Best for:</strong> {plan.bestFor}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/auth/register" className="flex-1">
                      <Button className="w-full gradient-accent text-white floating-button">
                        Get Quote
                      </Button>
                    </Link>
                    <Button variant="outline" className="floating-button">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Special Offers
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Take advantage of these limited-time discounts and promotions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {specialOffers.map((offer, index) => (
              <Card key={index} className="glass-card rounded-2xl card-hover">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 text-center">
                    {offer.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
                    {offer.description}
                  </p>

                  <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-center mb-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Promo Code
                    </div>
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {offer.code}
                    </div>
                  </div>

                  <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    {offer.expires}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Billing Terms */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Billing Terms & Conditions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Transparent and flexible payment options to suit your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {billingTerms.map((term, index) => (
              <Card key={index} className="glass-card rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    {term.title}
                  </h3>
                  <ul className="space-y-3">
                    {term.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Important Information
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  All plans are subject to our standard terms and conditions.
                  Prices may vary based on individual risk assessment and
                  coverage options. Cryptocurrency prices are locked at the time
                  of purchase to protect against volatility.
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  For detailed policy information, please review the full policy
                  documentation provided after purchase. All smart contracts are
                  audited by leading security firms and fully transparent on the
                  blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
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
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="floating-button px-8 py-4"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
