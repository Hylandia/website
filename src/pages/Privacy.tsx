import { motion } from "framer-motion";
import { Swords, Shield, Lock, Eye, Database, Mail, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen  w-screen bg-neutral relative overflow-hidden">
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
      <div className="relative mt-16 z-10 max-w-4xl mx-auto px-6 py-16">
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
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-black text-white">Privacy Policy</h1>
          </div>
          <p className="text-white/60 text-lg">
            Last Updated: November 19, 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-primary/10 border border-primary/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <p className="text-white/80 leading-relaxed">
            At Hylandia, we respect your privacy and are committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, store, and protect your data when you use our website,
            game servers, and related services ("Services").
          </p>
          <p className="text-white/80 leading-relaxed mt-4">
            By using Hylandia, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          <Section
            number="1"
            title="Information We Collect"
            icon={Database}
            delay={0.2}
          >
            <h4 className="font-bold text-white mb-3">
              1.1 Account Information
            </h4>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Username</li>
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Account creation date</li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-3">
              1.2 Gameplay Data
            </h4>
            <p>While you play on Hylandia, we collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>In-game statistics and progress</li>
              <li>Chat messages and interactions</li>
              <li>Game actions and preferences</li>
              <li>Session duration and frequency</li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-3">
              1.3 Technical Information
            </h4>
            <p>We automatically collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>IP address</li>
              <li>Device information and operating system</li>
              <li>Browser type and version</li>
              <li>Game client version</li>
              <li>Connection timestamps</li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-3">
              1.4 Payment Information
            </h4>
            <p>
              If you make purchases, our payment processors collect payment card
              details. We do not store full credit card information on our
              servers. We only retain transaction IDs and purchase history.
            </p>
          </Section>

          <Section
            number="2"
            title="How We Use Your Information"
            icon={Eye}
            delay={0.3}
          >
            <p>We use collected data to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Provide and maintain the Hylandia gaming experience</li>
              <li>Process transactions and deliver purchased items</li>
              <li>Personalize your gameplay experience</li>
              <li>Enforce our Terms of Service and community guidelines</li>
              <li>Detect and prevent cheating, fraud, and abuse</li>
              <li>Improve server performance and fix bugs</li>
              <li>
                Send important updates, announcements, and security alerts
              </li>
              <li>Respond to support requests and inquiries</li>
              <li>Analyze usage patterns to improve our Services</li>
            </ul>
          </Section>

          <Section number="3" title="Data Sharing and Disclosure" delay={0.4}>
            <p>
              We do not sell or rent your personal information to third parties.
            </p>

            <h4 className="font-bold text-white mt-6 mb-3">
              We may share data with:
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Payment Processors:</strong> To process transactions
                (e.g., Stripe, PayPal)
              </li>
              <li>
                <strong>Hosting Providers:</strong> To store and serve game data
              </li>
              <li>
                <strong>Anti-Cheat Services:</strong> To detect and prevent
                unauthorized modifications
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law or to
                protect our rights
              </li>
            </ul>

            <p className="mt-4">
              All third-party services are required to protect your data and use
              it only for specified purposes.
            </p>
          </Section>

          <Section number="4" title="Data Security" icon={Lock} delay={0.5}>
            <p>We implement security measures to protect your information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Passwords are encrypted using industry-standard hashing</li>
              <li>Secure HTTPS connections for website access</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Limited employee access to personal data</li>
              <li>Automated backups to prevent data loss</li>
            </ul>

            <p className="mt-4">
              However, no method of transmission over the internet is 100%
              secure. We cannot guarantee absolute security but continuously
              work to protect your data.
            </p>
          </Section>

          <Section number="5" title="Data Retention" delay={0.6}>
            <p>We retain your data for as long as:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Your account remains active</li>
              <li>
                Necessary to provide Services or fulfill legal obligations
              </li>
              <li>Required to resolve disputes or enforce agreements</li>
            </ul>

            <p className="mt-4">
              If you delete your account, most personal data is removed within
              30 days. Some data (e.g., transaction records, ban history) may be
              retained longer for legal or security purposes.
            </p>
          </Section>

          <Section number="6" title="Cookies and Tracking" delay={0.7}>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve site functionality</li>
            </ul>

            <p className="mt-4">
              You can configure your browser to refuse cookies, but some
              features may not function properly.
            </p>
          </Section>

          <Section number="7" title="Your Rights" delay={0.8}>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update inaccurate or incomplete
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a structured
                format
              </li>
              <li>
                <strong>Objection:</strong> Opt out of certain data processing
                activities
              </li>
            </ul>

            <p className="mt-4">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:privacy@hylandia.net"
                className="text-secondary hover:text-secondary/80 font-semibold"
              >
                privacy@hylandia.net
              </a>
            </p>
          </Section>

          <Section number="8" title="Children's Privacy" delay={0.9}>
            <p>
              Hylandia is intended for users aged 13 and older. We do not
              knowingly collect personal information from children under 13.
            </p>
            <p className="mt-3">
              If you believe a child under 13 has provided us with personal
              data, please contact us immediately, and we will delete it.
            </p>
            <p className="mt-3">
              Parents and guardians are responsible for monitoring and
              supervising minors' use of the Services.
            </p>
          </Section>

          <Section number="9" title="International Data Transfers" delay={1.0}>
            <p>
              Your data may be processed and stored in countries outside your
              residence. By using Hylandia, you consent to the transfer of your
              information to countries that may have different data protection
              laws.
            </p>
            <p className="mt-3">
              We ensure appropriate safeguards are in place to protect your data
              during international transfers.
            </p>
          </Section>

          <Section number="10" title="Third-Party Links" delay={1.1}>
            <p>
              Our website may contain links to third-party sites (e.g., Discord,
              social media). We are not responsible for the privacy practices of
              these external sites.
            </p>
            <p className="mt-3">
              We encourage you to review the privacy policies of any third-party
              sites you visit.
            </p>
          </Section>

          <Section number="11" title="Changes to This Policy" delay={1.2}>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                We may update this Privacy Policy to reflect changes in our
                practices or legal requirements.
              </li>
              <li>
                Changes take effect immediately upon posting on the website.
              </li>
              <li>
                Continued use of the Services constitutes acceptance of the
                updated policy.
              </li>
              <li>
                We will notify users of significant changes via email or in-game
                announcements.
              </li>
            </ul>
          </Section>

          <Section number="12" title="Contact Us" icon={Mail} delay={1.3}>
            <p>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or your data, contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@hylandia.net"
                  className="text-secondary hover:text-secondary/80 font-semibold"
                >
                  privacy@hylandia.net
                </a>
              </p>
              <p>
                <strong>General Support:</strong>{" "}
                <a
                  href="mailto:support@hylandia.net"
                  className="text-secondary hover:text-secondary/80 font-semibold"
                >
                  support@hylandia.net
                </a>
              </p>
            </div>
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
            and agree to our Privacy Policy.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Link
              to="/terms"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-all"
            >
              Terms of Service
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
