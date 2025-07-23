"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pagination } from "@/components/shared/Pagination";
import { offers } from "@/public/data/admin/offersData";
import EditOfferDialog from "@/components/shared/EditOfferDialog";
import {
  Gift,
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Percent,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  Search,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 8;

export default function SeasonalOffers() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    targetAudience: "all",
    policyCategories: [""],
    minPurchase: "",
    maxDiscount: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    isActive: true,
  });

  const filteredOffers = useMemo(() => {
    let filtered = offers.filter((offer) => {
      const matchesSearch =
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || offer.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // Sort by start date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }, [searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);
  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "scheduled":
        return "status-info";
      case "expired":
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
      case "draft":
        return "status-pending";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "expired":
        return <X className="w-4 h-4" />;
      case "draft":
        return <Edit className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateOffer = () => {
    console.log("Creating offer:", newOffer);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewOffer({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      targetAudience: "all",
      policyCategories: [""],
      minPurchase: "",
      maxDiscount: "",
      startDate: null,
      endDate: null,
      isActive: true,
    });
  };

  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Seasonal Offers</h1>
              <p className="page-header-subtitle">
                Create and manage promotional campaigns
              </p>
            </div>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gradient-accent text-white floating-button">
                <Plus className="w-4 h-4 mr-2" />
                Create New Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Seasonal Offer</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Offer Title
                    </label>
                    <Input
                      value={newOffer.title}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, title: e.target.value })
                      }
                      placeholder="Enter offer title"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target Audience
                    </label>
                    <Select
                      value={newOffer.targetAudience}
                      onValueChange={(value) =>
                        setNewOffer({ ...newOffer, targetAudience: value })
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="new-customers">
                          New Customers
                        </SelectItem>
                        <SelectItem value="existing-customers">
                          Existing Customers
                        </SelectItem>
                        <SelectItem value="premium-customers">
                          Premium Customers
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={newOffer.description}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, description: e.target.value })
                    }
                    placeholder="Describe the offer and its benefits"
                    className="form-input min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Discount Type
                    </label>
                    <Select
                      value={newOffer.discountType}
                      onValueChange={(value) =>
                        setNewOffer({ ...newOffer, discountType: value })
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Discount Value
                    </label>
                    <Input
                      value={newOffer.discountValue}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          discountValue: e.target.value,
                        })
                      }
                      placeholder={
                        newOffer.discountType === "percentage"
                          ? "e.g., 25"
                          : "e.g., 0.1 ETH"
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Max Discount
                    </label>
                    <Input
                      value={newOffer.maxDiscount}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          maxDiscount: e.target.value,
                        })
                      }
                      placeholder="e.g., 2 ETH"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal form-input"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal form-input"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Purchase Amount
                  </label>
                  <Input
                    value={newOffer.minPurchase}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, minPurchase: e.target.value })
                    }
                    placeholder="e.g., 0.5 ETH"
                    className="form-input"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateOffer}
                    className="flex-1 gradient-accent text-white floating-button"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Create Offer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">Active</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {offers.filter((o) => o.status === "active").length}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Active Offers
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-info">Total</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {offers.reduce((sum, o) => sum + o.redemptions, 0)}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Total Redemptions
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-warning">Revenue</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                268.7 ETH
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Generated Revenue
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <Badge className="status-badge status-active">Rate</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                19.8%
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Avg Conversion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Seasonal Offers
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Showing {paginatedOffers.length} of {filteredOffers.length}{" "}
                  offers
                </p>
              </div>

              <div className="responsive-stack">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search offers..."
                    value={searchTerm}
                    onChange={(e) =>
                      handleFilterChange(() => setSearchTerm(e.target.value))
                    }
                    className="form-input pl-10"
                  />
                </div>
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    handleFilterChange(() => setFilterStatus(value))
                  }
                >
                  <SelectTrigger className="w-full md:w-48 form-input">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {paginatedOffers.map((offer) => (
            <Card key={offer.id} className="glass-card rounded-2xl card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                        {offer.title}
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {offer.id}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`status-badge ${getStatusColor(offer.status)}`}
                  >
                    {getStatusIcon(offer.status)}
                    <span className="ml-1 capitalize">{offer.status}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">
                  {offer.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Discount
                    </p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {offer.discountType === "percentage"
                        ? `${offer.discountValue}%`
                        : `${offer.discountValue} ETH`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Max Discount
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {offer.maxDiscount}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Valid From
                    </p>
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {new Date(offer.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Valid Until
                    </p>
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {new Date(offer.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {offer.status === "active" && (
                  <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Redemptions
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {offer.redemptions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Revenue
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {offer.revenue}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Conversion
                      </p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {offer.conversionRate}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Categories:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {offer.policyCategories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs capitalize bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <Button
                    variant="outline"
                    className="flex-1 floating-button"
                    onClick={() => {
                      setSelectedOffer(offer);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {offer.status === "active" && (
                    <Button
                      variant="outline"
                      className="flex-1 floating-button"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showInfo={true}
          totalItems={filteredOffers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          className="mb-8"
        />

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No offers found
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
      {selectedOffer && (
        <EditOfferDialog
          offer={selectedOffer}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedOffer(null);
          }}
          onSave={(o) => {
            console.log("Saving offer:", o);
            setIsEditDialogOpen(false);
            setSelectedOffer(null);
          }}
        />
      )}
    </div>
  );
}
