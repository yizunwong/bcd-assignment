"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  profileData as defaultProfileData,
  notifications as defaultNotifications,
  adminStats,
  permissions,
} from "@/public/data/admin/profileData";
import { useMeQuery } from "@/hooks/useAuth";
import { useActivityLogsQuery } from "@/hooks/useActivityLog";
import {
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from "@/hooks/useUsers";
import { useToast } from "@/components/shared/ToastProvider";
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
  UploadDocDto,
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
  const [notifications, setNotifications] = useState(defaultNotifications);
  const { data: userResponse } = useMeQuery();
  const { data: activityLogs, isLoading: isActivityLoading } =
    useActivityLogsQuery({
      userId: userResponse?.data?.id,
      page: 1,
      limit: 5,
    });
  const { updateUser, isPending } = useUpdateUserMutation();
  const { uploadAvatar } = useUploadAvatarMutation();
  const { printMessage } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(profileData);

  useEffect(() => {
    if (userResponse?.data) {
      const user = userResponse.data;
      setProfileData((prev) => ({
        ...prev,
        firstName: user.firstName ?? prev.firstName,
        lastName: user.lastName ?? prev.lastName,
        role: user.role ?? prev.role,
        email: user.email ?? prev.email,
        phone: user.phone ?? prev.phone,
        companyName: user.companyName ?? prev.companyName,
        companyAddress: user.companyAddress ?? prev.companyAddress,
        companyContactNo: user.companyContactNo ?? prev.companyContactNo,
        companyLicenseNo: user.companyLicenseNo ?? prev.companyLicenseNo,
        bio: user.bio ?? prev.bio,
        avatarUrl: user.avatarUrl ?? prev.avatarUrl,
      }));
    }
  }, [userResponse]);

  const handleSave = async () => {
    if (!userResponse?.data?.id) return;
    try {
      await updateUser(userResponse.data.id, {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userResponse?.data?.id) return;
    try {
      const res = await uploadAvatar(userResponse.data.id, {
        files: [file],
      });
      setProfileData((prev) => ({
        ...prev,
        avatarUrl: res.data?.url as string,
      }));
      printMessage("Profile picture updated", "success");
    } catch (err) {
      console.error(err);
      printMessage("Upload failed", "error");
    }
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
                    <AvatarImage
                      src={profileData.avatarUrl || "/api/placeholder/96/96"}
                      alt="Profile"
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white shadow-lg hover:shadow-xl"
                    onClick={() => fileInputRef.current?.click()}
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
                                  ? new Date(
                                      activity.timestamp
                                    ).toLocaleDateString()
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
