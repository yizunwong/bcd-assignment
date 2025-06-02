const config = {
  dashboard: {
    input: "../bcd-assignment/backend/swagger-spec.json",
    output: {
      target: "./dashboard/src/api-client/api.ts", 
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./dashboard/src/api-client/fetch.ts",
          name: "customFetcher",
        },
      },
    },
  },
};

export default config;
