import { motion } from "framer-motion";
import {
  Swords,
  DollarSign,
  AlertCircle,
  Clock,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function RefundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-screen bg-neutral relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/media/backsplash.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-linear-to-br from-neutral/95 via-primary/10 to-secondary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mt-16  max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors mb-8"
          >
            <Swords className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <DollarSign className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-black text-white">Refund Policy</h1>
          </div>
          <p className="text-white/60 text-lg">
            Last Updated: November 19, 2025
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-primary/10 border border-primary/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="text-white font-bold text-lg mb-2">
                Please Read Carefully
              </h2>
              <p className="text-white/80 leading-relaxed">
                All purchases made on Hylandia are for{" "}
                <strong>virtual, digital goods</strong> with no real-world
                monetary value. By making a purchase, you acknowledge that you
                have read and understood this Refund Policy.
              </p>
              <p className="text-white/80 leading-relaxed mt-3">
                <strong className="text-secondary">
                  Most purchases are non-refundable.
                </strong>{" "}
                Refunds are only granted under specific circumstances outlined
                below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refund Sections */}
        <div className="space-y-8">
          <Section
            number="1"
            title="General Refund Policy"
            icon={DollarSign}
            delay={0.2}
          >
            <p>
              <strong>All sales are final.</strong> In-game purchases, including
              ranks, cosmetics, boosters, and other virtual items are
              non-refundable except in the cases listed below.
            </p>

            <h4 className="font-bold text-white mt-6 mb-3">
              Items That Are Non-Refundable:
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ranks and VIP memberships</li>
              <li>Cosmetic items (skins, particles, effects, etc.)</li>
              <li>Boosters and consumables that have been used</li>
              <li>Loot boxes, crates, or randomized rewards</li>
              <li>Bundles and limited-time offers</li>
              <li>In-game currency or credits</li>
            </ul>

            <p className="mt-4 text-secondary font-semibold">
              By clicking "Purchase" or "Confirm," you agree that the
              transaction is final and non-refundable.
            </p>
          </Section>

          <Section number="2" title="Eligible Refund Cases" delay={0.3}>
            <p>
              Refunds may be considered <strong>only</strong> in the following
              situations:
            </p>

            <h4 className="font-bold text-white mt-6 mb-3">
              2.1 Technical Issues or Errors
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You were charged but did not receive the purchased item</li>
              <li>A payment processing error occurred (e.g., double charge)</li>
              <li>
                The item was not delivered due to a server or system malfunction
              </li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-3">
              2.2 Unauthorized Transactions
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Your account was compromised, and purchases were made without
                your permission
              </li>
              <li>Fraudulent activity was detected on your payment method</li>
            </ul>
            <p className="mt-3 text-white/60 italic text-sm">
              Note: You must provide evidence (e.g., proof of unauthorized
              access) and report the issue within 48 hours of the transaction.
            </p>

            <h4 className="font-bold text-white mt-6 mb-3">
              2.3 Duplicate Purchases
            </h4>
            <p>
              If you accidentally purchased the same item twice due to a
              technical glitch or payment error, you may request a refund for
              the duplicate purchase.
            </p>

            <h4 className="font-bold text-white mt-6 mb-3">
              2.4 Permanent Server Shutdown (Pre-Launch Only)
            </h4>
            <p>
              Since Hylandia has not yet launched, if the server is permanently
              canceled before going live, all purchases will be refunded in
              full.
            </p>
            <p className="mt-3 text-secondary font-semibold">
              Once the server launches, this clause no longer applies.
            </p>
          </Section>

          <Section number="3" title="Refund Exclusions" delay={0.4}>
            <p>
              <strong>Refunds will NOT be granted for:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Change of mind or buyer's remorse</li>
              <li>
                Dissatisfaction with an item's appearance or functionality
              </li>
              <li>Items that were used, activated, or consumed</li>
              <li>
                Account bans or suspensions (including those from rule
                violations)
              </li>
              <li>Trades or transfers made between players</li>
              <li>
                Items modified, removed, or rebalanced for gameplay integrity
              </li>
              <li>Server downtime, maintenance, or temporary outages</li>
              <li>Loss of progress due to wipes, resets, or game updates</li>
            </ul>
          </Section>

          <Section
            number="4"
            title="How to Request a Refund"
            icon={HelpCircle}
            delay={0.5}
          >
            <p>If you believe you qualify for a refund, follow these steps:</p>

            <ol className="list-decimal list-inside space-y-3 ml-4 mt-4">
              <li>
                <strong>Contact Support:</strong> Email{" "}
                <a
                  href="mailto:support@hylandia.net"
                  className="text-secondary hover:text-secondary/80 font-semibold"
                >
                  support@hylandia.net
                </a>{" "}
                within <strong>7 days</strong> of the transaction
              </li>
              <li>
                <strong>Provide Details:</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Your username and email address</li>
                  <li>Transaction ID or receipt number</li>
                  <li>Date and time of purchase</li>
                  <li>Item(s) purchased</li>
                  <li>Reason for the refund request</li>
                  <li>
                    Any supporting evidence (screenshots, error messages, etc.)
                  </li>
                </ul>
              </li>
              <li>
                <strong>Wait for Review:</strong> Our team will investigate your
                claim and respond within 5-7 business days
              </li>
              <li>
                <strong>Decision:</strong> If approved, the refund will be
                processed to your original payment method within 10-14 business
                days
              </li>
            </ol>

            <p className="mt-4 text-secondary font-semibold">
              Refund requests submitted after 7 days may not be considered.
            </p>
          </Section>

          <Section number="5" title="Chargebacks" delay={0.6}>
            <p className="text-white font-bold">
              ⚠️ Do NOT initiate a chargeback before contacting support.
            </p>

            <p className="mt-4">
              If you dispute a charge with your bank or payment provider without
              first attempting to resolve the issue with us, the following will
              occur:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                <strong>Immediate permanent ban</strong> from Hylandia
              </li>
              <li>Revocation of all purchased items and account access</li>
              <li>Potential legal or collection action to recover costs</li>
              <li>Your account will be flagged and cannot be reinstated</li>
            </ul>

            <p className="mt-4 text-secondary font-semibold">
              We take chargebacks very seriously. Always contact us first at{" "}
              <a
                href="mailto:support@hylandia.net"
                className="text-secondary hover:text-secondary/80"
              >
                support@hylandia.net
              </a>{" "}
              if you have an issue with a purchase.
            </p>
          </Section>

          <Section
            number="6"
            title="Refund Processing Time"
            icon={Clock}
            delay={0.7}
          >
            <p>If your refund is approved:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                <strong>Credit/Debit Card:</strong> 5-10 business days
              </li>
              <li>
                <strong>PayPal:</strong> 3-5 business days
              </li>
              <li>
                <strong>Other Payment Methods:</strong> Up to 14 business days
              </li>
            </ul>

            <p className="mt-4 text-white/60">
              Processing times depend on your bank or payment provider. Hylandia
              is not responsible for delays caused by third-party financial
              institutions.
            </p>
          </Section>

          <Section number="7" title="Account Bans and Refunds" delay={0.8}>
            <p>
              <strong>
                If your account is banned for violating our Terms of Service,
                you are NOT entitled to a refund.
              </strong>
            </p>

            <p className="mt-3">This includes bans for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Cheating, hacking, or using unauthorized modifications</li>
              <li>Harassment, hate speech, or abusive behavior</li>
              <li>Fraud, chargebacks, or payment disputes</li>
              <li>Exploiting bugs or server vulnerabilities</li>
              <li>Any other violation of our community guidelines</li>
            </ul>

            <p className="mt-4 text-secondary font-semibold">
              By purchasing items on Hylandia, you accept the risk of account
              termination and agree that no refunds will be issued in such
              cases.
            </p>
          </Section>

          <Section number="8" title="Changes to Items or Services" delay={0.9}>
            <p>
              Hylandia reserves the right to modify, remove, or rebalance any
              virtual items, ranks, or features at any time for gameplay
              integrity, fairness, or legal compliance.
            </p>

            <p className="mt-3">
              <strong>No refunds will be issued</strong> if:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>An item's appearance, stats, or functionality is changed</li>
              <li>A feature or service is discontinued</li>
              <li>Server updates affect purchased items</li>
            </ul>

            <p className="mt-4">
              We will make reasonable efforts to notify players of significant
              changes, but we are not obligated to provide compensation or
              refunds.
            </p>
          </Section>

          <Section
            number="9"
            title="Gifts and Third-Party Purchases"
            delay={1.0}
          >
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Purchases made as gifts to other players are non-refundable once
                delivered
              </li>
              <li>
                If you purchase items from unauthorized third-party sellers or
                key resellers, Hylandia is not responsible and will not issue
                refunds
              </li>
              <li>
                Only purchases made directly through our official website or
                authorized payment processors are eligible for support
              </li>
            </ul>
          </Section>

          <Section number="10" title="Contact Us" delay={1.1}>
            <p>
              If you have questions about this Refund Policy or need to request
              a refund, contact us:
            </p>
            <p className="mt-4">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@hylandia.net"
                className="text-secondary hover:text-secondary/80 font-semibold"
              >
                support@hylandia.net
              </a>
            </p>
            <p className="mt-2 text-white/60">
              Please allow 5-7 business days for a response.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-white/50 text-sm">
            By making a purchase on Hylandia, you acknowledge that you have
            read, understood, and agree to this Refund Policy.
          </p>
          <div className="flex gap-4 justify-center mt-6 flex-wrap">
            <Link
              to="/terms"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-all"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-all"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-linear-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:from-secondary hover:to-tertiary transition-all"
            >
              Return to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  icon: Icon,
  delay,
  children,
}: {
  number: string;
  title: string;
  icon?: LucideIcon;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-neutral/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8"
    >
      <div className="flex items-start gap-4 mb-4">
        {Icon && <Icon className="w-6 h-6 text-primary shrink-0 mt-1" />}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">
            {number}. {title}
          </h3>
        </div>
      </div>
      <div className="text-white/70 leading-relaxed space-y-3 ml-10">
        {children}
      </div>
    </motion.div>
  );
}
