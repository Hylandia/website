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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/90 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
            <Input
              type="text"
              placeholder="John"
              className="w-full bg-white/5 border-2 border-white/20 py-2 pl-10 pr-3 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent text-sm"
              {...form.register("firstName")}
            />
          </div>
          {form.formState.errors.firstName && (
            <p className="text-red-400 text-xs mt-0.5">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-white/90 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
            <Input
              type="text"
              placeholder="Doe"
              className="w-full bg-white/5 border-2 border-white/20 py-2 pl-10 pr-3 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent text-sm"
              {...form.register("lastName")}
            />
          </div>
          {form.formState.errors.lastName && (
            <p className="text-red-400 text-xs mt-0.5">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-white/90 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
          <Input
            type="text"
            placeholder="Choose your username"
            className="w-full bg-white/5 border-2 border-white/20 py-2 pl-10 pr-3 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent text-sm"
            {...form.register("username")}
          />
        </div>
        {form.formState.errors.username && (
          <p className="text-red-400 text-xs mt-0.5">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-white/90 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
          <Input
            type="email"
            placeholder="your@email.com"
            className="w-full bg-white/5 border-2 border-white/20 py-2 pl-10 pr-3 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent text-sm"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-red-400 text-xs mt-0.5">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-white/90 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-white/5 border-2 border-white/20 py-2 pl-10 pr-10 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent text-sm"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors z-10"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-red-400 text-xs mt-0.5">
            {form.formState.errors.password.message}
          </p>
        )}
        <p className="text-white/40 text-xs mt-0.5">
          Must be 8+ characters with uppercase, lowercase, and a number
        </p>
      </div>

      <div>
        <label className="block text-white/90 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-white/5 border-2 border-white/20 py-3 pl-12 pr-4 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent"
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
          className="border-2 border-white/30 bg-white/5 mt-0.5"
          checked={form.watch("terms")}
          onCheckedChange={(checked) =>
            form.setValue("terms", checked as boolean)
          }
        />
        <label className="text-white/80 text-sm leading-snug">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-secondary hover:underline font-semibold"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-secondary hover:underline font-semibold"
          >
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
        className="w-full bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-white font-bold py-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_6px_16px_rgba(0,0,0,0.4)] border-2 border-primary/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
        {!isLoading && (
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        )}
      </motion.button>
    </form>
  );
}
