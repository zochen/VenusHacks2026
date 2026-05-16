import * as React from 'react';
import type { InterviewSimulation } from '../hooks/useInterviewSimulation';

interface Props {
  sim: InterviewSimulation;
}

export default function DevQuestionPanel({ sim }: Props) {
  const [open, setOpen] = React.useState(true);

  if (!open) {
    return (
      <button className="dev-panel-toggle" type="button" onClick={() => setOpen(true)}>
        ▸ Dev controls
      </button>
    );
  }

  return (
    <aside className="dev-panel" aria-label="Interview demo controls">
      <h3>
        Demo controls
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            float: 'right',
            background: 'transparent',
            color: 'var(--muted)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          hide
        </button>
      </h3>

      <div className="current-q">
        {sim.currentQuestion ? sim.currentQuestion.text : 'No question asked yet.'}
      </div>

      {sim.followUpQuestions.length > 0 && (
        <div className="followups">
          {sim.followUpQuestions.map((f, i) => (
            <div key={i}>↪ {f}</div>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button className="dev-btn" type="button" onClick={sim.askQuestion}>
          Ask Question
        </button>
        <button className="dev-btn" type="button" onClick={sim.nextQuestion}>
          Next Question
        </button>
        <button className="dev-btn ghost" type="button" onClick={sim.generateFollowUp}>
          Follow-Up
        </button>
        <button className="dev-btn ghost" type="button" onClick={sim.reset}>
          Reset
        </button>
      </div>

      {sim.captionLines.length > 0 && (
        <div className="captions">
          <span>{sim.captionLines.join(' ')}</span>
        </div>
      )}
    </aside>
  );
}
