// OWNER: Person 3 (Backend / Integrations)
// Surface: SHARED — must work in both Next.js (Node + browser) and the Chrome extension
// Do not edit without coordinating in group chat.

import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { CookieOptions } from '@supabase/ssr';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Create a Supabase client for browser contexts (client components)
 */
export function createBrowserSupabaseClient(config: SupabaseConfig) {
  return createBrowserClient(config.url, config.anonKey);
}

/**
 * Create a Supabase client for server contexts (server components, API routes)
 * Requires cookies helper from next/headers
 */
export function createServerSupabaseClient(
  config: SupabaseConfig,
  cookieStore: {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options: CookieOptions) => void;
    delete: (name: string) => void;
  }
) {
  return createServerClient(config.url, config.anonKey, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => cookieStore.set(name, value, options),
      delete: (name) => cookieStore.delete(name),
    },
  });
}

