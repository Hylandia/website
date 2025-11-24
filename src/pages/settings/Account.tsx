import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function AccountSettingsPage() {
  const { data: user, isLoading } = useUser();

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

      <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white uppercase mb-2">
            Username
          </h3>
          <p className="text-white/80">{user?.username}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white uppercase mb-2">Email</h3>
          <p className="text-white/80">{user?.email}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white uppercase mb-2">Name</h3>
          <p className="text-white/80">
            {user?.firstName} {user?.lastName}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white uppercase mb-2">
            Member Since
          </h3>
          <p className="text-white/80">
            {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
