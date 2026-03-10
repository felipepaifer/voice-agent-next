import { AxiosRequestConfig } from "axios";

export const generateHeaders = (): AxiosRequestConfig => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
  if (adminApiKey) {
    headers["x-api-key"] = adminApiKey;
  }

  return { headers };
};
