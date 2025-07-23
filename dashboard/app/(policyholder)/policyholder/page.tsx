"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Coins,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  policies,
  recentActivity,
} from "@/public/data/policyholder/dashboardData";

export default function PolicyholderDashboard() {
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
              <h1 className="page-header-title">Welcome back, Alex!</h1>
              <p className="page-header-subtitle">
                Manage your policies and track your coverage
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <StatsCard
            title="Active Policies"
            value="3"
            change="+1 this month"
            changeType="positive"
            icon={Shield}
          />
          <StatsCard
            title="Total Coverage"
            value="$175,000"
            change="+$25,000"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatsCard
            title="Pending Claims"
            value="1"
            change="Processing"
            changeType="neutral"
            icon={Clock}
          />
          <StatsCard
            title="Wallet Balance"
            value="5.2 ETH"
            change="$18,420 USD"
            changeType="neutral"
            icon={Coins}
          />
        </div>

        <div className="content-grid">
          {/* Active Policies */}
          <div className="content-main">
            <Card className="glass-card rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="heading-secondary">
                  Active Policies
                </CardTitle>
                <Link href="/policyholder/coverage">
                  <Button variant="outline" className="floating-button">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="element-spacing">
                  {policies.map((policy, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            {policy.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Coverage: {policy.coverage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`status-badge ${
                            policy.status === "Active"
                              ? "status-active"
                              : policy.status === "Claimed"
                              ? "status-info"
                              : "status-pending"
                          }`}
                        >
                          {policy.status}
                        </Badge>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Expires: {policy.expires}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="content-sidebar">
            {/* Quick Actions */}
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="heading-tertiary">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="element-spacing">
                <Link href="/policyholder/browse">
                  <Button className="w-full justify-start gradient-accent text-white floating-button">
                    <Shield className="w-4 h-4 mr-2" />
                    Buy New Policy
                  </Button>
                </Link>
                <Link href="/policyholder/claims">
                  <Button
                    variant="outline"
                    className="w-full justify-start floating-button"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    File a Claim
                  </Button>
                </Link>
                <Link href="/policyholder/wallet">
                  <Button
                    variant="outline"
                    className="w-full justify-start floating-button"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    View Wallet
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="heading-tertiary">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="element-spacing">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.status === "completed"
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : activity.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                            : "bg-blue-100 dark:bg-blue-900/30"
                        }`}
                      >
                        {activity.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : activity.status === "pending" ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        ) : (
                          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {activity.type}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activity.date}
                        </p>
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
