import { Outlet, Link, useLocation } from "react-router-dom";
import {
  User,
  Link as LinkIcon,
  Shield,
  Settings as SettingsIcon,
  Gamepad2,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useIsAuthenticated";

const settingsLinks = [
  { href: "/settings/account", label: "Account", icon: User },
  { href: "/settings/connections", label: "Connections", icon: LinkIcon },
  { href: "/settings/security", label: "Security", icon: Shield },
  { href: "/settings/preferences", label: "Preferences", icon: SettingsIcon },
  { href: "/settings/game-stats", label: "Game Stats", icon: Gamepad2 },
];

export default function SettingsLayout() {
  useRequireAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral py-20 px-4">
      <div className="max-w-7xl mx-auto mt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-2">
            Settings
          </h1>
          <p className="text-white/60">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-4">
              <nav className="space-y-2">
                {settingsLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center gap-3 px-4 py-3 uppercase tracking-wider text-sm font-bold transition-all ${
                        isActive
                          ? "bg-primary/20 border-l-4 border-primary text-primary"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
