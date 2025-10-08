"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Eye, EyeOff } from "lucide-react";

export default function SettingPage() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // state toggle hiển thị mật khẩu
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full mx-auto px-4 py-2 space-y-10">
      {/* Account Information */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#2563EB] mb-6">
            Account Information
          </h2>

          <div className="space-y-5">
            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-gray-800">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="phanGiang293"
                disabled={!isEditingInfo}
                className="mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-800">
                Email
              </Label>
              <Input
                id="email"
                defaultValue="phanGiang293@gmail.com"
                disabled={!isEditingInfo}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="bg-[#2563EB] hover:bg-[#1E4FCC] text-white"
                onClick={() => setIsEditingInfo(!isEditingInfo)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                {isEditingInfo ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Change Password
          </h2>

          <div className="space-y-5">
            {/* Current password */}
            <div className="relative">
              <Label htmlFor="current-password" className="text-gray-800">
                Current password
              </Label>
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
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

            {/* New password */}
            <div className="relative">
              <Label htmlFor="new-password" className="text-gray-800">
                New password
              </Label>
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
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

            {/* Confirm password */}
            <div className="relative">
              <Label htmlFor="confirm-password" className="text-gray-800">
                Confirm password
              </Label>
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
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
                onClick={() => setIsEditingPassword(!isEditingPassword)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                {isEditingPassword ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
