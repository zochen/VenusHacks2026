// OWNER: Person 3 (Backend / Integrations)
// Surface: extension — service worker
// Do not edit without coordinating in group chat.

import type { ExtensionMessage } from '@quietspace/shared-types';

// TODO(Person 3): on install, open the web onboarding tab if no session token in chrome.storage
// TODO(Person 3): listen for AUTH_TOKEN_SET from web app (via chrome.runtime.onMessageExternal) and persist
// TODO(Person 3): instantiate Supabase client with stored token; relay realtime events to content scripts
// TODO(Person 3): central message router — all content<->background traffic goes through here

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  // TODO: dispatch on message.type
  void message;
  sendResponse({ ok: true });
  return true;
});
