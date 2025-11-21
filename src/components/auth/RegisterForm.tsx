"use client";

import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "@/schemas/auth.schema";
import Link from "next/link";

interface RegisterFormProps {
  form: UseFormReturn<SignUpFormData>;
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export function RegisterForm({
  form,
  onSubmit,
  isLoading,
  showPassword,
  setShowPassword,
}: RegisterFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
            <Input
              type="text"
              placeholder="John"
              className="w-full bg-white/5 border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 h-auto"
              {...form.register("firstName")}
            />
          </div>
          {form.formState.errors.firstName && (
            <p className="text-red-400 text-xs mt-1">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
            <Input
              type="text"
              placeholder="Doe"
              className="w-full bg-white/5 border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 h-auto"
              {...form.register("lastName")}
            />
          </div>
          {form.formState.errors.lastName && (
            <p className="text-red-400 text-xs mt-1">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
          <Input
            type="text"
            placeholder="Choose your username"
            className="w-full bg-white/5 border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 h-auto"
            {...form.register("username")}
          />
        </div>
        {form.formState.errors.username && (
          <p className="text-red-400 text-xs mt-1">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
          <Input
            type="email"
            placeholder="your@email.com"
            className="w-full bg-white/5 border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 h-auto"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-red-400 text-xs mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-white/5 border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-white/30 h-auto"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors z-10"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-red-400 text-xs mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
        <p className="text-white/40 text-xs mt-1">
          Must be 8+ characters with uppercase, lowercase, and a number
        </p>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-white/5 border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 h-auto"
            {...form.register("confirmPassword")}
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          className="border-white/20 bg-white/5 mt-0.5"
          checked={form.watch("terms")}
          onCheckedChange={(checked) =>
            form.setValue("terms", checked as boolean)
          }
        />
        <label className="text-white/70 text-sm leading-snug">
          I agree to the{" "}
          <Link href="/terms" className="text-secondary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-secondary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      {form.formState.errors.terms && (
        <p className="text-red-400 text-xs -mt-4">
          {form.formState.errors.terms.message}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
        {!isLoading && (
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        )}
      </motion.button>
    </form>
  );
}
