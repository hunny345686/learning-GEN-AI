import { client } from "../lib/client.ts";
import { shortTermMemory } from "./shortTerm.ts";

const memory = new shortTermMemory();

async function chat(query: string) {
  memory.addMsg("user", query);

  const res = await client.chat.completions.create({
    model: "chatgpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...memory.getMsg(),
    ],
  });

  const reply = res.choices[0].message.content || "";
  memory.addMsg("assistant", reply);
  memory.trim(10);
  return reply;
}
