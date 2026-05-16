import * as React from 'react';

interface Props {
  isSpeaking: boolean;
}

export default function InterviewerVideo({ isSpeaking }: Props) {
  return (
    <div className="tile tile-interviewer">
      <div className={`avatar-circle${isSpeaking ? ' speaking' : ''}`}>SC</div>
      <div className="tile-label">
        Sarah Chen
        <small>Senior Software Engineer · Stripe</small>
      </div>
    </div>
  );
}
