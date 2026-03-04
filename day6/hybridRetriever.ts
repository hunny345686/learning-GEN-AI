import { index } from "../lib/client";
import { createEmbeddingd } from "../lib/embedding";

const localDocuments = [
  { id: "1", text: "React is a frontend library" },
  { id: "2", text: "Next.js 14 introduced app router caching" },
  { id: "3", text: "Vector databases store embeddings efficiently" },
];
/**
 * - Basic keyword match
 */

function keywordSearch(query: string) {
  const lowerCasetext = query.toLocaleLowerCase();

  return localDocuments
    .filter((doc) => doc.text.toLocaleLowerCase().includes(lowerCasetext))
    .map((doc) => doc.text);
}

/**
 * -Vector Search using Pinecone
 */
async function vectorSearch(query: string) {
  const embedding = createEmbeddingd(query);

  const results = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  return results.matches?.map((match) => match.metadata?.text as string) || [];
}

/**
 * -Hybrid Retrieval (Vector + Keyword)
 */
export async function hybridSearch(query: string) {
  const vectorResults = await vectorSearch(query);
  const keywordResults = await keywordSearch(query);

  const combine = [...vectorResults, ...keywordResults];

  // Remove duplicates
  const unique = [...new Set(combine)];
  return unique.slice(0, 5);
}

console.log(hybridSearch("What is React?"));
