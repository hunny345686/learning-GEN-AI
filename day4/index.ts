import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Document
const documents = [
  { id: 1, text: "React is a frontend JavaScript library for building UI." },
  {
    id: 2,
    text: "Next.js enables server-side rendering and static generation.",
  },
  { id: 3, text: "Node.js allows JavaScript to run on the server." },
  { id: 4, text: "MongoDB is a NoSQL database used for flexible schemas." },
];

// ---- Embedding Function ----

async function getEmbeddings(text: string) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return res.data[0].embedding;
}

// ---- Cosine Similarity ----
function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

function magnitude(vector: number[]): number {
  return Math.sqrt(dotProduct(vector, vector));
}

function cosineSimilarity(a: number[], b: number[]): number {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}
// ---- Precompute embeddings ----
async function indexDocs() {
  for (const doc of documents) {
    (doc as any).embedding = await getEmbeddings(doc.text);
  }
}

// ---- Retrieval ----

function retrivel(queryEmbedding: number[]) {
  return documents
    .map((doc: any) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => a.score - b.score);
}

// ---- Generation ----

async function generateAnswer(query: string, context: string) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "Answer only using the provided context",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${query}`,
      },
    ],
  });

  return res.choices[0].message.content;
}

// ---- Main Flow ----

async function run() {
  await indexDocs();
  //   const userQuery = "How does Next.js improve performance?";
  //   responce Answer:
  //  The provided context does not include information about Next.js or its performance improvements.
  const userQuery = "what is express?";

  const queryEmbedding = await getEmbeddings(userQuery);
  const topDocs = retrivel(queryEmbedding);

  const context = topDocs.map((d) => d.text).join("\n");
  const answer = await generateAnswer(userQuery, context);
  console.log(answer);
}
run();
