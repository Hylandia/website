import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OTPInput, type SlotProps } from "input-otp";
import {
  verifyCodeSchema,
  type VerifyCodeFormData,
} from "@/schemas/auth.schema";
import { useSendVerificationCode } from "@/hooks/useSendVerificationCode";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
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

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const sendCodeMutation = useSendVerificationCode();
  const verifyEmailMutation = useVerifyEmail();

  const form = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  // Send initial verification code
  useEffect(() => {
    if (email && !sendCodeMutation.isSuccess) {
      handleSendCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

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
    if (otp.length === 6) {
      handleVerify(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleSendCode = async () => {
    if (!email) return;

    setError("");
    try {
      await sendCodeMutation.mutateAsync(email);
      setResendCooldown(60);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to send verification code");
    }
  };

  const handleVerify = async (code: string) => {
    if (!email) return;

    setError("");
    try {
      await verifyEmailMutation.mutateAsync({ email, code });
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid verification code");
      setOtp("");
    }
  };

  const isLoading = sendCodeMutation.isPending || verifyEmailMutation.isPending;

  if (!email) {
    return null;
  }

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
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Verify Your Email
          </h1>
          <p className="text-white/60 text-center mb-8">
            We've sent a 6-digit code to{" "}
            <span className="text-white font-semibold">{email}</span>
          </p>

          {sendCodeMutation.isSuccess && !sendCodeMutation.isPending && (
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
                  Check your email and enter the 6-digit code below.
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

          <form onSubmit={form.handleSubmit((data) => handleVerify(data.code))}>
            <div className="flex flex-col items-center gap-6 mb-8">
              <OTPInput
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  form.setValue("code", value);
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

              {isLoading && (
                <div className="flex items-center gap-2 text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Verifying...</span>
                </div>
              )}
            </div>

            <div className="text-center space-y-4">
              <p className="text-white/60 text-sm">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={resendCooldown > 0 || isLoading}
                className="text-primary hover:text-primary/80 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Resend verification code"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">
              The verification code expires in 5 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
