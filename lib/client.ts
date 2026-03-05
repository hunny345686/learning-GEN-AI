import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

/**
 * - Open AI client
 */

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * - Pinecone Client
 */

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

export const index = pinecone.index("genai-index");
