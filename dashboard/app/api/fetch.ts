/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api-client/custom-fetcher.ts
interface FetcherProps {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: any;
  signal?: AbortSignal;
}

export const customFetcher = async <T = any>({
  url,
  method,
  headers,
  data,
  signal,
}: FetcherProps): Promise<T> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    signal,
  });

  if (!res.ok) throw new Error("API error");
  return res.json();
};
