"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisconnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  providerName: string;
  accountInfo?: string;
  isLastMethod: boolean;
  hasPassword: boolean;
  isLoading?: boolean;
}

export function DisconnectAccountModal({
  isOpen,
  onClose,
  onConfirm,
  providerName,
  accountInfo,
  isLastMethod,
  hasPassword,
  isLoading = false,
}: DisconnectAccountModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-neutral-800 border border-primary/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
            <h2 className="text-xl font-bold text-white">
              Disconnect {providerName}?
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-neutral-300">
              {accountInfo ? (
                <>
                  Are you sure you want to disconnect your {providerName}{" "}
                  account{" "}
                  <span className="font-semibold text-white">
                    ({accountInfo})
                  </span>
                  ?
                </>
              ) : (
                <>Are you sure you want to disconnect {providerName}?</>
              )}
            </p>

            {/* Warnings */}
            {isLastMethod && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400 mb-1">
                      Warning: Last Sign-In Method
                    </p>
                    <p className="text-sm text-red-300">
                      This is your only way to sign in. You won't be able to
                      access your account after disconnecting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!hasPassword && !isLastMethod && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-400 mb-1">
                      No Password Set
                    </p>
                    <p className="text-sm text-yellow-300">
                      You don't have a password set. Make sure you have another
                      way to sign in.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-neutral-700/50 bg-neutral-900/50">
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-neutral-600 hover:bg-neutral-700"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Disconnecting...
                </div>
              ) : (
                "Disconnect"
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
