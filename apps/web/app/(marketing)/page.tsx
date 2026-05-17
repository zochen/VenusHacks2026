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
    document.body.classList.add('home');
    return () => document.body.classList.remove('home');
  }, []);

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
        marginBottom: -40,
        position: 'relative',
        minHeight: 300,
        overflow: 'visible',
      }}
    >        {/* Smooth ombre cloud behind the logo; aria-hidden since decorative */}
        <div className="logo-cloud" aria-hidden="true" />
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 900 600"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            left: '50%',
            top: -230,
            transform: 'translateX(-50%)',
            width: '100vw',
            height: 620,
            zIndex: 0,
            display: 'block',
          }}
        >
          <rect x="0" y="0" width="900" height="600" fill="#88BECC" />
          <path d="M0 403L129 401L257 411L386 432L514 440L643 349L771 363L900 343L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#ffffff" />
          <path d="M0 448L129 446L257 407L386 404L514 396L643 428L771 429L900 441L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#e7e7e7" />
          <path d="M0 424L129 497L257 503L386 415L514 489L643 433L771 423L900 500L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#cfcfcf" />
          <path d="M0 473L129 519L257 468L386 526L514 530L643 507L771 507L900 467L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#b7b7b7" />
          <path d="M0 547L129 550L257 526L386 516L514 501L643 524L771 494L900 531L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#a0a0a0" />
          <path d="M0 555L129 582L257 579L386 565L514 545L643 553L771 550L900 575L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#A3A3A3" />
        </svg>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: 390,
            transform: 'translateX(-50%)',
            width: '100vw',
            height: 40,
            background: '#A3A3A3',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 900 600"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            left: '50%',
            top: 430,
            transform: 'translateX(-50%)',
            width: '100vw',
            height: 620,
            zIndex: 0,
            display: 'block',
            pointerEvents: 'none',
          }}
        >
          <rect x="0" y="0" width="900" height="600" fill="#ffffff" />
          <path d="M0 164L129 165L257 168L386 168L514 172L643 167L771 171L900 176L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z" fill="#ffffff" />
          <path d="M0 131L129 126L257 131L386 133L514 126L643 132L771 126L900 129L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z" fill="#d7d7d7" />
          <path d="M0 88L129 93L257 88L386 89L514 88L643 85L771 92L900 86L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z" fill="#b0b0b0" />
          <path d="M0 47L129 47L257 44L386 50L514 50L643 52L771 44L900 45L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z" fill="#A3A3A3" />
        </svg>
        <img
          className="hero-logo"
          src="/capybara_bath.PNG"
          alt="Capybaras relaxing in a hot spring with a job listing"
          style={{ position: 'relative', zIndex: 1, marginTop: -40 }}
        />
      </div>
      {/* Hero Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 32, alignItems: 'center', marginBottom: 64, position: 'relative', zIndex: 1 }}>
        <div>
          <h1 className="capy-title" style={{ fontSize: 48, lineHeight: 1.05, margin: '40px 0 20px', fontWeight: 800 }}>
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
              href="/demo/index.html" target="_blank" rel="noopener noreferrer"
              className="capy-btn"
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
              href="/auth/signup"
              className="capy-btn"
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

      {/* Full-bleed wave divider with colored fill below */}
      <div
        aria-hidden="true"
        style={{
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
          lineHeight: 0,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 110 }}>
          <path fill="#D8ECF0" fillOpacity="1" d="M0,256L48,234.7C96,213,192,171,288,165.3C384,160,480,192,576,213.3C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <div style={{ background: 'linear-gradient(180deg, #D8ECF0 0%, #D8ECF0 40%, rgba(216,236,240,0) 100%)', height: 260, marginBottom: -260, pointerEvents: 'none' }} />
      </div>

      {/* Why CapyConnect? — alternating flowing sections */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="capy-title" style={{ fontSize: 48, margin: '0 0 18px' }}>Why CapyConnect?</h2>

        {/** Build a combined array so we can render six alternating sections */}
        {(() => {
          const all = [...featureCols, ...extras] as { title: string; body: string }[];
          const pairs: Array<{ top: any; bottom: any }> = [];
          for (let i = 0; i < all.length; i += 2) {
            pairs.push({ top: all[i], bottom: all[i + 1] });
          }

          return pairs.map((p, pairIdx) => (
            <React.Fragment key={`pair-${pairIdx}`}>
              <section className="pair" style={{ height: '60vh', overflow: 'visible', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div className="pair-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {[p.top, p.bottom].map((s, idx) => (
                    <React.Fragment key={s.title}>
                      <div
                        className="panel"
                        style={{
                          flex: '1 1 30vh',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '20px 28px',
                          boxSizing: 'border-box',
                          ...(idx === 0
                            ? {
                                alignItems: 'flex-start',
                                paddingTop: pairIdx === 0 ? 0 : 60,
                                justifyContent: 'flex-start',
                              }
                            : {}),
                          ...(idx === 1
                            ? {
                                background: 'linear-gradient(180deg, #BDD2E4 0%, #BDD2E4 60%, rgba(189,210,228,0) 100%)',
                                width: '100vw',
                                marginLeft: 'calc(50% - 50vw)',
                                marginRight: 'calc(50% - 50vw)',
                                alignItems: 'flex-start',
                                paddingTop: 24,
                                justifyContent: 'flex-end',
                                paddingRight: 'max(28px, calc(50vw - 568px))',
                              }
                            : {}),
                        }}
                      >
                        <div style={{ maxWidth: 900, textAlign: idx === 0 ? 'left' : 'right' }}>
                          <h3 className="capy-title" style={{ margin: '0 0 12px', fontSize: 28 }}>{s.title}</h3>
                          <p style={{ margin: 0, color: '#345a73', fontSize: 18, lineHeight: 1.6 }}>{s.body}</p>
                        </div>
                      </div>
                      {idx === 0 && (
                        <div
                          aria-hidden="true"
                          style={{
                            flex: '0 0 auto',
                            width: '100vw',
                            marginLeft: 'calc(50% - 50vw)',
                            marginRight: 'calc(50% - 50vw)',
                            lineHeight: 0,
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
                            <path fill="#BDD2E4" fillOpacity="1" d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,48C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </section>
              {pairIdx < pairs.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    width: '100vw',
                    marginLeft: 'calc(50% - 50vw)',
                    marginRight: 'calc(50% - 50vw)',
                    lineHeight: 0,
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 90 }}>
                    <path fill="#D8ECF0" fillOpacity="1" d="M0,256L48,234.7C96,213,192,171,288,165.3C384,160,480,192,576,213.3C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                  </svg>
                  <div style={{ background: 'linear-gradient(180deg, #D8ECF0 0%, #D8ECF0 40%, rgba(216,236,240,0) 100%)', height: 260, marginBottom: -260, pointerEvents: 'none' }} />
                </div>
              )}
            </React.Fragment>
          ));
        })()}

        {/* pair/panel layout + fade-in styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          main { scroll-snap-type: none; }
          .pair { opacity: 0.02; transition: opacity 700ms ease; }
          .pair.in-view { opacity: 1; }
          .panel { opacity: 0; transform: translateY(18px); transition: opacity 700ms ease, transform 700ms cubic-bezier(0.2,0.8,0.2,1); }
          .pair.in-view .panel { opacity: 1; transform: translateY(0); }
          .panel > div { max-width: 960px; }
          .panel h3 { font-size: 36px; margin: 0 0 12px; }
          .panel p { font-size: 18px; color: #234154; line-height: 1.6; }
          .pair-inner { height: 100%; display: flex; flex-direction: column; }
          .panel { display: flex; align-items: center; justify-content: center; padding: 48px 24px; box-sizing: border-box; }
          body { background: #fbfeff; }
        ` }} />

        {/* IntersectionObserver set up in a client-side effect */}
        <script>{`/* placeholder - handled in React useEffect */`}</script>
      </section>

      {/* Footer CTA */}
      <section style={{ marginTop: 56, padding: 28, borderRadius: 12, background: '#f7fbff', textAlign: 'center' }}>
        <h3 className="capy-title" style={{ margin: '0 0 8px', fontSize: 20 }}>Ready to try a better interview experience?</h3>
        <div style={{ marginTop: 12 }}>
          <Link href="/demo/index.html" target="_blank" rel="noopener noreferrer" className="capy-btn" style={{ padding: '12px 20px', background: '#4a90e2', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, marginRight: 12 }}>Try Interactive Demo</Link>
          <Link href="/download-extension" className="capy-btn" style={{ padding: '12px 20px', background: '#bfeaf0', color: '#123244', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Download Extension</Link>
        </div>
      </section>
    </main>
  );
}
