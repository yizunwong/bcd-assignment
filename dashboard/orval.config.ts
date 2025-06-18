const config = {
  dashboard: {
    input: "../backend/swagger-spec.json",
    output: {
      target: "./src/api-client/api.ts", 
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./src/api-client/fetch.ts",
          name: "customFetcher",
        },
      },
    },
  },
};

export default config;
