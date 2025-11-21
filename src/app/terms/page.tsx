"use client";

import { motion } from "framer-motion";
import { Swords, Scale, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-screen bg-neutral relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://i.imgur.com/OvtdZ7q.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-linear-to-br from-neutral/95 via-primary/10 to-secondary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors mb-8"
          >
            <Swords className="w-5 h-5" />
            <span className="font-semibold">Go Back</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <Scale className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-black text-white">Terms of Service</h1>
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
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-white font-bold text-lg mb-2">
                Important Notice
              </h2>
              <p className="text-white/80 leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use
                of Hylandia, including our website, game servers, and any
                related services ("Services"). By creating an account, accessing
                our website, or playing on the Hylandia server, you agree to be
                bound by these Terms. If you do not agree, do not use the
                Services.
              </p>
              <p className="text-white/80 leading-relaxed mt-4">
                <strong>Hylandia is an independent, unofficial server</strong>{" "}
                created for the upcoming game Hytale by Hypixel Studios.
                Hylandia is not affiliated with, endorsed by, or supported by
                Hypixel Studios or Riot Games.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          <Section number="1" title="Eligibility" icon={Shield} delay={0.2}>
            <p>You must:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                Be at least 13 years old or meet the minimum age required by
                your region.
              </li>
              <li>Agree to comply with these Terms and all applicable laws.</li>
              <li>Provide accurate information during registration.</li>
            </ul>
            <p className="mt-3">
              Parents/guardians are responsible for minors who use the Services.
            </p>
          </Section>

          <Section number="2" title="Account Registration" delay={0.3}>
            <p>When you create a Hylandia account:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                You are responsible for maintaining the confidentiality of your
                login details.
              </li>
              <li>
                You agree you will not share, sell, or transfer your account.
              </li>
              <li>
                You must notify us immediately if you suspect unauthorized
                access to your account.
              </li>
              <li>
                We reserve the right to deny, suspend, or terminate any account
                at our discretion.
              </li>
            </ul>
          </Section>

          <Section number="3" title="In-Game Conduct" delay={0.4}>
            <p>By playing on Hylandia, you agree NOT to engage in:</p>

            <h4 className="font-bold text-white mt-6 mb-3">
              3.1 Prohibited Behavior
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Harassment, threats, hate speech, discrimination, or targeted
                abuse.
              </li>
              <li>
                Cheating, exploiting bugs, using hacks, autoclickers, bots, or
                unauthorized modifications.
              </li>
              <li>
                Attempting to disrupt gameplay, crash the server, or perform
                DDoS attacks.
              </li>
              <li>
                Impersonating staff members or official Hytale, Hypixel, or
                Hylandia representatives.
              </li>
              <li>
                Advertising or promoting other servers, services, or products
                without permission.
              </li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-3">
              3.2 Staff Authority
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Hylandia staff may warn, mute, kick, ban, or otherwise
                discipline players at their discretion.
              </li>
              <li>
                Moderation decisions are final unless appealed through the
                official system.
              </li>
            </ul>
          </Section>

          <Section
            number="4"
            title="Virtual Items & In-Game Purchases"
            delay={0.5}
          >
            <p>
              Hylandia offers optional in-game purchases, including but not
              limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Ranks</li>
              <li>Cosmetics</li>
              <li>Boosters</li>
              <li>Other digital items</li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-3">
              4.1 Nature of Purchases
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                All purchases are digital and non-refundable, except where
                required by law.
              </li>
              <li>Purchased items have no real-world monetary value.</li>
              <li>
                Items may be modified, removed, or rebalanced at any time for
                gameplay integrity.
              </li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-3">4.2 Chargebacks</h4>
            <p>Unauthorized chargebacks will result in:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Immediate permanent account ban</li>
              <li>Revocation of all purchased items</li>
              <li>Possible legal/collection action</li>
            </ul>
            <p className="mt-3 text-secondary font-semibold">
              If you need help with a purchase, contact support before
              initiating a chargeback.
            </p>
          </Section>

          <Section number="5" title="Server Availability" delay={0.6}>
            <p>You acknowledge that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                Hylandia may experience downtime, maintenance, bugs, wipes,
                resets, or feature changes.
              </li>
              <li>
                We may modify or discontinue parts of the service at any time.
              </li>
              <li>
                Progress, in-game items, or account data may be reset—especially
                while the Hytale platform is pre-release or evolving.
              </li>
              <li>
                Hylandia is not liable for loss of progress, items, or data.
              </li>
            </ul>
          </Section>

          <Section number="6" title="Website & Account Data" delay={0.7}>
            <p>When using our website:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                You agree not to attempt to hack, scrape, exploit, or overload
                the site.
              </li>
              <li>
                You will not upload malicious files or attempt unauthorized
                access to data.
              </li>
              <li>
                You agree that we may store necessary account data in accordance
                with our Privacy Policy.
              </li>
            </ul>
          </Section>

          <Section number="7" title="Intellectual Property" delay={0.8}>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                All Hylandia branding, custom scripts, builds, artwork, and
                content are owned by Hylandia.
              </li>
              <li>
                You may not copy, redistribute, or claim ownership of any
                Hylandia intellectual property.
              </li>
              <li>
                Hytale and Hypixel assets are the property of their respective
                owners; Hylandia makes no claim to them.
              </li>
            </ul>
          </Section>

          <Section
            number="8"
            title="Compliance With Hytale's Policies"
            delay={0.9}
          >
            <p>Because Hytale is currently unreleased, you acknowledge that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                All gameplay, mods, integrations, and server features may change
                based on the official rules set by Hypixel Studios.
              </li>
              <li>
                Hylandia will take necessary steps to comply with updated legal
                or technical requirements.
              </li>
            </ul>
          </Section>

          <Section number="9" title="Liability Disclaimer" delay={1.0}>
            <p>To the fullest extent permitted by law:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                Hylandia provides all Services "as is" and "as available."
              </li>
              <li>
                Hylandia is not liable for any damages, lost data, lost
                purchases, downtime, or user disputes.
              </li>
              <li>You agree to use the Services at your own risk.</li>
            </ul>
          </Section>

          <Section number="10" title="Termination" delay={1.1}>
            <p>
              We may suspend or terminate your account for any reason, including
              but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Violations of these Terms</li>
              <li>Fraud, abusive conduct, or illegal activity</li>
              <li>Chargebacks</li>
              <li>Safety concerns for the community</li>
            </ul>
            <p className="mt-4">Upon termination:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>You lose access to your account and all purchased items.</li>
              <li>No refunds will be issued.</li>
            </ul>
          </Section>

          <Section number="11" title="Changes to These Terms" delay={1.2}>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Hylandia reserves the right to update these Terms at any time.
              </li>
              <li>
                Changes take effect immediately when posted on the website.
              </li>
              <li>
                Continued use of the Services constitutes acceptance of the
                updated Terms.
              </li>
            </ul>
          </Section>

          <Section number="12" title="Contact Us" delay={1.3}>
            <p>For support, appeals, or questions, contact:</p>
            <p className="mt-3">
              <a
                href="mailto:support@hylandia.net"
                className="text-secondary hover:text-secondary/80 font-semibold transition-colors"
              >
                support@hylandia.net
              </a>
            </p>
          </Section>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-16 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-white/50 text-sm">
            By using Hylandia, you acknowledge that you have read, understood,
            and agree to be bound by these Terms of Service.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-8 py-3 bg-linear-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:from-secondary hover:to-tertiary transition-all"
          >
            Return to Homepage
          </Link>
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
  icon?: any;
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
        {Icon && <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
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
