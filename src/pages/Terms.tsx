import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <ScrollText className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-4">
              Terms of Service
            </h1>
            <p className="text-white/60">Last updated: November 24, 2025</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-white/80 leading-relaxed">
                By accessing and using Hylandia, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                Use of Service
              </h2>
              <p className="text-white/80 leading-relaxed">
                You agree to use our service only for lawful purposes and in
                accordance with these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                Account Responsibilities
              </h2>
              <p className="text-white/80 leading-relaxed">
                You are responsible for maintaining the confidentiality of your
                account and password and for restricting access to your
                computer.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
