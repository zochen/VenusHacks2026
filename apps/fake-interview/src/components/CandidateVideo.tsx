import * as React from 'react';

export default function CandidateVideo() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 270 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e: any) {
        setError(e?.message ?? 'Camera unavailable');
      }
    }

    start();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="tile tile-candidate">
      {error ? (
        <div className="cam-placeholder">
          Camera off
          <br />
          <span style={{ fontSize: 10, opacity: 0.7 }}>{error}</span>
        </div>
      ) : (
        <video ref={videoRef} muted playsInline autoPlay />
      )}
      <div className="tile-label">You</div>
    </div>
  );
}
