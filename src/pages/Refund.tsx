import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-neutral py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <DollarSign className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-4">
              Refund Policy
            </h1>
            <p className="text-white/60">Last updated: November 24, 2025</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                General Policy
              </h2>
              <p className="text-white/80 leading-relaxed">
                We strive to provide the best gaming experience. If you're not
                satisfied with your purchase, please review our refund policy
                below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                Eligibility
              </h2>
              <p className="text-white/80 leading-relaxed">
                Refund requests must be submitted within 14 days of purchase and
                the purchased items must not have been used or consumed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                How to Request
              </h2>
              <p className="text-white/80 leading-relaxed">
                To request a refund, please contact our support team with your
                purchase details and reason for the refund request.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
