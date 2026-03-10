import axios from "axios";
import { generateHeaders } from "@/handlers/generateHeaders";
import { getApiBaseUrl } from "@/handlers/getApiBaseUrl";
import { AgentSession } from "@/models/AgentSession";

export class AgentSessionHandler {
  async createAgentSession(
    identity: string,
    room: string,
    userId?: string
  ): Promise<AgentSession> {
    const headers = generateHeaders();
    const apiBaseUrl = getApiBaseUrl();
    const response = await axios.post(
      `${apiBaseUrl}/api/agent/session`,
      { identity, room, user_id: userId },
      headers
    );

    return new AgentSession({ ...response.data });
  }
}
