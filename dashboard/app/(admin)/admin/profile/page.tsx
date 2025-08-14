"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  profileData as defaultProfileData,
  adminStats,
  permissions,
} from "@/public/data/admin/profileData";
import { useActivityLogsQuery } from "@/hooks/useActivityLog";
import { useUpdateUserMutation } from "@/hooks/useUsers";
import { useToast } from "@/components/shared/ToastProvider";
import { useAuthStore } from "@/store/useAuthStore";
import {
  User,
  Shield,
  Bell,
  Camera,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Key,
  Award,
  Users,
} from "lucide-react";
import {
  CompanyDetailsDtoEmployeesNumber,
  CompanyDetailsDtoYearsInBusiness,
  ProfileResponseDto,
} from "@/api";

const roleLabels: Record<string, string> = {
  insurance_admin: "Insurance Admin",
  policyholder: "Policyholder",
  system_admin: "System Admin",
};

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] =
    useState<ProfileResponseDto>(defaultProfileData);
  const userId = useAuthStore((state) => state.userId);
  const { data: activityLogs, isLoading: isActivityLoading } =
    useActivityLogsQuery({
      userId: userId,
      page: 1,
      limit: 5,
    });
  const { updateUser, isPending } = useUpdateUserMutation();
  const { printMessage } = useToast();

  const handleSave = async () => {
    if (!userId) return;
    try {
      await updateUser(userId, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
        role: profileData.role,
        company: {
          name: profileData.companyName,
          address: profileData.companyAddress,
          contact_no: profileData.companyContactNo,
          license_number: profileData.companyLicenseNo,
          employees_number:
            profileData.companyEmployeesNumber ??
            CompanyDetailsDtoEmployeesNumber["1-10_employees"],
          years_in_business:
            profileData.companyYearsInBusiness ??
            CompanyDetailsDtoYearsInBusiness["0-1_years"],
        },
      });
      printMessage("Profile updated", "success");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      printMessage("Update failed", "error");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Admin Profile</h1>
              <p className="page-header-subtitle">
                Manage your administrative account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src="/api/placeholder/96/96" alt="Profile" />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white shadow-lg hover:shadow-xl"
                  >
                    <Camera className="w-4 h-4 text-slate-600" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  {profileData.companyName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                  {profileData.companyAddress}
                </p>
                <div className="space-y-2">
                  <Badge className="status-badge status-active">
                    <Shield className="w-3 h-3 mr-1" />
                    {roleLabels[profileData.role]}
                  </Badge>
                  <Badge className="status-badge status-info">
                    <Award className="w-3 h-3 mr-1" />
                    Licensed Professional
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card rounded-2xl mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Claims Reviewed
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {adminStats.claimsReviewed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Policies Managed
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {adminStats.policiesManaged}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Reports Generated
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {adminStats.reportsGenerated}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Avg Processing
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {adminStats.avgProcessingTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger value="personal" className="rounded-lg">
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-lg">
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="glass-card rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Personal Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="floating-button"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="floating-button"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={isPending}
                          className="gradient-accent text-white floating-button"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          First Name
                        </label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              firstName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Last Name
                        </label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              lastName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <Input
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone Number
                        </label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Company Information
                    </CardTitle>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Company Name
                        </label>
                        <Input
                          value={profileData.companyName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              companyName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Company Address
                        </label>
                        <Input
                          value={profileData.companyAddress}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              companyAddress: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Company Contact No
                        </label>
                        <Input
                          value={profileData.companyContactNo}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              companyContactNo: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Company License No
                        </label>
                        <Input
                          value={profileData.companyLicenseNo}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              companyLicenseNo: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Bio
                      </label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="form-input min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Recent Activity
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your recent administrative actions and system activity
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isActivityLoading ? (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Loading...
                        </p>
                      ) : (
                        (activityLogs?.data ?? []).map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                          >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-800 dark:text-slate-100">
                                {activity.action}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {activity.timestamp
                                  ? new Date(activity.timestamp).toLocaleDateString()
                                  : ""}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
