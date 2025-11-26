"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  errors?: Array<{ message: string; code?: string }>;
}

export function ErrorDisplay({ errors }: ErrorDisplayProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
    >
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <p className="text-red-200 text-sm">{errors[0].message}</p>
    </motion.div>
  );
}
