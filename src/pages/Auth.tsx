import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  signUpSchema,
  type SignInFormData,
  type SignUpFormData,
} from "@/schemas/auth.schema";
import { useLogin } from "@/hooks/useLogin";
import { useRegister } from "@/hooks/useRegister";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { ErrorDisplay } from "@/components/auth/ErrorDisplay";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { API_BASE_URL } from "@/lib/auth-api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Array<{ message: string; code?: string }>
  >([]);
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);
  const [searchParams] = useSearchParams();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Check if user just registered
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setTimeout(() => {
        setShowRegistrationMessage(true);
        setIsLogin(true);
      }, 0);
    }
  }, [searchParams]);

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

  const onSignIn = async (data: SignInFormData) => {
    setErrors([]);
    setShowRegistrationMessage(false);

    try {
      await loginMutation.mutateAsync({
        identifier: data.email,
        password: data.password,
      });
    } catch (err: unknown) {
      setErrors([{ message: (err as Error).message || "Login failed" }]);
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setErrors([]);

    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (err: unknown) {
      setErrors([{ message: (err as Error).message || "Registration failed" }]);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setErrors([]);
    setShowRegistrationMessage(false);

    try {
      const redirectUrl = searchParams.get("redirect_url") || "/";
      const apiBase = API_BASE_URL;

      window.location.href = `${apiBase}/auth/oauth/${provider}?redirect_url=${encodeURIComponent(
        redirectUrl
      )}`;
    } catch (err: unknown) {
      setErrors([{ message: (err as Error).message || "OAuth login failed" }]);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

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
            <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] mt-16">
              <Link
                to="/"
                className="flex md:hidden items-center gap-3 mb-6 group"
              >
                <Swords className="w-8 h-8 text-secondary group-hover:rotate-12 transition-transform" />
                <h1 className="text-3xl font-black bg-linear-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent pb-2 leading-tight">
                  Hylandia
                </h1>
              </Link>

              {showRegistrationMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3 mb-6"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-200 text-sm font-semibold">
                      Registration Successful!
                    </p>
                    <p className="text-green-200/80 text-xs mt-1">
                      Please check your email to verify your account before
                      logging in.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-2 bg-white/5 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrors([]);
                    setShowRegistrationMessage(false);
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
                    setErrors([]);
                    setShowRegistrationMessage(false);
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

              <SocialLogin onSignIn={handleSocialLogin} isLoading={isLoading} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
