import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swords } from "lucide-react";

export function NavigationProgress() {
  const { pathname } = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset on route change complete
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }, 300);
  }, [pathname]);

  // Simulate progress while navigating
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isNavigating]);

  // Listen for link clicks to trigger loading state
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.href.startsWith("http") && !link.target) {
        const url = new URL(link.href);
        if (url.pathname !== pathname) {
          setIsNavigating(true);
          setProgress(10);
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <>
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary origin-left z-50"
            style={{
              boxShadow: "0 0 10px rgba(212, 175, 55, 0.8)",
            }}
          />

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-black/80 backdrop-blur-md border-2 border-primary/50 px-4 py-2 flex items-center gap-3 shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Swords className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-white font-bold uppercase tracking-wider text-sm">
                Loading...
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
