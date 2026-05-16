// OWNER: Person 4 (AI / Marketing)
// Surface: server-only (Next.js route handlers). NEVER import from client or extension.
// Do not edit without coordinating in group chat.

// TODO(Person 4): instantiate OpenAI SDK with process.env.OPENAI_API_KEY
// TODO(Person 4): pick a default model (gpt-4o-mini for cost; bump for the demo if needed)
// TODO(Person 4): add a thin wrapper that injects the project's prompt templates
// TODO(Person 4): never expose this to the browser — guard with a "server only" runtime check

export function createOpenAIClient() {
  // TODO: return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return {} as unknown;
}
