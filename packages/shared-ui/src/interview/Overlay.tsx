// OWNER: Person 1 (Candidate Experience)
// Surface: SHARED — used by web (simulator) + extension (overlay)
// Lightweight composition component so the shared package exports a usable Overlay.

import * as React from 'react';
import { tokens } from '../tokens';
import { CaptionOverlay } from './CaptionOverlay';
import { ComfortCompanion } from './ComfortCompanion';
import { PauseProcessButtons } from './PauseProcessButtons';
import { LiveTranscript } from './LiveTranscript';
import { QuestionDisplay } from './QuestionDisplay';

export interface OverlayProps {
	// Intentionally minimal for shared usage; individual apps may mount more
	// advanced state or wire up real-time data streams.
}

export function Overlay(_props: OverlayProps) {
	// Minimal local state used for the demo fallback. Real apps should provide
	// transcripts, questions and handlers when mounting the overlay in-production.
	const [entries] = React.useState<any[]>([]);

	return (
		<div
			aria-hidden={false}
			style={{
				position: 'fixed',
				inset: 0,
				pointerEvents: 'none', // allow inner interactive children to opt-in
				zIndex: 2147483646,
				fontFamily: tokens.font.sans,
			}}
		>
			<div
				style={{
					position: 'fixed',
					right: 20,
					bottom: 20,
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					pointerEvents: 'auto',
					maxWidth: 420,
				}}
			>
				<CaptionOverlay entries={entries} />
				<QuestionDisplay question={null as any} />
				<LiveTranscript entries={entries} />
				<ComfortCompanion />
				<PauseProcessButtons />
			</div>
		</div>
	);
}

export default Overlay;
