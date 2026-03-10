"use client"

import { useMemo } from "react"
import {
  AWTrendLineChart,
  type AWTrendBand,
  type AWTrendLineSeries,
} from "@/components/AWTrendLineChart"
import type { LatencySample } from "@/handlers/LatencyMetricsHandler"

type LatencyTrendPoint = {
  turn: number
  endToEndResponse: number | null
  llmTtft: number | null
}

type LatencyTrendChartProps = {
  samples: LatencySample[]
}

export function LatencyTrendChart({ samples }: LatencyTrendChartProps) {
  const data = useMemo<LatencyTrendPoint[]>(
    () =>
      samples.map((sample) => ({
        turn: sample.turn,
        endToEndResponse: sample.end_to_end_response_ms,
        llmTtft: sample.llm_time_to_first_token_ms,
      })),
    [samples]
  )

  const yDomain = useMemo<[number, number]>(() => {
    const numericValues = data.flatMap((point) =>
      [point.endToEndResponse, point.llmTtft].filter(
        (value): value is number => typeof value === "number" && Number.isFinite(value)
      )
    )
    const maxValue = numericValues.length > 0 ? Math.max(...numericValues) : 2500
    // Add headroom so peaks are not clipped at the chart's top edge.
    const paddedMax = Math.ceil(maxValue * 1.15)
    return [0, Math.max(2500, paddedMax)]
  }, [data])

  const series: AWTrendLineSeries<LatencyTrendPoint>[] = [
    {
      key: "endToEndResponse",
      label: "Perceived response (EOU -> first audio)",
      color: "#fb7185",
      strokeWidth: 3,
    },
    { key: "llmTtft", label: "LLM TTFT", color: "#22c55e" },
  ]

  const bands: AWTrendBand[] = [
    { from: 0, to: 1200, color: "#166534", opacity: 0.2 },
    { from: 1200, to: 2500, color: "#a16207", opacity: 0.16 },
    { from: 2500, to: 30000, color: "#991b1b", opacity: 0.12 },
  ]

  return (
    <div className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
      <div className="mb-2 text-sm font-semibold text-slate-100">Latency trend</div>
      <AWTrendLineChart
        data={data}
        xKey="turn"
        series={series}
        bands={bands}
        height={210}
        yDomain={yDomain}
      />
      <div className="mt-2 text-[11px] text-slate-400">
        Baseline guidance: good under 1.2s, acceptable from 1.2s-2.5s,
        and poor above 2.5s for both perceived response and TTFT lines.
      </div>
    </div>
  )
}
