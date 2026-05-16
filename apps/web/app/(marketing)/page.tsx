// OWNER: Person 4 (Marketing)
// Surface: web
// Do not edit without coordinating in group chat.

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@quietspace/shared-ui';

const featureCols = [
  {
    title: 'Communication Support',
    body:
      'CapyConnect keeps conversations easier to follow with live captions, persistent question displays, and highlighted key points. Candidates can stay focused on responding thoughtfully instead of trying to remember long or fast-paced questions.',
  },
  {
    title: 'Flexible Interview Experience',
    body:
      'Every person communicates differently. CapyConnect allows candidates to customize pacing, visual focus, and communication settings to create a more comfortable interview environment without requiring disability disclosure.',
  },
  {
    title: 'Structured Conversations',
    body:
      'Interview questions remain visible throughout the conversation while AI tracks follow-up prompts in real time. This creates clearer, more organized discussions and reduces conversational overload during behavioral interviews.',
  },
];

const extras = [
  {
    title: 'Cognitive Comfort Tools',
    body:
      'Subtle support features like Thinking Pause and the Capybara Comfort Companion help reduce stress and overstimulation during high-pressure interviews. These tools are designed to support focus and regulation without interrupting the conversation.',
  },
  {
    title: 'Inclusive Interview Guidance',
    body:
      'CapyConnect provides interviewers with gentle communication recommendations that encourage clearer, more thoughtful conversations. The platform promotes inclusive interviewing practices without exposing personal diagnoses or accommodations.',
  },
  {
    title: 'Communication-Focused Hiring',
    body:
      'Traditional interviews often reward speed and social performance over actual ability. CapyConnect helps companies create interview environments that better evaluate communication, collaboration, and problem-solving skills.',
  },
];

export default function MarketingPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const els = Array.from(document.querySelectorAll('.wc-section')) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.classList.add('in-view');
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px' }}>
      {/* Hero Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 32, alignItems: 'center', marginBottom: 64 }}>
        <div>
          <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: '0 0 20px', fontWeight: 800 }}>
            Behavioral interviews redesigned for clarity, comfort, and focus.
          </h1>
          <p style={{ fontSize: 18, color: '#56778d', margin: '0 0 18px' }}>
            Customizable interview experiences that reduce cognitive overload, provide structured communication, and
            offer live accessibility support.
          </p>

          <ul style={{ margin: '16px 0 24px', paddingLeft: 18, color: '#56778d', lineHeight: 1.6 }}>
            <li>Customizable Interview Experiences</li>
            <li>Reduced Cognitive Overload</li>
            <li>Structured Communication</li>
            <li>Live Accessibility Support</li>
          </ul>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              href="/candidate/interview"
              style={{
                padding: '14px 22px',
                background: '#4a90e2',
                color: '#fff',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
              }}
            >
              Try Interactive Demo
            </Link>

            <Link
              href="/onboarding"
              style={{
                padding: '14px 22px',
                background: '#fff',
                color: '#123244',
                border: '1px solid #e6eef6',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
              }}
            >
              Get Started
            </Link>
          </div>
        </div>

        <div style={{ width: '100%', height: 360, borderRadius: 18, background: 'linear-gradient(180deg, #eaf6ff, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Animated mockup placeholder */}
          <div style={{ width: '88%', height: '86%', borderRadius: 12, background: '#fff', boxShadow: '0 8px 24px rgba(18,50,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#56778d' }}>
            Animated mockup goes here
          </div>
        </div>
      </section>

      {/* Why CapyConnect? — alternating flowing sections */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 28, margin: '0 0 18px' }}>Why CapyConnect?</h2>

        {/** Build a combined array so we can render six alternating sections */}
        {([...featureCols, ...extras] as { title: string; body: string }[]).map((s, idx) => {
          const isEven = idx % 2 === 0;
          const bg = isEven
            ? 'linear-gradient(180deg, rgba(74,144,226,0.06), rgba(74,144,226,0.02))'
            : 'linear-gradient(180deg, rgba(74,144,226,0.04), rgba(74,144,226,0.01))';
          const textAlign = isEven ? 'left' : 'right';
          return (
            <section
              key={s.title}
              className="wc-section"
              data-idx={idx}
              style={{
                marginBottom: 28,
                padding: '28px 24px',
                borderRadius: 16,
                background: bg,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                flexDirection: isEven ? 'row' : 'row-reverse',
              }}
            >
              {/* Decorative floating bubbles */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div className="bubble b1" />
                <div className="bubble b2" />
                <div className="bubble b3" />
              </div>

              <div style={{ flex: '1 1 55%', textAlign, zIndex: 2 }}>
                <h3 style={{ margin: '0 0 10px', fontSize: 20 }}>{s.title}</h3>
                <p style={{ margin: 0, color: '#345a73', lineHeight: 1.6 }}>{s.body}</p>
              </div>

              <div style={{ flex: '0 0 40%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Placeholder for illustration; keep light and non-rigid */}
                <div style={{ width: '84%', height: 160, borderRadius: 12, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#56778d', boxShadow: '0 6px 18px rgba(18,50,68,0.06)' }}>
                  <div style={{ textAlign: 'center' }}>{/* simple icon + note */}
                    <div style={{ fontSize: 28 }}>{idx % 2 === 0 ? '💬' : '🧭'}</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>Illustration</div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* fade-in + bubble animation styles */}
        <style>{`
          .wc-section { opacity: 0; transform: translateY(18px); transition: opacity 700ms ease, transform 700ms cubic-bezier(0.2,0.8,0.2,1); }
          .wc-section.in-view { opacity: 1; transform: translateY(0); }
          .bubble { position: absolute; border-radius: 999px; filter: blur(10px); }
          .bubble.b1 { width: 140px; height: 140px; background: rgba(74,144,226,0.08); left: -20px; top: -10px; animation: float1 8s ease-in-out infinite; }
          .bubble.b2 { width: 80px; height: 80px; background: rgba(74,144,226,0.06); right: 10%; top: 30%; animation: float2 10s ease-in-out infinite; }
          .bubble.b3 { width: 60px; height: 60px; background: rgba(74,144,226,0.05); left: 20%; bottom: -10%; animation: float3 12s ease-in-out infinite; }
          @keyframes float1 { 0%{ transform: translateY(0) } 50%{ transform: translateY(8px) } 100%{ transform: translateY(0) } }
          @keyframes float2 { 0%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } 100%{ transform: translateY(0) } }
          @keyframes float3 { 0%{ transform: translateY(0) } 50%{ transform: translateY(10px) } 100%{ transform: translateY(0) } }
        `}</style>

        {/* IntersectionObserver set up in a client-side effect */}
        <script>{`/* placeholder - handled in React useEffect */`}</script>
      </section>

      {/* Footer CTA */}
      <section style={{ marginTop: 56, padding: 28, borderRadius: 12, background: '#f7fbff', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>Ready to try a better interview experience?</h3>
        <div style={{ marginTop: 12 }}>
          <Link href="/candidate/interview" style={{ padding: '12px 20px', background: '#4a90e2', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Try Interactive Demo</Link>
        </div>
      </section>
    </main>
  );
}
