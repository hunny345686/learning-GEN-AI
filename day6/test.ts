import { hybridSearch } from "./hybridRetriever.ts";

async function test() {
  const results = await hybridSearch("Next.js app router caching");

  console.log(results);
}

test();
