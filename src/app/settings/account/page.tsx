"use client";

import { useState, useRef } from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { AddPasswordModal } from "@/components/auth/AddPasswordModal";
import {
  User,
  Mail,
  AtSign,
  Save,
  Loader2,
  Upload,
  Camera,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AccountSettingsPage() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
  });

  const isOAuthOnly =
    user && !user.passwordEnabled && user.externalAccounts.length > 0;

  // Action functions that will be wrapped with reverification
  const updateProfileAction = async () => {
    setIsLoading(true);
    setSuccess(false);
    setAvatarError("");

    try {
      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setAvatarError("Failed to update profile. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatarAction = async (file: File) => {
    setIsUploadingAvatar(true);
    setAvatarError("");

    try {
      await user?.setProfileImage({ file });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      setAvatarError("Failed to upload image. Please try again.");
      throw error;
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAvatarAction = async () => {
    setIsUploadingAvatar(true);
    setAvatarError("");

    try {
      await user?.setProfileImage({ file: null });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to remove avatar:", error);
      setAvatarError("Failed to remove image. Please try again.");
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Wrap actions with reverification
  const performUpdateWithReverification =
    useReverification(updateProfileAction);
  const performRemoveAvatarWithReverification =
    useReverification(removeAvatarAction);

  const handleSave = async () => {
    if (isOAuthOnly) {
      setShowAddPasswordModal(true);
      return;
    }

    const result = await performUpdateWithReverification();
    if (!result) {
      // User cancelled reverification
      return;
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 10MB");
      return;
    }

    if (isOAuthOnly) {
      setShowAddPasswordModal(true);
      return;
    }

    // Create a wrapped function with the file
    const performUpload = useReverification(() => uploadAvatarAction(file));
    const result = await performUpload();
    if (!result) {
      // User cancelled reverification
      return;
    }
  };

  const handleRemoveAvatar = async () => {
    if (isOAuthOnly) {
      setShowAddPasswordModal(true);
      return;
    }

    const result = await performRemoveAvatarWithReverification();
    if (!result) {
      // User cancelled reverification
      return;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-neutral-400">
        <Link
          href="/"
          className="hover:text-primary transition-colors uppercase tracking-wider font-semibold"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white uppercase tracking-wider font-semibold">
          Account Settings
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-800/80 backdrop-blur-xl border-2 border-primary/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(190,95,87,0.5)]" />
          <h1
            className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Account Settings
          </h1>
        </div>

        {/* Profile Picture */}
        <div className="mb-8">
          <Label className="text-white mb-3 block uppercase tracking-wider font-bold">
            Profile Picture
          </Label>
          <div className="flex items-center gap-6">
            <div className="relative group">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-24 h-24 border-4 border-primary/40 object-cover shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                />
              ) : (
                <div className="w-24 h-24 bg-primary/20 border-4 border-primary/40 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                  <User className="w-12 h-12 text-primary" />
                </div>
              )}
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="border-primary/30 text-white hover:bg-primary/10 hover:border-primary/50"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploadingAvatar ? "Uploading..." : "Upload Photo"}
              </Button>
              {user.imageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveAvatar}
                  disabled={isUploadingAvatar}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                >
                  Remove Photo
                </Button>
              )}
              <p className="text-xs text-neutral-400">
                JPG, PNG or GIF. Max size 10MB.
              </p>
              {avatarError && (
                <p className="text-xs text-red-400">{avatarError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="firstName"
                className="text-white mb-2 block uppercase tracking-wider font-cinzel font-semibold"
              >
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="pl-10 bg-neutral-900/50 border-neutral-700 text-white"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="lastName"
                className="text-white mb-2 block uppercase tracking-wider font-cinzel font-semibold"
              >
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="pl-10 bg-neutral-900/50 border-neutral-700 text-white"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <Label
              htmlFor="username"
              className="text-white mb-2 block uppercase tracking-wider font-cinzel font-semibold"
            >
              Username
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="pl-10 bg-neutral-900/50 border-neutral-700 text-white"
                placeholder="johndoe"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-white mb-2 block uppercase tracking-wider font-cinzel font-semibold"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="email"
                value={user.emailAddresses[0]?.emailAddress || ""}
                disabled
                className="pl-10 bg-neutral-900/30 border-neutral-700 text-neutral-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Email cannot be changed directly. Manage via connected accounts.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-500/10 border-2 border-green-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          >
            <p className="text-green-400 text-sm font-semibold uppercase tracking-wide">
              Profile updated successfully!
            </p>
          </motion.div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="border-neutral-700 text-white hover:bg-neutral-700"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* OAuth Warning Banner */}
      {isOAuthOnly && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm">
              Password Required for Account Changes
            </p>
            <p className="text-yellow-400/80 text-sm mt-1">
              You signed up using a social login. Add a password to make changes
              to your account.
            </p>
            <Button
              onClick={() => setShowAddPasswordModal(true)}
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
            >
              Add Password
            </Button>
          </div>
        </motion.div>
      )}

      {/* Add Password Modal */}
      <AddPasswordModal
        isOpen={showAddPasswordModal}
        onClose={() => {
          setShowAddPasswordModal(false);
        }}
        onSuccess={() => {
          user?.reload();
        }}
      />
    </>
  );
}
