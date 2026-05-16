// OWNER: Person 3 (Backend / Integrations)
// Surface: SHARED — must work in both Next.js (Node + browser) and the Chrome extension
// Do not edit without coordinating in group chat.

// TODO(Person 3): in the extension, persist session in chrome.storage.local (custom storage adapter)
// TODO(Person 3): in Next.js server contexts, prefer the service-role client when SUPABASE_SERVICE_ROLE_KEY is present
// TODO(Person 3): export a typed Database generic once we run `supabase gen types`
// TODO(Person 3): handle the "no env in extension" case — config is bundled at build time, see apps/extension/src/lib/config.ts

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function createSupabaseClient(_config: SupabaseConfig) {
  // TODO: return createClient(config.url, config.anonKey, { ...storage adapter... })
  return {} as unknown;
}
