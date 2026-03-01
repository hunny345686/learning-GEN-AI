import OpenAI from "openai"
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Step 1: Documents
// ----------------------------
const documents = [
    { id: 1, text: "React is a frontend library" },
    { id: 2, text: "Next.js supports server side rendering" },
    { id: 3, text: "MongoDB is a NoSQL database" },
    { id: 4, text: "Pizza is my favorite food" }
];
// Step 2: Generate Embedding
async function genrateEmbaddings(text) {
    const responce = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
    })

    return responce.data[0].embedding
}

// Step 3: Cosine Similarity
// ----------------------------
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);

    const magnitudeA = Math.sqrt(
        vecA.reduce((sum, val) => sum + val * val, 0)
    );

    const magnitudeB = Math.sqrt(
        vecB.reduce((sum, val) => sum + val * val, 0)
    );

    return dotProduct / (magnitudeA * magnitudeB);
}

// Step 4: Index Documents

async function indexDocs(params) {

    for (const doc of documents) {
        doc.embedding = await genrateEmbaddings(doc.text)
    }

}

// Step 5: Semantic Search
// ----------------------------
async function semanticSearch(query) {
    const queryEmbedding = await genrateEmbaddings(query);
    const scored = documents.map(doc => ({
        ...doc,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored[0]; // top result
}

// Run Example
// ----------------------------
(async () => {
    await indexDocs();

    const result = await semanticSearch("Which database should I use?");
    console.log("Top Match:");
    console.log(result.text);
})();