import { Configuration } from "../api-client";

export const config = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
  accessToken: () => localStorage.getItem("access_token") || "",
});
;