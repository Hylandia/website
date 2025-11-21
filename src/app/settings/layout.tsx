import { AuthBackground } from "@/components/auth/AuthBackground";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral">
      <AuthBackground />

      <div className="min-h-[calc(100%-4rem)] relative z-10 w-full max-w-3xl mx-auto px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
