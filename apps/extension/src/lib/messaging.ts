// OWNER: Person 3 (Backend / Integrations)
// Surface: extension — typed wrapper around chrome.runtime.sendMessage / onMessage
// Do not edit without coordinating in group chat.

import type { ExtensionMessage } from '@quietspace/shared-types';

// TODO(Person 3): typed send() that returns a typed response per message variant
// TODO(Person 3): on() helper that narrows by message.type
// TODO(Person 3): cross-context safety — content scripts and background see different chrome APIs

export function send(message: ExtensionMessage): Promise<unknown> {
  return chrome.runtime.sendMessage(message);
}

export function on(handler: (msg: ExtensionMessage) => void) {
  const listener = (msg: ExtensionMessage) => handler(msg);
  chrome.runtime.onMessage.addListener(listener);
  return () => chrome.runtime.onMessage.removeListener(listener);
}
