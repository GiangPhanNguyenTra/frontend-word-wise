"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Eye, EyeOff, Loader2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserInfo, changePassword } from "@/services/userService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingPage() {
  const { user, updateUser } = useAuth();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingPass, setIsLoadingPass] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdateInfo = async () => {
    if (!isEditingInfo) {
      setIsEditingInfo(true);
      return;
    }

    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsLoadingInfo(true);
    try {
      const res = await updateUserInfo({ username });

      if (res.success && res.data) {
        if (res.data.newToken) {
          localStorage.setItem("accessToken", res.data.newToken);
        }

        updateUser({
          username: res.data.userInfo.username,
          avatar: res.data.userInfo.avatarUrl,
        });

        toast.success("User information updated successfully");
        setIsEditingInfo(false);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message || "Failed to update info");
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large (max 5MB)");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");
      const uploadData = await uploadRes.json();
      const avatarUrl = uploadData.url;

      const updateRes = await updateUserInfo({ avatar: avatarUrl });

      if (updateRes.success && updateRes.data) {
        if (updateRes.data.newToken) {
          localStorage.setItem("accessToken", updateRes.data.newToken);
        }

        updateUser({
          username: updateRes.data.userInfo.username,
          avatar: updateRes.data.userInfo.avatarUrl,
        });

        toast.success("Avatar updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!isEditingPassword) {
      setIsEditingPassword(true);
      return;
    }

    if (!currentPassword || !newPassword || !reNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== reNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoadingPass(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        reNewPassword,
      });
      toast.success("Password changed successfully");
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setReNewPassword("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message || "Failed to change password");
    } finally {
      setIsLoadingPass(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-2 space-y-10">
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#2563EB] mb-6">
            Account Information
          </h2>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative group cursor-pointer"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <Avatar className="h-24 w-24 border-2 border-gray-100">
                  <AvatarImage
                    src={
                      user?.avatar ||
                      "https://api.dicebear.com/6.x/bottts/png?seed=John"
                    }
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {user?.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="text-white w-6 h-6" />
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <span className="text-xs text-gray-500">
                Click to change avatar
              </span>
            </div>

            <div className="space-y-5 flex-1 w-full">
              <div>
                <Label htmlFor="username" className="text-gray-800">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditingInfo}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-800">
                  Email
                </Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled={true}
                  className="mt-1 bg-gray-50"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  className="bg-[#2563EB] hover:bg-[#1E4FCC] text-white"
                  onClick={handleUpdateInfo}
                  disabled={isLoadingInfo}
                >
                  {isLoadingInfo ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <Pencil className="w-4 h-4 mr-2" />
                  )}
                  {isEditingInfo ? "Save" : "Edit"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Change Password
          </h2>

          <div className="space-y-5">
            <div className="relative">
              <Label htmlFor="current-password" className="text-gray-800">
                Current password
              </Label>
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={!isEditingPassword}
                className="mt-1 pr-10"
              />
              {isEditingPassword && (
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-[55%] text-gray-500 hover:text-gray-700"
                >
                  {!showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="new-password" className="text-gray-800">
                New password
              </Label>
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={!isEditingPassword}
                className="mt-1 pr-10"
              />
              {isEditingPassword && (
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-[55%] text-gray-500 hover:text-gray-700"
                >
                  {!showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="confirm-password" className="text-gray-800">
                Confirm password
              </Label>
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={reNewPassword}
                onChange={(e) => setReNewPassword(e.target.value)}
                disabled={!isEditingPassword}
                className="mt-1 pr-10"
              />
              {isEditingPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-[55%] text-gray-500 hover:text-gray-700"
                >
                  {!showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="bg-[#2563EB] hover:bg-[#1E4FCC] text-white"
                onClick={handleChangePassword}
                disabled={isLoadingPass}
              >
                {isLoadingPass ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Pencil className="w-4 h-4 mr-2" />
                )}
                {isEditingPassword ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
