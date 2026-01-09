"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ConvectionLayerProps {
  enabled: boolean;
  temperature: number;
}

export function ConvectionLayer({ enabled, temperature }: ConvectionLayerProps) {
  const hotArrows = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: `hot-${i}`,
      x: 15 + i * 10,
      delay: i * 0.3,
    }));
  }, []);

  const coldArrows = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: `cold-${i}`,
      x: 20 + i * 10,
      delay: i * 0.3 + 0.15,
    }));
  }, []);

  const speed = Math.max(1, 4 - (temperature / 100) * 2);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hotArrows.map((arrow) => (
        <motion.div
          key={arrow.id}
          className="absolute flex flex-col items-center"
          style={{ left: `${arrow.x}%`, bottom: "30%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-20, -120],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            delay: arrow.delay,
            ease: "easeOut",
          }}
        >
            <svg width="20" height="40" viewBox="0 0 20 40" className="drop-shadow-lg">
              <defs>
                <linearGradient id="hotGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M10 0 L15 12 L12 12 L12 40 L8 40 L8 12 L5 12 Z"
                fill="url(#hotGradient)"
              />
            </svg>
            <span className="text-[10px] text-primary font-heading mt-1 uppercase">Hot</span>
          </motion.div>
        ))}

        {coldArrows.map((arrow) => (
          <motion.div
            key={arrow.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${arrow.x}%`, top: "20%" }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [20, 120],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: arrow.delay,
              ease: "easeOut",
            }}
          >
            <span className="text-[10px] text-accent font-heading mb-1 uppercase">Cold</span>
            <svg width="20" height="40" viewBox="0 0 20 40" className="drop-shadow-lg">
              <defs>
                <linearGradient id="coldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M10 40 L15 28 L12 28 L12 0 L8 0 L8 28 L5 28 Z"
                fill="url(#coldGradient)"
              />
            </svg>
          </motion.div>
        ))}

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute bottom-2 right-2 glass-panel px-3 py-1 rounded-lg">
          <p className="text-[10px] text-accent font-heading uppercase tracking-wider">
            CONVECTION: Fluid circulation
          </p>
        </div>

    </div>
  );
}
