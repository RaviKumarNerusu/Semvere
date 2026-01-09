"use client";

import { motion } from "framer-motion";
import { Flame, Wind, Sun, ArrowRight, Zap } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 -right-24 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05], rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-10" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent mb-6"
        >
          <Zap className="w-4 h-4" />
          <span>Interactive Physics Experience</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl md:text-8xl font-bold font-heading mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent"
        >
          HEAT <span className="text-primary">TRANSFER</span>
          <br />
          VISUALIZER
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 leading-relaxed"
        >
          Explore the invisible world of thermodynamics through real-time interactive simulations.
        </motion.p>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(var(--primary), 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold font-heading text-lg"
        >
          ENTER THE LAB
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </header>

      {/* Cards */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Conduction */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10">
            <Flame className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-primary">CONDUCTION</h3>
            <p className="text-muted-foreground">
              Heat transfer through direct contact in solids caused by molecular vibration without material movement.
            </p>
          </motion.div>

          {/* Convection */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10">
            <Wind className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-accent">CONVECTION</h3>
            <p className="text-muted-foreground">
              Heat transfer by the movement of fluids where hot fluid rises and cold fluid sinks forming currents.
            </p>
          </motion.div>

          {/* Radiation */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10">
            <Sun className="w-8 h-8 text-chart-3 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-chart-3">RADIATION</h3>
            <p className="text-muted-foreground">
              Heat transfer through electromagnetic waves without requiring a physical medium.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
