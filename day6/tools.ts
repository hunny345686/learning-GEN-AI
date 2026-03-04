import { hybridRetrieve } from "hybridRetrieve";

export const tool = {
  searchDocs: async (query: string) => {
    return await hybridRetrieve(query);
  },
};
