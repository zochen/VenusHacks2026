import { useId } from 'react';

type DemoVideoProps = {
  title: string;
  subtitle: string;
  videoId?: string;
  shareId?: string;
  className?: string;
};

export function DemoVideo({
  title,
  subtitle,
  videoId = 'l7DWmKov6Jg',
  shareId = 'GHDx7BpcBgRzycUR',
  className,
}: DemoVideoProps) {
  const titleId = useId();
  const params = new URLSearchParams({
    si: shareId,
    mute: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });

  return (
    <section className={['demo-video-section', className].filter(Boolean).join(' ')} aria-labelledby={titleId}>
      <div className="demo-video-copy">
        <h2 id={titleId} className="capy-title demo-video-title">
          {title}
        </h2>
        <p className="demo-video-subtitle">{subtitle}</p>
      </div>

      <div className="demo-video-card">
        <div className="demo-video-frame">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
            title={`${title} video player`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
