"use client";

import { motion } from "framer-motion";

interface FooterProps {
  onCopyIP: () => void;
  copiedIP: boolean;
}

export function Footer({ onCopyIP, copiedIP }: FooterProps) {
  return (
    <div className="w-full py-16 bg-neutral border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <h3 className="text-3xl font-bold text-white">See you on launch</h3>
          <p className="text-white/60 max-w-xl">
            Server goes live shortly after Hytale drops. Save the IP and we'll
            see you there.
          </p>
          <motion.button
            type="button"
            onClick={onCopyIP}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-16 py-4 bg-linear-to-r from-primary via-secondary to-tertiary text-white rounded-full font-bold text-lg shadow-2xl shadow-primary/30"
          >
            {copiedIP ? "Copied!" : "Copy Server IP"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
