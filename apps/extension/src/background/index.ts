// OWNER: Person 3 (Backend / Integrations)
// Surface: extension — service worker
// Do not edit without coordinating in group chat.

import type { ExtensionMessage } from '@quietspace/shared-types';

// TODO(Person 3): on AUTH_TOKEN_SET from web (chrome.runtime.onMessageExternal), persist to chrome.storage.local
// TODO(Person 3): instantiate Supabase client with stored token; relay realtime events to content scripts
// TODO(Person 3): central message router — all content<->background traffic goes through here

const WEB_URL = 'http://localhost:3000';

// Open onboarding on first install if no session token is stored.
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== 'install') return;
  try {
    const { quietspaceToken } = await chrome.storage.local.get('quietspaceToken');
    if (!quietspaceToken) {
      chrome.tabs.create({ url: `${WEB_URL}/onboarding` });
    }
  } catch {
    // chrome.storage may be unavailable in some test contexts — ignore.
  }
});

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  // TODO(Person 3): dispatch on message.type and forward to other contexts as needed.
  void message;
  sendResponse({ ok: true });
  return true;
});
