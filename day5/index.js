
// Dous.map((doc)=>{ cosineSimilarity(doc.embedding, queryEmbedding) })
// O(N) — linear scan.

import OpenAI from "openai"
import { Pinecone } from "@pinecone-database/pinecone"
import dotenv from "dotenv";

dotenv.config();


// Dummy Data
const documents = [
    {
        id: "1",
        text: "React is a frontend library",
    },
    {
        id: "2",
        text: "Next.js is a full stack framework",
    },
    {
        id: "3",
        text: "Vector databases store embeddings",
    },
];

// Open AI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})
// Pincode 
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
})
// Index
const index = pinecone.index(process.env.PINECONE_INDEX).namespace("Learning-GENAI");

// Create Embedings 
async function createEmbeddingd(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    })

    return response.data[0].embedding
}

// convert all data in embeddings in upsert to vercor DB

async function ingestInVectorDB() {
    const vercor = []
    for (const doc of documents) {
        const embeddings = await createEmbeddingd(doc.text)
        vercor.push({
            id: doc.id,
            value: embeddings,
            metadat: {
                text: doc.text
            }
        })
    }
    await index.upsertRecords(vercor)
    console.log("Documents stored in Pinecone")
    // const testEmbedding = await createEmbeddingd("hello world");

    // await index.upsertRecords([
    //     {
    //         "_id": "rec1",
    //         "chunk_text": "Apples are a great source of dietary fiber, which supports digestion and helps maintain a healthy gut.",
    //         "category": "digestive system", 
    //     },
    // ]);

}
ingestInVectorDB()


//  Retrivel from vecordb 

async function serchInvecordb(query) {
    const Qembeddin = await createEmbeddingd(query)

    const result = await index.query({
        vector: Qembeddin,
        topK: 2,
        includeMetadata: true
    })
    console.log("Matches:");
    console.log(result.matches);
}
serchInvecordb("What is frontend framework?");