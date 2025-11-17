"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { useCoverageQuery } from "@/hooks/useCoverage";
import { useTransactionStore } from "@/store/useTransactionStore";
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
import autoTable from "jspdf-autotable";
import { useSearchParams } from "next/navigation";
import { useTransactionQuery } from "@/hooks/usePayment";

// ------- Helpers -------
function formatAmount(a: any) {
  // Customize if you use crypto (e.g., "10 ETH")
  if (typeof a === "string") return a;
  if (typeof a === "number") return `$${a.toFixed(2)}`;
  return String(a ?? "-");
}

function drawBox(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  rows: [string, string][]
) {
  doc.setDrawColor(0);
  doc.rect(x, y, w, h);
  const rowH = h / rows.length;
  rows.forEach((row, i) => {
    const yy = y + rowH * i + 5;
    doc.setFont("helvetica", "bold");
    doc.text(`${row[0]}:`, x + 2, yy);
    doc.setFont("helvetica", "normal");
    doc.text(String(row[1] ?? "-"), x + w / 2, yy);
    if (i < rows.length - 1)
      doc.line(x, y + rowH * (i + 1), x + w, y + rowH * (i + 1));
  });
}

function drawDashedLine(
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dash = 2,
  gap = 2
) {
  // Manual dashed line (avoids setLineDash type issues)
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.floor(len / (dash + gap));
  const vx = dx / steps;
  const vy = dy / steps;
  let cx = x1,
    cy = y1;
  for (let i = 0; i < steps; i++) {
    // draw dash
    doc.line(
      cx,
      cy,
      cx + vx * (dash / (dash + gap)),
      cy + vy * (dash / (dash + gap))
    );
    // move to next dash start
    cx += vx;
    cy += vy;
  }
}

function drawDashedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number
) {
  drawDashedLine(doc, x, y, x + w, y, 2, 2); // top
  drawDashedLine(doc, x + w, y, x + w, y + h, 2, 2); // right
  drawDashedLine(doc, x, y + h, x + w, y + h, 2, 2); // bottom
  drawDashedLine(doc, x, y, x, y + h, 2, 2); // left
}

function drawRowsInRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  rows: [string, string][]
) {
  const rowH = h / rows.length;
  rows.forEach((row, i) => {
    const yy = y + rowH * i + 6;
    // inner dashed separator (skip first row)
    if (i > 0) drawDashedLine(doc, x, y + rowH * i, x + w, y + rowH * i, 2, 2);

    doc.setFont("helvetica", "bold");
    doc.text(`${row[0]}:`, x + 4, yy);
    doc.setFont("helvetica", "normal");
    doc.text(String(row[1] ?? "-"), x + w / 2, yy);
  });
}

function addTermsAndConditions(doc: jsPDF, startY: number) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 15;
  const maxWidth = pageW - marginX * 2;
  let y = startY;

  // Page-break if starting too low
  if (y > pageH - 40) {
    doc.addPage();
    y = 20;
  }

  // Section header
  doc.setFillColor(240, 240, 240);
  doc.rect(marginX, y, maxWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Terms & Conditions", marginX + 3, y + 6);
  y += 12;

  // Body text style
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Terms (edit as you need)
  const terms: string[] = [
    "This receipt is issued upon successful payment and does not on its own constitute proof of coverage. Coverage becomes effective only in accordance with the policy terms and eligibility requirements.",
    "All amounts are quoted in the payment currency shown on this invoice. Crypto payments, if any, are valued at the on-chain settlement time. Network or gas fees are non-refundable.",
    "Minimum Amount Due must be received by the Due Date to avoid lapse, late fees, or suspension as described in your policy schedule.",
    "Refunds, cancellations, and cooling-off periods (if applicable) follow the policy wording and any governing regulations. Administrative fees may apply.",
    "Policyholder is responsible for accuracy of personal details and contact information. Please notify us promptly of any changes.",
    "Claims must be submitted within the timeframes specified in the policy. Supporting documents and verifications may be required.",
    "Where permitted, documents may be delivered electronically. Keep this receipt for your records.",
    "This document should be read together with the Policy Schedule, Product Disclosure Sheet (if any), and full Policy Wording. In the event of inconsistency, the Policy Wording prevails.",
    "For assistance with billing or coverage, contact our support center during business hours listed on this statement.",
  ];

  // Render bullets with auto-wrap + page breaks
  const lineGap = 4; // gap between wrapped lines
  const bulletGap = 3; // space between bullet and text line
  const paraGap = 3; // extra gap between bullet items

  terms.forEach((t) => {
    // Split into wrapped lines
    const lines = doc.splitTextToSize(t, maxWidth - 5 - bulletGap); // subtract bullet space

    // Page break if needed (space for at least two lines)
    if (y + lines.length * (lineGap + 2) > pageH - 20) {
      doc.addPage();
      y = 20;
    }

    // Draw bullet for first wrapped line of this item
    doc.circle(marginX + 2, y - 2, 0.7, "F"); // small filled bullet
    // Draw first line
    doc.text(String(lines[0]), marginX + 5 + bulletGap, y);

    // Additional wrapped lines (indented)
    for (let i = 1; i < lines.length; i++) {
      y += lineGap + 2;
      if (y > pageH - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(String(lines[i]), marginX + 5 + bulletGap, y);
    }

    y += paraGap + 4; // space before next bullet
  });

  // Optional: tiny footer note
  if (y > pageH - 15) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text(
    "Note: This receipt is generated electronically. No signature is required.",
    marginX,
    y + 2
  );
}

export default function PaymentConfirmation() {
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const coverageId = searchParams.get("coverageId") || "";
  const txHash = searchParams.get("txHash") || "";
  const { data: coverage, isLoading: isCoverageLoading } = useCoverageQuery(
    coverageId,
    { enabled: !!coverageId }
  );
  const { data: transactionRaw, isLoading: isTransactionLoading } =
    useTransactionQuery(txHash, { enabled: !!txHash });
  if (!transactionRaw?.data || !coverage) {
    return <div className="p-8">Loading...</div>;
  }
  const transactionData = transactionRaw.data;

  const policyData = coverage?.data
    ? {
        id: coverage.data.policies?.id,
        name: coverage.data.policies?.name || "Unknown Policy",
        category: coverage.data.policies?.category || "general",
        provider: coverage.data.policies?.provider || "Unknown Provider",
        duration: `${coverage.data.policies?.durationDays} days`,
        coverage: `RM${coverage.data.policies?.coverageAmount}`,
        effectiveDate: coverage.data.startDate,
        expiryDate: coverage.data.endDate,
      }
    : null;

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

  const generateReceiptPdf = () => {
    const doc = new jsPDF();

    // ---- HEADER ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PREMIUM INVOICE", 105, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Your Insurance Company Name", 105, 24, { align: "center" });

    // Right policy box
    const RIGHT = { x: 140, y: 10, w: 60, h: 25 };
    const policyDetails: [string, string][] = [
      ["Policy #", String(policyData?.id ?? "-")],
      [
        "Statement Date",
        policyData
          ? new Date(policyData.effectiveDate).toLocaleDateString()
          : "-",
      ],
      [
        "Due Date",
        policyData ? new Date(policyData.expiryDate).toLocaleDateString() : "-",
      ],
    ];
    drawBox(doc, RIGHT.x, RIGHT.y, RIGHT.w, RIGHT.h, policyDetails);

    // Compute where header ends and table should start
    const headerBottomY = Math.max(24, RIGHT.y + RIGHT.h); // title vs box
    const tableStartY = headerBottomY + 10; // spacing

    // ---- TABLE ----
    const tableBody = [
      [
        new Date(transactionData?.createdAt!).toLocaleDateString(),
        String(policyData?.id ?? "-"),
        String(policyData?.name ?? "-"),
        formatAmount(transactionData?.amount),
        formatAmount(transactionData?.amount),
      ],
    ];

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: 15, right: 15 },
      theme: "grid",
      head: [
        [
          "Trans Date",
          "Policy Number",
          "Description",
          "Transaction Amount",
          "Minimum Due",
        ],
      ],
      body: tableBody,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.2,
        lineColor: [120, 120, 120],
      },
      headStyles: {
        fillColor: [52, 104, 160],
        textColor: 255,
        halign: "center",
      },
      columnStyles: { 3: { halign: "right" }, 4: { halign: "right" } },
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? tableStartY + 10;

    // Totals (right aligned)
    doc.setFont("helvetica", "bold");
    const minText = `Minimum Amount Due: ${formatAmount(
      transactionData.amount
    )}`;
    doc.text(minText, 195, finalY + 8, { align: "right" });

    // ---- DETACH LINE ----
    drawDashedLine(doc, 15, finalY + 16, 195, finalY + 16, 2, 2);
    doc.setFont("helvetica", "italic");
    doc.text("Detach Here", 105, finalY + 12, { align: "center" });

    // ---- MAIL TO (below table) ----
    doc.setFont("helvetica", "bold");
    doc.text("Mail To:", 15, finalY + 26);
    doc.setFont("helvetica", "normal");
    // if (policyData?.customerName)
    //   doc.text(String(policyData.customerName), 15, finalY + 32);
    // if (policyData?.customerAddress)
    //   doc.text(String(policyData.customerAddress), 15, finalY + 38);

    // ---- PAYMENT SLIP (right dashed box) ----
    const slipTop = finalY + 24;
    const slipH = 48;
    const slipW = 70;
    const slipX = 195 - slipW;
    drawDashedRect(doc, slipX, slipTop, slipW, slipH);

    const slipRows: [string, string][] = [
      ["Policy #", String(policyData?.id ?? "-")],
      [
        "Statement Date",
        policyData
          ? new Date(policyData.effectiveDate).toLocaleDateString()
          : "-",
      ],
      [
        "Due Date",
        policyData ? new Date(policyData.expiryDate).toLocaleDateString() : "-",
      ],
      ["Payment in Full", formatAmount(transactionData.amount)],
      ["Minimum Due", formatAmount(transactionData.amount)],
    ];
    drawRowsInRect(doc, slipX, slipTop, slipW, slipH, slipRows);
    const termsStartY = slipTop + slipH + 12;
    addTermsAndConditions(doc, termsStartY);

    doc.save("receipt.pdf");
  };

  const steps = [
    { id: 1, name: "Policy Selection", status: "completed" },
    { id: 2, name: "Payment Details", status: "completed" },
    { id: 3, name: "Confirmation", status: "current" },
  ];

  const nextSteps = [
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

  if (!policyData) {
    return <div className="p-8">Loading...</div>;
  }

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
            Coverly!
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
                        {transactionData.currency}
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Payment Method:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {transactionData.paymentMethod}
                    </span>
                  </div> */}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Transaction Date:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {new Date(transactionData.createdAt).toLocaleDateString()}
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
                    {formatAddress(transactionData.txHash)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transactionData.txHash)}
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

          <Button
            variant="outline"
            className="flex-1 floating-button"
            onClick={generateReceiptPdf}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
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
