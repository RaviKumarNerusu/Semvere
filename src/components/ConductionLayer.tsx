"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ConductionLayerProps {
  enabled: boolean;
  material: string;
  thickness: number;
}

export function ConductionLayer({ enabled, material, thickness }: ConductionLayerProps) {
  const particles = useMemo(() => {
    const count = Math.floor(thickness * 3);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 10 + (i % 5) * 18,
      y: 15 + Math.floor(i / 5) * 20,
      delay: Math.random() * 0.5,
      size: 4 + Math.random() * 4,
    }));
  }, [thickness]);

    const getMaterialConfig = (mat: string) => {
      switch (mat) {
        case "copper":
          return { speed: 0.08, colors: ["#6366f1", "#818cf8", "#a5b4fc"] };
        case "steel":
          return { speed: 0.12, colors: ["#8b5cf6", "#a78bfa", "#c4b5fd"] };
        case "glass":
          return { speed: 0.25, colors: ["#06b6d4", "#22d3ee", "#67e8f9"] };
        case "wood":
          return { speed: 0.4, colors: ["#10b981", "#34d399", "#6ee7b7"] };
        case "foam":
          return { speed: 0.6, colors: ["#f59e0b", "#fbbf24", "#fcd34d"] };
        default:
          return { speed: 0.2, colors: ["#818cf8", "#a5b4fc", "#c7d2fe"] };
      }
    };


  const config = getMaterialConfig(material);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, index) => {
        const colorIndex = Math.min(
          Math.floor((particle.x / 100) * config.colors.length),
          config.colors.length - 1
        );
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: config.colors[colorIndex],
              boxShadow: `0 0 ${particle.size * 2}px ${config.colors[colorIndex]}`,
            }}
            animate={{
              x: [0, -3, 3, -2, 2, 0],
              y: [0, 2, -2, 3, -3, 0],
              scale: [1, 1.2, 0.9, 1.1, 0.95, 1],
            }}
            transition={{
              duration: config.speed,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      <div className="absolute bottom-2 left-2 glass-panel px-3 py-1 rounded-lg">
        <p className="text-[10px] text-primary font-heading uppercase tracking-wider">
          CONDUCTION: Molecular vibration
        </p>
      </div>
    </div>
  );
}
