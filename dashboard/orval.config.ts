const config = {
  dashboard: {
    input: "../backend/swagger-spec.json",
    output: {
      target: "./app/api/index.ts",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./app/api/fetch.ts",
          name: "customFetcher",
        },
      },
    },
  },
};

export default config;
