import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});


async function main() {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
            { role: "system", content: "You are a senior AI architect." },
            { role: "user", content: "Explain RAG in simple terms." }
        ],
    });
    console.log(response.choices[0].message.content);
}

main();


