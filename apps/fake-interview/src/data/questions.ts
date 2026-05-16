export interface InterviewQuestion {
  id: string;
  text: string;
  followUps: string[];
}

export const QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    text: "Tell me about a project you're proud of.",
    followUps: [
      'What challenges did you face?',
      'What would you do differently?',
      'How did you measure its success?',
    ],
  },
  {
    id: 'q2',
    text: 'Describe a challenging bug you encountered.',
    followUps: [
      'How did you isolate the root cause?',
      'How did you solve that issue?',
      'What did you learn from it?',
    ],
  },
  {
    id: 'q3',
    text: 'How do you approach debugging in an unfamiliar codebase?',
    followUps: [
      'What tools do you reach for first?',
      'How do you decide when to ask for help?',
    ],
  },
  {
    id: 'q4',
    text: 'Tell me about a time you worked on a team project.',
    followUps: [
      'How did you handle disagreements?',
      'What was your role on the team?',
      'What would you do differently next time?',
    ],
  },
  {
    id: 'q5',
    text: 'Walk me through how you would design a URL shortener.',
    followUps: [
      'How would you handle collisions?',
      'How would you scale reads vs writes?',
    ],
  },
];
