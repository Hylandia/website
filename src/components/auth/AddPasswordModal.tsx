"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddPasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPasswordModalProps) {
  const { user } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await user?.updatePassword({
        newPassword: password,
      });

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Failed to add password:", err);
      setError(
        err.errors?.[0]?.message || "Failed to add password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ willChange: "opacity" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-neutral-800 border border-primary/20 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Add Password</h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Password Added!
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    You can now use your password to sign in and verify changes.
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-neutral-400 text-sm mb-6">
                    Add a password to your account to enable password-based sign
                    in and verify sensitive operations.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label
                        htmlFor="new-password"
                        className="text-white mb-2 block"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          id="new-password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          disabled={isLoading}
                          className="pl-10 bg-neutral-900/50 border-neutral-700 text-white"
                          placeholder="At least 8 characters"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="confirm-password"
                        className="text-white mb-2 block"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                          }}
                          disabled={isLoading}
                          className="pl-10 bg-neutral-900/50 border-neutral-700 text-white"
                          placeholder="Re-enter your password"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 border-neutral-700 text-white hover:bg-neutral-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || !password || !confirmPassword}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Password"
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
