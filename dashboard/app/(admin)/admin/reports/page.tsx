"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/shared/Pagination";
import {
  reportTemplates,
  recentReports,
  quickStats,
} from "@/public/data/admin/reportsData";
import {
  Download,
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Shield,
  DollarSign,
  Clock,
  Target,
  Search,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const ITEMS_PER_PAGE = 20;

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState("overview");
  const [timeframe, setTimeframe] = useState("monthly");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredReports = useMemo(() => {
    let filtered = recentReports.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || report.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by generation date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.generatedDate).getTime() -
        new Date(a.generatedDate).getTime()
    );
  }, [searchTerm, filterCategory]);

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sales":
        return "from-emerald-500 to-teal-500";
      case "claims":
        return "from-blue-500 to-cyan-500";
      case "customers":
        return "from-purple-500 to-indigo-500";
      case "financial":
        return "from-green-500 to-emerald-500";
      case "risk":
        return "from-red-500 to-pink-500";
      case "compliance":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sales":
        return TrendingUp;
      case "claims":
        return Shield;
      case "customers":
        return Users;
      case "financial":
        return DollarSign;
      case "risk":
        return Target;
      case "compliance":
        return FileText;
      default:
        return BarChart3;
    }
  };

  const handleGenerateReport = async (reportId: string, format: string) => {
    const extension = format === "Excel" ? "xlsx" : "pdf";
    const prefix =
      reportId === "sales-summary"
        ? "sales-summary-template"
        : "claims-analysis-template";
    const fileName = `${prefix}.${extension}`;

    const response = await fetch(`/templates/${fileName}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Reports & Analytics</h1>
              <p className="page-header-subtitle">
                Generate comprehensive reports and analyze business performance
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">Active</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {quickStats.totalPolicies}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Total Policies
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-info">Claims</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {quickStats.totalClaims}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Total Claims</p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">Revenue</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {quickStats.totalRevenue}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Total Revenue
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-info">Users</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {quickStats.activeUsers}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Active Users</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger value="templates" className="rounded-lg">
              Report Templates
            </TabsTrigger>
            <TabsTrigger value="custom" className="rounded-lg">
              Custom Reports
            </TabsTrigger>
            <TabsTrigger value="recent" className="rounded-lg">
              Recent Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <div className="grid lg:grid-cols-2 gap-6">
              {reportTemplates.map((template) => {
                const CategoryIcon = getCategoryIcon(template.category);
                return (
                  <Card
                    key={template.id}
                    className="glass-card rounded-2xl card-hover"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(
                            template.category
                          )} flex items-center justify-center`}
                        >
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                            {template.name}
                          </CardTitle>
                          <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                            {template.category} Report
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-slate-700 dark:text-slate-300">
                        {template.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Last Generated
                          </p>
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {new Date(
                              template.lastGenerated
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Frequency
                          </p>
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {template.frequency}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Available Formats:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.format.map((format, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                            >
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                        {template.format.map((format, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleGenerateReport(template.id, format)
                            }
                            className="flex-1 floating-button"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {format}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                  Custom Report Builder
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Create custom reports with specific parameters
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Report Type
                    </label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">
                          Business Overview
                        </SelectItem>
                        <SelectItem value="sales">Sales Performance</SelectItem>
                        <SelectItem value="claims">Claims Analysis</SelectItem>
                        <SelectItem value="customers">
                          Customer Analytics
                        </SelectItem>
                        <SelectItem value="financial">
                          Financial Report
                        </SelectItem>
                        <SelectItem value="risk">Risk Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Timeframe
                    </label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date Range
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal form-input"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            "Pick a date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-slate-500 dark:text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Charts
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Include visual charts
                    </p>
                  </div>
                  <div className="text-center">
                    <PieChart className="w-8 h-8 text-slate-500 dark:text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Breakdown
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Category breakdown
                    </p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-slate-500 dark:text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Trends
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Trend analysis
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-slate-500 dark:text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      KPIs
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Key metrics
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    Preview Report
                  </Button>
                  <Button className="flex-1 gradient-accent text-white floating-button">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Recent Reports
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Showing {paginatedReports.length} of{" "}
                      {filteredReports.length} reports
                    </p>
                  </div>

                  <div className="responsive-stack">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) =>
                          handleFilterChange(() =>
                            setSearchTerm(e.target.value)
                          )
                        }
                        className="form-input pl-10"
                      />
                    </div>
                    <Select
                      value={filterCategory}
                      onValueChange={(value) =>
                        handleFilterChange(() => setFilterCategory(value))
                      }
                    >
                      <SelectTrigger className="w-full md:w-48 form-input">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="claims">Claims</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="risk">Risk</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {paginatedReports.map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(
                            report.category
                          )} flex items-center justify-center`}
                        >
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            {report.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {report.type} • {report.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Generated
                          </p>
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {new Date(
                              report.generatedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                        >
                          {report.format}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="floating-button"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showInfo={true}
                  totalItems={filteredReports.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
