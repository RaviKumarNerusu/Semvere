"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface RadiationLayerProps {
  enabled: boolean;
  intensity: number;
}

export function RadiationLayer({ enabled, intensity }: RadiationLayerProps) {
  const waves = useMemo(() => {
    const count = Math.floor(5 + intensity / 20);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: i * 0.4,
      y: 20 + i * 12,
    }));
  }, [intensity]);

  const rays = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: i * 15 - 90,
      length: 40 + Math.random() * 30,
      delay: i * 0.1,
    }));
  }, []);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -left-16 top-1/2 -translate-y-1/2 w-32 h-32"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-chart-3 via-primary to-chart-4 animate-pulse-glow" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-chart-3" />
            
            {rays.map((ray) => (
              <motion.div
                key={ray.id}
                className="absolute left-1/2 top-1/2 origin-left h-1 bg-gradient-to-r from-chart-3 to-transparent"
                style={{
                  width: ray.length,
                  transform: `rotate(${ray.angle}deg)`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scaleX: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: ray.delay,
                }}
              />
            ))}
          </div>
        </motion.div>

        {waves.map((wave) => (
          <motion.div
            key={wave.id}
            className="absolute left-0 h-1"
            style={{ top: `${wave.y}%` }}
            initial={{ x: "-10%", opacity: 0 }}
            animate={{
              x: ["0%", "110%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 - intensity / 50,
              repeat: Infinity,
              delay: wave.delay,
              ease: "linear",
            }}
          >
            <svg width="120" height="20" viewBox="0 0 120 20">
              <defs>
                <linearGradient id={`waveGrad-${wave.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--chart-3)" stopOpacity="0" />
                  <stop offset="30%" stopColor="var(--chart-3)" stopOpacity="1" />
                  <stop offset="70%" stopColor="var(--chart-4)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--chart-3)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 10 Q15 0 30 10 T60 10 T90 10 T120 10"
                fill="none"
                stroke={`url(#waveGrad-${wave.id})`}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        ))}

        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2"
          animate={{
            x: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-16 h-16 rounded-full border-2 border-chart-3/50 absolute"
              style={{
                left: -32 + i * 20,
                top: -32,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        <div className="absolute top-2 left-2 glass-panel px-3 py-1 rounded-lg">
          <p className="text-[10px] text-chart-3 font-heading uppercase tracking-wider">
            RADIATION: EM waves
          </p>
        </div>

    </div>
  );
}
