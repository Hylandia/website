import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/60">Last updated: November 24, 2025</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                Information We Collect
              </h2>
              <p className="text-white/80 leading-relaxed">
                We collect information you provide directly to us, such as when
                you create an account, use our services, or communicate with us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                How We Use Your Information
              </h2>
              <p className="text-white/80 leading-relaxed">
                We use the information we collect to provide, maintain, and
                improve our services, communicate with you, and protect our
                users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                Data Security
              </h2>
              <p className="text-white/80 leading-relaxed">
                We implement appropriate security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
