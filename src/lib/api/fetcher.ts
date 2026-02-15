import { ApiError } from "@/types/api-contract";

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const apiError = payload as ApiError | null;
    const errorMessage =
      apiError?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage) as Error & {
      status?: number;
      code?: string;
      details?: string;
    };
    error.status = response.status;
    error.code = apiError?.code;
    error.details = apiError?.details;
    throw error;
  }

  return payload;
};
