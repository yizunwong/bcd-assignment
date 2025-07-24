/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api-client/custom-fetcher.ts
interface FetcherProps {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: any;
  signal?: AbortSignal;
  params?: Record<string, string | number>; // ✅ Add this
}

export const customFetcher = async <T = any>({
  url,
  method,
  headers,
  data,
  signal,
  params,
}: FetcherProps): Promise<T> => {
  // Construct query string
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}${query}`, {
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
