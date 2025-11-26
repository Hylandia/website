import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OTPInput, type SlotProps } from "input-otp";
import {
  sendPasswordResetSchema,
  resetPasswordSchema,
  type SendPasswordResetFormData,
  type ResetPasswordFormData,
} from "@/schemas/auth.schema";
import { useSendPasswordResetCode } from "@/hooks/useSendPasswordResetCode";
import { useResetPassword } from "@/hooks/useResetPassword";
import { AuthBackground } from "@/components/auth/AuthBackground";

function Slot(props: SlotProps) {
  return (
    <div
      className={`relative w-12 h-14 text-[2rem] flex items-center justify-center transition-all border-2 bg-white/5 backdrop-blur-sm ${
        props.isActive
          ? "border-primary shadow-[0_0_20px_rgba(190,95,87,0.5)]"
          : "border-white/20"
      }`}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-white" />
    </div>
  );
}

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const sendCodeMutation = useSendPasswordResetCode();
  const resetPasswordMutation = useResetPassword();

  const emailForm = useForm<SendPasswordResetFormData>({
    resolver: zodResolver(sendPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && step === "reset") {
      resetForm.setValue("code", otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  const handleSendCode = async (data: SendPasswordResetFormData) => {
    setError("");
    try {
      await sendCodeMutation.mutateAsync(data.email);
      setEmail(data.email);
      resetForm.setValue("email", data.email);
      setStep("reset");
      setResendCooldown(60);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to send password reset code");
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setError("");
    try {
      await sendCodeMutation.mutateAsync(email);
      setResendCooldown(60);
      setOtp("");
      resetForm.reset({
        email,
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to send password reset code");
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setError("");
    try {
      await resetPasswordMutation.mutateAsync({
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to reset password");
      setOtp("");
      resetForm.setValue("code", "");
    }
  };

  const isLoading =
    sendCodeMutation.isPending || resetPasswordMutation.isPending;

  return (
    <div className="min-h-screen w-screen bg-neutral relative overflow-y-auto flex items-center justify-center py-8">
      <AuthBackground />

      <div className="relative mt-16 z-10 w-full max-w-lg mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">
            {step === "email" ? "Forgot Password?" : "Reset Password"}
          </h1>
          <p className="text-white/60 text-center mb-8">
            {step === "email"
              ? "Enter your email address and we'll send you a verification code"
              : `We've sent a 6-digit code to ${email}`}
          </p>

          {sendCodeMutation.isSuccess && step === "reset" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3 mb-6"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-green-200 text-sm font-semibold">
                  Verification code sent!
                </p>
                <p className="text-green-200/80 text-xs mt-1">
                  Check your email and enter the code below to reset your
                  password.
                </p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"
            >
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          {step === "email" ? (
            <form onSubmit={emailForm.handleSubmit(handleSendCode)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...emailForm.register("email")}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 focus:border-primary text-white placeholder-white/40 transition-colors outline-none"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-linear-to-r from-primary to-secondary text-white font-bold uppercase tracking-wider border-2 border-primary/40 shadow-[inset_0_2px_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(190,95,87,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)}>
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-white mb-3 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center">
                      <OTPInput
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                          setOtp(value);
                          resetForm.setValue("code", value);
                          if (error) setError("");
                        }}
                        containerClassName="flex gap-2"
                        render={({ slots }) => (
                          <>
                            <div className="flex gap-2">
                              {slots.slice(0, 3).map((slot, idx) => (
                                <Slot key={idx} {...slot} />
                              ))}
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="w-3 h-0.5 bg-white/20" />
                            </div>
                            <div className="flex gap-2">
                              {slots.slice(3).map((slot, idx) => (
                                <Slot key={idx} {...slot} />
                              ))}
                            </div>
                          </>
                        )}
                      />
                    </div>
                    {resetForm.formState.errors.code && (
                      <p className="text-red-400 text-sm mt-2 text-center">
                        {resetForm.formState.errors.code.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full text-center">
                    <p className="text-white/60 text-sm mb-2">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCooldown > 0 || isLoading}
                      className="text-primary hover:text-primary/80 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resendCooldown > 0
                        ? `Resend code in ${resendCooldown}s`
                        : "Resend verification code"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...resetForm.register("newPassword")}
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 focus:border-primary text-white placeholder-white/40 transition-colors outline-none pr-12"
                      placeholder="Enter new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...resetForm.register("confirmPassword")}
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 focus:border-primary text-white placeholder-white/40 transition-colors outline-none pr-12"
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full py-3 px-6 bg-linear-to-r from-primary to-secondary text-white font-bold uppercase tracking-wider border-2 border-primary/40 shadow-[inset_0_2px_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(190,95,87,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">
              {step === "reset" && "The verification code expires in 5 minutes"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
