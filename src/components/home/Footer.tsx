"use client";

import { motion } from "framer-motion";
import { Scroll } from "lucide-react";

interface FooterProps {
  onCopyIP: () => void;
  copiedIP: boolean;
}

export function Footer({ onCopyIP, copiedIP }: FooterProps) {
  return (
    <div className="w-full py-16 bg-neutral border-t-2 border-accent/40 shadow-[inset_0_4px_12px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Scroll className="w-8 h-8 text-accent drop-shadow-[0_0_8px_rgba(177,182,124,0.6)]" />
            <h3 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" style={{ fontFamily: "var(--font-cinzel)" }}>
              See you on launch
            </h3>
            <Scroll className="w-8 h-8 text-accent drop-shadow-[0_0_8px_rgba(177,182,124,0.6)]" />
          </div>
          <p className="text-white/70 max-w-xl text-lg tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Server goes live shortly after Hytale drops. Save the IP and we'll
            see you there.
          </p>
          <motion.button
            type="button"
            onClick={onCopyIP}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-16 py-4 bg-linear-to-r from-primary via-secondary to-tertiary text-white font-bold text-lg shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_6px_16px_rgba(0,0,0,0.4)] border-2 border-primary/40 uppercase tracking-wider"
          >
            {copiedIP ? "Copied!" : "Copy Server IP"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
