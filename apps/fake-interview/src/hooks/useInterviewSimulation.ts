import * as React from 'react';
import { QUESTIONS, type InterviewQuestion } from '../data/questions';

/**
 * Drives the fake-interview demo state:
 *  - currentQuestion   — the question the interviewer is "asking"
 *  - followUpQuestions — surfaced gradually after the main question finishes
 *  - captionLines      — words streamed in, so the page looks like live captions
 *  - isSpeaking        — true while the interviewer is mid-question (drives speaking ring)
 *
 * It also publishes everything to `window.capyconnectInterview` so the
 * CapyConnect browser extension can read the current question from any
 * content script / injected demo overlay. See `publishToWindow()` below.
 */

declare global {
  interface Window {
    capyconnectInterview?: {
      currentQuestion: string | null;
      followUps: string[];
      captionLines: string[];
      isSpeaking: boolean;
      askedAt: number | null;
    };
  }
}

const WORD_INTERVAL_MS = 220;
const FOLLOWUP_DELAY_MS = 1200;

export function useInterviewSimulation() {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] =
    React.useState<InterviewQuestion | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = React.useState<string[]>([]);
  const [captionLines, setCaptionLines] = React.useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const timersRef = React.useRef<number[]>([]);
  const clearTimers = React.useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  const publishToWindow = React.useCallback(
    (q: InterviewQuestion | null, follows: string[], captions: string[], speaking: boolean) => {
      window.capyconnectInterview = {
        currentQuestion: q?.text ?? null,
        followUps: follows,
        captionLines: captions,
        isSpeaking: speaking,
        askedAt: q ? Date.now() : null,
      };
      // Fire a custom event so listeners (e.g. the extension's injected
      // overlay) can react without polling.
      window.dispatchEvent(
        new CustomEvent('capyconnect:question', {
          detail: { question: q?.text ?? null, followUps: follows },
        }),
      );
    },
    [],
  );

  const streamQuestion = React.useCallback(
    (q: InterviewQuestion) => {
      clearTimers();
      setCurrentQuestion(q);
      setFollowUpQuestions([]);
      setCaptionLines([]);
      setIsSpeaking(true);
      publishToWindow(q, [], [], true);

      const words = q.text.split(/\s+/);
      words.forEach((word, i) => {
        const t = window.setTimeout(() => {
          setCaptionLines((prev) => {
            const next = [...prev, word];
            publishToWindow(q, [], next, true);
            return next;
          });
        }, i * WORD_INTERVAL_MS);
        timersRef.current.push(t);
      });

      // After the question finishes streaming, drop speaking state +
      // gradually surface follow-ups one by one.
      const doneAt = words.length * WORD_INTERVAL_MS;
      const doneTimer = window.setTimeout(() => {
        setIsSpeaking(false);
        publishToWindow(q, [], words, false);
      }, doneAt + 200);
      timersRef.current.push(doneTimer);

      q.followUps.forEach((fu, i) => {
        const t = window.setTimeout(
          () => {
            setFollowUpQuestions((prev) => {
              const next = [...prev, fu];
              publishToWindow(q, next, captionLinesRef.current, false);
              return next;
            });
          },
          doneAt + FOLLOWUP_DELAY_MS * (i + 1),
        );
        timersRef.current.push(t);
      });
    },
    [clearTimers, publishToWindow],
  );

  // Keep a ref of latest captions so the staggered follow-up timers can
  // publish a consistent snapshot to window.
  const captionLinesRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    captionLinesRef.current = captionLines;
  }, [captionLines]);

  const askQuestion = React.useCallback(() => {
    const q = QUESTIONS[questionIndex] ?? QUESTIONS[0]!;
    streamQuestion(q);
  }, [questionIndex, streamQuestion]);

  const nextQuestion = React.useCallback(() => {
    setQuestionIndex((idx) => {
      const next = (idx + 1) % QUESTIONS.length;
      const q = QUESTIONS[next]!;
      streamQuestion(q);
      return next;
    });
  }, [streamQuestion]);

  const generateFollowUp = React.useCallback(() => {
    if (!currentQuestion) return;
    const remaining = currentQuestion.followUps.filter(
      (f) => !followUpQuestions.includes(f),
    );
    const pick = remaining[0] ?? 'Can you elaborate on that?';
    setFollowUpQuestions((prev) => {
      const next = [...prev, pick];
      publishToWindow(currentQuestion, next, captionLinesRef.current, isSpeaking);
      return next;
    });
  }, [currentQuestion, followUpQuestions, isSpeaking, publishToWindow]);

  const reset = React.useCallback(() => {
    clearTimers();
    setQuestionIndex(0);
    setCurrentQuestion(null);
    setFollowUpQuestions([]);
    setCaptionLines([]);
    setIsSpeaking(false);
    publishToWindow(null, [], [], false);
  }, [clearTimers, publishToWindow]);

  // Cleanup on unmount.
  React.useEffect(() => () => clearTimers(), [clearTimers]);

  // Initial publish so the extension can read an empty snapshot too.
  React.useEffect(() => {
    publishToWindow(null, [], [], false);
  }, [publishToWindow]);

  return {
    currentQuestion,
    followUpQuestions,
    captionLines,
    isSpeaking,
    askQuestion,
    nextQuestion,
    generateFollowUp,
    reset,
  };
}

export type InterviewSimulation = ReturnType<typeof useInterviewSimulation>;
