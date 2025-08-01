"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Bell,
  Lock,
  Camera,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X,
} from "lucide-react";
import {
  profileData as initialProfileData,
  notifications as initialNotifications,
  kycStatus,
  activityLog,
} from "@/public/data/policyholder/profileData";
import { useMeQuery } from "@/hooks/useAuth";
import { useUpdateUserMutation } from "@/hooks/useUsers";
import { useToast } from "@/components/shared/ToastProvider";
import ConfirmationDialog from "@/app/(admin)/admin/policies/components/ConfirmationDialog";
import { ProfileResponseDto } from "@/api";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [profileData, setProfileData] =
    useState<ProfileResponseDto>(initialProfileData);
  const [notifications, setNotifications] = useState(initialNotifications);
  const { data } = useMeQuery();
  const { updateUser, isPending } = useUpdateUserMutation();
  const { printMessage } = useToast();

  useEffect(() => {
    if (data?.data) {
      const user: ProfileResponseDto = data.data;
      setProfileData((prev) => ({
        ...prev,
        id: user.id ?? prev.id,
        role: user.role ?? prev.role,
        firstName: user.firstName ?? prev.firstName,
        lastName: user.lastName ?? prev.lastName,
        email: user.email ?? prev.email,
        phone: user.phone ?? prev.phone,
        address: user.address ?? prev.address,
        occupation: user.occupation ?? prev.occupation,
        dateOfBirth: user.dateOfBirth ?? prev.dateOfBirth,
        bio: user.bio ?? prev.bio,
      }));
    }
  }, [data]);
  const handleSave = async () => {
    if (!data?.data?.id) return;
    try {
      await updateUser(data.data.id, {
        role: profileData.role,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
        dateOfBirth: profileData.dateOfBirth,
        occupation: profileData.occupation,
        address: profileData.address,
      });
      printMessage("Profile updated", "success");
      setIsEditing(false);
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      printMessage("Update failed", "error");
      setConfirmOpen(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "status-active";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-error";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <><div className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-header-icon">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">Profile Settings</h1>
              <p className="page-header-subtitle">
                Manage your account information and preferences
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
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {profileData.occupation}
                </p>
                <Badge className="status-badge status-active">
                  <Shield className="w-3 h-3 mr-1" />
                  {profileData.status.charAt(0).toUpperCase() +
                    profileData.status.slice(1)}
                </Badge>
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
                          onClick={() => setConfirmOpen(true)}
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
                          onChange={(e) => setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })}
                          disabled={!isEditing}
                          className="form-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Last Name
                        </label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })}
                          disabled={!isEditing}
                          className="form-input" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })}
                          disabled={!isEditing}
                          className="form-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone Number
                        </label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })}
                          disabled={!isEditing}
                          className="form-input" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Address
                      </label>
                      <Input
                        value={profileData.address}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })}
                        disabled={!isEditing}
                        className="form-input" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Date of Birth
                        </label>
                        <Input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            dateOfBirth: e.target.value,
                          })}
                          disabled={!isEditing}
                          className="form-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Occupation
                        </label>
                        <Input
                          value={profileData.occupation}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            occupation: e.target.value,
                          })}
                          disabled={!isEditing}
                          className="form-input" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Bio
                      </label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          bio: e.target.value,
                        })}
                        disabled={!isEditing}
                        className="form-input min-h-[100px]" />
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
                      Your account activity and transaction history
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityLog.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === "claim"
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                : activity.type === "payment"
                                  ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                  : activity.type === "policy"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                    : "bg-gradient-to-r from-slate-500 to-slate-600"}`}
                          >
                            {activity.type === "claim" && (
                              <Shield className="w-5 h-5 text-white" />
                            )}
                            {activity.type === "payment" && (
                              <CheckCircle className="w-5 h-5 text-white" />
                            )}
                            {activity.type === "policy" && (
                              <Lock className="w-5 h-5 text-white" />
                            )}
                            {activity.type === "profile" && (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {activity.action}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div><ConfirmationDialog
        open={confirmOpen}
        title="Save Changes"
        description="Are you sure you want to save these changes?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSave} /></>
  );
}
