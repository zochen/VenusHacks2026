// OWNER: Person 1 (Candidate Experience)
// Surface: extension — content script entry point
// Do not edit without coordinating in group chat.

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Overlay } from './overlay';

// TODO(Person 1): mount inside a shadow DOM to isolate styles from the host page (Meet/Zoom/Teams)
// TODO(Person 1): only mount once per tab; guard against re-injection
// TODO(Person 1): notify background of OVERLAY_MOUNTED via chrome.runtime.sendMessage
// TODO(Person 1): cleanly unmount on page navigation (SPA host pages reuse the document)

function mount() {
  const host = document.createElement('div');
  host.id = 'quietspace-overlay-host';
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(<Overlay />);
}

mount();
