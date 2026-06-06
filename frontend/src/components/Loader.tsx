"use client";

import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer scanning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute w-16 h-16 border-t-2 border-b-2 border-[var(--primary)] rounded-full opacity-80"
        />
        {/* Inner pulsing circle */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-8 h-8 bg-[var(--primary)] rounded-full opacity-60"
        />
      </div>
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-sm font-medium text-[var(--secondary)] tracking-widest uppercase"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
