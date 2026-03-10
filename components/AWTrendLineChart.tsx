"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AWTrendLineSeries<T extends Record<string, unknown>> = {
  key: keyof T;
  label: string;
  color: string;
  strokeWidth?: number;
};

export type AWTrendBand = {
  from: number;
  to: number;
  color: string;
  opacity?: number;
};

type AWTrendLineChartProps<T extends Record<string, unknown>> = {
  data: T[];
  xKey: keyof T;
  series: AWTrendLineSeries<T>[];
  bands?: AWTrendBand[];
  height?: number;
  yDomain?: [number | "auto", number | "auto"];
};

export function AWTrendLineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  series,
  bands = [],
  height = 220,
  yDomain = ["auto", "auto"],
}: AWTrendLineChartProps<T>) {
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 14, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey={String(xKey)} stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={yDomain} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#cbd5e1" }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />

          {bands.map((band) => (
            <ReferenceArea
              key={`${band.from}-${band.to}-${band.color}`}
              y1={band.from}
              y2={band.to}
              fill={band.color}
              fillOpacity={band.opacity ?? 0.14}
            />
          ))}

          {series.map((line) => (
            <Line
              key={String(line.key)}
              type="monotone"
              dataKey={String(line.key)}
              name={line.label}
              stroke={line.color}
              strokeWidth={line.strokeWidth ?? 2}
              dot={false}
              isAnimationActive
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
