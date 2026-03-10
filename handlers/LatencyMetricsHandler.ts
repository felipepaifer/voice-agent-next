import axios from "axios"
import { generateHeaders } from "@/handlers/generateHeaders"
import { getApiBaseUrl } from "@/handlers/getApiBaseUrl"

type LatencySummaryMetric = {
  p50: number | null
  p95: number | null
}

export type LatencySample = {
  turn: number
  timestamp: string
  end_to_end_response_ms: number | null
  llm_time_to_first_token_ms: number | null
}

export type LatencyMetricsResponse = {
  window_size: number
  sample_count: number
  samples: LatencySample[]
  summary: {
    end_to_end_response_ms: LatencySummaryMetric
    llm_time_to_first_token_ms: LatencySummaryMetric
  }
}

export class LatencyMetricsHandler {
  async getLatencyMetrics(): Promise<LatencyMetricsResponse> {
    const headers = generateHeaders()
    const apiBaseUrl = getApiBaseUrl()
    const response = await axios.get<LatencyMetricsResponse>(
      `${apiBaseUrl}/api/admin/metrics/latency`,
      headers
    )
    return response.data
  }
}
