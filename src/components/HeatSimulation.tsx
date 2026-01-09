"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

import { ConductionLayer } from "./ConductionLayer";
import { ConvectionLayer } from "./ConvectionLayer";
import { RadiationLayer } from "./RadiationLayer";
import { WallLayers } from "./WallLayers";
import TemperatureGraph from "./ui/TemperatureGraph";
import HeatChatbot from "./HeatChatbot";

import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- MATERIAL DATA ---------------- */

const MATERIALS = [
  { id: "copper", name: "Copper", conductivity: 401 },
  { id: "steel", name: "Steel", conductivity: 50 },
  { id: "glass", name: "Glass", conductivity: 1.05 },
  { id: "wood", name: "Wood", conductivity: 0.15 },
  { id: "foam", name: "Foam", conductivity: 0.03 },
  { id: "brick", name: "Brick", conductivity: 0.72 },
  { id: "concrete", name: "Concrete", conductivity: 1.7 },
  { id: "fiberglass", name: "Fiberglass", conductivity: 0.04 },
];

interface Layer {
  material: string;
  thickness: number;
}

/* ---------------- MAIN COMPONENT ---------------- */

export function HeatSimulation() {
  /* Toggles */
  const [conductionEnabled, setConductionEnabled] = useState(false);
  const [convectionEnabled, setConvectionEnabled] = useState(false);
  const [radiationEnabled, setRadiationEnabled] = useState(false);

  /* Wall layers */
  const [layers, setLayers] = useState<Layer[]>([
    { material: "brick", thickness: 10 },
    { material: "foam", thickness: 5 },
    { material: "concrete", thickness: 15 },
  ]);

  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  /* Temperature */
  const [temperature, setTemperature] = useState(80);

  /* Graph state */
  const [time, setTime] = useState(0);
  const [hotTemp, setHotTemp] = useState(100);
  const [coldTemp, setColdTemp] = useState(20);
  const [tempHistory, setTempHistory] = useState<
    { time: number; hot: number; cold: number }[]
  >([]);

  /* ---------------- ENERGY LOSS ---------------- */

  const energyLoss = useMemo(() => {
    let resistance = 0;
    layers.forEach((layer) => {
      const mat = MATERIALS.find((m) => m.id === layer.material);
      if (mat) resistance += layer.thickness / (mat.conductivity * 100);
    });
    return Math.round(100 / (1 + resistance * 10));
  }, [layers]);

  /* ---------------- REAL-TIME TEMPERATURE UPDATE ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);

      setHotTemp((t) => Math.max(t - energyLoss * 0.01, temperature));
      setColdTemp((t) => Math.min(t + energyLoss * 0.008, temperature));

      setTempHistory((prev) =>
        [
          ...prev,
          {
            time,
            hot: hotTemp,
            cold: coldTemp,
          },
        ].slice(-40)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [energyLoss, temperature, time, hotTemp, coldTemp]);

  /* ---------------- LAYER ACTIONS ---------------- */

  const addLayer = () => {
    if (layers.length < 5) {
      setLayers([...layers, { material: "foam", thickness: 5 }]);
    }
  };

  const removeLayer = (index: number) => {
    if (layers.length > 1) {
      setLayers(layers.filter((_, i) => i !== index));
      setSelectedLayerIndex(0);
    }
  };

  const updateLayer = (
    index: number,
    field: keyof Layer,
    value: string | number
  ) => {
    const copy = [...layers];
    copy[index] = { ...copy[index], [field]: value };
    setLayers(copy);
  };

  const resetSimulation = () => {
    setLayers([
      { material: "brick", thickness: 10 },
      { material: "foam", thickness: 5 },
      { material: "concrete", thickness: 15 },
    ]);
    setTemperature(80);
    setHotTemp(100);
    setColdTemp(20);
    setTempHistory([]);
    setTime(0);
    setConductionEnabled(false);
    setConvectionEnabled(false);
    setRadiationEnabled(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-border flex justify-between">
        <h1 className="text-xl font-bold font-heading">
          Heat Transfer <span className="text-primary">Visualizer</span>
        </h1>
        <button
          onClick={resetSimulation}
          className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT PANEL */}
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-xl">
            <p className="font-heading mb-3">Transfer Modes</p>

            {[
              ["Conduction", conductionEnabled, setConductionEnabled],
              ["Convection", convectionEnabled, setConvectionEnabled],
              ["Radiation", radiationEnabled, setRadiationEnabled],
            ].map(([label, value, setter]) => (
              <div key={label as string} className="flex justify-between mb-2">
                <span>{label}</span>
                <Switch checked={value as boolean} onCheckedChange={setter as any} />
              </div>
            ))}
          </div>

          <div className="glass-panel p-4 rounded-xl">
            <p className="font-heading mb-2">Temperature</p>
            <Slider
              value={[temperature]}
              min={20}
              max={100}
              step={1}
              onValueChange={(v) => setTemperature(v[0])}
            />
            <p className="text-center mt-2">{temperature}°C</p>
          </div>

          <div className="glass-panel p-4 rounded-xl">
            <div className="flex justify-between mb-2">
              <p className="font-heading">Wall Layers</p>
              <button onClick={addLayer}>
                <Plus size={16} />
              </button>
            </div>

            <AnimatePresence>
              {layers.map((layer, index) => (
                <motion.div
                  key={index}
                  className="p-3 border rounded-lg mb-2"
                >
                  <div className="flex justify-between mb-2">
                    <span>Layer {index + 1}</span>
                    <button onClick={() => removeLayer(index)}>
                      <Minus size={14} />
                    </button>
                  </div>

                  <Select
                    value={layer.material}
                    onValueChange={(v) =>
                      updateLayer(index, "material", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIALS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Slider
                    value={[layer.thickness]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(v) =>
                      updateLayer(index, "thickness", v[0])
                    }
                  />
                  <p className="text-xs">{layer.thickness} cm</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-3">
          <div className="glass-panel h-[600px] p-4 flex flex-col">
            {/* WALL AREA */}
            <div className="flex-1 relative overflow-hidden">
              <WallLayers
                layers={layers}
                showConduction={conductionEnabled}
              />

              <AnimatePresence>
                {conductionEnabled && (
                  <ConductionLayer
                    enabled
                    material={layers[selectedLayerIndex].material}
                    thickness={layers.reduce((s, l) => s + l.thickness, 0)}
                  />
                )}
                {convectionEnabled && (
                  <ConvectionLayer enabled temperature={temperature} />
                )}
                {radiationEnabled && (
                  <RadiationLayer enabled intensity={temperature} />
                )}
              </AnimatePresence>

              <div className="absolute top-4 right-4 text-right">
                <p className="text-xs">Energy Loss</p>
                <p className="text-2xl font-bold">{energyLoss}%</p>
              </div>
            </div>

            {/* GRAPH AREA */}
            <div className="mt-4">
              <TemperatureGraph data={tempHistory} />
            </div>
          </div>
        </div>
      </main>
    </div>
    

  );
}
