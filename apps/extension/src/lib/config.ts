// OWNER: Person 3 (Backend / Integrations)
// Surface: extension — build-time config (extension cannot read .env at runtime)
// Do not edit without coordinating in group chat.

// TODO(Person 3): swap in real values before building the extension for the demo
// TODO(Person 3): consider a `define` block in vite.config.ts to inject from process.env at build time
// TODO(Person 3): NEVER place service-role or OPENAI_API_KEY here — extension is client-side, anyone can read it

export const SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR-ANON-KEY',
};
