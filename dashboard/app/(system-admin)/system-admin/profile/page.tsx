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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  Key,
  Activity,
  Award,
  Users,
  BarChart3,
  Crown,
  Server,
  Code,
  Database,
  Monitor,
  Settings,
} from "lucide-react";
import {
  profileData as initialProfileData,
  notifications as initialNotifications,
  systemStats,
  activityLog,
  systemPermissions,
  securitySettings,
} from "@/public/data/system-admin/profileData";

export default function SystemAdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);

  const [notifications, setNotifications] = useState(initialNotifications);
  // Data moved to public/data/system-admin/profileData.ts

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
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
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-header-title">System Admin Profile</h1>
              <p className="page-header-subtitle">
                Manage your system administrator account and security settings
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
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
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
                  {profileData.position}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                  {profileData.company}
                </p>
                <div className="space-y-2">
                  <Badge className="status-badge bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    <Crown className="w-3 h-3 mr-1" />
                    System Admin
                  </Badge>
                  <Badge className="status-badge status-error">
                    <Lock className="w-3 h-3 mr-1" />
                    {profileData.clearanceLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* System Stats */}
            <Card className="glass-card rounded-2xl mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    System Uptime
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {systemStats.systemUptime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Users Managed
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {systemStats.usersManaged}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Contracts Deployed
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {systemStats.contractsDeployed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Security Incidents
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {systemStats.securityIncidents}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger value="personal" className="rounded-lg">
                  Personal
                </TabsTrigger>
                <TabsTrigger value="permissions" className="rounded-lg">
                  Permissions
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg">
                  Security
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
                          Position
                        </label>
                        <Input
                          value={profileData.position}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              position: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Department
                        </label>
                        <Input
                          value={profileData.department}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              department: e.target.value,
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
                          Employee ID
                        </label>
                        <Input
                          value={profileData.employeeId}
                          disabled
                          className="form-input bg-slate-100 dark:bg-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Clearance Level
                        </label>
                        <Input
                          value={profileData.clearanceLevel}
                          disabled
                          className="form-input bg-slate-100 dark:bg-slate-700"
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

              <TabsContent value="permissions">
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      System Permissions
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your system administrator access permissions
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {systemPermissions.map((permission, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                        >
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                              {permission.name}
                            </span>
                          </div>
                          <Badge className="status-badge status-active">
                            Full Access
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      Security Settings
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Critical security configurations and protocols
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securitySettings.map((setting, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                setting.critical
                                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                                  : "bg-gradient-to-r from-blue-500 to-cyan-500"
                              }`}
                            >
                              {setting.critical ? (
                                <Shield className="w-5 h-5 text-white" />
                              ) : (
                                <Settings className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-100">
                                {setting.name}
                              </p>
                              {setting.value && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {setting.value}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {setting.critical && (
                              <Badge className="status-badge status-error text-xs">
                                Critical
                              </Badge>
                            )}
                            <Badge
                              className={`status-badge ${
                                setting.status === "enabled" ||
                                setting.status === "active"
                                  ? "status-active"
                                  : "status-pending"
                              }`}
                            >
                              {setting.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="glass-card rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      System Notifications
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Configure system and security alert preferences
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
                            key: "emailSecurity",
                            label: "Security alerts and incidents",
                          },
                          {
                            key: "emailSystem",
                            label: "System status and maintenance",
                          },
                          {
                            key: "emailUsers",
                            label: "User management activities",
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
                            key: "pushSecurity",
                            label: "Critical security alerts",
                          },
                          {
                            key: "pushSystem",
                            label: "System downtime and errors",
                          },
                          { key: "pushUsers", label: "User access violations" },
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
                        Emergency Notifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50/50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <span className="text-red-700 dark:text-red-300">
                            Emergency SMS alerts
                          </span>
                          <Button
                            variant={
                              notifications.smsEmergency ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setNotifications({
                                ...notifications,
                                smsEmergency: !notifications.smsEmergency,
                              })
                            }
                            className="floating-button"
                          >
                            {notifications.smsEmergency ? "On" : "Off"}
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
                      System Activity Log
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Recent system administration activities
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
                              activity.type === "system"
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                : activity.type === "user"
                                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                : activity.type === "contract"
                                ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                : "bg-gradient-to-r from-red-500 to-pink-500"
                            }`}
                          >
                            {activity.type === "system" && (
                              <Monitor className="w-5 h-5 text-white" />
                            )}
                            {activity.type === "user" && (
                              <Users className="w-5 h-5 text-white" />
                            )}
                            {activity.type === "contract" && (
                              <Code className="w-5 h-5 text-white" />
                            )}
                            {activity.type === "security" && (
                              <Shield className="w-5 h-5 text-white" />
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
