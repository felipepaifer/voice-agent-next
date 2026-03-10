import axios from "axios";
import { generateHeaders } from "@/handlers/generateHeaders";
import { getApiBaseUrl } from "@/handlers/getApiBaseUrl";
import { AgentSettings } from "@/models/AgentSettings";

export class AgentSettingsHandler {
  async getAgentSettings(): Promise<AgentSettings> {
    const headers = generateHeaders();
    const apiBaseUrl = getApiBaseUrl();
    const response = await axios.get(
      `${apiBaseUrl}/api/admin/config`,
      headers
    );

    return new AgentSettings({ ...response.data });
  }

  async updateAgentSettings(settings: AgentSettings): Promise<AgentSettings> {
    const headers = generateHeaders();
    const apiBaseUrl = getApiBaseUrl();
    const response = await axios.post(
      `${apiBaseUrl}/api/admin/config`,
      settings.toApi(),
      headers
    );

    return new AgentSettings({ ...response.data.config });
  }
}
