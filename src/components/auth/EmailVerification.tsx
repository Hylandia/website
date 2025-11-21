"use client";

import { motion } from "framer-motion";
import { Mail, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { VerifyCodeFormData } from "@/schemas/auth.schema";
import { ClerkAPIError } from "@clerk/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthBackground } from "./AuthBackground";

interface EmailVerificationProps {
  form: UseFormReturn<VerifyCodeFormData>;
  onSubmit: (data: VerifyCodeFormData) => void;
  onBack: () => void;
  onResend: () => void;
  isLoading: boolean;
  errors?: ClerkAPIError[];
  email: string;
  code: string;
  setCode: (code: string) => void;
}

export function EmailVerification({
  form,
  onSubmit,
  onBack,
  onResend,
  isLoading,
  errors,
  email,
  code,
  setCode,
}: EmailVerificationProps) {
  return (
    <div className="min-h-screen w-screen bg-neutral relative overflow-hidden flex items-center justify-center">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md mx-auto px-6"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Verify your email</h2>
            <p className="text-white/70">
              We've sent a verification code to{" "}
              <span className="text-secondary font-medium">{email}</span>
            </p>
          </div>

          {errors && errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-6"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{errors[0].message}</p>
            </motion.div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-white/80 text-sm font-medium text-center">
                Verification Code
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => {
                    setCode(value);
                    form.setValue("code", value);
                  }}
                >
                  <InputOTPGroup className="gap-2">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-14 w-14 text-2xl bg-white/5 border-white/20 text-white rounded-xl"
                        />
                      ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {form.formState.errors.code && (
                <p className="text-red-400 text-xs mt-1 text-center">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </motion.button>
          </form>

          <div className="mt-6 space-y-4 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-white/60 hover:text-white text-sm transition-colors"
              disabled={isLoading}
            >
              ← Back to registration
            </button>

            <div className="text-sm text-white/50">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={onResend}
                className="text-secondary hover:underline font-medium"
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
