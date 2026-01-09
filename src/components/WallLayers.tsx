"use client";

import { motion } from "framer-motion";

interface WallLayersProps {
  layers: {
    material: string;
    thickness: number;
  }[];
  showConduction: boolean;
}

const materialColors: Record<string, { main: string; accent: string; pattern: string }> = {
  copper: { main: "#b87333", accent: "#cd7f32", pattern: "repeating-linear-gradient(90deg, #b87333, #b87333 2px, #cd7f32 2px, #cd7f32 4px)" },
  steel: { main: "#71797E", accent: "#848884", pattern: "repeating-linear-gradient(45deg, #71797E, #71797E 3px, #848884 3px, #848884 6px)" },
  glass: { main: "rgba(135, 206, 235, 0.4)", accent: "rgba(173, 216, 230, 0.6)", pattern: "linear-gradient(180deg, rgba(255,255,255,0.3), rgba(135,206,235,0.4))" },
  wood: { main: "#8B4513", accent: "#A0522D", pattern: "repeating-linear-gradient(90deg, #8B4513 0px, #A0522D 10px, #8B4513 20px)" },
  foam: { main: "#FFE4B5", accent: "#FFDAB9", pattern: "radial-gradient(circle at 50% 50%, #FFE4B5 0%, #FFDAB9 100%)" },
  brick: { main: "#CB4335", accent: "#922B21", pattern: "repeating-linear-gradient(0deg, #CB4335 0px, #CB4335 15px, #922B21 15px, #922B21 17px)" },
  concrete: { main: "#808080", accent: "#696969", pattern: "linear-gradient(135deg, #808080 25%, #696969 75%)" },
  fiberglass: { main: "#FFB6C1", accent: "#FFC0CB", pattern: "repeating-linear-gradient(45deg, #FFB6C1, #FFB6C1 5px, #FFC0CB 5px, #FFC0CB 10px)" },
};

export function WallLayers({ layers, showConduction }: WallLayersProps) {
  const totalThickness = layers.reduce((sum, layer) => sum + layer.thickness, 0);

  return (
    <div className="relative flex h-full">
      <div className="absolute -left-20 top-0 bottom-0 w-16 flex flex-col items-center justify-center">
        <motion.div
          className="w-12 h-48 rounded-lg bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,100,50,0.5)",
              "0 0 40px rgba(255,100,50,0.8)",
              "0 0 20px rgba(255,100,50,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-full flex items-center justify-center">
            <span className="text-white orbitron text-xs font-bold writing-mode-vertical transform -rotate-180" style={{ writingMode: "vertical-rl" }}>
              HOT SIDE
            </span>
          </div>
        </motion.div>
        <p className="mt-2 text-orange-400 orbitron text-sm font-bold">100°C</p>
      </div>

      <div className="flex-1 flex">
        {layers.map((layer, index) => {
          const widthPercent = (layer.thickness / totalThickness) * 100;
          const colors = materialColors[layer.material] || materialColors.concrete;
          
          return (
            <motion.div
              key={`${layer.material}-${index}`}
              className="relative h-full border-x border-white/10"
              style={{
                width: `${widthPercent}%`,
                background: colors.pattern,
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel px-2 py-1 rounded whitespace-nowrap">
                <p className="text-xs orbitron text-white/80 capitalize">{layer.material}</p>
                <p className="text-[10px] text-white/60">{layer.thickness}cm</p>
              </div>

              {showConduction && (
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: Math.floor(layer.thickness / 2) }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${20 + (i % 3) * 30}%`,
                        top: `${20 + Math.floor(i / 3) * 25}%`,
                        backgroundColor: index === 0 ? "#ff6b35" : index === layers.length - 1 ? "#4488ff" : "#ff9966",
                        boxShadow: `0 0 8px ${index === 0 ? "#ff6b35" : index === layers.length - 1 ? "#4488ff" : "#ff9966"}`,
                      }}
                      animate={{
                        x: [-2, 2, -2],
                        y: [1, -1, 1],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 0.2 + index * 0.1,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="absolute -right-20 top-0 bottom-0 w-16 flex flex-col items-center justify-center">
        <motion.div
          className="w-12 h-48 rounded-lg bg-gradient-to-t from-blue-600 via-cyan-500 to-blue-400"
          animate={{
            boxShadow: [
              "0 0 20px rgba(50,150,255,0.5)",
              "0 0 40px rgba(50,150,255,0.8)",
              "0 0 20px rgba(50,150,255,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-full flex items-center justify-center">
            <span className="text-white orbitron text-xs font-bold" style={{ writingMode: "vertical-rl" }}>
              COLD SIDE
            </span>
          </div>
        </motion.div>
        <p className="mt-2 text-cyan-400 orbitron text-sm font-bold">20°C</p>
      </div>
    </div>
  );
}
