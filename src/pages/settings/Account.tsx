import { motion } from "framer-motion";
import { User, Save } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useUpdateAccount } from "@/hooks/useUpdateAccount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const updateAccountSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .optional()
    .or(z.literal("")),
});

type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

export default function AccountSettingsPage() {
  const { data: user, isLoading } = useUser();
  const { mutate: updateAccount, isPending } = useUpdateAccount();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
    },
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
    },
  });

  const onSubmit = (data: UpdateAccountFormData) => {
    // Filter out empty strings and undefined values
    const updateData: Record<string, string> = {};

    if (data.firstName && data.firstName !== user?.firstName) {
      updateData.firstName = data.firstName;
    }
    if (data.lastName && data.lastName !== user?.lastName) {
      updateData.lastName = data.lastName;
    }
    if (data.username && data.username !== user?.username) {
      updateData.username = data.username;
    }

    // Only submit if there are actual changes
    if (Object.keys(updateData).length === 0) {
      return;
    }

    updateAccount(updateData, {
      onSuccess: () => {
        setSuccessMessage("Account updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      onError: (error: Error) => {
        console.error("Update failed:", error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="border-b-2 border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          Account Settings
        </h1>
        <p className="text-white/60 mt-2">Manage your account information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 space-y-6">
          {successMessage && (
            <div className="bg-green-500/10 border-2 border-green-500/30 p-4 rounded-lg">
              <p className="text-green-400 text-sm font-semibold">
                {successMessage}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-white font-bold uppercase"
            >
              Username
            </Label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className="w-full bg-white/5 border-2 border-white/20 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-white font-bold uppercase"
            >
              First Name
            </Label>
            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              className="w-full bg-white/5 border-2 border-white/20 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-white font-bold uppercase"
            >
              Last Name
            </Label>
            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              className="w-full bg-white/5 border-2 border-white/20 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm">{errors.lastName.message}</p>
            )}
          </div>

          <div className="border-t-2 border-white/10 pt-4">
            <h3 className="text-lg font-bold text-white uppercase mb-2">
              Email
            </h3>
            <p className="text-white/60 text-sm mb-2">{user?.email}</p>
            <p className="text-white/40 text-xs">
              Email cannot be changed at this time
            </p>
          </div>

          <div className="border-t-2 border-white/10 pt-4">
            <h3 className="text-lg font-bold text-white uppercase mb-2">
              Member Since
            </h3>
            <p className="text-white/80">
              {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t-2 border-white/10">
            <Button
              type="submit"
              disabled={!isDirty || isPending}
              className="bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
