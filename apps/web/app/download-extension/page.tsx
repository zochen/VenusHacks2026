import Link from 'next/link';

export default function DownloadExtensionPage() {
  return (
    <main style={{ padding: '64px 24px', minHeight: 'calc(100vh - 128px)', background: '#f6f9fc' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', background: '#ffffff', borderRadius: 20, boxShadow: '0 24px 80px rgba(18, 50, 68, 0.08)', padding: '48px 40px' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 3vw, 3rem)', lineHeight: 1.05, color: '#123244' }}>
          Install the CapyConnect extension
        </h1>
        <p style={{ marginTop: 24, color: '#3c4b59', fontSize: 18, lineHeight: 1.7 }}>
          We don’t have a published store listing yet. Use the instructions below to open the extension area and pin CapyConnect so it stays visible while you interview.
        </p>

        <div style={{ marginTop: 32, display: 'grid', gap: 24 }}>
          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 1: Open your extensions page</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              Click the button below to open your browser’s extension manager. Then locate CapyConnect and pin it to your toolbar.
            </p>
            <a
              href="chrome://extensions"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 16,
                background: '#123244',
                color: '#ffffff',
                padding: '14px 24px',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Open Chrome extensions
            </a>
          </div>

          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 2: Pin CapyConnect</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              If CapyConnect is already installed, pin it from the extension toolbar menu so it is easy to access during interviews.
            </p>
          </div>

          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 3: Return to the app</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              After opening extensions, keep this page open and follow the extension install or reload instructions for your browser. Then come back to continue.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#123244', textDecoration: 'underline' }}>
            Back to home
          </Link>
          <span style={{ color: '#6b7a88' }}>
            If you’re using Firefox, open <strong>about:addons</strong> instead.
          </span>
        </div>
      </div>
    </main>
  );
}
