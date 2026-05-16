// OWNER: Person 1 (Candidate Experience)
// Surface: extension — content script entry point
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Overlay } from './overlay';

// TODO(Person 1): mount inside a shadow DOM to fully isolate styles from host page
// TODO(Person 1): notify background of OVERLAY_MOUNTED via chrome.runtime.sendMessage
// TODO(Person 1): cleanly unmount on SPA navigation (Meet/Zoom reuse the document)

const HOST_ID = 'capyconnect-overlay-host';

function mount() {
  if (document.getElementById(HOST_ID)) return; // guard re-injection
  const host = document.createElement('div');
  host.id = HOST_ID;
  // High z-index so we float above Meet/Zoom/Teams chrome.
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483646;';
  document.body.appendChild(host);
  createRoot(host).render(<Overlay />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
