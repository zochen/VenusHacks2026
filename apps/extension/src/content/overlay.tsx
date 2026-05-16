// OWNER: Person 1 (Candidate Experience)
// Surface: extension — the floating accessibility panel that shows on top of the video call
// Do not edit without coordinating in group chat.

import * as React from 'react';
import {
  CaptionOverlay,
  ComfortCompanion,
  PauseProcessButtons,
} from '@quietspace/shared-ui';

// TODO(Person 1): draggable / minimizable panel chrome
// TODO(Person 1): pull live transcript from Web Speech API in the content-script context
// TODO(Person 1): subscribe to Preferences via chrome.storage.onChanged for live updates
// TODO(Person 1): pipe pause/repeat events back through background via messaging.ts

export function Overlay() {
  return (
    <div data-quietspace-overlay>
      <CaptionOverlay entries={[]} />
      <PauseProcessButtons />
      <ComfortCompanion />
    </div>
  );
}

export default Overlay;
