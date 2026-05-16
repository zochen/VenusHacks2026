// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: extension — toolbar popup
// Do not edit without coordinating in group chat.

import * as React from 'react';

// TODO(Person 2): if no session token in chrome.storage, show "Sign in via QuietSpace web app" button
// TODO(Person 2): quick toggles for captions / companion / communication style
// TODO(Person 2): link to full Options page
// TODO(Person 2): show current host (Meet/Zoom/Teams) and overlay status

export function Popup() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 16 }}>QuietSpace</h1>
      <p style={{ marginTop: 8, fontSize: 13 }}>Accessibility overlay for interviews.</p>
    </main>
  );
}

export default Popup;
