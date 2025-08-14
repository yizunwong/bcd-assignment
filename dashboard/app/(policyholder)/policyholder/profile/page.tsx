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
  User,
  Shield,
  Bell,
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
} from "@/public/data/policyholder/profileData";
import { useMeQuery } from "@/hooks/useAuth";
import { useActivityLogsQuery } from "@/hooks/useActivityLog";
import {
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from "@/hooks/useUsers";
import { useToast } from "@/components/shared/ToastProvider";
import { ProfileResponseDto } from "@/api";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [profileData, setProfileData] =
    useState<ProfileResponseDto>(initialProfileData);
  const [notifications, setNotifications] = useState(initialNotifications);
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
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (userResponse?.data) {
      const user: ProfileResponseDto = userResponse.data;
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
        avatarUrl: user.avatarUrl ?? prev.avatarUrl,
      }));
    }
  }, [userResponse]);
  const handleSave = async () => {
    if (!userResponse?.data?.id) return;
    try {
      await updateUser(userResponse.data.id, {
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

  const onStartDrag = (
    e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>
  ) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    startPos.current = { ...position };
  };

  const onDrag = (
    e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>
  ) => {
    if (!dragStart.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    setPosition({ x: startPos.current.x + dx, y: startPos.current.y + dy });
  };

  const onEndDrag = () => {
    dragStart.current = null;
  };

  const handleCropCancel = () => {
    setCropOpen(false);
    setSelectedFile(null);
    setImageSrc("");
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = () => {
    if (!userResponse?.data?.id || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imgRef.current;
    const scale = img.naturalWidth / img.width;
    const sx = (-position.x / zoom) * scale;
    const sy = (-position.y / zoom) * scale;
    const sWidth = (size / zoom) * scale;
    const sHeight = (size / zoom) * scale;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(imgRef.current, sx, sy, sWidth, sHeight, 0, 0, size, size);
    ctx.restore();
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        const avatarFile = new File([blob], selectedFile?.name || "avatar.png", {
          type: "image/png",
        });
        const res = await uploadAvatar(userResponse.data!.id, {
          files: [avatarFile],
        });
        setProfileData((prev) => ({
          ...prev,
          avatarUrl: res.data?.url as string,
        }));
        printMessage("Profile picture updated", "success");
      } catch (err) {
        console.error(err);
        printMessage("Upload failed", "error");
      } finally {
        handleCropCancel();
      }
    }, "image/png");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      printMessage("Please select an image file", "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
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
    <>
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
      <ConfirmationDialog
        open={confirmOpen}
        title="Save Changes"
        description="Are you sure you want to save these changes?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSave}
      />
      <Dialog open={cropOpen} onOpenChange={(o) => !o && handleCropCancel()}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-64 h-64 overflow-hidden bg-slate-200 rounded-full">
              {imageSrc && (
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Preview"
                  className="select-none"
                  style={{
                    width: "auto",
                    height: "auto",
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transformOrigin: "top left",
                    cursor: dragStart.current ? "grabbing" : "grab",
                  }}
                  onMouseDown={onStartDrag}
                  onMouseMove={onDrag}
                  onMouseUp={onEndDrag}
                  onMouseLeave={onEndDrag}
                  onTouchStart={onStartDrag}
                  onTouchMove={onDrag}
                  onTouchEnd={onEndDrag}
                  draggable={false}
                />
              )}
              <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white" />
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCropCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} className="flex-1 gradient-accent text-white">
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
