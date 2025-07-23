"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  Shield,
  Lock,
  FileText,
  CheckCircle,
  ArrowRight,
  Eye,
  Users,
  Server,
  Database,
  Globe,
  Award,
  AlertTriangle,
  Zap,
  Code,
  Search,
  Building,
  Verified,
  Key,
  RefreshCw,
  Network,
  HardDrive,
  Layers,
  Fingerprint,
  UserCheck,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function TrustSecurityPage() {
  const [activeTab, setActiveTab] = useState("security");

  const securityMeasures = [
    {
      title: "Smart Contract Audits",
      description:
        "All smart contracts undergo rigorous third-party security audits",
      icon: Code,
      details: [
        "Multiple independent security audits",
        "Formal verification of critical functions",
        "Open-source code for transparency",
        "Bug bounty program for vulnerabilities",
        "Regular security updates and improvements",
      ],
    },
    {
      title: "Multi-Signature Security",
      description: "Critical operations require multiple authorized signatures",
      icon: Key,
      details: [
        "3-of-5 multi-signature requirement",
        "Distributed key management",
        "Hardware security module integration",
        "Time-locked transactions",
        "Anomaly detection and prevention",
      ],
    },
    {
      title: "Encryption Standards",
      description: "Military-grade encryption for all sensitive data",
      icon: Lock,
      details: [
        "AES-256 encryption for all data",
        "End-to-end encryption for communications",
        "Zero-knowledge proofs for privacy",
        "Secure key management system",
        "Regular encryption algorithm updates",
      ],
    },
    {
      title: "Decentralized Storage",
      description: "Data stored across distributed nodes for maximum security",
      icon: Database,
      details: [
        "IPFS distributed storage",
        "Content-addressed data",
        "Redundant storage across multiple nodes",
        "Immutable audit trails",
        "Cryptographic verification of data integrity",
      ],
    },
    {
      title: "Continuous Monitoring",
      description: "24/7 automated and human monitoring of all systems",
      icon: Eye,
      details: [
        "Real-time threat detection",
        "Automated anomaly identification",
        "Security operations center",
        "Intrusion prevention systems",
        "Regular penetration testing",
      ],
    },
    {
      title: "Secure Infrastructure",
      description:
        "Enterprise-grade infrastructure with multiple security layers",
      icon: Server,
      details: [
        "Distributed denial-of-service protection",
        "Secure cloud infrastructure",
        "Network segmentation",
        "Firewall protection",
        "Regular security patching",
      ],
    },
  ];

  const complianceStandards = [
    {
      name: "GDPR Compliance",
      description: "Full compliance with European data protection regulations",
      icon: FileCheck,
      details: [
        "Data minimization principles",
        "Right to be forgotten implementation",
        "Transparent data processing",
        "Data portability support",
        "Regular compliance audits",
      ],
    },
    {
      name: "SOC 2 Type II",
      description:
        "Service Organization Control certification for security and privacy",
      icon: Verified,
      details: [
        "Annual third-party audits",
        "Security, availability, and confidentiality",
        "Processing integrity verification",
        "Operational excellence standards",
        "Continuous compliance monitoring",
      ],
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management",
      icon: ShieldCheck,
      details: [
        "Comprehensive information security management system",
        "Risk assessment methodology",
        "Security control implementation",
        "Continuous improvement process",
        "Regular certification renewal",
      ],
    },
    {
      name: "Insurance Regulatory Compliance",
      description: "Adherence to global insurance regulations and standards",
      icon: Building,
      details: [
        "Licensed insurance provider",
        "Regulatory reporting compliance",
        "Capital adequacy requirements",
        "Consumer protection standards",
        "Cross-border insurance regulations",
      ],
    },
  ];

  const privacyPrinciples = [
    {
      title: "Data Minimization",
      description:
        "We collect only the data necessary for providing our services",
      icon: Fingerprint,
    },
    {
      title: "Zero-Knowledge Proofs",
      description: "Verify information without revealing sensitive data",
      icon: Eye,
    },
    {
      title: "User Control",
      description:
        "Full control over your personal data with easy export and deletion",
      icon: UserCheck,
    },
    {
      title: "Transparent Processing",
      description: "Clear documentation of how your data is used and processed",
      icon: FileText,
    },
    {
      title: "Secure Sharing",
      description: "Encrypted data sharing with explicit consent requirements",
      icon: Users,
    },
    {
      title: "No Data Selling",
      description: "We never sell your personal information to third parties",
      icon: AlertTriangle,
    },
  ];

  const technicalArchitecture = [
    {
      title: "Blockchain Layer",
      description:
        "Ethereum-based smart contracts for policy management and claims processing",
      icon: Layers,
      details: [
        "ERC-721 policy tokens",
        "Solidity smart contracts",
        "Layer 2 scaling solutions",
        "Gas optimization techniques",
        "Cross-chain interoperability",
      ],
    },
    {
      title: "Oracle Network",
      description:
        "Decentralized data feeds for real-world information and verification",
      icon: Globe,
      details: [
        "Chainlink integration",
        "Weather data oracles",
        "Financial data feeds",
        "Multiple data source verification",
        "Tamper-proof data transmission",
      ],
    },
    {
      title: "Storage Infrastructure",
      description:
        "Distributed storage for policy documents and supporting materials",
      icon: HardDrive,
      details: [
        "IPFS document storage",
        "Content-addressed data",
        "Encrypted file system",
        "Redundant storage",
        "Decentralized access control",
      ],
    },
    {
      title: "API Gateway",
      description: "Secure interface for third-party integrations and services",
      icon: Network,
      details: [
        "RESTful API endpoints",
        "OAuth 2.0 authentication",
        "Rate limiting protection",
        "Webhook notifications",
        "Comprehensive documentation",
      ],
    },
    {
      title: "Processing Engine",
      description: "High-performance claims processing and underwriting system",
      icon: Zap,
      details: [
        "AI-powered risk assessment",
        "Automated claims verification",
        "Fraud detection algorithms",
        "Real-time processing",
        "Scalable architecture",
      ],
    },
    {
      title: "Monitoring System",
      description:
        "24/7 monitoring and alerting for system health and security",
      icon: RefreshCw,
      details: [
        "Real-time metrics collection",
        "Anomaly detection",
        "Predictive maintenance",
        "Automated incident response",
        "Performance optimization",
      ],
    },
  ];

  const certifications = [
    { name: "SOC 2 Type II", icon: Award, date: "Renewed Jan 2025" },
    { name: "ISO 27001", icon: Shield, date: "Certified Mar 2025" },
    { name: "GDPR Compliant", icon: FileText, date: "Verified Feb 2025" },
    { name: "Smart Contract Audit", icon: Code, date: "Audited Apr 2025" },
    { name: "PCI DSS Level 1", icon: Lock, date: "Certified Dec 2024" },
    { name: "CCPA Compliant", icon: Users, date: "Verified Jan 2025" },
  ];

  const partners = [
    { name: "Chainlink", role: "Oracle Provider", logo: Globe },
    { name: "OpenZeppelin", role: "Security Partner", logo: Shield },
    { name: "ConsenSys", role: "Blockchain Infrastructure", logo: Layers },
    { name: "Quantstamp", role: "Security Auditor", logo: Search },
    { name: "Aon", role: "Reinsurance Partner", logo: Building },
    { name: "AWS", role: "Cloud Infrastructure", logo: Server },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative w-20 h-20 mx-auto mb-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-slate-200 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Trust & Security
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto">
            Learn how we protect your data, ensure compliance, and maintain the
            highest standards of security for your peace of mind.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              SOC 2 Type II Certified
            </Badge>
            <Badge className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-sm">
              <Lock className="w-4 h-4 mr-2" />
              256-bit Encryption
            </Badge>
            <Badge className="px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-sm">
              <FileText className="w-4 h-4 mr-2" />
              GDPR Compliant
            </Badge>
            <Badge className="px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-sm">
              <Code className="w-4 h-4 mr-2" />
              Audited Smart Contracts
            </Badge>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-10 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "security"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              Security Measures
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "compliance"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              Compliance Standards
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "privacy"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "architecture"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              Technical Architecture
            </button>
          </div>
        </div>
      </section>

      {/* Security Measures */}
      {activeTab === "security" && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                Enterprise-Grade Security
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Our multi-layered security approach ensures your data and funds
                are protected at all times
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityMeasures.map((measure, index) => (
                <Card key={index} className="glass-card rounded-2xl card-hover">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <measure.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      {measure.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {measure.description}
                    </p>

                    <div className="space-y-2">
                      {measure.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="flex items-center space-x-2"
                        >
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

            <div className="mt-16 p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Our Security Commitment
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">
                    At BlockSecure, security is our highest priority. We employ
                    a defense-in-depth approach with multiple layers of
                    protection to safeguard your data and funds. Our security
                    team continuously monitors for threats and vulnerabilities,
                    and we regularly conduct third-party security audits to
                    ensure our systems remain impenetrable.
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    We maintain a comprehensive bug bounty program and encourage
                    security researchers to responsibly disclose any
                    vulnerabilities they discover. This collaborative approach
                    helps us maintain the highest security standards in the
                    industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Compliance Standards */}
      {activeTab === "compliance" && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                Regulatory Compliance
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                We adhere to the highest regulatory standards across global
                jurisdictions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {complianceStandards.map((standard, index) => (
                <Card key={index} className="glass-card rounded-2xl card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                        <standard.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                          {standard.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {standard.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {standard.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="flex items-center space-x-2"
                        >
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

            {/* Certifications */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
                Our Certifications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {certifications.map((cert, index) => (
                  <Card key={index} className="glass-card rounded-2xl">
                    <CardContent className="p-4 text-center">
                      <cert.icon className="w-10 h-10 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                        {cert.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {cert.date}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
                Our Trusted Partners
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {partners.map((partner, index) => (
                  <Card key={index} className="glass-card rounded-2xl">
                    <CardContent className="p-4 text-center">
                      <partner.logo className="w-10 h-10 mx-auto mb-3 text-slate-700 dark:text-slate-300" />
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {partner.role}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Privacy Policy */}
      {activeTab === "privacy" && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                Privacy Policy Highlights
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Your privacy is paramount - learn how we protect your personal
                information
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {privacyPrinciples.map((principle, index) => (
                <Card key={index} className="glass-card rounded-2xl card-hover">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <principle.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      {principle.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-card rounded-2xl mb-16">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                  Data We Collect
                </h3>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Account Information
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Name and contact details
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Wallet address
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Email address
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Authentication data
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Policy Information
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Policy details
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Coverage information
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Premium payment history
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Claim history
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Usage Data
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Device information
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          IP address
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Browser type
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Usage patterns
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                  How We Use Your Data
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Service Provision
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Policy creation and management
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Claims processing
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Customer support
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Transaction processing
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Security & Compliance
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Fraud prevention
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Identity verification
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Regulatory reporting
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Audit trail maintenance
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Service Improvement
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Product enhancement
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          User experience optimization
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Aggregated analytics
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Research and development
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/privacy-policy">
                <Button className="gradient-accent text-white floating-button px-8 py-3">
                  View Full Privacy Policy
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Technical Architecture */}
      {activeTab === "architecture" && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                Technical Architecture
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Explore the advanced technology stack that powers our blockchain
                insurance platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technicalArchitecture.map((component, index) => (
                <Card key={index} className="glass-card rounded-2xl card-hover">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <component.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      {component.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {component.description}
                    </p>

                    <div className="space-y-2">
                      {component.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="flex items-center space-x-2"
                        >
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

            <div className="mt-16 p-8 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
                System Architecture Diagram
              </h3>

              <div className="relative p-8 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                      User Interface Layer
                    </h4>
                    <div className="flex justify-center space-x-4 mt-2">
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Web App
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Mobile App
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        API
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-center">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Application Layer
                    </h4>
                    <div className="flex justify-center space-x-4 mt-2">
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Policy Management
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Claims Processing
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Risk Assessment
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300">
                      Blockchain Layer
                    </h4>
                    <div className="flex flex-col space-y-2 mt-2">
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Smart Contracts
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Policy NFTs
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-center">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">
                      Oracle Network
                    </h4>
                    <div className="flex flex-col space-y-2 mt-2">
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Data Feeds
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        External APIs
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
                    <h4 className="font-semibold text-red-800 dark:text-red-300">
                      Storage Layer
                    </h4>
                    <div className="flex flex-col space-y-2 mt-2">
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        IPFS
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Encrypted DB
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 p-4 bg-slate-100 dark:bg-slate-600 rounded-lg text-center">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                      Security Layer
                    </h4>
                    <div className="flex justify-center space-x-4 mt-2">
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Encryption
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Authentication
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Monitoring
                      </div>
                      <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded text-sm">
                        Auditing
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="absolute top-[120px] left-1/2 w-0.5 h-8 bg-slate-300 dark:bg-slate-500"></div>
                <div className="absolute top-[230px] left-1/2 w-0.5 h-8 bg-slate-300 dark:bg-slate-500"></div>
                <div className="absolute top-[280px] left-1/6 w-0.5 h-8 bg-slate-300 dark:bg-slate-500"></div>
                <div className="absolute top-[280px] left-1/2 w-0.5 h-8 bg-slate-300 dark:bg-slate-500"></div>
                <div className="absolute top-[280px] left-5/6 w-0.5 h-8 bg-slate-300 dark:bg-slate-500"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            Your Security Is Our Priority
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Experience the peace of mind that comes with blockchain-secured
            insurance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="gradient-accent text-white floating-button px-8 py-4"
              >
                Get Protected Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="floating-button px-8 py-4"
              >
                Contact Security Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
