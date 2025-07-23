"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  Database,
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";
import {
  networkNodes,
  systemAlerts,
  smartContracts,
  systemMetrics,
} from "@/public/data/system-admin/dashboardData";

export default function SystemAdminDashboard() {
  const [networkStatus] = useState("operational");

  // Data moved to public/data/system-admin/dashboardData.ts

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                System Monitoring
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Global network status and platform operations
              </p>
            </div>
          </div>
        </div>

        {/* Network Status Banner */}
        <Card className="glass-card rounded-2xl mb-8 border-l-4 border-l-emerald-500">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Network Status: Operational
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All systems running normally • 99.2% uptime
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              Healthy
            </Badge>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <StatsCard
              key={index}
              title={metric.label}
              value={metric.value}
              change={metric.change}
              changeType="positive"
              icon={metric.icon}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Network Nodes */}
          <div className="lg:col-span-2">
            <Card className="glass-card rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Network Nodes
                </CardTitle>
                <Button className="gradient-accent text-white floating-button">
                  Manage Nodes
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkNodes.map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            node.status === "online"
                              ? "bg-gradient-to-r from-emerald-500 to-green-600"
                              : node.status === "warning"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-slate-400 to-slate-500"
                          }`}
                        >
                          <Server className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                              {node.id}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                            >
                              {node.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {node.location} • {node.connections} connections
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {node.uptime}
                          </p>
                          <Badge
                            className={`${
                              node.status === "online"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : node.status === "warning"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300"
                            }`}
                          >
                            {node.status === "online" && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {node.status === "warning" && (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            )}
                            {node.status === "maintenance" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            <span className="capitalize">{node.status}</span>
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="gradient-accent text-white floating-button"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts & Smart Contracts */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start space-x-3 pb-3 border-b border-slate-200 dark:border-slate-700/50 last:border-b-0 last:pb-0"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          alert.severity === "high"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : alert.severity === "medium"
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {alert.severity === "high" ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {alert.message}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart Contracts */}
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Smart Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartContracts.slice(0, 4).map((contract, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {contract.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          v{contract.version} • {contract.transactions} txns
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <Badge
                          className={`${
                            contract.status === "deployed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          <span className="capitalize">{contract.status}</span>
                        </Badge>
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
