"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  signUpSchema,
  verifyCodeSchema,
  type SignInFormData,
  type SignUpFormData,
  type VerifyCodeFormData,
} from "@/schemas/auth.schema";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { ClerkAPIError, OAuthStrategy } from "@clerk/types";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { ErrorDisplay } from "@/components/auth/ErrorDisplay";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { EmailVerification } from "@/components/auth/EmailVerification";

function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");

  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const verifyForm = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSignIn = async (data: SignInFormData) => {
    setErrors(undefined);
    setIsLoading(true);
    if (!signInLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setSignInActive({ session: signInAttempt.createdSessionId });
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      // Check if error is about invalid verification strategy (OAuth account)
      if (
        err.errors &&
        err.errors.some((e: any) => e.code === "strategy_for_user_invalid")
      ) {
        setErrors([
          {
            message:
              "This account uses social login (Google, GitHub, or Microsoft). Please use the social login buttons below.",
            code: "oauth_account",
          } as ClerkAPIError,
        ]);
      } else if (err.errors) {
        setErrors(err.errors);
      } else {
        console.error("Error:", JSON.stringify(err, null, 2));
      }
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setErrors(undefined);
    setIsLoading(true);
    if (!signUpLoaded) {
      return;
    }

    try {
      const result = await signUp.create({
        username: data.username,
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setVerifying(true);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      if (err.errors) setErrors(err.errors);
      else console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  const handleVerify = async (data: VerifyCodeFormData) => {
    setErrors(undefined);
    setIsLoading(true);

    if (!signUpLoaded) {
      return;
    }

    if (code.length !== 6) {
      setErrors([
        { message: "Please enter a valid 6-digit code" } as ClerkAPIError,
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setSignUpActive({ session: signUpAttempt.createdSessionId });
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        setErrors([
          {
            message: "Verification failed. Please try again.",
          } as ClerkAPIError,
        ]);
        console.error("Verification failed:", signUpAttempt);
      }
    } catch (err: any) {
      if (err.errors) setErrors(err.errors);
      else console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRegistration = () => {
    setVerifying(false);
    setErrors(undefined);
    setCode("");
  };

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/auth/sso-callback",
      redirectUrlComplete: redirectUrl || "/",
    });
  };

  async function handleSignInWith(strategy: OAuthStrategy) {
    if (!signIn || !signUp) return null;

    setErrors(undefined);

    try {
      await signInWith(strategy);
    } catch (err: any) {
      if (err.errors) setErrors(err.errors);
      else console.error("OAuth Error:", JSON.stringify(err, null, 2));
    }
  }

  if (verifying) {
    return (
      <EmailVerification
        form={verifyForm}
        onSubmit={handleVerify}
        onBack={handleBackToRegistration}
        onResend={async () => {
          try {
            await signUp?.prepareEmailAddressVerification({
              strategy: "email_code",
            });
          } catch (error) {
            console.error("Error resending code:", error);
          }
        }}
        isLoading={isLoading}
        errors={errors}
        email={signUpForm.watch("email")}
        code={code}
        setCode={setCode}
      />
    );
  }

  return (
    <div className="min-h-screen w-screen bg-neutral relative overflow-y-auto flex items-center justify-center py-8">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start md:items-center">
          <AuthBranding />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <Link
                href="/"
                className="flex md:hidden items-center gap-3 mb-6 group"
              >
                <Swords className="w-8 h-8 text-secondary group-hover:rotate-12 transition-transform" />
                <h1 className="text-3xl font-black bg-linear-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent pb-2 leading-tight">
                  Hylandia
                </h1>
              </Link>

              <div className="flex gap-2 bg-white/5 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrors(undefined);
                  }}
                  className={`flex-1 py-2 md:py-3 px-4 md:px-6 font-bold transition-all uppercase tracking-wider border-2 text-sm md:text-base ${
                    isLogin
                      ? "bg-linear-to-r from-primary to-secondary text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.2)] border-primary/40"
                      : "text-white/60 hover:text-white border-transparent hover:border-white/20"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrors(undefined);
                  }}
                  className={`flex-1 py-2 md:py-3 px-4 md:px-6 font-bold transition-all uppercase tracking-wider border-2 text-sm md:text-base ${
                    !isLogin
                      ? "bg-linear-to-r from-primary to-secondary text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.2)] border-primary/40"
                      : "text-white/60 hover:text-white border-transparent hover:border-white/20"
                  }`}
                >
                  Register
                </button>
              </div>

              <ErrorDisplay errors={errors} />

              {isLogin ? (
                <LoginForm
                  form={signInForm}
                  onSubmit={onSignIn}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              ) : (
                <RegisterForm
                  form={signUpForm}
                  onSubmit={onSignUp}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              )}

              <div id="clerk-captcha" className="mt-4" />
              <SocialLogin onSignIn={handleSignInWith} isLoading={isLoading} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral">
          <div className="animate-spin">
            <Swords className="w-8 h-8 text-primary" />
          </div>
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
