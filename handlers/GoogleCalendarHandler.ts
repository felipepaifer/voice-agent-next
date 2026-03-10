import axios from "axios";
import { generateHeaders } from "@/handlers/generateHeaders";
import { getApiBaseUrl } from "@/handlers/getApiBaseUrl";

type ConnectResponse = {
  auth_url: string;
};

type StatusResponse = {
  connected: boolean;
  scopes?: string[];
  expiry?: string | null;
  error?: string;
};

export class GoogleCalendarHandler {
  async connect(userId: string): Promise<string> {
    const headers = generateHeaders();
    const apiBaseUrl = getApiBaseUrl();
    const response = await axios.post<ConnectResponse>(
      `${apiBaseUrl}/api/admin/google/connect`,
      { user_id: userId },
      headers
    );
    return response.data.auth_url;
  }

  async status(userId: string): Promise<StatusResponse> {
    const headers = generateHeaders();
    const apiBaseUrl = getApiBaseUrl();
    const response = await axios.get<StatusResponse>(
      `${apiBaseUrl}/api/admin/google/status`,
      {
        ...headers,
        params: { user_id: userId },
      }
    );
    return response.data;
  }

  async disconnect(userId: string): Promise<void> {
    const headers = generateHeaders();
    const apiBaseUrl = getApiBaseUrl();
    await axios.post(
      `${apiBaseUrl}/api/admin/google/disconnect`,
      { user_id: userId },
      headers
    );
  }
}
