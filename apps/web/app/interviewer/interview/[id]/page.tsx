// OWNER: Person 2 (Interviewer + Onboarding)
// Surface: web (simulator — interviewer-side view)
// Do not edit without coordinating in group chat.

// TODO(Person 2): load interview by params.id from Supabase
// TODO(Person 2): show candidate's preferences + live transcript via LiveTranscript
// TODO(Person 2): question control (advance, clarify, follow-up detection toggle)
// TODO(Person 2): hook into shared-lib/supabase/realtime to push SessionState updates

export default function InterviewerInterviewPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Interviewer — interview {params.id}</h1>
    </main>
  );
}
