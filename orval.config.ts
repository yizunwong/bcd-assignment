const config = {
  dashboard: {
    input: "../bcd-assignment/backend/swagger-spec.json",
    output: {
      target: "./dashboard/src/api-client/endpoints.ts", 
      schemas: "./dashboard/src/api-client/types", 
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
