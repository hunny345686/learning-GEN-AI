import { client } from "./client.ts";

export async function createEmbeddingd(text: string) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return res.data[0].embedding;
}
