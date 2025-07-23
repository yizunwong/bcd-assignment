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

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [notifications, setNotifications] = useState(initialNotifications);
  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
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
    <div className="section-spacing">
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
                  KYC Verified
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger value="personal" className="rounded-lg">
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="kyc" className="rounded-lg">
                  KYC Status
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg">
                  Notifications
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

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Address
                      </label>
                      <Input
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Date of Birth
                        </label>
                        <Input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Occupation
                        </label>
                        <Input
                          value={profileData.occupation}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              occupation: e.target.value,
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

              <TabsContent value="kyc">
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      KYC Verification Status
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your identity verification status for compliance
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(kycStatus).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              value.status === "verified"
                                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                : value.status === "pending"
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                : "bg-gradient-to-r from-red-500 to-pink-500"
                            }`}
                          >
                            {getStatusIcon(value.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}{" "}
                              Verification
                            </h3>
                            {value.date && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Verified on{" "}
                                {new Date(value.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={`status-badge ${getStatusColor(
                            value.status
                          )}`}
                        >
                          {getStatusIcon(value.status)}
                          <span className="ml-1 capitalize">
                            {value.status}
                          </span>
                        </Badge>
                      </div>
                    ))}

                    {Object.values(kycStatus).some(
                      (v) => v.status === "pending"
                    ) && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                            Pending Verification
                          </h4>
                        </div>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          Some documents are still under review. This may take
                          1-3 business days to complete.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Notification Preferences
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Choose how you want to receive updates
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        Email Notifications
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            key: "emailClaims",
                            label: "Claim updates and status changes",
                          },
                          {
                            key: "emailPremiums",
                            label: "Premium payment reminders",
                          },
                          {
                            key: "emailOffers",
                            label: "New policy offers and promotions",
                          },
                        ].map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg"
                          >
                            <span className="text-slate-700 dark:text-slate-300">
                              {label}
                            </span>
                            <Button
                              variant={
                                notifications[key as keyof typeof notifications]
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setNotifications({
                                  ...notifications,
                                  [key]:
                                    !notifications[
                                      key as keyof typeof notifications
                                    ],
                                })
                              }
                              className="floating-button"
                            >
                              {notifications[key as keyof typeof notifications]
                                ? "On"
                                : "Off"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        Push Notifications
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            key: "pushClaims",
                            label: "Instant claim notifications",
                          },
                          { key: "pushPremiums", label: "Payment due alerts" },
                          {
                            key: "pushOffers",
                            label: "Special offers and deals",
                          },
                        ].map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg"
                          >
                            <span className="text-slate-700 dark:text-slate-300">
                              {label}
                            </span>
                            <Button
                              variant={
                                notifications[key as keyof typeof notifications]
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setNotifications({
                                  ...notifications,
                                  [key]:
                                    !notifications[
                                      key as keyof typeof notifications
                                    ],
                                })
                              }
                              className="floating-button"
                            >
                              {notifications[key as keyof typeof notifications]
                                ? "On"
                                : "Off"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        SMS Notifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
                          <span className="text-slate-700 dark:text-slate-300">
                            Urgent security alerts only
                          </span>
                          <Button
                            variant={
                              notifications.smsUrgent ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setNotifications({
                                ...notifications,
                                smsUrgent: !notifications.smsUrgent,
                              })
                            }
                            className="floating-button"
                          >
                            {notifications.smsUrgent ? "On" : "Off"}
                          </Button>
                        </div>
                      </div>
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
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              activity.type === "claim"
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                : activity.type === "payment"
                                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                : activity.type === "policy"
                                ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                : "bg-gradient-to-r from-slate-500 to-slate-600"
                            }`}
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
    </div>
  );
}
