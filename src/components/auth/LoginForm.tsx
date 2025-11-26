import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { UseFormReturn } from "react-hook-form";
import type { SignInFormData } from "@/schemas/auth.schema";
import { Link } from "react-router-dom";

interface LoginFormProps {
  form: UseFormReturn<SignInFormData>;
  onSubmit: (data: SignInFormData) => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export function LoginForm({
  form,
  onSubmit,
  isLoading,
  showPassword,
  setShowPassword,
}: LoginFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-white/90 text-sm font-bold mb-2 uppercase tracking-wider">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
          <Input
            type="email"
            placeholder="your@email.com"
            className="w-full bg-white/5 border-2 border-white/20 py-3 pl-12 pr-4 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent"
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-white/90 text-sm font-bold uppercase tracking-wider">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-xs text-secondary hover:text-secondary/80 transition-colors uppercase tracking-wider font-semibold"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-white/5 border-2 border-white/20 py-3 pl-12 pr-12 text-white placeholder:text-white/30 h-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:border-accent"
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
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-white/60 cursor-pointer hover:text-white/80">
          <Checkbox className="border-white/20 bg-white/5" />
          Remember me
        </label>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-white font-bold py-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_6px_16px_rgba(0,0,0,0.4)] border-2 border-primary/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
      >
        {isLoading ? "Signing in..." : "Sign In"}
        {!isLoading && (
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        )}
      </motion.button>
    </form>
  );
}
