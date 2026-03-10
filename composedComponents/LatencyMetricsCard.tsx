"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  LatencyMetricsHandler,
  type LatencyMetricsResponse,
  type LatencySample,
} from "@/handlers/LatencyMetricsHandler"
import { LatencyTrendChart } from "@/composedComponents/LatencyTrendChart"
import { AWAccordion } from "@/components/AWAccordion"

const formatMs = (value: number | null | undefined): string =>
  typeof value === "number" ? `${value.toFixed(1)} ms` : "insufficient data"

const getLatencyStatus = (value: number | null | undefined) => {
  if (typeof value !== "number") {
    return {
      label: "No data",
      className: "border-slate-600/60 bg-slate-700/30 text-slate-200",
    }
  }
  if (value < 1200) {
    return {
      label: "Good",
      className: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
    }
  }
  if (value <= 2500) {
    return {
      label: "Acceptable",
      className: "border-amber-400/40 bg-amber-500/15 text-amber-200",
    }
  }
  return {
    label: "Poor",
    className: "border-rose-400/40 bg-rose-500/15 text-rose-200",
  }
}

export function LatencyMetricsCard() {
  // States
  const handler = useMemo(() => new LatencyMetricsHandler(), [])
  const [metrics, setMetrics] = useState<LatencyMetricsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  // Derived values
  const latestSamples = (metrics?.samples ?? []).slice().reverse()
  const endToEndP50 = metrics?.summary.end_to_end_response_ms.p50
  const latencyStatus = getLatencyStatus(endToEndP50)
  const isLowSampleSize = (metrics?.sample_count ?? 0) < 15

  // Methods
  const loadMetrics = useCallback(async () => {
    try {
      const response = await handler.getLatencyMetrics()
      setMetrics(response)
      setError("")
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load metrics"
      if (message.toLowerCase().includes("network error")) {
        setError("Unable to reach backend metrics endpoint. Check backend/agent containers.")
        return
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [handler])

  const summaryItems = [
    {
      label: "Perceived response latency",
      metric: metrics?.summary.end_to_end_response_ms,
      formula: "EOU -> first audio (firstAudioPlaybackAt - speechEndAt)",
    },
    {
      label: "LLM time to first token",
      metric: metrics?.summary.llm_time_to_first_token_ms,
      formula: "providerTTFT",
    },
  ]

  // Watchers
  useEffect(() => {
    if (!isExpanded) {
      return
    }
    setIsLoading(true)
    void loadMetrics()
    const intervalId = window.setInterval(() => {
      void loadMetrics()
    }, 2500)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [isExpanded, loadMetrics])

  return (
    <div className="pointer-events-none absolute inset-x-2 bottom-2 z-30 sm:inset-x-3 sm:bottom-3">
      <div className="pointer-events-auto">
        <AWAccordion
          expanded={isExpanded}
          onChange={setIsExpanded}
          title="Latency Dashboard"
          subtitle={
            <div className="flex items-center gap-2">
              <span>Live turn metrics ({metrics?.sample_count ?? 0} samples)</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${latencyStatus.className}`}
              >
                P50 perceived response: {latencyStatus.label}
              </span>
            </div>
          }
        >
          <div className="grid gap-3">
            {isLowSampleSize ? (
              <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
                Sample size is low ({metrics?.sample_count ?? 0} turns). p50/p95 may swing until
                you collect at least 15 turns.
              </div>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-3 text-slate-100"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {item.label}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">{item.formula}</div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium text-slate-300">p50:</span>{" "}
                    {formatMs(item.metric?.p50)}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-300">p95:</span>{" "}
                    {formatMs(item.metric?.p95)}
                  </div>
                </div>
              ))}
            </div>

            <LatencyTrendChart samples={metrics?.samples ?? []} />

            <div className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
              <div className="mb-2 text-sm font-semibold text-slate-100">
                Recent turns ({metrics?.sample_count ?? 0} samples, window{" "}
                {metrics?.window_size ?? 0})
              </div>
              {isLoading ? (
                <div className="text-sm text-slate-400">Loading metrics...</div>
              ) : error ? (
                <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
                  {error}
                </div>
              ) : latestSamples.length === 0 ? (
                <div className="text-sm text-slate-400">
                  No samples yet. Start a call and speak to generate latency data.
                </div>
              ) : (
                <div className="max-h-[28vh] overflow-y-auto overflow-x-hidden sm:max-h-[32vh]">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="pr-2">Turn</th>
                        <th className="pr-2">Perceived response</th>
                        <th className="pr-2">LLM TTFT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestSamples.map((sample: LatencySample) => (
                        <tr
                          key={`${sample.turn}-${sample.timestamp}`}
                          className="border-t border-slate-700/60"
                        >
                          <td className="py-1 pr-2 font-medium text-slate-100">
                            {sample.turn}
                          </td>
                          <td className="py-1 pr-2 text-slate-200">
                            {formatMs(sample.end_to_end_response_ms)}
                          </td>
                          <td className="py-1 pr-2 text-slate-200">
                            {formatMs(sample.llm_time_to_first_token_ms)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </AWAccordion>
      </div>
    </div>
  )
}
