"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TempPoint = {
  time: number;
  hot: number;
  cold: number;
};

export default function TemperatureGraph({ data }: { data: TempPoint[] }) {
  return (
    <div className="glass-panel rounded-xl px-4 py-3 border-white/5 bg-white/5">
      <p className="text-[11px] font-heading uppercase tracking-wider text-muted-foreground mb-2">
        Temperature vs Time
      </p>

      {/* FIXED HEIGHT */}
      <div className="w-full h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 3"
            />

            {/* X AXIS */}
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />

            {/* Y AXIS – FIXED RANGE */}
            <YAxis
              domain={[0, 100]}
              unit="°C"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(15,20,35,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

            {/* HOT SIDE */}
            <Line
              type="monotone"
              dataKey="hot"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              name="Hot Side"
            />

            {/* COLD SIDE */}
            <Line
              type="monotone"
              dataKey="cold"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              name="Cold Side"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
