"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Landing } from "@/components/Landing";

// 🚀 CRITICAL FIX: client-only HeatSimulation
const HeatSimulation = dynamic(
  () => import("@/components/HeatSimulation").then(mod => mod.HeatSimulation),
  { ssr: false }
);

export default function Home() {
  const [showSimulation, setShowSimulation] = useState(false);

  return (
    <main>
      <AnimatePresence mode="wait">
        {!showSimulation ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Landing onStart={() => setShowSimulation(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="simulation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <HeatSimulation />

            {/* Back button */}
            <button 
              onClick={() => setShowSimulation(false)}
              className="fixed bottom-8 left-8 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs orbitron text-white/60 transition-colors"
            >
              ← EXIT LAB
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
