import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell } from "lucide-react";

export default function PreferencesSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="border-b-2 border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Preferences
        </h1>
        <p className="text-white/60 mt-2">Customize your experience</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
              <span className="text-white">Email Notifications</span>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    email: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
              <span className="text-white">Push Notifications</span>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications({ ...notifications, push: e.target.checked })
                }
                className="w-5 h-5"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
              <span className="text-white">Game Updates</span>
              <input
                type="checkbox"
                checked={notifications.updates}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    updates: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
