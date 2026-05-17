// OWNER: Person 1 (Candidate Experience)
// Surface: extension — the floating accessibility panel on Meet/Zoom/Teams
// Do not edit without coordinating in group chat.

// Re-export the shared Overlay implementation so extension uses the single source of truth
import { Overlay } from '@quietspace/shared-ui';
export { Overlay };
export default Overlay;
