import * as React from 'react';
import InterviewerVideo from './InterviewerVideo';
import CandidateVideo from './CandidateVideo';

interface Props {
  interviewerSpeaking: boolean;
}

export default function VideoStage({ interviewerSpeaking }: Props) {
  return (
    <main className="stage">
      <InterviewerVideo isSpeaking={interviewerSpeaking} />
      <CandidateVideo />
    </main>
  );
}
