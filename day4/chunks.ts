function paragraphChunk(text: string): string[] {
  return text
    .split("\n\n")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

function tokenChunk(
  text: string,
  chunkSize: number,
  overlap: number
): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
  }

  return chunks;
}

const text = `
Next.js enables server-side rendering.
It improves performance using caching.
It supports static generation.
It also supports API routes.
ext.js enables server-side rendering.
It improves performance using caching.
It supports static generation.
It also supports API routesext.js enables server-side rendering.
It improves performance using caching.
It supports static generation.
It also supports API routesext.js enables server-side rendering.
It improves performance using caching.
It supports static generation.
It also supports API routesext.js enables server-side rendering.
It improves performance using caching.
It supports static generation.
It also supports API routesext.js enables server-side rendering.
It improves performance using caching.
It supports static generation.
It also supports API routes
`;

const chunksByToken = tokenChunk(text, 10, 5);
const chunksByPara = paragraphChunk(text);

console.log("chunksByToken", chunksByToken);
console.log("chunksByPara,", chunksByPara);
