"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClaimReviewDialog from "@/components/shared/ClaimReviewDialog";
import { recentClaims, topPolicies } from "@/public/data/admin/dashboardData";
import {
  Shield,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Eye,
  X,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Insurance Admin Dashboard</h1>
              <p className="page-header-subtitle">
                Monitor policies, review claims, and manage operations
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <StatsCard
            title="Active Policies"
            value="1,247"
            change="+8.2% from last month"
            changeType="positive"
            icon={Shield}
          />
          <StatsCard
            title="Pending Claims"
            value="23"
            change="3 urgent reviews"
            changeType="neutral"
            icon={AlertCircle}
          />
          <StatsCard
            title="Total Revenue"
            value="2,450 ETH"
            change="+15.3% from last month"
            changeType="positive"
            icon={DollarSign}
          />
          <StatsCard
            title="Active Users"
            value="3,891"
            change="+12.1% from last month"
            changeType="positive"
            icon={Users}
          />
        </div>

        <div className="content-grid">
          {/* Recent Claims */}
          <div className="content-main">
            <Card className="glass-card rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="heading-secondary">
                  Recent Claims
                </CardTitle>
                <Button variant="outline" className="floating-button">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="element-spacing">
                  {recentClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                              {claim.id}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                            >
                              {claim.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {claim.submittedBy} • {claim.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {claim.amount}
                          </p>
                          <Badge
                            className={`status-badge ${
                              claim.status === "approved"
                                ? "status-active"
                                : claim.status === "pending"
                                ? "status-pending"
                                : "status-info"
                            }`}
                          >
                            {claim.status === "approved" && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {claim.status === "pending" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {claim.status === "review" && (
                              <Eye className="w-3 h-3 mr-1" />
                            )}
                            {claim.status.charAt(0).toUpperCase() +
                              claim.status.slice(1)}
                          </Badge>
                        </div>
                        <ClaimReviewDialog claim={claim} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Top Policies */}
          <div className="content-sidebar">
            {/* Quick Actions */}
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="heading-tertiary">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="element-spacing">
                <Button className="w-full justify-start gradient-accent text-white floating-button">
                  <FileText className="w-4 h-4 mr-2" />
                  Review Claims
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start floating-button"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Create New Policy
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start floating-button"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Top Policies */}
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="heading-tertiary">
                  Top Performing Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="element-spacing">
                  {topPolicies.map((policy, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                          {policy.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {policy.sales} sales • {policy.revenue}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {policy.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
