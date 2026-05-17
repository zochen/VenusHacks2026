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
    const els = Array.from(document.querySelectorAll('.pair')) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.classList.add('in-view');
            // keep observing so fade can re-run if user scrolls back
            // but we don't need to unobserve immediately
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px' }}>
      {/* Large brand logo with soft blue oval gradient */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
        minHeight: 420,
        overflow: 'visible',
      }}
    >        {/* Smooth ombre cloud behind the logo; aria-hidden since decorative */}
        <div className="logo-cloud" aria-hidden="true" />
        <img className="hero-logo" src="/CapyConnect_logo.PNG" alt="CapyConnect" />
      </div>
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
        <h2 className="capy-title" style={{ fontSize: 28, margin: '0 0 18px' }}>Why CapyConnect?</h2>

        {/** Build a combined array so we can render six alternating sections */}
        {(() => {
          const all = [...featureCols, ...extras] as { title: string; body: string }[];
          const pairs: Array<{ top: any; bottom: any }> = [];
          for (let i = 0; i < all.length; i += 2) {
            pairs.push({ top: all[i], bottom: all[i + 1] });
          }

          return pairs.map((p, pairIdx) => (
            <section key={`pair-${pairIdx}`} className="pair" style={{ height: '100vh', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div className="pair-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {[p.top, p.bottom].map((s, idx) => (
                  <div key={s.title} className="panel" style={{ flex: '1 1 50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 28px', boxSizing: 'border-box' }}>
                    <div style={{ maxWidth: 900, textAlign: idx === 0 ? 'left' : 'right' }}>
                      <h3 className="capy-title" style={{ margin: '0 0 12px', fontSize: 28 }}>{s.title}</h3>
                      <p style={{ margin: 0, color: '#345a73', fontSize: 18, lineHeight: 1.6 }}>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ));
        })()}

        {/* pair/panel layout + fade-in styles */}
        <style>{`
          /* make main snap to each pair block */
          main { scroll-snap-type: y mandatory; }
          section.pair { scroll-snap-align: start; }

          /* pair visibility — keep next pairs hidden until scrolled into view */
          .pair { opacity: 0.02; transition: opacity 700ms ease; }
          .pair.in-view { opacity: 1; }

          /* panels (each half-viewport) transition in when their pair is in view */
          .panel { opacity: 0; transform: translateY(18px); transition: opacity 700ms ease, transform 700ms cubic-bezier(0.2,0.8,0.2,1); }
          .pair.in-view .panel { opacity: 1; transform: translateY(0); }

          /* visual sizing and typography for the large text sections */
          .panel > div { max-width: 960px; }
          .panel h3 { font-size: 36px; margin: 0 0 12px; }
          .panel p { font-size: 18px; color: #234154; line-height: 1.6; }

          /* ensure smooth aesthetic: center content vertically and avoid bleed into next pair */
          .pair-inner { height: 100%; display: flex; flex-direction: column; }
          .panel { display: flex; align-items: center; justify-content: center; padding: 48px 24px; box-sizing: border-box; }

          /* subtle page background to help the ombre blend */
          body { background: #fbfeff; }
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
