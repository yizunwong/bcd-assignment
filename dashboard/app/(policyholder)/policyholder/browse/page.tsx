"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Pagination } from "@/components/shared/Pagination";
import { Shield, Search, Filter, Star } from "lucide-react";
import { policyCategories } from "@/public/data/policyholder/browseData";
import PolicyDetailsDialog, {
  Policy,
} from "@/app/(admin)/admin/policies/components/PolicyDetailsDialog";
import Link from "next/link";
import { logEvent } from "@/lib/analytics";
import { usePoliciesQuery, useCategoryCountsQuery } from "@/hooks/usePolicies";
import { useCoverageListQuery } from "@/hooks/useCoverage";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/components/shared/ToastProvider";
import {
  PolicyControllerFindAllCategory,
  PolicyControllerFindAllSortBy,
  PolicyCategoryCountStatsDto,
  PolicyControllerFindAllParams,
} from "@/api";
import { formatValue } from "@/utils/formatHelper";

const ITEMS_PER_PAGE = 6;

export default function BrowsePolicies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    PolicyControllerFindAllCategory | "all"
  >("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const { printMessage } = useToast();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const sortParams = useMemo(() => {
    switch (sortBy) {
      case "popular":
        return {
          sortBy: PolicyControllerFindAllSortBy.id,
          sortOrder: "desc" as const,
        };
      case "rating":
        return {
          sortBy: PolicyControllerFindAllSortBy.rating,
          sortOrder: "desc" as const,
        };
      case "price-low":
        return {
          sortBy: PolicyControllerFindAllSortBy.premium,
          sortOrder: "asc" as const,
        };
      case "price-high":
        return {
          sortBy: PolicyControllerFindAllSortBy.premium,
          sortOrder: "desc" as const,
        };
      default:
        return {
          sortBy: PolicyControllerFindAllSortBy.id,
          sortOrder: "asc" as const,
        };
    }
  }, [sortBy]);

  const { data: categoryCountsData } = useCategoryCountsQuery();
  const { data: coverageData } = useCoverageListQuery({ limit: 100 });

  const purchasedPolicyIds = useMemo(() => {
    return (coverageData?.data || []).map((c: any) => Number(c.policy_id));
  }, [coverageData]);

  const hasFilters = selectedCategory !== "all" || !!debouncedSearchTerm;

  const filters = hasFilters
    ? {
        ...(selectedCategory !== "all" && {
          category: selectedCategory as PolicyControllerFindAllCategory,
        }),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      }
    : {};

  const {
    data: policiesData,
    isLoading,
    error,
  } = usePoliciesQuery({
    ...(filters as PolicyControllerFindAllParams),
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy: sortParams.sortBy,
    sortOrder: sortParams.sortOrder,
  });

  useEffect(() => {
    if (error) {
      printMessage(
        "Failed to load policies: " +
          (typeof error === "string" ? error : "Unknown error"),
        "error"
      );
    }
  }, [error, printMessage]);

  const policies = useMemo<Policy[]>(() => {
    return (policiesData?.data || []).map((policy) => ({
      id: policy.id,
      name: policy.name,
      category: policy.category as PolicyControllerFindAllCategory,
      provider: policy.provider,
      coverage: policy.coverage,
      premium: policy.premium,
      rating: policy.rating,
      features: policy.claim_types ?? [],
      popular: policy.popular,
      revenue: policy.revenue ?? 0,
      description:
        typeof policy.description === "string" ? policy.description : "",
      sales: policy.sales,
    }));
  }, [policiesData]);

  const totalPages = Math.ceil((policiesData?.count || 0) / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  const openDetails = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowDetails(true);
    logEvent("open_policy_details", policy.id);
  };

  const closeDetails = () => {
    setShowDetails(false);
    if (selectedPolicy) logEvent("close_policy_details", selectedPolicy.id);
  };

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
              <h1 className="page-header-title">Browse Insurance Policies</h1>
              <p className="page-header-subtitle">
                Discover and purchase blockchain-secured insurance coverage
              </p>
            </div>
          </div>
        </div>

        {/* Policy Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {policyCategories.map((category) => {
            const count =
              categoryCountsData?.data?.[
                category.id as keyof PolicyCategoryCountStatsDto
              ] ?? 0;

            return (
              <Card
                key={category.id}
                className={`glass-card rounded-2xl cursor-pointer card-hover ${
                  selectedCategory === category.id
                    ? "ring-2 ring-emerald-500"
                    : ""
                }`}
                onClick={() =>
                  handleFilterChange(() =>
                    setSelectedCategory(
                      category.id as PolicyControllerFindAllCategory
                    )
                  )
                }
              >
                <CardContent className="flex items-center p-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mr-4`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {count} policies available
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card className="glass-card rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="responsive-stack">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) =>
                    handleFilterChange(() => setSearchTerm(e.target.value))
                  }
                  className="form-input pl-10"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  handleFilterChange(() =>
                    setSelectedCategory(
                      value as PolicyControllerFindAllCategory | "all"
                    )
                  )
                }
              >
                <SelectTrigger className="w-full md:w-48 form-input">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="health">Health Insurance</SelectItem>
                  <SelectItem value="travel">Travel Insurance</SelectItem>
                  <SelectItem value="crop">Crop Insurance</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  handleFilterChange(() => setSortBy(value))
                }
              >
                <SelectTrigger className="w-full md:w-48 form-input">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing {policies.length} of {policiesData?.count || 0} policies
            {selectedCategory !== "all" && (
              <span>
                {" "}
                in{" "}
                {policyCategories.find((c) => c.id === selectedCategory)?.name}
              </span>
            )}
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Loading policies...
              </h3>
            </div>
          ) : (
            policies.map((policy) => {
              const categoryInfo = policyCategories.find(
                (cat) => cat.id === policy.category
              );
              return (
                <Card
                  key={policy.id}
                  className="glass-card rounded-2xl card-hover relative overflow-hidden"
                >
                  {policy.popular && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      Popular
                    </Badge>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryInfo?.color} flex items-center justify-center mr-3`}
                      >
                        {categoryInfo && (
                          <categoryInfo.icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                          {policy.name}
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {policy.provider}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                        {policy.rating}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {policy.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Coverage
                        </span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {formatValue(policy?.coverage, {
                            currency: typeof policy?.coverage === "number",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Premium
                        </span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {policy.premium} ETH/month
                        </span>
                      </div>
                    </div>

                    {policy.features && policy.features.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Key Features:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {policy.features.slice(0, 3).map((feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {policy.features.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-slate-200 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300"
                            >
                              +{policy.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 floating-button"
                        onClick={() => openDetails(policy)}
                      >
                        Details
                      </Button>
                      {purchasedPolicyIds.includes(Number(policy.id)) ? (
                        <Button className="flex-1" disabled>
                          Purchased
                        </Button>
                      ) : (
                        <Link
                          href={`/policyholder/payment?policy=${policy.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full gradient-accent text-white floating-button">
                            Buy
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showInfo={true}
          totalItems={policiesData?.count || 0}
          itemsPerPage={ITEMS_PER_PAGE}
          className="mt-8"
        />

        {policies.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No policies found
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}

        {selectedPolicy && (
          <PolicyDetailsDialog
            policy={selectedPolicy}
            open={showDetails}
            onClose={closeDetails}
          />
        )}
      </div>
    </div>
  );
}
