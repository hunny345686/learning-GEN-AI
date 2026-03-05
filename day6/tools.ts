import { hybridSearch } from "./hybridRetriever.ts";

export const tool = {
  searchDocs: async (query: string) => {
    return await hybridSearch(query);
  },
};
