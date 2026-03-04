import dotenv from "dotenv";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();
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
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);
