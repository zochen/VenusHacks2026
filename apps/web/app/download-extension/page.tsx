import Link from 'next/link';
import { Button } from '@quietspace/shared-ui';

export default function DownloadExtensionPage() {
  return (
    <main style={{ padding: '64px 24px', minHeight: 'calc(100vh - 128px)', background: '#f6f9fc' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', background: '#ffffff', borderRadius: 20, boxShadow: '0 24px 80px rgba(18, 50, 68, 0.08)', padding: '48px 40px' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 3vw, 3rem)', lineHeight: 1.05, color: '#123244' }}>
          Install the CapyConnect Extension
        </h1>
        <p style={{ marginTop: 24, color: '#3c4b59', fontSize: 18, lineHeight: 1.7 }}>
          Download the CapyConnect extension ZIP, extract it, then load the unpacked extension in Chrome.
        </p>

        <div style={{ marginTop: 32, display: 'grid', gap: 24 }}>
          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 1: Download the extension ZIP</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              Click the button below to download the built CapyConnect extension ZIP file. This package contains the extension manifest and compiled assets.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <a href="/downloads/capyconnect-extension.zip" download style={{ textDecoration: 'none' }}>
                <Button variant="primary">Download Extension</Button>
              </a>
              <a href="chrome://extensions" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Open Chrome Extensions</Button>
              </a>
            </div>
          </div>

          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 2: Unzip the folder</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              Extract the downloaded ZIP file to a folder. The extracted folder should contain <code>manifest.json</code> and an <code>assets/</code> directory.
            </p>
          </div>

          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 3: Open Chrome extensions</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              In Chrome, open <code>chrome://extensions</code> and enable <strong>Developer mode</strong> (toggle in the top-right).
            </p>
          </div>

          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 4: Load unpacked</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              Click <strong>Load unpacked</strong> and select the folder you extracted from the ZIP. Chrome will install the extension from those files.
            </p>
          </div>

          <div style={{ padding: 24, borderRadius: 18, background: '#f3f7fb', border: '1px solid #dce6f1' }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#123244' }}>Step 5: Pin the extension</h2>
            <p style={{ marginTop: 12, color: '#4d5d6d', fontSize: 16, lineHeight: 1.7 }}>
              After the extension is loaded, use the extensions menu to pin CapyConnect to the toolbar so it remains visible during interviews.
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
