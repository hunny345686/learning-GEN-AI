import { client } from "../lib/client.ts";
import { tool } from "./tools.ts";

async function agent(question: string) {
  let context = "";
  let finalAnswer = "";

  for (let i = 0; i < 3; i++) {
    const prompt = `
            You are an AI agent.

            You can:
            1. SEARCH: searchDocs(query)
            2. ANSWER: provide final answer

            Current context:
            ${context}

            User question:
            ${question}

            Respond in JSON:
            {
            "action": "SEARCH" | "ANSWER",
            "input": "string"
            }
            `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const content = response.choices[0].message.content || "{}";
    const decision = JSON.parse(content) as {
      action: "SEARCH" | "ANSWER";
      input: string;
    };

    if (decision.action === "SEARCH") {
      const results = await tool.searchDocs(decision.input);
      context += "\n" + results.join("\n");
    }

    if (decision.action === "ANSWER") {
      finalAnswer = decision.input;
      break;
    }
  }

  return finalAnswer;
}

agent("Explain Next.js app router caching.");
