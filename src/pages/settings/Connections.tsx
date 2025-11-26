import { motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";

export default function ConnectionsSettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="border-b-2 border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <LinkIcon className="w-8 h-8 text-primary" />
          Connected Accounts
        </h1>
        <p className="text-white/60 mt-2">Manage your linked social accounts</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8">
        <div className="text-center py-12">
          <LinkIcon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2 uppercase">
            Coming Soon
          </h2>
          <p className="text-white/60">
            Social account connections will be available soon.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
