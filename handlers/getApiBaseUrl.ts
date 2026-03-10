const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getApiBaseUrl = (): string => {
  const rawValue =
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!rawValue) {
    throw new Error(
      "Missing API base URL. Set NEXT_PUBLIC_BACKEND_API_BASE_URL in aloware-next/.env."
    );
  }

  return trimTrailingSlash(rawValue);
};
