import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

function magnitude(vector: number[]): number {
  return Math.sqrt(dotProduct(vector, vector));
}

function cosineSimilarity(a: number[], b: number[]): number {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}

async function run() {
  const text1 = "React is a frontend library";
  const text2 = "Next.js is used for server side rendering";
  const text3 = "I love eating pizza";

  const emb1 = await getEmbedding(text1);
  const emb2 = await getEmbedding(text2);
  const emb3 = await getEmbedding(text3);

  // console.log("Embedding 1:", emb1);
  // console.log("Embedding 2:", emb2);
  // console.log("Embedding 3:", emb3);

  console.log("React vs Next:", cosineSimilarity(emb1, emb2));
  console.log("React vs Pizza:", cosineSimilarity(emb1, emb3));
}

run();
