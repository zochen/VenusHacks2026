import * as React from 'react';
import InterviewHeader from '../components/InterviewHeader';
import VideoStage from '../components/VideoStage';
import ControlBar from '../components/ControlBar';
import DevQuestionPanel from '../components/DevQuestionPanel';
import { useInterviewSimulation } from '../hooks/useInterviewSimulation';

export default function InterviewPage() {
  const sim = useInterviewSimulation();

  return (
    <div className="page">
      <InterviewHeader />
      <VideoStage interviewerSpeaking={sim.isSpeaking} />
      <ControlBar />
      <DevQuestionPanel sim={sim} />
    </div>
  );
}
